// Defines the schema and model for bookings and rental inquiries

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
  bookingType: { 
    type: String, 
    enum: ['short-term', 'long-term'], 
    required: true 
  },
  checkinDate: Date,
  checkoutDate: Date,
  guests: Number,
  startDate: Date,
  durationInMonths: Number,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
