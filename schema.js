const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  rentalOption: Joi.string().valid('rent', 'booking', 'both').required()
}).required().unknown(true); // allow additional keys if needed

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }).required()
});
