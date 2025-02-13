// controllers/bookingController.js
// controllers/booking.js

const Booking = require('../models/booking');
const Listing = require('../models/listing'); // Ensure this model exists and is registered as "Listing"
const ExpressError = require("../utils/ExpressError");

// Create a booking; the guest name (fullName) is auto-filled from the logged-in user.
exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkin, checkout, guests, phone } = req.body;
    
    // Retrieve the listing to get the owner info.
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash('error', 'Listing not found.');
      return res.redirect('back');
    }
    
    // Auto-fill the guest name using the logged-in user's username.
    const booking = new Booking({
      property: listing._id,    // Using listing._id as property reference
      user: req.user._id,       // Logged-in user's ID
      owner: listing.owner,     // Owner of the listing (assumed to be stored in the listing document)
      checkIn: checkin,         // From form (ensure proper date format)
      checkOut: checkout,       // From form
      guests,
      fullName: req.user.username,  // Auto-fill guest name from the current user
      phone
    });
    
    await booking.save();
    req.flash('success', 'Booking request created successfully!');
    return res.redirect('/user/dashboard'); // Adjust redirection as needed
  } catch (error) {
    console.error("Error creating booking:", error);
    req.flash('error', 'Error processing booking request');
    return res.redirect('back');
  }
};

// Render the owner dashboard with bookings for which the current user is the owner.
exports.getOwnerDashboard = async (req, res) => {
  try {
    // Assuming req.user._id is the owner's ID, fetch bookings for which this user is the owner.
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property');  // Ensure the ref in your Booking schema matches the Listing model name.
    return res.render('ownerDashboard', { bookings });
  } catch (error) {
    console.error("Error fetching owner dashboard:", error);
    req.flash('error', 'Error loading dashboard');
    return res.redirect('back');
  }
};

// Accept a booking; update its status to "accepted".
exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('back');
    }
    // Update the booking status to "accepted"
    booking.status = 'accepted';
    // Save without running full validations to bypass missing required fields (if any exist)
    await booking.save({ validateBeforeSave: false });
    req.flash('success', 'Booking accepted successfully!');
    return res.redirect('/owner/dashboard');
  } catch (error) {
    console.error("Error accepting booking:", error);
    req.flash('error', 'Error processing acceptance');
    return res.redirect('back');
  }
};

// List bookings for the logged-in user; used to render the user's dashboard.
exports.listBookings = async (req, res) => {
  try {
    // Find bookings created by the logged-in user and populate the property field.
    const bookings = await Booking.find({ user: req.user._id }).populate('property');
    return res.render('bookings/index', { bookings });
  } catch (error) {
    console.error("Error listing bookings:", error);
    req.flash("error", "Error retrieving bookings");
    return res.redirect('back');
  }
};

module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/user/dashboard");
  }

  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  const diffInMs = checkIn - now; // difference in milliseconds
  const hoursDiff = diffInMs / (1000 * 60 * 60); // Convert to hours

  // Check if the booking is more than 24 hours away from check-in or if it was made within 24 hours
  if (hoursDiff < 24) {
    req.flash("error", "You cannot cancel your booking within 24 hours of check-in.");
    return res.redirect("/user/dashboard");
  }

  booking.status = "cancelled"; // Update status to cancelled
  await booking.save();

  // After updating the status, delete the booking from the database
  await Booking.findByIdAndDelete(id);

  req.flash("success", "Your booking has been cancelled.");
  res.redirect("/user/dashboard");
};

