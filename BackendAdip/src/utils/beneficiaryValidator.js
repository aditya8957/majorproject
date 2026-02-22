
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
