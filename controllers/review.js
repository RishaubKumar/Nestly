// Handles review creation and deletion operations

const Review = require("../models/review");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("back");
    }

    if (listing.owner.equals(req.user._id)) {
      req.flash("error", "You cannot review your own listing.");
      return res.redirect(`/listings/${listing._id}`);
    }

    const hasInteracted = await Booking.findOne({
      property: listing._id,
      user: req.user._id,
      status: 'accepted'
    });

    if (!hasInteracted) {
      req.flash("error", "You can only review properties that you have booked and had accepted.");
      return res.redirect(`/listings/${listing._id}`);
    }

    const existingReview = await Review.findOne({
      author: req.user._id,
      _id: { $in: listing.reviews }
    });

    if (existingReview) {
      req.flash("error", "You have already reviewed this listing.");
      return res.redirect(`/listings/${listing._id}`);
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    req.flash("success", "Review added successfully.");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error("Error creating review:", error);
    req.flash("error", "Error creating review.");
    res.redirect("back");
  }
};

module.exports.destroyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error deleting review:", error);
    req.flash("error", "Error deleting review.");
    res.redirect("back");
  }
};
