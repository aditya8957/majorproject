const mongoose = require('mongoose');

const trackStatusSchema = new mongoose.Schema({
  applicationId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing'],
    default: 'pending'
  },
  device: {
    type: String,
    required: true
  },
  center: {
    type: String,
    default: null
  },
  appliedDate: { 
    type: Date, 
    default: Date.now 
  },
  updatedDate: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedDate on save
trackStatusSchema.pre('save', function(next) {
  this.updatedDate = new Date();
  next();
});

module.exports = mongoose.model('trackStatus', trackStatusSchema);