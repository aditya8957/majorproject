
const validator = require("validator");
const { DISABILITY_TYPES, DEVICE_TYPES, GENDER_TYPES } = require('../constants/enums');

const validateBeneficiary = (data) => {
  if (Object.prototype.hasOwnProperty.call(data, "age")) {
    throw new Error("The age field is not supported; use dateOfBirth");
  }

  const mandatoryFields = [
    "fullName",
    "email",
    "phone",
    "dateOfBirth",
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

  if (!GENDER_TYPES.includes(data.gender)) throw new Error(`Invalid gender. Allowed values: ${GENDER_TYPES.join(', ')}`);
  if (!DISABILITY_TYPES.includes(data.disabilityType)) throw new Error(`Invalid disability type. Allowed values: ${DISABILITY_TYPES.join(', ')}`);
  if (!DEVICE_TYPES.includes(data.requiredDevice)) throw new Error(`Invalid required device. Allowed values: ${DEVICE_TYPES.join(', ')}`);



  if (!data.dateOfBirth) {
    throw new Error("Date of birth is required");
  }

  const dateOfBirth = new Date(data.dateOfBirth);
  if (Number.isNaN(dateOfBirth.getTime())) {
    throw new Error("Date of birth must be a valid date");
  }

  const now = new Date();
  if (dateOfBirth > now) {
    throw new Error("Date of birth cannot be in the future");
  }

  let age = now.getFullYear() - dateOfBirth.getFullYear();
  const birthdayHasPassed =
    now.getMonth() > dateOfBirth.getMonth() ||
    (now.getMonth() === dateOfBirth.getMonth() &&
      now.getDate() >= dateOfBirth.getDate());

  if (!birthdayHasPassed) {
    age -= 1;
  }

  if (age < 1 || age > 130) {
    throw new Error("Age must be between 1 and 130 years");
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
