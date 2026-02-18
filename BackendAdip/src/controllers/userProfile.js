// controllers/profileController.js
const Beneficiary = require('../models/beneficiary');
const User = require('../models/user');

// Get user profile with all their applications
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
            filter.applicationStatus = status;
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
            pending: applications.filter(app => app.applicationStatus === 'pending').length,
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
            const fields = ['applicationId', 'fullName', 'age', 'gender', 'phone', 
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

module.exports = {
    getUserProfile,
    getApplicationDetails,
    getAllApplications,
    updateProfile,
    getApplicationStats,
    downloadApplications
};