const TrackStatus = require("../models/trackStatus");

const getApplicationStatus = async (req,res) => {
  try {
    const { id: applicationId, phone: phoneNumber } = req.query;;

    if(!applicationId || !phoneNumber){
      return res.status(400).json({ error: "Application ID and Phone Number required" });
    }

    const app = await TrackStatus.findOne({ applicationId, phoneNumber });
    if(!app) return res.status(404).json({ error: "Application not found" });

    res.json({
      applicationId: app.applicationId,
      name: app.name,
      status: app.status,
      device: app.device,
      appliedDate: app.appliedDate,
      updatedDate: app.updatedDate,
      center: app.center || ""
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getApplicationStatus };
