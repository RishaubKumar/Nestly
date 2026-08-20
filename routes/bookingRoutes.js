// Defines routes related to property booking and owner dashboards

const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require('../controllers/bookingController');
const { isloggedin } = require('../middleware');

router.post('/bookings', isloggedin, wrapAsync(bookingController.createBooking));
router.get('/bookings', isloggedin, wrapAsync(bookingController.listBookings));
router.get('/owner/dashboard', isloggedin, wrapAsync(bookingController.getOwnerDashboard));
router.post('/owner/accept', isloggedin, wrapAsync(bookingController.acceptBooking));
router.post('/owner/reject', isloggedin, wrapAsync(bookingController.rejectBooking));
router.post('/bookings/:id/cancel', isloggedin, wrapAsync(bookingController.cancelBooking));

module.exports = router;

