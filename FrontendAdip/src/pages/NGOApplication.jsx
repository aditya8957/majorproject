import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useAccessibility } from "../context/AccessibilityContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Jammu & Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry"
];

export function NGOApplication() {
  const { language } = useAccessibility();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("register"); // register or status
  const [formData, setFormData] = useState({
    ngoName: "",
    registrationNumber: "",
    district: "",
    state: "",
    address: "",
    phone: "",
  });

  const [files, setFiles] = useState({
    registrationCertificate: null,
    governmentApprovalLetter: null,
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusData, setStatusData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch NGO status when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "status" && isAuthenticated) {
      fetchNGOStatus();
    }
  }, [activeTab, isAuthenticated]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ngoName.trim()) {
      newErrors.ngoName = "NGO Name is required";
    } else if (formData.ngoName.trim().length < 3) {
      newErrors.ngoName = "NGO Name must be at least 3 characters";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration Number is required";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!files.registrationCertificate) {
      newErrors.registrationCertificate = "Registration Certificate is required";
    } else if (!files.registrationCertificate.type.includes("pdf")) {
      newErrors.registrationCertificate = "Only PDF files are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file && !file.type.includes("pdf")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only PDF files are allowed",
      }));
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const fetchNGOStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await axiosClient.get("/ngo/status");
      setStatusData(res.data.data);
    } catch (err) {
      console.error("Error fetching status:", err);
      setStatusData(null);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataObj = new FormData();

      // Add form fields
      formDataObj.append("ngoName", formData.ngoName);
      formDataObj.append("registrationNumber", formData.registrationNumber);
      formDataObj.append("district", formData.district);
      formDataObj.append("state", formData.state);
      formDataObj.append("address", formData.address);
      formDataObj.append("phone", formData.phone);

      // Add files
      if (files.registrationCertificate) {
        formDataObj.append("registrationCertificate", files.registrationCertificate);
      }

      if (files.governmentApprovalLetter) {
        formDataObj.append("governmentApprovalLetter", files.governmentApprovalLetter);
      }

      const res = await axiosClient.post("/ngo/register", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data);
      resetForm();

      // Switch to status tab after successful submission
      setTimeout(() => {
        setActiveTab("status");
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ngoName: "",
      registrationNumber: "",
      district: "",
      state: "",
      address: "",
      phone: "",
    });
    setFiles({
      registrationCertificate: null,
      governmentApprovalLetter: null,
    });
    setErrors({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            {language === "en"
              ? "Please login to apply as NGO"
              : "एनजीओ के रूप में आवेदन करने के लिए कृपया लॉगिन करें"}
          </p>
        </div>
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {language === "en" ? "Go to Login" : "लॉगिन पर जाएँ"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        {language === "en" ? "NGO Registration" : "एनजीओ पंजीकरण"}
      </h1>
      <p className="text-center text-gray-600 mb-8">
        {language === "en"
          ? "Register your organization and get approval from admin"
          : "अपने संगठन को पंजीकृत करें और प्रशासक से अनुमोदन प्राप्त करें"}
      </p>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "register"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {language === "en" ? "Register" : "पंजीकरण"}
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "status"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {language === "en" ? "Application Status" : "आवेदन की स्थिति"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col items-center justify-center py-12 bg-green-50 rounded-lg border border-green-200">
            <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              {language === "en"
                ? "Application Submitted Successfully!"
                : "आवेदन सफलतापूर्वक जमा किया गया!"}
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              {language === "en" ? "Application ID:" : "आवेदन आईडी:"}{" "}
              <span className="font-mono font-bold text-blue-600">
                {success.data._id}
              </span>
            </p>
            <p className="text-gray-600">
              {language === "en"
                ? "Your registration request has been submitted. The admin will review and approve your application."
                : "आपका पंजीकरण अनुरोध जमा कर दिया गया है। व्यवस्थापक आपके आवेदन की समीक्षा करेंगे।"}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">
            {language === "en" ? "Error: " : "त्रुटि: "}{error}
          </p>
        </div>
      )}

      {/* Register Tab */}
      {activeTab === "register" && !success && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NGO Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "NGO Name" : "एनजीओ नाम"} *
              </label>
              <input
                type="text"
                name="ngoName"
                value={formData.ngoName}
                onChange={handleInputChange}
                placeholder={language === "en" ? "Enter NGO name" : "एनजीओ का नाम दर्ज करें"}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ngoName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ngoName && <p className="text-red-500 text-sm mt-1">{errors.ngoName}</p>}
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Registration Number" : "पंजीकरण संख्या"} *
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder={language === "en" ? "Enter registration number" : "पंजीकरण संख्या दर्ज करें"}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.registrationNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
              )}
            </div>

            {/* District and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en" ? "District" : "जिला"} *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder={language === "en" ? "Enter district" : "जिला दर्ज करें"}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en" ? "State" : "राज्य"} *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">{language === "en" ? "Select State" : "राज्य चुनें"}</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Address" : "पता"} *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={language === "en" ? "Enter complete address" : "पूरा पता दर्ज करें"}
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Phone Number" : "फोन नंबर"} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={language === "en" ? "Enter 10-digit phone number" : "10 अंकों का फोन नंबर दर्ज करें"}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Registration Certificate Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en"
                  ? "Registration Certificate (PDF)"
                  : "पंजीकरण प्रमाणपत्र (पीडीएफ)"}{" "}
                *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  name="registrationCertificate"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="regCert"
                />
                <label htmlFor="regCert" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v12m-6-6l6 6m-6-6l-6 6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    {files.registrationCertificate
                      ? files.registrationCertificate.name
                      : language === "en"
                      ? "Click to upload or drag and drop"
                      : "अपलोड करने के लिए क्लिक करें"}
                  </p>
                </label>
              </div>
              {errors.registrationCertificate && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationCertificate}</p>
              )}
            </div>

            {/* Government Approval Letter Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en"
                  ? "Government Approval Letter (PDF) - Optional"
                  : "सरकारी अनुमोदन पत्र (पीडीएफ) - वैकल्पिक"}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  name="governmentApprovalLetter"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="govApproval"
                />
                <label htmlFor="govApproval" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v12m-6-6l6 6m-6-6l-6 6"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    {files.governmentApprovalLetter
                      ? files.governmentApprovalLetter.name
                      : language === "en"
                      ? "Click to upload or drag and drop"
                      : "अपलोड करने के लिए क्लिक करें"}
                  </p>
                </label>
              </div>
            </div>

            {/* Submit and Reset Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
              >
                {loading
                  ? language === "en"
                    ? "Submitting..."
                    : "जमा किया जा रहा है..."
                  : language === "en"
                  ? "Submit Application"
                  : "आवेदन जमा करें"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition duration-300"
              >
                {language === "en" ? "Reset" : "रीसेट"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status Tab */}
      {activeTab === "status" && (
        <div className="max-w-4xl mx-auto">
          {statusLoading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">
                {language === "en" ? "Loading..." : "लोड हो रहा है..."}
              </p>
            </div>
          ) : statusData ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">
                {language === "en" ? "Application Status" : "आवेदन की स्थिति"}
              </h2>

              <div className={`p-4 rounded-lg mb-6 ${getStatusColor(statusData.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {language === "en" ? "Current Status" : "वर्तमान स्थिति"}
                    </p>
                    <p className="text-lg font-bold mt-1">{statusData.status}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(statusData.status)}`}>
                    {statusData.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">
                    {language === "en" ? "NGO Name" : "एनजीओ नाम"}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {statusData.ngoName}
                  </p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">
                    {language === "en" ? "Registration Number" : "पंजीकरण संख्या"}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {statusData.registrationNumber}
                  </p>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">
                    {language === "en" ? "Submitted On" : "पर जमा किया"}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {new Date(statusData.createdAt).toLocaleDateString(
                      language === "en" ? "en-US" : "hi-IN"
                    )}
                  </p>
                </div>

                {statusData.status === "approved" && statusData.approvedAt && (
                  <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                    <p className="text-gray-600 text-sm">
                      {language === "en" ? "Approved On" : "पर अनुमोदित"}
                    </p>
                    <p className="text-lg font-semibold text-green-700 mt-1">
                      {new Date(statusData.approvedAt).toLocaleDateString(
                        language === "en" ? "en-US" : "hi-IN"
                      )}
                    </p>
                  </div>
                )}

                {statusData.status === "rejected" && statusData.rejectedAt && (
                  <div className="border border-red-300 rounded-lg p-4 bg-red-50">
                    <p className="text-gray-600 text-sm">
                      {language === "en" ? "Rejected On" : "पर अस्वीकृत"}
                    </p>
                    <p className="text-lg font-semibold text-red-700 mt-1">
                      {new Date(statusData.rejectedAt).toLocaleDateString(
                        language === "en" ? "en-US" : "hi-IN"
                      )}
                    </p>
                  </div>
                )}
              </div>

              {statusData.adminComment && (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-600 text-sm font-medium">
                    {language === "en" ? "Admin Comment" : "व्यवस्थापक टिप्पणी"}
                  </p>
                  <p className="text-gray-800 mt-2">{statusData.adminComment}</p>
                </div>
              )}

              {statusData.status === "pending" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800">
                    {language === "en"
                      ? "Your application is under review. The admin will notify you once a decision has been made."
                      : "आपका आवेदन समीक्षा के अंतर्गत है। व्यवस्थापक आपको निर्णय के बाद अवगत कराएंगे।"}
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setActiveTab("register")}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                >
                  {language === "en" ? "Back to Form" : "फॉर्म पर वापस"}
                </button>
                <button
                  onClick={fetchNGOStatus}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition duration-300"
                >
                  {language === "en" ? "Refresh Status" : "स्थिति ताज़ा करें"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {language === "en"
                  ? "No Application Found"
                  : "कोई आवेदन नहीं मिला"}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === "en"
                  ? "You haven't submitted any NGO registration application yet."
                  : "आपने अभी तक कोई एनजीओ पंजीकरण आवेदन जमा नहीं किया है।"}
              </p>
              <button
                onClick={() => setActiveTab("register")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
              >
                {language === "en" ? "Submit Application" : "आवेदन जमा करें"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NGOApplication;
