const NAME_REGEX = /^[A-Za-z\s]{2,60}$/;
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_ENQUIRY_TYPES = [
  "Product Enquiry",
  "Service Enquiry",
  "Training Enquiry",
  "Other",
];

export const QUOTE_ENQUIRY_TYPES = ["Product", "Service", "Training", "Other"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates fields shared by both /api/contact and /api/get-quote.
 * Mutates nothing; returns an { errors } object keyed by field name.
 */
function validateCommon(body, { enquiryTypes }) {
  const errors = {};
  const { name, phone, countryCode, countryName, email, message, enquiryType } = body;

  if (!isNonEmptyString(name)) {
    errors.name = "Name is required.";
  } else if (!NAME_REGEX.test(name.trim())) {
    errors.name = "Name must contain only letters and spaces (2-60 characters).";
  }

  if (!isNonEmptyString(phone)) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }

  if (!isNonEmptyString(countryCode)) {
    errors.countryCode = "Country code is required.";
  }

  if (!isNonEmptyString(countryName)) {
    errors.countryName = "Country is required.";
  }

  if (isNonEmptyString(email) && !EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please provide a valid email address.";
  }

  if (!isNonEmptyString(message)) {
    errors.message = "Message is required.";
  } else if (message.trim().length < 10 || message.trim().length > 1000) {
    errors.message = "Message must be between 10 and 1000 characters.";
  }

  if (!isNonEmptyString(enquiryType)) {
    errors.enquiryType = "Enquiry type is required.";
  } else if (!enquiryTypes.includes(enquiryType)) {
    errors.enquiryType = `Enquiry type must be one of: ${enquiryTypes.join(", ")}.`;
  }

  return errors;
}

/**
 * Validates the /api/contact request body.
 * @returns {Object} field -> error message map (empty object if valid)
 */
export function validateContact(body) {
  const errors = validateCommon(body, { enquiryTypes: CONTACT_ENQUIRY_TYPES });
  const { subject } = body;

  if (!isNonEmptyString(subject)) {
    errors.subject = "Subject is required.";
  } else if (subject.trim().length < 3 || subject.trim().length > 120) {
    errors.subject = "Subject must be between 3 and 120 characters.";
  }

  return errors;
}

/**
 * Validates the /api/get-quote request body.
 * @returns {Object} field -> error message map (empty object if valid)
 */
export function validateGetQuote(body) {
  const errors = validateCommon(body, { enquiryTypes: QUOTE_ENQUIRY_TYPES });
  const { company } = body;

  if (company !== undefined && company !== null && company !== "") {
    if (typeof company !== "string" || company.trim().length > 120) {
      errors.company = "Company name must be 120 characters or fewer.";
    }
  }

  return errors;
}
