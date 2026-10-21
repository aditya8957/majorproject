const Beneficiary = require("../models/beneficiary");
const TrackStatus = require("../models/trackStatus");
const validateBeneficiary = require("../utils/beneficiaryValidator");
const cloudinary = require("../config/cloudinary");
const { APPLICATION_STATUS } = require('../constants/enums');

const generateApplicationId = async () => {
  const year = new Date().getFullYear();
  let id;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    id = `ADIP${year}${randomNumber}`;
    exists = await Beneficiary.exists({ applicationId: id });
  }

  return id;
};

const registerBeneficiary = async (req, res) => {
  try {
    validateBeneficiary(req.body);

    const { fullName, email, phone } = req.body;

    req.body.role = "user";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "disability_certificates",
            resource_type: "raw",
            format: "pdf"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      req.body.disabilityCertificate = {
        fileName: req.file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        version: result.version,
        uploadedAt: new Date()
      };
    }

    req.body.applicationId = await generateApplicationId();
    req.body.userId = req.result?._id || req.body.userId;

    const beneficiary = await Beneficiary.create(req.body);

    await TrackStatus.create({
      applicationId: beneficiary.applicationId,
      name: beneficiary.fullName,
      phoneNumber: beneficiary.phone,
      status: beneficiary.applicationStatus || APPLICATION_STATUS.SUBMITTED,
      device: beneficiary.requiredDevice,
      appliedDate: beneficiary.createdAt,
      updatedDate: beneficiary.createdAt
      ,history: [{ status: APPLICATION_STATUS.SUBMITTED, message: 'Application submitted', date: beneficiary.createdAt }]
    });

    const reply = {
      _id: beneficiary._id,
      fullName: beneficiary.fullName,
      email: beneficiary.email,
      phone: beneficiary.phone,
      disabilityType: beneficiary.disabilityType,
      applicationId: beneficiary.applicationId,
      disabilityPercentage: beneficiary.disabilityPercentage,
      state: beneficiary.state,
      requiredDevice: beneficiary.requiredDevice,
      role: beneficiary.role,
      disabilityCertificate: beneficiary.disabilityCertificate
    };

    res.status(201).json({
      user: reply,
      message: "Beneficiary Registered Successfully"
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { registerBeneficiary };