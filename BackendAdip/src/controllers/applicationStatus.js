const TrackStatus = require("../models/trackStatus");
const Beneficiary = require("../models/beneficiary");

// Public route for tracking application status
const getApplicationStatus = async (req, res) => {
  try {
    const { id: applicationId, phone: phoneNumber } = req.query;

    if (!applicationId || !phoneNumber) {
      return res.status(400).json({ 
        error: "Application ID and Phone Number required" 
      });
    }

    // First try to find in TrackStatus collection
    let app = await TrackStatus.findOne({ applicationId, phoneNumber });

    // If not found in TrackStatus, check Beneficiary collection
    if (!app) {
      const beneficiary = await Beneficiary.findOne({ 
        applicationId, 
        phone: phoneNumber 
      }).select('fullName requiredDevice applicationStatus createdAt disabilityCertificate.verificationStatus');

      if (!beneficiary) {
        return res.status(404).json({ 
          error: "Application not found with the provided details" 
        });
      }

      // Create track status record for future lookups
      app = await TrackStatus.create({
        applicationId: beneficiary.applicationId,
        name: beneficiary.fullName,
        phoneNumber: phoneNumber,
        status: beneficiary.applicationStatus,
        device: beneficiary.requiredDevice,
        appliedDate: beneficiary.createdAt,
        updatedDate: beneficiary.updatedAt || beneficiary.createdAt
      });
    }

    res.json({
      applicationId: app.applicationId,
      name: app.name,
      status: app.status,
      device: app.device,
      appliedDate: app.appliedDate,
      updatedDate: app.updatedDate,
      center: app.center || ""
    });

  } catch (err) {
    console.error('Error in getApplicationStatus:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getApplicationStatus };