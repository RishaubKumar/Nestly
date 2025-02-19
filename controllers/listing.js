const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    const { q } = req.query;
    let allListings;
    if (q && q.trim() !== "") {
      // Search by location (partial and case-insensitive match)
      allListings = await Listing.find({
        location: { $regex: q, $options: "i" }
      });
    } else {
      allListings = await Listing.find({});
    }
    // Pass the query back so the view can preserve the search term
    res.render("listings/index.ejs", { allListings, q });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error retrieving listings");
    res.redirect("back");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    // Populate the reviews and owner (only username) as per your show.ejs requirements
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: { path: 'author', select: 'username' }
      })
      .populate('owner', 'username');

    if (!listing) {
      req.flash('error', 'Listing not found.');
      return res.redirect('/listings');
    }
    // Pass the current user as currUser so that the view can compare ownership
    res.render('listings/show', { listing, currUser: req.user });
  } catch (error) {
    console.error('Error fetching listing:', error);
    req.flash('error', 'Error fetching listing details.');
    res.redirect('back');
  }
};

module.exports.createListing = async (req, res, next) => {
  // Create a new listing using data from the form
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  // Map through the array of uploaded files and create an array of image objects
  if (req.files && req.files.length > 0) {
    newListing.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
  }
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Sorry, No similar listing!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  // Remove images if checkboxes are checked
  if (req.body.deleteImages) {
    const deleteFilenames = Array.isArray(req.body.deleteImages)
      ? req.body.deleteImages
      : [req.body.deleteImages];
    // Optionally, remove images from cloud storage here if needed.
    listing.images = listing.images.filter(
      img => !deleteFilenames.includes(img.filename)
    );
    await listing.save();
  }
  
  // Add any new images uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    listing.images.push(...newImages);
    await listing.save();
  }
  
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

module.exports.renderHome = (req, res) => {
  res.render("home.ejs", { isHomePage: true });
};
