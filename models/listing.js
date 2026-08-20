// Defines the schema and model for properties/listings

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  price: Number,
  location: String,
  country: String,
  rentalOption: {
    type: String,
    enum: ['rent', 'booking', 'both'],
    required: true,
  },
  rentalTypes: {
    type: [String],
    enum: ['short-term', 'long-term'],
    default: ['long-term']
  },
  amenities: {
    type: [String],
    default: []
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

listingSchema.post("findOneAndDelete", async function(listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;