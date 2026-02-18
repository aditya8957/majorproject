const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema({
 
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  applicationId: {
  type: String,
  unique: true,
  required: true
 },

  age: {
    type: Number,
    required: true,
    min: 1
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, "Invalid phone number"]
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },

  // Disability Details
  disabilityType: {
    type: String,
    enum: [
      "locomotor",
      "visual",
      "hearing",
      "intellectual",
      "multiple"
    ],
    required: true
  },
  disabilityPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  disabilityCertificate: {
    fileName: { type: String }, // stored filename
    fileUrl: { type: String },  // path/URL where file is saved
    uploadedAt: { type: Date, default: Date.now }
  },

  // Address Details
  address: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pinCode: {
    type: String,
    required: true,
    match: [/^[0-9]{6}$/, "Invalid PIN Code"]
  },

  // Device Requirement
  requiredDevice: {
    type: String,
    enum: ["wheelchair", "hearing", "crutches", "prosthetic", "braille"],
    required: true
  },

  // Declaration
  declarationAccepted: {
    type: Boolean,
    required: true
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});




beneficiarySchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.disabilityCertificate && doc.disabilityCertificate.fileName) {
    const filePath = path.join(__dirname, "../uploads", doc.disabilityCertificate.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted:", filePath);
    }
  }
});

beneficiarySchema.post("deleteOne", { document: true, query: false }, async function (doc) {
  if (doc && doc.disabilityCertificate && doc.disabilityCertificate.fileName) {
    const filePath = path.join(__dirname, "../uploads", doc.disabilityCertificate.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted:", filePath);
    }
  }
});
module.exports = mongoose.model("beneficiary", beneficiarySchema);
