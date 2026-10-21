const TrackStatus = require("../models/trackStatus");
const Beneficiary = require("../models/beneficiary");

// Public route for tracking application status
const getApplicationStatus = async (req, res) => {
  try {
    const applicationId = String(req.query.id || '').trim();
    const phoneNumber = String(req.query.phone || '').trim();

    if (!applicationId || !phoneNumber) {
      return res.status(400).json({ 
        error: "Application ID and Phone Number required" 
      });
    }

    const beneficiary = await Beneficiary.findOne({ applicationId, phone: phoneNumber })
      .populate('assignedNGO', 'ngoName phone address district state');

    if (!beneficiary) return res.status(404).json({ error: "Application not found with the provided details" });

    const distributionStatus = beneficiary.distribution?.status;
    const canonicalDistributionStatus = distributionStatus === 'accepted' ? 'processing_at_ngo' : distributionStatus;
    const status = canonicalDistributionStatus && canonicalDistributionStatus !== 'pending'
      ? canonicalDistributionStatus
      : beneficiary.sentToNGO
        ? 'processing_at_ngo'
        : beneficiary.assignedNGO
          ? 'ngo_assigned'
          : beneficiary.applicationStatus === 'pending'
            ? 'submitted'
            : beneficiary.applicationStatus;
    const legacyHistory = await TrackStatus.findOne({ applicationId: beneficiary.applicationId }).select('history');
    const assignedNGO = beneficiary.assignedNGO ? {
      id: beneficiary.assignedNGO._id,
      name: beneficiary.assignedNGO.ngoName,
      phone: beneficiary.assignedNGO.phone,
      address: beneficiary.assignedNGO.address,
      district: beneficiary.assignedNGO.district,
      state: beneficiary.assignedNGO.state
    } : null;

    res.json({
      applicationId: beneficiary.applicationId,
      name: beneficiary.fullName,
      phone: beneficiary.phone,
      status,
      device: beneficiary.requiredDevice,
      assignedNGO,
      implementingCenter: assignedNGO?.name || '',
      center: assignedNGO?.name || '',
      appliedDate: beneficiary.createdAt,
      updatedDate: beneficiary.updatedAt || beneficiary.createdAt,
      history: legacyHistory?.history || [],
      distribution: beneficiary.distribution ? {
        method: beneficiary.distribution.method,
        status: beneficiary.distribution.status,
        expectedDeliveryDate: beneficiary.distribution.expectedDeliveryDate,
        deliveredAt: beneficiary.distribution.deliveredAt,
        beneficiaryConfirmed: beneficiary.distribution.beneficiaryConfirmed,
        beneficiaryConfirmedAt: beneficiary.distribution.beneficiaryConfirmedAt,
        proofSubmittedAt: beneficiary.distribution.proofSubmittedAt,
        verificationStatus: beneficiary.adminVerification?.status || 'pending'
      } : null
    });

  } catch (err) {
    console.error('Error in getApplicationStatus:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getApplicationStatus };