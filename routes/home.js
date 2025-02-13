const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listing.js"); // Use the controller you already created

// Route to render the home page
router.get("/", listingController.renderHome);

module.exports = router;
