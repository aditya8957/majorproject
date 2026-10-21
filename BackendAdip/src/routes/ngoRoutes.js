const express = require("express");
const ngoRouter = express.Router();
const {
  registerNGO,
  getNGORegistrationRequests,
  approveNGORegistration,
  rejectNGORegistration,
  getNGOApplicationStatus
} = require("../controllers/ngoRegistration");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const ngoMiddleware = require("../middleware/ngoMiddleware");
const multer = require("multer");
const processing = require('../controllers/ngoProcessing');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow PDF files only
    if (["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// NGO Registration Routes

// User: Register/Submit NGO Application
ngoRouter.post(
  "/register",
  userMiddleware,
  upload.fields([
    { name: "registrationCertificate", maxCount: 1 },
    { name: "governmentApprovalLetter", maxCount: 1 }
  ]),
  registerNGO
);

// User: Check their own NGO registration status
ngoRouter.get("/status", userMiddleware, getNGOApplicationStatus);

// Admin Routes

// Admin: Get all NGO registration requests
ngoRouter.get(
  "/admin/requests",
  adminMiddleware,
  getNGORegistrationRequests
);

// Admin: Approve NGO registration
ngoRouter.put(
  "/admin/approve/:ngoId",
  adminMiddleware,
  approveNGORegistration
);

ngoRouter.get('/applications', ngoMiddleware, processing.getApplications);
ngoRouter.get('/applications/:applicationId', ngoMiddleware, processing.getApplication);
ngoRouter.get('/profile', ngoMiddleware, processing.getProfile);
ngoRouter.put('/applications/:applicationId/accept', ngoMiddleware, processing.accept);
ngoRouter.put('/applications/:applicationId/reject', ngoMiddleware, processing.reject);
ngoRouter.put('/applications/:applicationId/fulfillment', ngoMiddleware, processing.fulfillment);
ngoRouter.put('/applications/:applicationId/availability', ngoMiddleware, processing.availability);
ngoRouter.put('/applications/:applicationId/distribution-method', ngoMiddleware, processing.setDistributionMethod);
ngoRouter.put('/applications/:applicationId/deliver', ngoMiddleware, processing.markDelivered);
ngoRouter.put('/applications/:applicationId/message', ngoMiddleware, processing.sendMessage);
ngoRouter.put('/applications/:applicationId/distribute', ngoMiddleware, upload.single('proof'), processing.distribute);

// Admin: Reject NGO registration
ngoRouter.put(
  "/admin/reject/:ngoId",
  adminMiddleware,
  rejectNGORegistration
);

module.exports = ngoRouter;
