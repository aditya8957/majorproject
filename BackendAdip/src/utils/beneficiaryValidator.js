
// module.exports = function validateBeneficiary(data) {
//   if (!data.fullName || data.fullName.trim() === "") {
//     throw new Error("Full Name is required");
//   }
//   if (!data.age || isNaN(data.age) || data.age <= 0) {
//     throw new Error("Valid Age is required");
//   }
//   if (!data.gender || !["Male", "Female", "Other"].includes(data.gender)) {
//     throw new Error("Gender must be Male, Female, or Other");
//   }
//   if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
//     throw new Error("Valid 10-digit Phone Number is required");
//   }
//   if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//     throw new Error("Valid Email is required");
//   }
//   if (!data.monthlyIncome || isNaN(data.monthlyIncome)) {
//     throw new Error("Monthly Income must be a number");
//   }
//   if (!data.disabilityType || data.disabilityType.trim() === "") {
//     throw new Error("Disability Type is required");
//   }
//   if (
//     !data.disabilityPercentage ||
//     isNaN(data.disabilityPercentage) ||
//     data.disabilityPercentage < 0 ||
//     data.disabilityPercentage > 100
//   ) {
//     throw new Error("Disability Percentage must be between 0 and 100");
//   }
//   if (!data.state || data.state.trim() === "") {
//     throw new Error("State is required");
//   }
//   if (!data.pinCode || !/^[0-9]{6}$/.test(data.pinCode)) {
//     throw new Error("Valid 6-digit Pin Code is required");
//   }
//   if (!data.requiredDevice || data.requiredDevice.trim() === "") {
//     throw new Error("Required Device is required");
//   }
//   if (!data.declarationAccepted) {
//     throw new Error("Declaration must be accepted");
//   }
// };

const validator = require("validator");

const validateBeneficiary = (data) => {
  
  const mandatoryFields = [
    "fullName",
    "email",
    "phone",
    "age",
    "gender",
    "monthlyIncome",
    "disabilityType",
    "disabilityPercentage",
    "state",
    "requiredDevice",
    "declarationAccepted"
  ];

  // Check all fields present
  const isAllowed = mandatoryFields.every((key) =>
    Object.keys(data).includes(key)
  );

  if (!isAllowed) {
    throw new Error("Some required fields are missing");
  }

  // Email check
  if (!validator.isEmail(data.email)) {
    throw new Error("Invalid Email");
  }

  // Phone check (10 digits India, you can extend later)
  if (!validator.isMobilePhone(data.phone, "en-IN")) {
    throw new Error("Invalid Phone Number");
  }



  if (!validator.isInt(data.age.toString(), { min: 1 })) {
    throw new Error("Invalid Age");
  }

  if (
    !validator.isInt(data.disabilityPercentage.toString(), {
      min: 0,
      max: 100
    })
  ) {
    throw new Error("Disability Percentage must be between 0 and 100");
  }

  if (!validator.isInt(data.monthlyIncome.toString(), { min: 0 })) {
    throw new Error("Invalid Monthly Income");
  }
};

module.exports = validateBeneficiary;
