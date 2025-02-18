const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to procced further !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Owner of the Property!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.setUserRole = async (req, res, next) => {
  if (req.user) {
    // Check if the user owns any listings
    const ownedListings = await Listing.findOne({ owner: req.user._id });
    // Set ownsListings to true if at least one listing is found
    res.locals.currUser = req.user;
    res.locals.currUser.ownsListings = !!ownedListings;
  }
  next();
};

// New middleware: Validate that uploaded files are images
module.exports.validateImages = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (!file.mimetype.startsWith("image/")) {
        return next(new ExpressError(400, "Uploaded files must be images"));
      }
    }
  }
  next();
};
