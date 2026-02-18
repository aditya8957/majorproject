
import React, { useState } from 'react';
import axios from 'axios';
import { useAccessibility } from '../context/AccessibilityContext';
import { SearchIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export function ApplicationStatus() {
  const { language } = useAccessibility();
  const [applicationId, setApplicationId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);

    if (!applicationId || !phoneNumber) {
      setError(
        language === 'en'
          ? 'Please enter both Application ID and Phone Number'
          : 'कृपया आवेदन आईडी और फोन नंबर दोनों दर्ज करें'
      );
      return;
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setError(
        language === 'en'
          ? 'Please enter a valid 10-digit phone number'
          : 'कृपया एक वैध 10-अंकों का फोन नंबर दर्ज करें'
      );
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:4000/application/status`,
        { params: { id: applicationId, phone: phoneNumber } }
      );

      setSearchResult(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        (language === 'en'
          ? 'Something went wrong. Please try again.'
          : 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircleIcon className="w-5 h-5" />,
          label: language === 'en' ? 'Approved' : 'स्वीकृत',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          message: language === 'en'
            ? 'Your application has been approved! You will be contacted soon for device distribution.'
            : 'आपका आवेदन स्वीकृत कर लिया गया है! उपकरण वितरण के लिए आपसे जल्द ही संपर्क किया जाएगा।'
        };
      case 'rejected':
        return {
          icon: <XCircleIcon className="w-5 h-5" />,
          label: language === 'en' ? 'Rejected' : 'अस्वीकृत',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          message: language === 'en'
            ? 'Your application has been rejected. Please contact the helpdesk for more information.'
            : 'आपका आवेदन अस्वीकृत कर दिया गया है। अधिक जानकारी के लिए कृपया हेल्पडेस्क से संपर्क करें।'
        };
      default:
        return {
          icon: <ClockIcon className="w-5 h-5" />,
          label: language === 'en' ? 'Pending' : 'लंबित',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          message: language === 'en'
            ? 'Your application is being processed. Please check back later for updates.'
            : 'आपका आवेदन प्रक्रियाधीन है। अपडेट के लिए कृपया बाद में फिर से जांचें।'
        };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`;
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
          {language === 'en' ? 'Track Your Application' : 'अपना आवेदन ट्रैक करें'}
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-center text-gray-600">
            {language === 'en'
              ? 'Enter your Application ID and registered Phone Number to check your application status.'
              : 'अपने आवेदन की स्थिति की जांच करने के लिए अपनी आवेदन आईडी और पंजीकृत फोन नंबर दर्ज करें।'}
          </p>

          <form onSubmit={handleSearch} className="mt-6 space-y-4">
            <div>
              <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Application ID' : 'आवेदन आईडी'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="applicationId"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder={language === 'en' ? 'e.g. ADIP202512001' : 'जैसे ADIP202512001'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                {language === 'en' ? 'Registered Phone Number' : 'पंजीकृत फोन नंबर'} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={language === 'en' ? '10-digit number' : '10-अंक का नंबर'}
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : <>
                <SearchIcon className="-ml-1 mr-2 h-5 w-5" />
                {language === 'en' ? 'Check Status' : 'स्थिति जांचें'}
              </>}
            </button>
          </form>
        </div>

        {searchResult && (
          <div className={`mt-8 p-6 rounded-lg shadow-lg ${getStatusInfo(searchResult.status).bgColor} border ${getStatusInfo(searchResult.status).borderColor}`}>
            <div className={`flex items-center mb-4 ${getStatusInfo(searchResult.status).color}`}>
              {getStatusInfo(searchResult.status).icon}
              <h2 className="text-xl font-bold ml-3">{getStatusInfo(searchResult.status).label}</h2>
            </div>
            <p className={`mb-6 ${getStatusInfo(searchResult.status).color}`}>{getStatusInfo(searchResult.status).message}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-semibold text-gray-500">{language === 'en' ? 'Application ID' : 'आवेदन आईडी'}</p>
                <p className="font-mono">{searchResult.applicationId}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-semibold text-gray-500">{language === 'en' ? 'Applicant Name' : 'आवेदक का नाम'}</p>
                <p>{searchResult.name}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-semibold text-gray-500">{language === 'en' ? 'Device Requested' : 'अनुरोधित उपकरण'}</p>
                <p>{searchResult.device}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-semibold text-gray-500">{language === 'en' ? 'Implementing Center' : 'कार्यान्वयन केंद्र'}</p>
                <p>{searchResult.center || (language === 'en' ? 'Not assigned yet' : 'अभी असाइन नहीं हुआ')}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-semibold text-gray-500">{language === 'en' ? 'Application Date' : 'आवेदन तिथि'}</p>
                <p>{formatDate(searchResult.appliedDate)}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-semibold text-gray-500">{language === 'en' ? 'Last Updated' : 'अंतिम अपडेट'}</p>
                <p>{formatDate(searchResult.updatedDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




//   // const mockApplications = [{
//   //   id: 'ADIP2023001',
//   //   status: 'approved',
//   //   name: 'Rajesh Kumar',
//   //   appliedDate: '2023-05-15',
//   //   updatedDate: '2023-06-10',
//   //   device: 'Wheelchair',
//   //   center: 'ALIMCO Delhi'
//   // }, {
//   //   id: 'ADIP2023002',
//   //   status: 'pending',
//   //   name: 'Priya Sharma',
//   //   appliedDate: '2023-07-20',
//   //   updatedDate: '2023-07-25',
//   //   device: 'Hearing Aid',
//   //   center: 'Artificial Limbs Manufacturing Corporation, Mumbai'
//   // }, {
//   //   id: 'ADIP2023003',
//   //   status: 'rejected',
//   //   name: 'Amit Patel',
//   //   appliedDate: '2023-06-05',
//   //   updatedDate: '2023-06-30',
//   //   device: 'Prosthetic Leg',
//   //   center: 'National Institute for the Empowerment of Persons with Disabilities, Chennai'
//   // }];