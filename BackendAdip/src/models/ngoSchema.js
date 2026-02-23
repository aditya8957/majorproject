const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  ngoName: {
    type: String,
    required: true
  },

  registrationNumber: {
    type: String,
    required: true
  },

  district: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  documents: {
    registrationCertificate: {
      type: String,   // Cloudinary URL
      required: true
    },
    governmentApprovalLetter: {
      type: String    // optional
    }
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  adminComment: {
    type: String
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  approvedAt: {
    type: Date
  },

  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  rejectedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("ngoApplication", ngoSchema);