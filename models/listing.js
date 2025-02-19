const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // An array of image objects
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  // The primary price (typically the long-term monthly price)
  price: Number,
  location: String,
  country: String,
  // Rental types supported by this listing:
  rentalTypes: {
    type: [String],
    enum: ['short-term', 'long-term'],
    default: ['long-term']
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

// When a listing is deleted, also delete its associated reviews
listingSchema.post("findOneAndDelete", async function(listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
