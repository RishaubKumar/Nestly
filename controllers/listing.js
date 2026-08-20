// Handles listing CRUD operations, home rendering, search filtering, and image upload updates

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    const { q, rentalOption } = req.query;
    let query = {};

    if (q && q.trim() !== "") {
      query.location = { $regex: q, $options: "i" };
    }

    if (rentalOption && rentalOption.trim() !== "") {
      if (rentalOption === "rent") {
        query.$or = [
          { rentalOption: { $in: ["rent", "both"] } },
          { rentalOption: { $exists: false } }
        ];
      } else if (rentalOption === "booking") {
        query.rentalOption = { $in: ["booking", "both"] };
      } else {
        query.rentalOption = rentalOption;
      }
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, q, rentalOption });
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
    res.render('listings/show', { listing, currUser: req.user });
  } catch (error) {
    console.error('Error fetching listing:', error);
    req.flash('error', 'Error fetching listing details.');
    res.redirect('back');
  }
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  
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
  
  if (req.body.deleteImages) {
    const deleteFilenames = Array.isArray(req.body.deleteImages)
      ? req.body.deleteImages
      : [req.body.deleteImages];
    listing.images = listing.images.filter(
      img => !deleteFilenames.includes(img.filename)
    );
    await listing.save();
  }
  
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

