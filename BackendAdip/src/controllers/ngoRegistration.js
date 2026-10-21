const NGO = require("../models/ngoSchema");
const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const validator = require("validator");

// Validate NGO registration data
const validateNGORegistration = (data) => {
  const mandatoryFields = [
    "ngoName",
    "registrationNumber",
    "district",
    "state",
    "address",
    "phone"
  ];

  // Check all required fields are present
  const isAllowed = mandatoryFields.every((key) =>
    Object.keys(data).includes(key)
  );

  if (!isAllowed) {
    throw new Error("Some required fields are missing");
  }

  // Phone validation
  if (!validator.isMobilePhone(data.phone, "en-IN")) {
    throw new Error("Invalid Phone Number");
  }

  // Validate registration number format (not empty)
  if (!data.registrationNumber || data.registrationNumber.trim().length === 0) {
    throw new Error("Registration Number is required");
  }

  // Validate NGO name
  if (!data.ngoName || data.ngoName.trim().length < 3) {
    throw new Error("NGO Name must be at least 3 characters");
  }

  // Validate address
  if (!data.address || data.address.trim().length < 5) {
    throw new Error("Address must be at least 5 characters");
  }
};

// Register NGO (create request)
const registerNGO = async (req, res) => {
  try {
    validateNGORegistration(req.body);

    const { ngoName, registrationNumber, district, state, address, phone } = req.body;

    // Check if NGO with same registration number already exists
    const existingNGO = await NGO.findOne({ registrationNumber });
    if (existingNGO) {
      return res.status(409).json({
        success: false,
        message: "NGO with this registration number already exists"
      });
    }

    // const userId = req.user._id;
    const userId = req.result._id;

    // Check if user already has a pending registration
    const pendingRegistration = await NGO.findOne({
      userId,
      status: "pending"
    });

    if (pendingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending registration request"
      });
    }

    // Handle file uploads
    const documents = {};

    // Registration Certificate (required)
    if (!req.files || !req.files.registrationCertificate) {
      return res.status(400).json({
        success: false,
        message: "Registration Certificate is required"
      });
    }

    const certResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ngo_documents/registration_certificates",
          resource_type: "raw",
          format: "pdf"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.files.registrationCertificate[0].buffer);
    });

    documents.registrationCertificate = certResult.secure_url;

    // Government Approval Letter (optional)
    if (req.files && req.files.governmentApprovalLetter) {
      const govResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ngo_documents/approval_letters",
            resource_type: "raw",
            format: "pdf"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.governmentApprovalLetter[0].buffer);
      });

      documents.governmentApprovalLetter = govResult.secure_url;
    }

    // Create NGO registration request
    const ngoRegistration = await NGO.create({
      userId,
      ngoName,
      registrationNumber,
      district,
      state,
      address,
      phone,
      documents,
      status: "pending"
    });

    await User.findByIdAndUpdate(userId, { isNgoRequested: true, isNgoApproved: false });

    res.status(201).json({
      success: true,
      message: "NGO registration request submitted successfully",
      data: {
        _id: ngoRegistration._id,
        ngoName: ngoRegistration.ngoName,
        registrationNumber: ngoRegistration.registrationNumber,
        status: ngoRegistration.status,
        submittedAt: ngoRegistration.createdAt
      }
    });

  } catch (err) {
    console.error('NGO Registration error:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Get all NGO registration requests (Admin only)
const getNGORegistrationRequests = async (req, res) => {
  try {
    const { status, sortBy = "createdAt" } = req.query;
    let query = {};

    if (status) {
      const normalizedStatus = status.toLowerCase();
      query.status = ["pending", "approved", "rejected"].includes(normalizedStatus)
        ? { $regex: new RegExp(`^${normalizedStatus}$`, "i") }
        : status;
    }

    const requests = await NGO.find(query)
      .populate("userId", "fullName email phone")
      .sort({ [sortBy]: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (err) {
    console.error('Error fetching NGO requests:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching NGO registration requests"
    });
  }
};

// Approve NGO registration (Admin only)
const approveNGORegistration = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { adminComment } = req.body;

    const ngoRegistration = await NGO.findById(ngoId);

    if (!ngoRegistration) {
      return res.status(404).json({
        success: false,
        message: "NGO registration request not found"
      });
    }

    if (ngoRegistration.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Only pending requests can be approved"
      });
    }

    // Update NGO status
    ngoRegistration.status = "approved";
    if (adminComment) {
      ngoRegistration.adminComment = adminComment;
    }
    ngoRegistration.approvedBy = req.user._id;
    ngoRegistration.approvedAt = new Date();

    await ngoRegistration.save();

    // Update user role to "ngo" if needed
    const user = await User.findById(ngoRegistration.userId);
    if (user) {
      user.role = "ngo";
      user.isNgoApproved = true;
      user.isNgoRequested = true;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "NGO registration approved successfully",
      data: {
        _id: ngoRegistration._id,
        ngoName: ngoRegistration.ngoName,
        status: ngoRegistration.status,
        approvedAt: ngoRegistration.approvedAt
      }
    });

  } catch (err) {
    console.error('NGO approval error:', err);
    res.status(500).json({
      success: false,
      message: "Error approving NGO registration"
    });
  }
};

// Reject NGO registration (Admin only)
const rejectNGORegistration = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { adminComment } = req.body;

    if (!adminComment) {
      return res.status(400).json({
        success: false,
        message: "Admin comment is required for rejection"
      });
    }

    const ngoRegistration = await NGO.findById(ngoId);

    if (!ngoRegistration) {
      return res.status(404).json({
        success: false,
        message: "NGO registration request not found"
      });
    }

    if (ngoRegistration.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Only pending requests can be rejected"
      });
    }

    // Update NGO status
    ngoRegistration.status = "rejected";
    ngoRegistration.adminComment = adminComment;
    ngoRegistration.rejectedBy = req.user._id;
    ngoRegistration.rejectedAt = new Date();

    await ngoRegistration.save();

    const user = await User.findById(ngoRegistration.userId);
    if (user) {
      user.role = "user";
      user.isNgoApproved = false;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "NGO registration rejected successfully",
      data: {
        _id: ngoRegistration._id,
        ngoName: ngoRegistration.ngoName,
        status: ngoRegistration.status,
        rejectionReason: adminComment,
        rejectedAt: ngoRegistration.rejectedAt
      }
    });

  } catch (err) {
    console.error('NGO rejection error:', err);
    res.status(500).json({
      success: false,
      message: "Error rejecting NGO registration"
    });
  }
};

// Get NGO application status (User - check their own status)
const getNGOApplicationStatus = async (req, res) => {
  try {
    // const userId = req.user._id;
    const userId = req.result._id;

    const ngoRegistration = await NGO.findOne({ userId }).select(
      "_id ngoName registrationNumber status adminComment createdAt approvedAt rejectedAt"
    );

    if (!ngoRegistration) {
      return res.status(404).json({
        success: false,
        message: "No NGO registration request found"
      });
    }

    res.status(200).json({
      success: true,
      data: ngoRegistration
    });

  } catch (err) {
    console.error('Error fetching NGO status:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching NGO application status"
    });
  }
};

module.exports = {
  registerNGO,
  getNGORegistrationRequests,
  approveNGORegistration,
  rejectNGORegistration,
  getNGOApplicationStatus
};
