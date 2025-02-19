const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  // Indicates if this booking is for short-term or long-term rental
  bookingType: { 
    type: String, 
    enum: ['short-term', 'long-term'], 
    required: true 
  },
  // Fields for short-term bookings
  checkinDate: Date,
  checkoutDate: Date,
  guests: Number,
  // Fields for long-term bookings
  startDate: Date,
  durationInMonths: Number,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
