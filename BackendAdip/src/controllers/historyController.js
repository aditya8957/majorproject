const TrackStatus = require("../models/trackStatus");

const getMyHistory = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Phone number required" });
    }

    const history = await TrackStatus.find({ phoneNumber: phone })
      .sort({ appliedDate: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMyHistory };



