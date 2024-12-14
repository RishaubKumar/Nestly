const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedin , isOwner ,validatelisting} =require("../middleware.js")// for authentication
const listingController = require("../controllers/listing.js")
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Removed "/" argument
  .post(
    isloggedin, 
    upload.single("listing[image]"),
    validatelisting, 
    wrapAsync(listingController.createListing)
  );

  //New Route
  router.get("/new", isloggedin, listingController.renderNewForm);
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedin,
      isOwner,
    upload.single("listing[image]"),
    validatelisting, wrapAsync(listingController.updateListing))
    .delete(isloggedin,isOwner,wrapAsync(listingController.destroyListing))
  
  //Edit Route
  router.get("/:id/edit", isloggedin,isOwner,  wrapAsync(listingController.renderEditForm));
    module.exports = router;