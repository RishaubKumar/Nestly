const Booking = require('../models/booking');
const Listing = require('../models/listing'); // Ensure this model is registered as "Listing"
const ExpressError = require("../utils/ExpressError");

// Create a booking (monthly rental)
exports.createBooking = async (req, res) => {
  try {
    // Destructure new form data from request body
    const { listingId, startDate, durationInMonths, phone } = req.body;

    // Retrieve the listing to get the owner information
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash('error', 'Listing not found.');
      return res.redirect('back');
    }

    // Parse the start date and duration
    const start = new Date(startDate);
    const duration = parseInt(durationInMonths);
    if (isNaN(start.getTime()) || isNaN(duration) || duration <= 0) {
      req.flash('error', 'Invalid move-in date or duration.');
      return res.redirect('back');
    }

    // Create a new booking document
    const booking = new Booking({
      property: listing._id,
      user: req.user._id,
      owner: listing.owner,
      startDate: start,
      durationInMonths: duration,
      fullName: req.user.username,
      phone
    });

    await booking.save();
    req.flash('success', 'Rent request sent successfully!');
    return res.redirect('/user/dashboard');
  } catch (error) {
    console.error("Error in renting:", error);
    req.flash('error', 'Error processing renting request');
    return res.redirect('back');
  }
};

// Render the owner dashboard with bookings for which the current user is the owner.
exports.getOwnerDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property');
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
    booking.status = 'accepted';
    await booking.save({ validateBeforeSave: false });
    req.flash('success', 'Booking accepted successfully!');
    return res.redirect('/owner/dashboard');
  } catch (error) {
    console.error("Error accepting booking:", error);
    req.flash('error', 'Error processing acceptance');
    return res.redirect('back');
  }
};

// List bookings for the logged-in user; used for the user's dashboard.
exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property');
    return res.render('bookings/index', { bookings });
  } catch (error) {
    console.error("Error listing bookings:", error);
    req.flash("error", "Error retrieving bookings");
    return res.redirect('back');
  }
};

// Cancel a booking
module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/user/dashboard");
  }

  const now = new Date();
  const start = new Date(booking.startDate);
  const diffInMs = start - now;
  const hoursDiff = diffInMs / (1000 * 60 * 60);

  // Disallow cancellation within 24 hours of move-in date
  if (hoursDiff < 24) {
    req.flash("error", "You cannot cancel your booking within 24 hours of the move-in date.");
    return res.redirect("/user/dashboard");
  }

  booking.status = "cancelled";
  await booking.save();

  // Optionally delete the booking after cancellation
  await Booking.findByIdAndDelete(id);

  req.flash("success", "Your booking has been cancelled.");
  res.redirect("/user/dashboard");
};
