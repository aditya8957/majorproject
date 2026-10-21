
const Beneficiary = require('../models/beneficiary');
const User = require('../models/user');
const { normalizeApplicationStatus } = require('../constants/enums');

const findOwnedApplication = (req) => Beneficiary.findOne({
    applicationId: req.params.applicationId,
    userId: req.result._id
});


const getUserProfile = async (req, res) => {
    try {
        // User data is already attached by middleware (req.result)
        const user = req.result;
        
        // Get all applications submitted by this user
        const applications = await Beneficiary.find({ userId: user._id })
            .sort({ createdAt: -1 }); // Most recent first

        // Remove sensitive information
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            phone: user.phone,
            role: user.role,
            age: user.age,
            address: user.address,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            user: userData,
            applications,
            totalApplications: applications.length
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile data',
            error: error.message
        });
    }
};

// Get specific application details
const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.result._id;

        const application = await Beneficiary.findOne({
            applicationId: applicationId,
            userId: userId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            application
        });

    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application details',
            error: error.message
        });
    }
};

// Get all applications (with optional filters)
const getAllApplications = async (req, res) => {
    try {
        const userId = req.result._id;
        const { status, fromDate, toDate, disabilityType } = req.query;

        // Build filter object
        let filter = { userId };

        if (status) {
            filter.applicationStatus = normalizeApplicationStatus(status);
        }

        if (disabilityType) {
            filter.disabilityType = disabilityType;
        }

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) {
                filter.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                filter.createdAt.$lte = new Date(toDate);
            }
        }

        const applications = await Beneficiary.find(filter)
            .sort({ createdAt: -1 });

        // Get statistics
        const stats = {
            total: applications.length,
            pending: applications.filter(app => ['submitted', 'under_review'].includes(normalizeApplicationStatus(app.applicationStatus))).length,
            approved: applications.filter(app => app.applicationStatus === 'approved').length,
            rejected: applications.filter(app => app.applicationStatus === 'rejected').length,
            processing: applications.filter(app => app.applicationStatus === 'processing').length
        };

        res.status(200).json({
            success: true,
            applications,
            stats,
            filters: { status, fromDate, toDate, disabilityType }
        });

    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Update profile information
const updateProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        const updates = req.body;

        // Fields that cannot be updated
        const restrictedFields = ['_id', 'emailId', 'role', 'password'];
        restrictedFields.forEach(field => delete updates[field]);

        // Validate phone if provided
        if (updates.phone && !/^\d{10}$/.test(updates.phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit phone number'
            });
        }

        // Validate age if provided
        if (updates.age && (updates.age < 6 || updates.age > 80)) {
            return res.status(400).json({
                success: false,
                message: 'Age must be between 6 and 80'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Get application statistics
const getApplicationStats = async (req, res) => {
    try {
        const userId = req.result._id;

        const stats = await Beneficiary.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$applicationStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const deviceStats = await Beneficiary.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$requiredDevice',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get monthly application trend
        const monthlyTrend = await Beneficiary.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                byStatus: stats,
                byDevice: deviceStats,
                monthlyTrend
            }
        });

    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// Download application data (for export)
const downloadApplications = async (req, res) => {
    try {
        const userId = req.result._id;
        const { format = 'json' } = req.query;

        const applications = await Beneficiary.find({ userId })
            .sort({ createdAt: -1 });

        if (format === 'csv') {
            // Convert to CSV
            const fields = ['applicationId', 'fullName', 'dateOfBirth', 'gender', 'phone', 
                          'disabilityType', 'disabilityPercentage', 'requiredDevice', 
                          'applicationStatus', 'createdAt'];
            
            const csvRows = [];
            
            // Add headers
            csvRows.push(fields.join(','));
            
            // Add data rows
            for (const app of applications) {
                const row = fields.map(field => {
                    const value = app[field] || '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',');
                csvRows.push(row);
            }
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
            return res.status(200).send(csvRows.join('\n'));
        }

        // Default JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=applications.json');
        res.status(200).json(applications);

    } catch (error) {
        console.error('Error downloading applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading applications',
            error: error.message
        });
    }
};

const getNotifications = async (req, res) => {
    try {
        const applications = await Beneficiary.find({ userId: req.result._id }).select('applicationId notifications');
        const notifications = applications.flatMap(application => (application.notifications || [])
            .filter(item => item.recipientRole === 'beneficiary')
            .map(item => ({ ...item.toObject(), applicationId: application.applicationId })))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, notifications });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const confirmReceipt = async (req, res) => {
    try {
        const application = await findOwnedApplication(req);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.deliveryProblem?.reported) return res.status(409).json({ message: 'Resolve the delivery problem before confirming receipt' });
        if (application.distribution?.beneficiaryConfirmed) return res.status(409).json({ message: 'Receipt already confirmed' });
        if (application.distribution?.status !== 'delivered') return res.status(409).json({ message: 'Aid must be marked delivered first' });
        application.distribution.beneficiaryConfirmed = true;
        application.distribution.beneficiaryConfirmedAt = new Date();
        application.distribution.status = 'beneficiary_confirmed';
        application.ngoStatus = 'beneficiary_confirmed';
        application.applicationStatus = 'beneficiary_confirmed';
        application.notifications.push({ recipientRole: 'ngo', message: `Beneficiary confirmed receipt for ${application.applicationId}.`, type: 'receipt_confirmed' });
        await application.save();
        res.json({ success: true, application });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const reportProblem = async (req, res) => {
    const reason = String(req.body.reason || '').trim();
    if (!reason) return res.status(422).json({ message: 'Problem description is required' });
    try {
        const application = await findOwnedApplication(req);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        application.deliveryProblem = { reported: true, reason, reportedAt: new Date(), resolvedAt: null };
        application.notifications.push({ recipientRole: 'ngo', message: `Delivery problem reported: ${reason}`, type: 'delivery_problem' });
        application.notifications.push({ recipientRole: 'admin', message: `Delivery problem reported for ${application.applicationId}: ${reason}`, type: 'delivery_problem' });
        await application.save();
        res.json({ success: true, application });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const sendBeneficiaryMessage = async (req, res) => {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(422).json({ message: 'Message is required' });
    try {
        const application = await findOwnedApplication(req);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        application.communications.push({ senderRole: 'beneficiary', message });
        application.notifications.push({ recipientRole: 'ngo', message, type: 'communication' });
        await application.save();
        res.json({ success: true, application });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
    getUserProfile,
    getApplicationDetails,
    getAllApplications,
    updateProfile,
    getApplicationStats,
    downloadApplications,
    getNotifications,
    confirmReceipt,
    reportProblem,
    sendBeneficiaryMessage
};