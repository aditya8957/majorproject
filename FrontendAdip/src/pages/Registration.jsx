import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";
import { useAccessibility } from "../context/AccessibilityContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 


const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi", "Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"
];

export function Registration() {
  const { language } = useAccessibility();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    monthlyIncome: "",
    disabilityType: "",
    disabilityPercentage: "",
    address: "",
    state: "",
    pinCode: "",
    requiredDevice: "",
    declarationAccepted: false,
  });

  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      monthlyIncome: "",
      disabilityType: "",
      disabilityPercentage: "",
      address: "",
      state: "",
      pinCode: "",
      requiredDevice: "",
      declarationAccepted: false,
    });
    setFile(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.declarationAccepted) {
      alert(language === "en" ? "Please accept the declaration" : "कृपया घोषणा स्वीकार करें");
      return;
    }

    setLoading(true);
    setError(null);

    const data = new FormData();
    
    // Add userId from Redux store 
    data.append("userId", user?._id);
    
    // Add all form fields
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    
    // Add file if exists
    if (file) {
      data.append("disabilityCertificate", file);
    }

    try {
      const res = await api.post("/beneficiary/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(res.data);
      resetForm();
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || err.message);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Redirect after 15 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/"), 15000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            {language === "en" 
              ? "Please login to apply for benefits" 
              : "लाभ के लिए आवेदन करने हेतु कृपया लॉगिन करें"}
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

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
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
            ? "Beneficiary Registered Successfully!"
            : "लाभार्थी सफलतापूर्वक पंजीकृत!"}
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          {language === "en" ? "Tracking ID:" : "ट्रैकिंग आईडी:"}{" "}
          <span className="font-mono font-bold text-blue-600">
            {success.user.applicationId}
          </span>
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {language === "en" ? "Go to Home" : "होम पर जाएँ"}
        </button>
        <p className="mt-4 text-gray-500 text-sm">
          {language === "en"
            ? "You will be redirected to homepage automatically in 15 seconds."
            : "आप 10 सेकंड में स्वचालित रूप से होमपेज पर रीडायरेक्ट हो जाएंगे।"}
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {language === "en"
          ? "Beneficiary Registration"
          : "लाभार्थी पंजीकरण"}
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === "en" ? "Personal Information" : "व्यक्तिगत जानकारी"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Full Name" : "पूरा नाम"} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Age" : "उम्र"} *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Gender" : "लिंग"} *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">
                    {language === "en" ? "-- Select --" : "-- चयन करें --"}
                  </option>
                  <option value="male">
                    {language === "en" ? "Male" : "पुरुष"}
                  </option>
                  <option value="female">
                    {language === "en" ? "Female" : "महिला"}
                  </option>
                  <option value="other">
                    {language === "en" ? "Other" : "अन्य"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Phone Number" : "फोन नंबर"} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Email Address" : "ईमेल पता"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en"
                    ? "Monthly Income (Rs.)"
                    : "मासिक आय (रु.)"} *
                </label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Disability Details Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === "en" ? "Disability Details" : "विकलांगता विवरण"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en"
                    ? "Type of Disability"
                    : "विकलांगता का प्रकार"} *
                </label>
                <select
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">
                    {language === "en" ? "-- Select --" : "-- चयन करें --"}
                  </option>
                  <option value="locomotor">
                    {language === "en" ? "Locomotor Disability" : "गतिविषयक विकलांगता"}
                  </option>
                  <option value="visual">
                    {language === "en" ? "Visual Impairment" : "दृष्टि हानि"}
                  </option>
                  <option value="hearing">
                    {language === "en" ? "Hearing Impairment" : "श्रवण हानि"}
                  </option>
                  <option value="intellectual">
                    {language === "en" ? "Intellectual Disability" : "बौद्धिक विकलांगता"}
                  </option>
                  <option value="multiple">
                    {language === "en" ? "Multiple Disabilities" : "बहु विकलांगता"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Disability Percentage" : "विकलांगता प्रतिशत"} *
                </label>
                <input
                  type="number"
                  name="disabilityPercentage"
                  value={formData.disabilityPercentage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en"
                    ? "Disability Certificate (PDF)"
                    : "विकलांगता प्रमाण पत्र (PDF)"} *
                </label>
                <input
                  type="file"
                  name="disabilityCertificate"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="w-full p-2 border rounded-md"
                  required
                />
                <p className="text-xs text-gray-500">
                  {language === "en"
                    ? "Upload a scanned copy of your disability certificate (max 2MB)"
                    : "अपने विकलांगता प्रमाण पत्र की स्कैन की गई प्रति अपलोड करें (अधिकतम 2MB)"}
                </p>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === "en" ? "Address Details" : "पता विवरण"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                  placeholder={language === "en" ? "Full Address" : "पूरा पता"}
                ></textarea>
              </div>

              <div>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">
                    {language === "en" ? "-- Select State --" : "-- राज्य चुनें --"}
                  </option>
                  {indianStates.map((state) => (
                    <option key={state} value={state.toLowerCase().replace(/\s+/g, "")}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                  placeholder={language === "en" ? "PIN Code" : "पिन कोड"}
                />
              </div>
            </div>
          </div>

          {/* Required Device Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === "en"
                ? "Required Assistive Device"
                : "आवश्यक सहायक उपकरण"}
            </h2>

            <select
              name="requiredDevice"
              value={formData.requiredDevice}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">
                {language === "en" ? "-- Select Device --" : "-- उपकरण चुनें --"}
              </option>
              <option value="wheelchair">Wheelchair</option>
              <option value="hearing">Hearing Aid</option>
              <option value="crutches">Crutches</option>
              <option value="prosthetic">Prosthetic Limb</option>
              <option value="braille">Braille Equipment</option>
            </select>
          </div>

          {/* Declaration */}
          <div className="mt-8">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="declarationAccepted"
                checked={formData.declarationAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, declarationAccepted: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                required
              />
              <div className="ml-3 text-sm">
                <label className="font-medium text-gray-700">
                  {language === "en"
                    ? "I declare that the information provided is true and correct to the best of my knowledge."
                    : "मैं घोषणा करता/करती हूं कि दी गई जानकारी मेरे ज्ञान के अनुसार सत्य और सही है।"}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              {language === "en" ? "Submit Application" : "आवेदन जमा करें"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



