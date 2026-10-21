const mongoose = require("mongoose");
const { DISABILITY_TYPES, DEVICE_TYPES, APPLICATION_STATUS, NGO_STATUS, DISTRIBUTION_STATUS, DISTRIBUTION_METHODS, GENDER_TYPES, VERIFICATION_STATUS } = require('../constants/enums');

const beneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
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
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: GENDER_TYPES,
    required: true
  },
  phone: {
    type: String,
    required: true,
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
  disabilityType: {
    type: String,
    enum: DISABILITY_TYPES,
    required: true
  },
  disabilityPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
   disabilityCertificate: {
    fileName: { type: String },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    verificationStatus: {  // ✅ Add this
      type: String,
      enum: VERIFICATION_STATUS,
      default: 'pending'
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    verifiedAt: { type: Date }, 
    rejectionReason: { type: String } 
  },
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
  requiredDevice: {
    type: String,
    enum: DEVICE_TYPES,
    required: true
  },
  applicationStatus: {
    type: String,
    enum: Object.values(APPLICATION_STATUS),
    default: APPLICATION_STATUS.SUBMITTED
  },
  assignedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ngoApplication',
    default: null
  },
  ngoStatus: {
    type: String,
    enum: NGO_STATUS,
    default: 'not_assigned'
  },
  sentToNGO: { type: Boolean, default: false },
  ngoResponseAt: { type: Date, default: null },
  ngoRejectionReason: { type: String, default: null },
  expectedDistributionDate: { type: Date, default: null },
  distributionDate: { type: Date, default: null },
  distributionRemarks: { type: String, default: null },
  distributionProof: {
    fileName: String,
    fileUrl: String,
    publicId: String,
    uploadedAt: Date
  },
  adminVerification: {
  status: { type: String, enum: VERIFICATION_STATUS, default: 'pending' },
    comment: { type: String, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    verifiedAt: { type: Date, default: null }
  },
  distribution: {
    method: { type: String, enum: DISTRIBUTION_METHODS, default: null },
    status: {
      type: String,
      enum: DISTRIBUTION_STATUS,
      default: 'pending'
    },
    expectedDeliveryDate: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    pickupDate: { type: Date, default: null },
    campName: { type: String, default: null },
    campLocation: { type: String, default: null },
    instructions: { type: String, default: null },
    beneficiaryConfirmed: { type: Boolean, default: false },
    beneficiaryConfirmedAt: { type: Date, default: null },
    proofUrl: { type: String, default: null },
    proofSubmittedAt: { type: Date, default: null },
    adminVerified: { type: Boolean, default: false },
    adminVerifiedAt: { type: Date, default: null },
    adminRejectionReason: { type: String, default: null },
    ngoRemarks: { type: String, default: null }
  },
  notifications: [{
    recipientRole: { type: String, enum: ['beneficiary', 'ngo', 'admin'], required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'application_update' },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  communications: [{
    senderRole: { type: String, enum: ['beneficiary', 'ngo', 'admin'], required: true },
    message: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  deliveryProblem: {
    reported: { type: Boolean, default: false },
    reason: { type: String, default: null },
    reportedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null }
  },
  declarationAccepted: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });




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
