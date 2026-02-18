import React, { useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import { Link } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, HelpCircleIcon } from "lucide-react";

export function EligibilityChecker() {
  const { language } = useAccessibility();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nationality: "",
    disabilityPercentage: "",
    monthlyIncome: "",
    hasDisabilityCertificate: "",
    ageGroup: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEligible =
      formData.nationality === "indian" &&
      parseInt(formData.disabilityPercentage) >= 40 &&
      parseInt(formData.monthlyIncome) <= 20000 &&
      formData.hasDisabilityCertificate === "yes";

    const isPartiallyEligible =
      formData.nationality === "indian" &&
      formData.hasDisabilityCertificate === "yes";

    setResult({
      isEligible,
      isPartiallyEligible,
      reasons: !isEligible ? getIneligibilityReasons() : [],
    });
    setStep(4); // show results
  };

  const getIneligibilityReasons = () => {
    const reasons = [];
    if (formData.nationality !== "indian") {
      reasons.push(
        language === "en"
          ? "Only Indian citizens are eligible for the ADIP scheme"
          : "केवल भारतीय नागरिक ही एडीआईपी योजना के लिए पात्र हैं"
      );
    }
    if (parseInt(formData.monthlyIncome) > 20000) {
      reasons.push(
        language === "en"
          ? "Monthly income must be Rs. 20,000 or less"
          : "मासिक आय रु. 20,000 या उससे कम होनी चाहिए"
      );
    }
    if (formData.hasDisabilityCertificate !== "yes") {
      reasons.push(
        language === "en"
          ? "A valid disability certificate is required"
          : "एक वैध विकलांगता प्रमाण पत्र आवश्यक है"
      );
    }
    return reasons;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {language === "en" ? "Basic Information" : "बुनियादी जानकारी"}
            </h2>

            <label className="block mb-2">
              {language === "en"
                ? "Are you an Indian citizen?"
                : "क्या आप भारतीय नागरिक हैं?"}{" "}
              *
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="border rounded p-2 w-full mb-4"
            >
              <option value="">{language === "en" ? "-- Select --" : "-- चयन करें --"}</option>
              <option value="indian">{language === "en" ? "Yes" : "हां"}</option>
              <option value="other">{language === "en" ? "No" : "नहीं"}</option>
            </select>

            <label className="block mb-2">
              {language === "en" ? "What is your age group?" : "आपका आयु वर्ग क्या है?"} *
            </label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="border rounded p-2 w-full mb-4"
            >
              <option value="">{language === "en" ? "-- Select --" : "-- चयन करें --"}</option>
              <option value="below18">
                {language === "en" ? "Below 18 years" : "18 वर्ष से कम"}
              </option>
              <option value="18-59">
                {language === "en" ? "18-59 years" : "18-59 वर्ष"}
              </option>
              <option value="60+">
                {language === "en" ? "60 years and above" : "60 वर्ष और अधिक"}
              </option>
            </select>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {language === "en" ? "Next →" : "अगला →"}
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {language === "en" ? "Disability Details" : "विकलांगता विवरण"}
            </h2>

            <label className="block mb-2">
              {language === "en"
                ? "What is your disability percentage?"
                : "आपका विकलांगता प्रतिशत क्या है?"}{" "}
              *
            </label>
            <input
              type="number"
              name="disabilityPercentage"
              value={formData.disabilityPercentage}
              onChange={handleChange}
              className="border rounded p-2 w-full mb-4"
              placeholder="%"
            />

            <label className="block mb-2">
              {language === "en"
                ? "Do you have a valid disability certificate?"
                : "क्या आपके पास वैध विकलांगता प्रमाण पत्र है?"}{" "}
              *
            </label>
            <select
              name="hasDisabilityCertificate"
              value={formData.hasDisabilityCertificate}
              onChange={handleChange}
              className="border rounded p-2 w-full mb-4"
            >
              <option value="">{language === "en" ? "-- Select --" : "-- चयन करें --"}</option>
              <option value="yes">{language === "en" ? "Yes" : "हां"}</option>
              <option value="no">{language === "en" ? "No" : "नहीं"}</option>
            </select>

            {formData.hasDisabilityCertificate === "no" && (
              <p className="text-red-500">
                {language === "en"
                  ? "A valid disability certificate is required for the ADIP scheme."
                  : "एडीआईपी योजना के लिए एक वैध विकलांगता प्रमाण पत्र आवश्यक है।"}
              </p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                ← {language === "en" ? "Back" : "वापस"}
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {language === "en" ? "Next →" : "अगला →"}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {language === "en"
                ? "Financial Information"
                : "वित्तीय जानकारी"}
            </h2>

            <label className="block mb-2">
              {language === "en"
                ? "What is your monthly income (in Rs.)?"
                : "आपकी मासिक आय (रु. में) क्या है?"}{" "}
              *
            </label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              className="border rounded p-2 w-full mb-4"
              placeholder="₹"
            />

            <p className="text-sm text-gray-600 mb-4">
              {language === "en"
                ? "Your personal income, not your family income"
                : "आपकी व्यक्तिगत आय, आपके परिवार की आय नहीं"}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                ← {language === "en" ? "Back" : "वापस"}
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {language === "en" ? "Check Eligibility" : "पात्रता जांचें"}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {language === "en" ? "Eligibility Results" : "पात्रता परिणाम"}
            </h2>

            {result?.isEligible ? (
              <div className="p-4 border rounded bg-green-50">
                <CheckCircleIcon className="text-green-600 mb-2" />
                <p className="font-bold">
                  {language === "en" ? "You are eligible!" : "आप पात्र हैं!"}
                </p>
                <p>
                  {language === "en"
                    ? "Based on the information provided, you are eligible for assistance under the ADIP Scheme."
                    : "प्रदान की गई जानकारी के आधार पर, आप एडीआईपी योजना के तहत सहायता के लिए पात्र हैं।"}
                </p>
              </div>
            ) : result?.isPartiallyEligible ? (
              <div className="p-4 border rounded bg-yellow-50">
                <HelpCircleIcon className="text-yellow-600 mb-2" />
                <p className="font-bold">
                  {language === "en"
                    ? "Partially Eligible"
                    : "आंशिक रूप से पात्र"}
                </p>
                <ul className="list-disc ml-6">
                  {result.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 border rounded bg-red-50">
                <XCircleIcon className="text-red-600 mb-2" />
                <p className="font-bold">
                  {language === "en" ? "Not Eligible" : "पात्र नहीं"}
                </p>
                <ul className="list-disc ml-6">
                  {result?.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              {result?.isEligible && (
                <Link
                  to="/beneficiary/apply"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {language === "en" ? "Apply Now" : "अभी आवेदन करें"}
                </Link>
              )}
              <Link
                to="/documents"
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                {language === "en" ? "Document Guide" : "दस्तावेज़ गाइड"}
              </Link>
              <button
                onClick={() => {
                  setStep(1);
                  setResult(null);
                  setFormData({
                    nationality: "",
                    disabilityPercentage: "",
                    monthlyIncome: "",
                    hasDisabilityCertificate: "",
                    ageGroup: "",
                  });
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                {language === "en" ? "Start Over" : "फिर से शुरू करें"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-2">
        {language === "en" ? "Eligibility Checker" : "पात्रता जांचकर्ता"}
      </h1>

      <p className="text-gray-600 mb-4">
        {language === "en"
          ? "Answer a few questions to check if you are eligible for assistance under the ADIP Scheme."
          : "कुछ प्रश्नों का उत्तर दें यह जांचने के लिए कि क्या आप एडीआईपी योजना के तहत सहायता के लिए पात्र हैं।"}
      </p>

      {step < 4 && (
        <p className="text-sm text-gray-500 mb-4">
          {language === "en" ? `Step ${step} of 3` : `चरण ${step} / 3`}
        </p>
      )}

      {renderStep()}
    </div>
  );
}
