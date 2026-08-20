// Defines routes related to listing creation, display, editing, updating, and deletion

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedin, 
    upload.array("images"), 
    validatelisting, 
    wrapAsync(listingController.createListing)
  );

router.get("/new", isloggedin, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isloggedin,
    isOwner,
    upload.array("images"), 
    validatelisting, 
    wrapAsync(listingController.updateListing)
  )
  .delete(isloggedin, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
