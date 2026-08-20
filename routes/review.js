// Defines routes related to creating and deleting listing reviews

const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isloggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router.post("/", isloggedin, validateReview, wrapAsync(reviewController.createReview));
router.delete('/:reviewId', isloggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;