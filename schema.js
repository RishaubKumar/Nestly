// Defines Joi schemas for listing and review validation

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  rentalOption: Joi.string().valid('rent', 'booking', 'both').required()
}).required().unknown(true);

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
});
