// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// If you have authentication middleware, you can require and use it here
const { isloggedin } = require('../middleware'); // Adjust based on your project

// Route to create a booking (form action should match this endpoint)
router.post('/user/dashboard',isloggedin, bookingController.createBooking);

router.get('/user/dashboard', isloggedin, bookingController.listBookings);

// Route to show the owner dashboard with booking requests
router.get('/owner/dashboard',isloggedin, bookingController.getOwnerDashboard);

  
// Route for the owner to accept a booking request
router.post('/owner/accept', isloggedin, bookingController.acceptBooking);

module.exports = router;

