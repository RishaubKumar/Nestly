const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
    // Note: We don’t validate images here because they come from req.files.
  }).required(),
  // Allow deleteImages as an optional field (it can be a string or an array of strings)
  deleteImages: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional()
}).unknown(true);  // Allow unknown keys if necessary

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
            rating:Joi.number().required(),
            comment:Joi.string().required(),
    }).required()
})