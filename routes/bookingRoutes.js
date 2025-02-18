const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require('../controllers/bookingController');
const { isloggedin } = require('../middleware');

// Create a booking (form action should match this endpoint)
router.post('/user/dashboard', isloggedin, bookingController.createBooking);

// List bookings for the logged-in user
router.get('/user/dashboard', isloggedin, bookingController.listBookings);

// Owner dashboard (bookings for which the current user is the owner)
router.get('/owner/dashboard', isloggedin, bookingController.getOwnerDashboard);

// Accept a booking request (by the owner)
router.post('/owner/accept', isloggedin, bookingController.acceptBooking);

// Cancel a booking
router.post("/:id/cancel", isloggedin, wrapAsync(bookingController.cancelBooking));

module.exports = router;
