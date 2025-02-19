// controllers/review.js
const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  try {
    // Find the listing using the id from params
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("back");
    }
    
    // Create a new Review document using the data from req.body.review
    const review = new Review(req.body.review);
    // Set the author to the current logged-in user's id
    review.author = req.user._id;
    // Save the review document
    await review.save();
    
    // Instead of pushing the entire review object, push only its _id
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
    // Remove the review's ObjectId from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete the review document from the database
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error deleting review:", error);
    req.flash("error", "Error deleting review.");
    res.redirect("back");
  }
};
