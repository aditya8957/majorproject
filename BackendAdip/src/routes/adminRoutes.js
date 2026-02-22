const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/beneficiary');
const TrackStatus = require('../models/trackStatus');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply admin middleware
router.use(adminMiddleware);

// GET /admin/applications - Get all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Beneficiary.find()
      .sort({ createdAt: -1 });
    
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
      status: mapStatus(app.applicationStatus),
      documents: [
        {
          id: app._id.toString(),
          name: app.disabilityCertificate?.fileName || 'Disability Certificate.pdf',
          type: 'disability',
          status: app.disabilityCertificate?.verificationStatus || 'pending',
          url: app.disabilityCertificate?.fileUrl
        }
      ],
      trackingHistory: [
        {
          status: mapStatus(app.applicationStatus),
          date: app.createdAt,
          comment: 'Application submitted'
        }
      ]
    }));

    res.json(transformedApps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/applications/:id - Get single application
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

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
      age: application.age,
      gender: application.gender,
      deviceRequested: application.requiredDevice,
      deviceType: getDeviceType(application.requiredDevice),
      estimatedCost: getEstimatedCost(application.requiredDevice),
      status: mapStatus(application.applicationStatus),
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
      trackingHistory: trackStatus ? [
        {
          status: mapStatus(trackStatus.status),
          date: trackStatus.updatedDate,
          comment: `Status updated to ${trackStatus.status}`
        }
      ] : []
    };

    res.json(transformedApp);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATED: PUT /admin/applications/:id/status - Update status (Now updates TrackStatus)
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
    
    // ✅ Update beneficiary status
    application.applicationStatus = dbStatus;
    await application.save();

    // ✅ Update or create track status (for public tracking)
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

    console.log(`✅ Status updated for ${application.applicationId}: ${dbStatus}`);

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

// ✅ UPDATED: PUT /admin/applications/:id/verify-document (Now updates TrackStatus when rejected)
router.put('/applications/:id/verify-document', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body; // 'verified' or 'rejected'
    
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // ✅ Document status update
    application.disabilityCertificate.verificationStatus = status;
    application.disabilityCertificate.verifiedBy = req.user?._id;
    application.disabilityCertificate.verifiedAt = new Date();
    
    if (status === 'rejected' && rejectionReason) {
      application.disabilityCertificate.rejectionReason = rejectionReason;
      // ✅ Application status bhi reject karo
      application.applicationStatus = 'rejected';
    }

    await application.save();

    // ✅ Update TrackStatus for public tracking
    await TrackStatus.findOneAndUpdate(
      { applicationId: application.applicationId },
      { 
        $set: {
          status: status === 'rejected' ? 'rejected' : 'pending',
          updatedDate: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`✅ Document ${status} for ${application.applicationId}`);

    // ✅ Updated application return karo
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

// ✅ UPDATED: POST /admin/applications/:id/assign-ngo (Now updates TrackStatus)
router.post('/applications/:id/assign-ngo', async (req, res) => {
  try {
    const { ngoId } = req.body;
    
    const application = await Beneficiary.findOne({ 
      applicationId: req.params.id 
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update status to processing/assigned
    application.applicationStatus = 'processing';
    await application.save();

    // ✅ Update track status with center info
    await TrackStatus.findOneAndUpdate(
      { applicationId: application.applicationId },
      { 
        $set: {
          status: 'processing',
          updatedDate: new Date(),
          center: ngoId 
        }
      },
      { upsert: true }
    );

    console.log(`✅ NGO assigned to ${application.applicationId}`);

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

// GET /admin/ngos - Get all NGOs
router.get('/ngos', async (req, res) => {
  try {
    const ngos = [
      {
        id: "ngo-1",
        name: "Helping Hands Foundation",
        location: "New Delhi",
        deviceTypes: ["wheelchair", "hearing"],
        workload: 12,
        capacity: 50,
        contact: "+91 98765 43210",
      },
      {
        id: "ngo-2",
        name: "Vision for All",
        location: "Mumbai",
        deviceTypes: ["braille"],
        workload: 8,
        capacity: 30,
        contact: "+91 98765 43211",
      },
      {
        id: "ngo-3",
        name: "Mobility Plus",
        location: "Bangalore",
        deviceTypes: ["crutches", "prosthetic"],
        workload: 25,
        capacity: 40,
        contact: "+91 98765 43212",
      },
    ];
    
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/dashboard/stats - Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const total = await Beneficiary.countDocuments();
    const pending = await Beneficiary.countDocuments({ applicationStatus: 'pending' });
    const approved = await Beneficiary.countDocuments({ applicationStatus: 'approved' });
    const rejected = await Beneficiary.countDocuments({ applicationStatus: 'rejected' });
    const processing = await Beneficiary.countDocuments({ applicationStatus: 'processing' });

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Beneficiary.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const chartData = months.map((name, index) => {
      const monthData = monthlyData.find(d => d._id === index + 1);
      return {
        name,
        apps: monthData ? monthData.count : 0
      };
    });

    res.json({
      stats: {
        total,
        pending,
        approved,
        rejected,
        processing
      },
      chartData,
      pieData: [
        { name: 'Approved', value: approved, color: '#10b981' },
        { name: 'Rejected', value: rejected, color: '#ef4444' },
        { name: 'Pending', value: pending, color: '#f59e0b' },
        { name: 'Processing at NGO', value: processing, color: '#3b82f6' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ NEW: Sync endpoint to populate TrackStatus for existing applications
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
  const types = {
    'wheelchair': 'Locomotor Aid',
    'hearing': 'Hearing Aid',
    'crutches': 'Mobility Aid',
    'prosthetic': 'Prosthetic Aid',
    'braille': 'Visual Aid'
  };
  return types[device] || 'Other';
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
  const statusMap = {
    'PENDING_VERIFICATION': 'pending',
    'UNDER_REVIEW': 'pending',
    'APPROVED': 'approved',
    'NGO_ASSIGNED': 'processing',
    'PROCESSING_AT_NGO': 'processing',
    'READY_FOR_DISTRIBUTION': 'processing',
    'DELIVERED': 'approved',
    'REJECTED': 'rejected'
  };
  return statusMap[frontendStatus] || 'pending';
}

module.exports = router;