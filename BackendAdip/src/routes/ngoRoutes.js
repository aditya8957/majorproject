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

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow PDF files only
    if (file.mimetype === "application/pdf") {
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

// Admin: Reject NGO registration
ngoRouter.put(
  "/admin/reject/:ngoId",
  adminMiddleware,
  rejectNGORegistration
);

module.exports = ngoRouter;
