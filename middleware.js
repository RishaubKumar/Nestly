// Defines middleware functions for route protection, listing/review validation, and author/owner authorization checks

const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to proceed further!");
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
  if (!listing) {
    req.flash("error", "Property listing not found!");
    return res.redirect("/listings");
  }
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Owner of the Property!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validatelisting = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

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
