const express = require("express");
const beneficiaryRouter = express.Router();
const { registerBeneficiary } = require("../controllers/beneficiaryRegistration");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  }
});

beneficiaryRouter.post(
  "/apply",
  upload.single("disabilityCertificate"),
  registerBeneficiary
);

module.exports = beneficiaryRouter;
