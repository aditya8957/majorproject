const Beneficiary = require("../models/beneficiary");
const validateBeneficiary = require("../utils/beneficiaryValidator");
const TrackStatus = require("../models/trackStatus");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");




// const generateApplicationId = async () => {
//   const last = await Beneficiary.findOne().sort({ createdAt: -1 });
//   let nextNumber = 1;
//   if (last && last.applicationId) {
//     const match = last.applicationId.match(/ADIP(\d{7})/);
//     if (match) nextNumber = parseInt(match[1]) + 1;
//   }
//   const year = new Date().getFullYear();
//   return `ADIP${year}${String(nextNumber).padStart(3, "0")}`;
// };

const generateApplicationId = async () => {
  const year = new Date().getFullYear();
  let id;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    id = `ADIP${year}${randomNumber}`;
    exists = await Beneficiary.exists({ applicationId: id });
  }

  return id;
};





const registerBeneficiary = async (req, res) => {
  try {

    validateBeneficiary(req.body);

    const { fullName, email, phone } = req.body;

    

    req.body.role = "user";

   
    if (req.file) {
 
      const normalizedPath = req.file.path.replace(/\\/g, "/");

      req.body.disabilityCertificate = {
        fileName: req.file.filename,
        
        filePath: normalizedPath,
       
        fileUrl: `/uploads/${req.file.filename}`
      };
    }


    req.body.applicationId = await generateApplicationId();

    const beneficiary = await Beneficiary.create(req.body);


     await TrackStatus.create({
      applicationId: beneficiary.applicationId,
      name: beneficiary.fullName,
      phoneNumber: beneficiary.phone,
      status: "pending",
      device: beneficiary.requiredDevice
    });

    const token = jwt.sign(
      { _id: beneficiary._id, email: beneficiary.email, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 } // 1 hour
    );


    const reply = {
      _id: beneficiary._id,
      fullName: beneficiary.fullName,
      email: beneficiary.email,
      phone: beneficiary.phone,
      disabilityType: beneficiary.disabilityType,
      applicationId: beneficiary.applicationId,
      disabilityPercentage: beneficiary.disabilityPercentage,
      state: beneficiary.state,
      requiredDevice: beneficiary.requiredDevice,
      role: beneficiary.role,
      disabilityCertificate: beneficiary.disabilityCertificate
    };


    res.cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true });

    res.status(201).json({
      user: reply,
      message: "Beneficiary Registered Successfully"
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { registerBeneficiary };
