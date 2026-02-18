import React, { useState } from "react";
import axios from "axios";
import { useAccessibility } from "../context/AccessibilityContext";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react";

export function Contact() {
  const { language } = useAccessibility();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:4000/api/contact", formData);
      setSuccessMsg(res.data.message);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {language === "en" ? "Contact Us" : "संपर्क करें"}
          </h1>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {language === "en" ? "Get in Touch" : "संपर्क में रहें"}
              </h2>
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <MapPinIcon className="flex-shrink-0 h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{language === "en" ? "Address" : "पता"}</h3>
                    <p className="text-gray-600">
                      {language === "en"
                        ? "Department of Empowerment of Persons with Disabilities, Ministry of Social Justice and Empowerment, 5th Floor, Paryavaran Bhawan, CGO Complex, Lodhi Road, New Delhi - 110003"
                        : "दिव्यांगजन सशक्तिकरण विभाग, सामाजिक न्याय और अधिकारिता मंत्रालय, 5वीं मंजिल, पर्यावरण भवन, सीजीओ कॉम्प्लेक्स, लोधी रोड, नई दिल्ली - 110003"}
                    </p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start">
                  <PhoneIcon className="flex-shrink-0 h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{language === "en" ? "Phone" : "फोन"}</h3>
                    <p className="text-gray-600">{language === "en" ? "Toll-Free Helpline" : "टोल-फ्री हेल्पलाइन"}: 1800-XXX-XXXX</p>
                    <p className="text-gray-600">{language === "en" ? "Office" : "कार्यालय"}: 011-XXXX-XXXX</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start">
                  <MailIcon className="flex-shrink-0 h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{language === "en" ? "Email" : "ईमेल"}</h3>
                    <p className="text-gray-600">
                      <a href="mailto:contact@adip.gov.in" className="text-blue-600 hover:underline">contact@adip.gov.in</a>
                    </p>
                    <p className="text-gray-600">
                      <a href="mailto:support@adip.gov.in" className="text-blue-600 hover:underline">support@adip.gov.in</a>
                    </p>
                  </div>
                </div>
                {/* Working Hours */}
                <div className="flex items-start">
                  <ClockIcon className="flex-shrink-0 h-6 w-6 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{language === "en" ? "Working Hours" : "कार्य समय"}</h3>
                    <p className="text-gray-600">{language === "en" ? "Monday to Friday: 9:00 AM to 5:30 PM" : "सोमवार से शुक्रवार: सुबह 9:00 बजे से शाम 5:30 बजे तक"}</p>
                    <p className="text-gray-600">{language === "en" ? "Saturday, Sunday & Public Holidays: Closed" : "शनिवार, रविवार और सार्वजनिक अवकाश: बंद"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{language === "en" ? "Send us a Message" : "हमें संदेश भेजें"}</h2>

              {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
              {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === "en" ? "Your Name" : "आपका नाम"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === "en" ? "Email Address" : "ईमेल पता"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{language === "en" ? "Phone Number" : "फोन नंबर"}</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === "en" ? "Subject" : "विषय"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === "en" ? "Message" : "संदेश"} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? (language === "en" ? "Submitting..." : "जमा किया जा रहा है...") : (language === "en" ? "Submit" : "जमा करें")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
