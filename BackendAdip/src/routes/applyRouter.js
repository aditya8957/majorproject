const express = require("express");
const beneficiaryRouter = express.Router();
const { registerBeneficiary } = require("../controllers/beneficiaryRegistration");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userMiddleware = require("../middleware/userMiddleware");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// File upload setup (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // absolute path
  },
  filename: (req, file, cb) => {
    // Clean file name: remove spaces & special chars
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[()]/g, "");
    cb(null, Date.now() + "-" + safeName);
  }
});

const upload = multer({ storage });

// Routes
beneficiaryRouter.post(
  "/apply",
  
  upload.single("disabilityCertificate"),
  registerBeneficiary
);

module.exports = beneficiaryRouter;
