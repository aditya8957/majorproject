const Beneficiary = require("../models/beneficiary");
const validateBeneficiary = require("../utils/beneficiaryValidator");
const TrackStatus = require("../models/trackStatus");
const cloudinary = require("../config/cloudinary");

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
            resource_type: "raw"  
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const viewUrl = `https://res.cloudinary.com/${cloudinary.config().cloud_name}/raw/upload/fl_attachment:false/${result.public_id}.pdf`;

      req.body.disabilityCertificate = {
        fileName: req.file.originalname,
        fileUrl: viewUrl,     
        publicId: result.public_id
      };
    }

    req.body.applicationId = await generateApplicationId();

    const beneficiary = await Beneficiary.create(req.body);

    await TrackStatus.create({
      applicationId: beneficiary.applicationId,
      name: beneficiary.fullName,
      phoneNumber: beneficiary.phone,
      status: "pending",
      device: beneficiary.requiredDevice
    });

    // 🚨 IMPORTANT: DO NOT generate new token here
    // User should keep their original login token

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
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = { registerBeneficiary };