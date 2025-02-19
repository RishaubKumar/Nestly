const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require('../controllers/bookingController');
const { isloggedin } = require('../middleware');

// Create a booking (short-term or long-term)
router.post('/bookings', isloggedin, wrapAsync(bookingController.createBooking));

// List bookings for the logged-in user
router.get('/bookings', isloggedin, wrapAsync(bookingController.listBookings));

// Owner dashboard: show booking requests for properties the user owns
router.get('/owner/dashboard', isloggedin, wrapAsync(bookingController.getOwnerDashboard));

// Owner accepts a booking request
router.post('/owner/accept', isloggedin, wrapAsync(bookingController.acceptBooking));

// Cancel a booking
router.post('/bookings/:id/cancel', isloggedin, wrapAsync(bookingController.cancelBooking));

module.exports = router;

