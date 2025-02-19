const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isloggedin } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signUp));

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: '/login',
      failureFlash: true
    }),
    userController.login
  );

router.get('/logout', userController.logout);

// User Dashboard route – this remains separate from the bookings routes.
router.get('/user/dashboard', isloggedin, wrapAsync(userController.renderUserDashboard));

module.exports = router;

