const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/beneficiary');
const TrackStatus = require('../models/trackStatus');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const NGO = require('../models/ngoSchema');
const updateTrackStatus = require('../utils/updateTrackStatus');
const { APPLICATION_STATUS, DEVICE_LABELS, normalizeApplicationStatus, STATUS_TRANSITIONS } = require('../constants/enums');

const workflowStatus = (application) => {
  if (application.distribution?.status && application.distribution.status !== 'pending') return application.distribution.status === 'accepted' ? 'processing_at_ngo' : application.distribution.status;
  if (application.sentToNGO) return 'processing_at_ngo';
  if (application.assignedNGO) return 'ngo_assigned';
  if (application.applicationStatus === 'pending') return 'submitted';
  return application.applicationStatus;
};
const addNotification = (application, recipientRole, message, type = 'application_update') => {
  application.notifications.push({ recipientRole, message, type, createdAt: new Date() });
};

// Apply admin middleware
router.use(adminMiddleware);

// GET /admin/applications - Get all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Beneficiary.find().populate('assignedNGO', 'ngoName address phone')
      .sort({ createdAt: -1 });
    const trackStatuses = await TrackStatus.find({ applicationId: { $in: applications.map(application => application.applicationId) } }).select('applicationId history');
    const historyById = new Map(trackStatuses.map(trackStatus => [trackStatus.applicationId, trackStatus.history || []]));
    
    const transformedApps = applications.map(app => ({
      id: app.applicationId,
      applicantName: app.fullName,
      contact: app.phone,
      email: app.email,
      date: app.createdAt,
      disabilityType: app.disabilityType,
      disabilityPercentage: app.disabilityPercentage,
      monthlyIncome: app.monthlyIncome,
      address: app.address,
      deviceRequested: app.requiredDevice,
      deviceType: getDeviceType(app.requiredDevice),
      estimatedCost: getEstimatedCost(app.requiredDevice),
      status: workflowStatus(app),
      ngo: app.assignedNGO,
      ngoStatus: app.ngoStatus,
      distribution: app.distribution,
      adminVerification: app.adminVerification,
      documents: [
        {
          id: app._id.toString(),
          name: app.disabilityCertificate?.fileName || 'Disability Certificate.pdf',
          type: 'disability',
          status: app.disabilityCertificate?.verificationStatus || 'pending',
          url: app.disabilityCertificate?.fileUrl
        }
      ],
      trackingHistory: historyById.get(app.applicationId) || []
    }));

    res.json(transformedApps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/applications/:id - Get single application
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Beneficiary.findOne({ applicationId: req.params.id }).populate('assignedNGO', 'ngoName address phone');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Get tracking status
    const trackStatus = await TrackStatus.findOne({ 
      applicationId: application.applicationId 
    });

    const documentStatus = application.disabilityCertificate?.verificationStatus || 'pending';

    const transformedApp = {
      id: application.applicationId,
      applicantName: application.fullName,
      contact: application.phone,
      email: application.email,
      date: application.createdAt,
      disabilityType: application.disabilityType,
      disabilityPercentage: application.disabilityPercentage,
      monthlyIncome: application.monthlyIncome,
      address: application.address,
      state: application.state,
      pinCode: application.pinCode,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender,
      deviceRequested: application.requiredDevice,
      deviceType: getDeviceType(application.requiredDevice),
      estimatedCost: getEstimatedCost(application.requiredDevice),
      status: workflowStatus(application),
      ngo: application.assignedNGO,
      ngoStatus: application.ngoStatus,
      sentToNGO: application.sentToNGO,
      distribution: application.distribution,
      distributionProof: application.distributionProof,
      adminVerification: application.adminVerification,
      documents: [
        {
          id: application._id.toString(),
          name: application.disabilityCertificate?.fileName || 'Disability Certificate.pdf',
          type: 'disability',
          status: documentStatus,
          url: application.disabilityCertificate?.fileUrl,
          publicId: application.disabilityCertificate?.publicId,
          uploadedAt: application.disabilityCertificate?.uploadedAt,
          rejectionReason: application.disabilityCertificate?.rejectionReason,
          verifiedBy: application.disabilityCertificate?.verifiedBy,
          verifiedAt: application.disabilityCertificate?.verifiedAt
        }
      ],
      trackingHistory: trackStatus?.history || []
    };

    res.json(transformedApp);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATED: PUT /admin/applications/:id/status - Update status (Now updates TrackStatus)
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status, comment, rejectionReason } = req.body;
    
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Map frontend status to your status
    const dbStatus = mapToDBStatus(status);
    const currentStatus = workflowStatus(application);
    if (dbStatus !== currentStatus && !(STATUS_TRANSITIONS[currentStatus] || []).includes(dbStatus)) {
      return res.status(409).json({ message: `Invalid status transition from ${currentStatus} to ${dbStatus}` });
    }
    
    // Update beneficiary status
    application.applicationStatus = dbStatus;
    if (normalizeApplicationStatus(status) === APPLICATION_STATUS.APPROVED) {
      addNotification(application, 'beneficiary', 'Your application has been approved.', 'application_approved');
    }
    if (normalizeApplicationStatus(status) === APPLICATION_STATUS.PROCESSING_AT_NGO) {
      if (!application.assignedNGO) return res.status(409).json({ message: 'Assign an approved NGO before forwarding' });
      application.sentToNGO = true;
      application.ngoStatus = 'pending';
    }
    await application.save();

    // Update or create track status (for public tracking)
    await TrackStatus.findOneAndUpdate(
      { applicationId: application.applicationId },
      {
        $set: {
          status: dbStatus,
          updatedDate: new Date()
        }
      },
      { 
        upsert: true, // Create if doesn't exist
        new: true 
      }
    );
    if (normalizeApplicationStatus(status) === APPLICATION_STATUS.PROCESSING_AT_NGO) {
      await updateTrackStatus(application.applicationId, { status: APPLICATION_STATUS.PROCESSING_AT_NGO, message: 'Application forwarded to NGO' });
    }

    // console.log(` Status updated for ${application.applicationId}: ${dbStatus}`);

    res.json({ 
      success: true,
      message: 'Status updated successfully',
      status: status 
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATED: PUT /admin/applications/:id/verify-document (Now updates TrackStatus when rejected)
router.put('/applications/:id/verify-document', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body; // 'verified' or 'rejected'
    
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Document status update
    application.disabilityCertificate.verificationStatus = status;
    application.disabilityCertificate.verifiedBy = req.user?._id;
    application.disabilityCertificate.verifiedAt = new Date();
    
    if (status === 'rejected' && rejectionReason) {
      application.disabilityCertificate.rejectionReason = rejectionReason;
      // Application status bhi reject karo
      application.applicationStatus = 'rejected';
    } else if (status === 'verified') {
      application.applicationStatus = 'under_review';
    }

    await application.save();

    // Update TrackStatus for public tracking
    await TrackStatus.findOneAndUpdate(
      { applicationId: application.applicationId },
      { 
        $set: {
          status: status === 'rejected' ? 'rejected' : 'under_review',
          updatedDate: new Date()
        }
      },
      { upsert: true }
    );

    // console.log(`Document ${status} for ${application.applicationId}`);

    // Updated application return karo
    const updatedApp = await Beneficiary.findOne({ 
      applicationId: application.applicationId 
    });

    res.json({ 
      success: true,
      message: `Document ${status} successfully`,
      application: updatedApp
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: error.message });
  }
});

//  UPDATED: POST /admin/applications/:id/assign-ngo (Now updates TrackStatus)
router.post('/applications/:id/assign-ngo', async (req, res) => {
  try {
    const { ngoId } = req.body;
    
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!ngoId) return res.status(422).json({ message: 'Approved NGO is required' });
    const ngo = await NGO.findOne({ _id: ngoId, status: { $regex: /^approved$/i } });
    if (!ngo) return res.status(404).json({ message: 'Approved NGO not found' });
    if (workflowStatus(application) !== APPLICATION_STATUS.APPROVED) return res.status(409).json({ message: 'Only approved applications can be assigned to an NGO' });
    if (application.assignedNGO && application.assignedNGO.toString() !== ngo._id.toString() && application.sentToNGO) {
      return res.status(409).json({ message: 'Application is already assigned to an active NGO' });
    }

    application.assignedNGO = ngo._id;
    application.ngoStatus = 'pending';
    application.sentToNGO = false;
    application.ngoRejectionReason = null;
    application.distribution = { status: 'pending' };
    addNotification(application, 'beneficiary', `Your application has been assigned to ${ngo.ngoName}.`, 'ngo_assigned');
    application.applicationStatus = APPLICATION_STATUS.NGO_ASSIGNED;
    await application.save();

    //  Update track status with center info
    await TrackStatus.findOneAndUpdate(
      { applicationId: application.applicationId },
      { 
        $set: {
          status: 'processing',
          updatedDate: new Date(),
          center: ngo._id.toString()
        }
      },
      { upsert: true }
    );

    // console.log(` NGO assigned to ${application.applicationId}`);

    await updateTrackStatus(application.applicationId, { status: APPLICATION_STATUS.NGO_ASSIGNED, center: ngo._id.toString(), message: 'NGO assigned' });
    res.json({ 
      success: true,
      message: 'NGO assigned successfully',
      applicationId: application.applicationId,
      ngoId: ngoId
    });
  } catch (error) {
    console.error('Error assigning NGO:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/applications/:id/document - Get document for viewing
router.get('/applications/:id/document', async (req, res) => {
  try {
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

    if (!application || !application.disabilityCertificate?.fileUrl) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ 
      fileUrl: application.disabilityCertificate.fileUrl,
      fileName: application.disabilityCertificate.fileName,
      verificationStatus: application.disabilityCertificate.verificationStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/applications/:id/distribution-proof', async (req, res) => {
  try {
    const application = await Beneficiary.findOne({ applicationId: req.params.id }).populate('assignedNGO', 'ngoName address phone').select('applicationId fullName requiredDevice assignedNGO distribution distributionProof distributionDate distributionRemarks adminVerification ngoStatus');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (!application.distributionProof?.fileUrl) return res.status(404).json({ message: 'Distribution proof not found' });
    res.json({ success: true, data: application });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/applications/:id/verify-distribution', async (req, res) => {
  try {
    const { status, comment } = req.body;
    if (!['verified', 'rejected'].includes(status) || (status === 'rejected' && !String(comment || '').trim())) return res.status(422).json({ message: status === 'rejected' ? 'A rejection reason is required' : 'Valid verification status is required' });
    const application = await Beneficiary.findOne({ applicationId: req.params.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.ngoStatus !== 'proof_submitted' || application.distribution?.status !== 'proof_submitted') return res.status(409).json({ message: 'Only submitted proof can be verified' });
    application.adminVerification = { status, comment: String(comment || '').trim() || null, verifiedBy: req.user._id, verifiedAt: new Date() };
    application.ngoStatus = status === 'verified' ? 'completed' : 'proof_submitted';
    application.applicationStatus = status === 'verified' ? APPLICATION_STATUS.COMPLETED : APPLICATION_STATUS.PROOF_REJECTED;
    application.distribution.status = status === 'verified' ? 'completed' : 'proof_rejected';
    application.distribution.adminVerified = status === 'verified';
    application.distribution.adminVerifiedAt = status === 'verified' ? new Date() : null;
    application.distribution.adminRejectionReason = status === 'rejected' ? String(comment).trim() : null;
    addNotification(application, 'beneficiary', status === 'verified' ? 'Your aid distribution has been verified successfully. Your application is now completed.' : 'The submitted distribution proof requires correction.', status === 'verified' ? 'completed' : 'proof_rejected');
    addNotification(application, 'ngo', status === 'verified' ? 'Admin has verified the submitted distribution proof.' : 'Distribution proof was rejected by Admin. Please submit updated proof.', status === 'verified' ? 'completed' : 'proof_rejected');
    await application.save();
    await updateTrackStatus(application.applicationId, { status: status === 'verified' ? APPLICATION_STATUS.COMPLETED : APPLICATION_STATUS.PROOF_REJECTED, message: status === 'verified' ? 'Distribution proof verified' : 'Distribution proof rejected' });
    res.json({ success: true, data: application });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// GET /admin/ngos - Get all NGOs
router.get('/ngos', async (req, res) => {
  try {
    const registrations = await NGO.find({ status: { $regex: /^approved$/i } }).sort({ approvedAt: -1 });
    const ngos = registrations.map(ngo => ({
      id: ngo._id.toString(), name: ngo.ngoName,
      location: `${ngo.state}, ${ngo.district}`, deviceTypes: [], workload: 0,
      capacity: null, contact: ngo.phone, address: ngo.address,
      registrationNumber: ngo.registrationNumber, status: ngo.status,
      approvedAt: ngo.approvedAt, documents: ngo.documents
    }));
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/dashboard/stats - Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const applications = await Beneficiary.find().select('applicationStatus assignedNGO sentToNGO distribution ngoStatus');
    const statuses = applications.map(workflowStatus);
    const total = applications.length;
    const pendingVerification = statuses.filter(status => ['submitted', 'under_review'].includes(status)).length;
    const approved = statuses.filter(status => status === 'approved').length;
    const ngoAssigned = statuses.filter(status => status === 'ngo_assigned').length;
    const ngoProcessing = statuses.filter(status => ['processing_at_ngo', 'aid_preparation', 'aid_ready'].includes(status)).length;
    const outForDelivery = statuses.filter(status => ['out_for_delivery', 'delivered', 'beneficiary_confirmed'].includes(status)).length;
    const proofSubmitted = statuses.filter(status => ['proof_submitted', 'proof_rejected'].includes(status)).length;
    const completed = statuses.filter(status => status === 'completed').length;
    const rejected = statuses.filter(status => status === 'rejected').length;

    // Monthly trends (last 6 months)
   
  
    // Monthly trends: January to current month (dynamic)
    const now = new Date();

    const startDate = new Date(now.getFullYear(), 0, 1);
    startDate.setHours(0, 0, 0, 0);

    const monthlyData = await Beneficiary.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Generate month labels dynamically
    const monthlyCounts = {};

    monthlyData.forEach(item => {
      monthlyCounts[item._id] = item.count;
    });

    const chartData = [];
    const currentMonth = now.getMonth() + 1;

    for (let month = 0; month < currentMonth; month++) {
      const date = new Date(now.getFullYear(), month, 1);

      chartData.push({
        name: date.toLocaleString("en-US", { month: "short" }),
        apps: monthlyCounts[month + 1] || 0
      });
    }



    res.json({
      stats: {
        total,
        pending: pendingVerification,
        pendingVerification,
        approved,
        ngoAssigned,
        ngoProcessing,
        outForDelivery,
        proofSubmitted,
        completed,
        rejected,
        processing: ngoProcessing + ngoAssigned
      },
      chartData,
      pieData: [
        { name: 'Approved', value: approved, color: '#10b981' },
        { name: 'Rejected', value: rejected, color: '#ef4444' },
        { name: 'Pending Verification', value: pendingVerification, color: '#f59e0b' },
        { name: 'Proof Verification', value: proofSubmitted, color: '#f97316' },
        { name: 'Completed', value: completed, color: '#22c55e' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: Sync endpoint to populate TrackStatus for existing applications
router.post('/sync-track-status', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({});
    let created = 0;
    let updated = 0;

    for (const ben of beneficiaries) {
      const result = await TrackStatus.findOneAndUpdate(
        { applicationId: ben.applicationId },
        {
          $set: {
            applicationId: ben.applicationId,
            name: ben.fullName,
            phoneNumber: ben.phone,
            status: ben.applicationStatus,
            device: ben.requiredDevice,
            appliedDate: ben.createdAt,
            updatedDate: ben.updatedAt || ben.createdAt
          }
        },
        { 
          upsert: true,
          new: true 
        }
      );

      // Check if it was created or updated
      if (result.createdAt === result.updatedAt) {
        created++;
      } else {
        updated++;
      }
    }

    res.json({
      success: true,
      message: `Track status synced: ${created} created, ${updated} updated`,
      total: beneficiaries.length
    });

  } catch (error) {
    console.error('Error syncing track status:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper functions
function getDeviceType(device) {
  return DEVICE_LABELS[device] || device || 'Other';
}

function getEstimatedCost(device) {
  const costs = {
    'wheelchair': 35000,
    'hearing': 25000,
    'crutches': 5000,
    'prosthetic': 45000,
    'braille': 15000
  };
  return costs[device] || 10000;
}

function mapStatus(dbStatus) {
  const statusMap = {
    'pending': 'PENDING_VERIFICATION',
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'processing': 'PROCESSING_AT_NGO'
  };
  return statusMap[dbStatus] || 'PENDING_VERIFICATION';
}

function mapToDBStatus(frontendStatus) {
  return normalizeApplicationStatus(frontendStatus) || APPLICATION_STATUS.SUBMITTED;
}

module.exports = router;