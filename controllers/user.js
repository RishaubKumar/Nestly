// Handles user signup, login, logout, and dashboard rendering

const Listing = require("../models/listing");
const Booking = require('../models/booking');
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Registered Successfully!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Nestly! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are successfully logged out!");
    res.redirect("/listings");
  });
};

exports.renderUserDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('property');
    res.render('userDashboard', { bookings });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    req.flash("error", "Unable to fetch bookings.");
    res.redirect("back");
  }
};