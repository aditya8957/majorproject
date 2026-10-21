// routes/profileRoutes.js
const express = require('express');
const profileRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {
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
} = require('../controllers/userProfile');

// All profile routes are protected by userMiddleware
profileRouter.use(userMiddleware);

// Profile routes
profileRouter.get('/', getUserProfile);
profileRouter.put('/', updateProfile);

// Applications routes
profileRouter.get('/applications', getAllApplications);
profileRouter.get('/applications/stats', getApplicationStats);
profileRouter.get('/applications/download', downloadApplications);
profileRouter.get('/applications/:applicationId', getApplicationDetails);
profileRouter.get('/notifications', getNotifications);
profileRouter.put('/applications/:applicationId/confirm-receipt', confirmReceipt);
profileRouter.put('/applications/:applicationId/report-problem', reportProblem);
profileRouter.put('/applications/:applicationId/message', sendBeneficiaryMessage);

module.exports = profileRouter;