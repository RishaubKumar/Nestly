// Defines routes related to rendering the application homepage

const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listing.js");

router.get("/", listingController.renderHome);

module.exports = router;
