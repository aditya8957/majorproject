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
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  adminComment: {
    type: String
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  approvedAt: {
    type: Date
  },

  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  rejectedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("ngoApplication", ngoSchema);