import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon, SearchIcon, XCircleIcon } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../utils/api';

const STATUS_ORDER = ['submitted', 'under_review', 'approved', 'ngo_assigned', 'processing_at_ngo', 'aid_preparation', 'aid_ready', 'ready_for_pickup', 'ready_for_distribution', 'out_for_delivery', 'delivered', 'beneficiary_confirmed', 'proof_submitted', 'completed'];

const STATUS_CONFIG = {
  submitted: { icon: ClockIcon, en: 'Submitted', hi: 'जमा किया गया', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', message: 'Your application has been successfully submitted and is awaiting review.' },
  under_review: { icon: ClockIcon, en: 'Under Review', hi: 'समीक्षा में', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', message: 'Your application is currently being reviewed by the administration.' },
  approved: { icon: CheckCircleIcon, en: 'Approved', hi: 'स्वीकृत', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', message: 'Your application has been approved and an implementing NGO will be assigned.' },
  ngo_assigned: { icon: CheckCircleIcon, en: 'NGO Assigned', hi: 'एनजीओ नियुक्त', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', message: 'Your application has been approved and assigned for further processing.' },
  processing_at_ngo: { icon: ClockIcon, en: 'Processing at NGO', hi: 'एनजीओ द्वारा प्रक्रिया में', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', message: 'The assigned NGO is processing your request and arranging the requested aid.' },
  aid_preparation: { icon: ClockIcon, en: 'Aid Being Prepared', hi: 'सहायता तैयार की जा रही है', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', message: 'Your requested aid is currently being prepared.' },
  aid_ready: { icon: CheckCircleIcon, en: 'Aid Ready', hi: 'सहायता तैयार है', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', message: 'Your requested aid is ready for distribution.' },
  ready_for_pickup: { icon: CheckCircleIcon, en: 'Ready for Center Pickup', hi: 'केंद्र से लेने के लिए तैयार', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', message: 'Your aid is ready for pickup at the assigned center.' },
  ready_for_distribution: { icon: CheckCircleIcon, en: 'Ready for Camp Distribution', hi: 'शिविर वितरण के लिए तैयार', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', message: 'Your aid is ready for distribution at the assigned camp.' },
  out_for_delivery: { icon: ClockIcon, en: 'Out for Delivery', hi: 'वितरण के लिए भेजा गया', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', message: 'Your aid is currently out for delivery.' },
  delivered: { icon: CheckCircleIcon, en: 'Delivered', hi: 'वितरित', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', message: 'Your aid has been marked as delivered. Please confirm that you have received it.' },
  beneficiary_confirmed: { icon: CheckCircleIcon, en: 'Receipt Confirmed', hi: 'प्राप्ति की पुष्टि', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', message: 'Your receipt has been recorded and the distribution is awaiting proof verification.' },
  proof_submitted: { icon: ClockIcon, en: 'Proof Submitted', hi: 'प्रमाण जमा किया गया', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', message: 'The NGO has submitted distribution proof. Your application is awaiting administrative verification.' },
  proof_rejected: { icon: XCircleIcon, en: 'Proof Requires Correction', hi: 'प्रमाण में सुधार आवश्यक', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', message: 'The submitted distribution proof requires correction. The NGO has been asked to provide updated proof.' },
  completed: { icon: CheckCircleIcon, en: 'Completed', hi: 'पूर्ण', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', message: 'Your aid distribution has been successfully verified and your application is completed.' },
  rejected: { icon: XCircleIcon, en: 'Rejected', hi: 'अस्वीकृत', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', message: 'Your application has been rejected. Please check the application details or contact the helpdesk for further information.' }
};

const normalizeStatus = (status) => {
  const value = String(status || '').toLowerCase().replace(/-/g, '_');
  const aliases = { pending: 'submitted', pending_verification: 'submitted', processing: 'processing_at_ngo', ngo_accepted: 'processing_at_ngo', fulfillment: 'aid_preparation' };
  return aliases[value] || value || 'submitted';
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';

export function ApplicationStatus() {
  const { language } = useAccessibility();
  const [applicationId, setApplicationId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault(); setError(''); setSearchResult(null);
    const id = applicationId.trim(); const phone = phoneNumber.trim();
    if (!id || !phone) return setError(language === 'en' ? 'Please enter both Application ID and Phone Number' : 'कृपया आवेदन आईडी और फोन नंबर दोनों दर्ज करें');
    if (!/^\d{10}$/.test(phone)) return setError(language === 'en' ? 'Please enter a valid 10-digit phone number' : 'कृपया एक वैध 10-अंकों का फोन नंबर दर्ज करें');
    setIsLoading(true);
    try {
      const { data } = await api.get('/application/status', { params: { id, phone } });
      setSearchResult(data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || (requestError.response?.status === 404 ? (language === 'en' ? 'Application not found or details do not match.' : 'आवेदन नहीं मिला या विवरण मेल नहीं खाते।') : language === 'en' ? 'Unable to reach the tracking service. Please try again.' : 'ट्रैकिंग सेवा उपलब्ध नहीं है। कृपया पुनः प्रयास करें।'));
    } finally { setIsLoading(false); }
  };

  const currentStatus = normalizeStatus(searchResult?.status);
  const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.submitted;
  const StatusIcon = statusInfo.icon;
  const activeTimelineStatus = currentStatus === 'proof_rejected' ? 'proof_submitted' : currentStatus;
  const activeIndex = STATUS_ORDER.indexOf(activeTimelineStatus);

  return <div className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl">
    <h1 className="mb-4 text-center text-3xl font-extrabold text-gray-900">{language === 'en' ? 'Track Your Application' : 'अपना आवेदन ट्रैक करें'}</h1>
    <div className="rounded-lg bg-white p-8 shadow-lg"><p className="text-center text-gray-600">{language === 'en' ? 'Enter your Application ID and registered Phone Number to check your application status.' : 'अपने आवेदन की स्थिति की जांच करने के लिए अपनी आवेदन आईडी और पंजीकृत फोन नंबर दर्ज करें।'}</p><form onSubmit={handleSearch} className="mt-6 space-y-4"><div><label htmlFor="applicationId" className="block text-sm font-medium text-gray-700">{language === 'en' ? 'Application ID' : 'आवेदन आईडी'} *</label><input id="applicationId" value={applicationId} onChange={event => setApplicationId(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div><div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">{language === 'en' ? 'Registered Phone Number' : 'पंजीकृत फोन नंबर'} *</label><input id="phoneNumber" type="tel" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} maxLength={10} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>{error && <p className="text-center text-sm text-red-600">{error}</p>}<button disabled={isLoading} className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{isLoading ? 'Searching...' : <><SearchIcon className="mr-2 h-5 w-5" />{language === 'en' ? 'Check Status' : 'स्थिति जांचें'}</>}</button></form></div>
    {searchResult && <div className={`mt-8 rounded-lg border p-6 shadow-lg ${statusInfo.bg} ${statusInfo.border}`}><div className={`mb-4 flex items-center ${statusInfo.color}`}><StatusIcon className="h-5 w-5"/><h2 className="ml-3 text-xl font-bold">{language === 'en' ? statusInfo.en : statusInfo.hi}</h2></div><p className={`mb-6 ${statusInfo.color}`}>{statusInfo.message}{currentStatus === 'ngo_assigned' && searchResult.assignedNGO?.name ? ` ${searchResult.assignedNGO.name}.` : ''}</p>
      <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2"><Info label={language === 'en' ? 'Application ID' : 'आवेदन आईडी'} value={searchResult.applicationId}/><Info label={language === 'en' ? 'Applicant Name' : 'आवेदक का नाम'} value={searchResult.name}/><Info label={language === 'en' ? 'Device Requested' : 'अनुरोधित उपकरण'} value={searchResult.device}/><Info label={language === 'en' ? 'Application Date' : 'आवेदन तिथि'} value={formatDate(searchResult.appliedDate)}/><Info label={language === 'en' ? 'Last Updated' : 'अंतिम अपडेट'} value={formatDate(searchResult.updatedDate)}/></div>
      <div className="mt-6 rounded-md bg-white p-4 shadow-sm"><h3 className="mb-4 text-lg font-bold text-gray-900">{language === 'en' ? 'Implementing Center' : 'कार्यान्वयन केंद्र'}</h3>{searchResult.assignedNGO ? <><p className="font-semibold text-gray-900">{searchResult.assignedNGO.name}</p><p className="text-sm text-gray-600">{[searchResult.assignedNGO.district, searchResult.assignedNGO.state].filter(Boolean).join(', ')}</p>{searchResult.assignedNGO.phone && <p className="text-sm text-gray-600">Contact: {searchResult.assignedNGO.phone}</p>}{searchResult.assignedNGO.address && <p className="text-sm text-gray-600">{searchResult.assignedNGO.address}</p>}</> : <p className="text-sm text-gray-500">{language === 'en' ? 'Not assigned yet' : 'अभी नियुक्त नहीं हुआ'}</p>}</div>
      <div className="mt-6 rounded-md bg-white p-4 shadow-sm"><h3 className="mb-4 text-lg font-bold text-gray-900">{language === 'en' ? 'Application Progress' : 'आवेदन प्रगति'}</h3><div className="space-y-3">{STATUS_ORDER.map((status, index) => { const config = STATUS_CONFIG[status]; const complete = index < activeIndex || currentStatus === 'completed'; const active = index === activeIndex; return <div key={status} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${complete || active ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{complete ? '✓' : active ? '●' : '○'}</span><span className={`${active ? 'font-bold text-gray-900' : complete ? 'text-gray-700' : 'text-gray-400'}`}>{language === 'en' ? config.en : config.hi}</span></div>; })}</div></div>
      {searchResult.distribution && <div className="mt-6 rounded-md bg-white p-4 shadow-sm"><h3 className="mb-3 text-lg font-bold text-gray-900">{language === 'en' ? 'Distribution Details' : 'वितरण विवरण'}</h3><div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2"><Info label="Method" value={searchResult.distribution.method?.replace(/_/g, ' ')}/><Info label="Distribution Status" value={searchResult.distribution.status?.replace(/_/g, ' ')}/><Info label="Expected Date" value={formatDate(searchResult.distribution.expectedDeliveryDate)}/><Info label="Delivered Date" value={formatDate(searchResult.distribution.deliveredAt)}/><Info label="Receipt" value={searchResult.distribution.beneficiaryConfirmed ? 'Confirmed' : 'Pending'}/><Info label="Verification" value={searchResult.distribution.verificationStatus?.replace(/_/g, ' ')}/></div></div>}
    </div>}
  </div></div>;
}

function Info({ label, value }) { return <div className="rounded-md bg-white p-3 shadow-sm"><p className="font-semibold text-gray-500">{label}</p><p className="capitalize">{value || '-'}</p></div>; }
