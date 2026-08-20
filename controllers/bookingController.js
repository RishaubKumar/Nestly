// Handles booking creation, listing, dashboards, cancellation, and owner accept/reject operations

const Booking = require('../models/booking');
const Listing = require('../models/listing');

module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, fullName, phone } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash('error', 'Listing not found.');
      return res.redirect('back');
    }

    if (listing.owner.equals(req.user._id)) {
      req.flash('error', 'You cannot book your own listing.');
      return res.redirect('back');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let bookingData = {
      property: listing._id,
      user: req.user._id,
      owner: listing.owner,
      fullName,
      phone
    };

    if (req.body.checkin && req.body.checkout) {
      const checkinDate = new Date(req.body.checkin);
      const checkoutDate = new Date(req.body.checkout);

      if (
        isNaN(checkinDate.getTime()) ||
        isNaN(checkoutDate.getTime()) ||
        checkinDate >= checkoutDate
      ) {
        req.flash('error', 'Invalid check-in or check-out dates.');
        return res.redirect('back');
      }

      if (checkinDate < today) {
        req.flash('error', 'Check-in date cannot be in the past.');
        return res.redirect('back');
      }

      const overlapping = await Booking.findOne({
        property: listing._id,
        status: 'accepted',
        bookingType: 'short-term',
        $or: [
          { checkinDate: { $lt: checkoutDate }, checkoutDate: { $gt: checkinDate } }
        ]
      });

      if (overlapping) {
        req.flash('error', 'These dates are already booked!');
        return res.redirect('back');
      }

      bookingData.bookingType = 'short-term';
      bookingData.checkinDate = checkinDate;
      bookingData.checkoutDate = checkoutDate;
      bookingData.guests = req.body.guests;
    } else if (req.body.startDate && req.body.durationInMonths) {
      const start = new Date(req.body.startDate);
      const duration = parseInt(req.body.durationInMonths);

      if (isNaN(start.getTime()) || isNaN(duration) || duration <= 0) {
        req.flash('error', 'Invalid move-in date or duration.');
        return res.redirect('back');
      }

      if (start < today) {
        req.flash('error', 'Move-in date cannot be in the past.');
        return res.redirect('back');
      }

      bookingData.bookingType = 'long-term';
      bookingData.startDate = start;
      bookingData.durationInMonths = duration;
    } else {
      req.flash('error', 'Invalid booking data provided.');
      return res.redirect('back');
    }

    const booking = new Booking(bookingData);
    await booking.save();
    req.flash(
      'success',
      `${
        bookingData.bookingType === 'short-term'
          ? 'Booking'
          : 'Rent inquiry'
      } sent successfully!`
    );
    res.redirect('/user/dashboard');
  } catch (error) {
    console.error('Error creating booking:', error);
    req.flash('error', 'Error processing booking request.');
    res.redirect('back');
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id }).populate('property');
    return res.render('ownerDashboard', { bookings });
  } catch (error) {
    console.error("Error fetching owner dashboard:", error);
    req.flash('error', 'Error loading dashboard');
    return res.redirect('back');
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('back');
    }

    if (!booking.owner.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to accept this booking.');
      return res.redirect('back');
    }

    if (booking.bookingType === 'short-term') {
      const overlapping = await Booking.findOne({
        _id: { $ne: booking._id },
        property: booking.property,
        status: 'accepted',
        bookingType: 'short-term',
        $or: [
          { checkinDate: { $lt: booking.checkoutDate }, checkoutDate: { $gt: booking.checkinDate } }
        ]
      });

      if (overlapping) {
        req.flash('error', 'Cannot accept. This overlaps with an already accepted booking!');
        return res.redirect('back');
      }
    }

    booking.status = 'accepted';
    await booking.save();
    req.flash('success', 'Booking accepted successfully!');
    return res.redirect('/owner/dashboard');
  } catch (error) {
    console.error("Error accepting booking:", error);
    req.flash('error', 'Error processing acceptance');
    return res.redirect('back');
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('back');
    }

    if (!booking.owner.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to reject this booking.');
      return res.redirect('back');
    }

    booking.status = 'rejected';
    await booking.save();
    req.flash('success', 'Booking rejected successfully!');
    return res.redirect('/owner/dashboard');
  } catch (error) {
    console.error("Error rejecting booking:", error);
    req.flash('error', 'Error processing rejection');
    return res.redirect('back');
  }
};

exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('property');
    return res.render('bookings/index', { bookings });
  } catch (error) {
    console.error("Error listing bookings:", error);
    req.flash("error", "Error retrieving bookings");
    return res.redirect('back');
  }
};

module.exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/user/dashboard");
    }

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You are not authorized to cancel this booking.");
      return res.redirect("/user/dashboard");
    }

    const now = new Date();
    const targetDate = booking.bookingType === 'short-term' ? booking.checkinDate : booking.startDate;
    const diffInMs = targetDate - now;
    const hoursDiff = diffInMs / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      req.flash("error", "You cannot cancel your booking within 24 hours of starting.");
      return res.redirect("/user/dashboard");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Your booking has been cancelled.");
    res.redirect("/user/dashboard");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    req.flash("error", "Error processing cancellation");
    res.redirect("/user/dashboard");
  }
};

