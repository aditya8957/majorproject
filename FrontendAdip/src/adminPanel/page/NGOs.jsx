import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Target, CheckCircle, XCircle, Clock, AlertCircle, Eye, Download } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { useAccessibility } from '../../context/AccessibilityContext';

export const NGOManagementPage = () => {
  const { language } = useAccessibility();
  const ngos = useSelector((state) => state.app.ngos);

  // State for pending requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedNGOs, setApprovedNGOs] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch NGO registration requests
  useEffect(() => {
    fetchNGORequests();
  }, []);

  useEffect(() => {
    console.debug('[NGOManagementPage] Redux approved NGO state:',
      ngos.map(({ name, status }) => ({ name, status }))
    );
  }, [ngos]);

  useEffect(() => {
    console.debug('[NGOManagementPage] final approved NGO array:',
      approvedNGOs.map(({ ngoName, status }) => ({ name: ngoName, status }))
    );
  }, [approvedNGOs]);

  const fetchNGORequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all requests
      const pendingRes = await axiosClient.get('/ngo/admin/requests?status=pending');
      const approvedRes = await axiosClient.get('/ngo/admin/requests?status=approved');
      const rejectedRes = await axiosClient.get('/ngo/admin/requests?status=rejected');

      setPendingRequests(pendingRes.data.data || []);
      setApprovedNGOs(approvedRes.data.data || []);
      setRejectedRequests(rejectedRes.data.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch NGO requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (request) => {
    setApproveModal(request);
    setAdminComment('');
  };

  const handleRejectClick = (request) => {
    setRejectModal(request);
    setAdminComment('');
  };

  const submitApproval = async () => {
    if (!approveModal) return;
    
    try {
      setSubmitting(true);
      await axiosClient.put(`/ngo/admin/approve/${approveModal._id}`, {
        adminComment: adminComment.trim()
      });
      
      setApproveModal(null);
      setAdminComment('');
      fetchNGORequests();
    } catch (err) {
      console.error('Approval error:', err);
      alert(err.response?.data?.message || 'Error approving request');
    } finally {
      setSubmitting(false);
    }
  };

  const submitRejection = async () => {
    if (!rejectModal) return;
    
    if (!adminComment.trim()) {
      alert(language === 'en' ? 'Please provide a reason for rejection' : 'कृपया अस्वीकृति का कारण दें');
      return;
    }

    try {
      setSubmitting(true);
      await axiosClient.put(`/ngo/admin/reject/${rejectModal._id}`, {
        adminComment: adminComment.trim()
      });
      
      setRejectModal(null);
      setAdminComment('');
      fetchNGORequests();
    } catch (err) {
      console.error('Rejection error:', err);
      alert(err.response?.data?.message || 'Error rejecting request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {language === 'en' ? 'NGO Management' : 'एनजीओ प्रबंधन'}
          </h2>
          <p className="text-slate-500">
            {language === 'en' 
              ? 'Manage NGO registrations and approved agencies' 
              : 'एनजीओ पंजीकरण और अनुमोदित एजेंसियों को प्रबंधित करें'}
          </p>
        </div>

        <button 
          onClick={fetchNGORequests}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          {language === 'en' ? 'Refresh' : 'ताज़ा करें'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            activeTab === 'approved'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="inline mr-2" size={16} />
          {language === 'en' ? 'Approved NGOs' : 'अनुमोदित एनजीओ'} ({approvedNGOs.length})
        </button>

        
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="inline mr-2" size={16} />
          {language === 'en' ? 'Pending Requests' : 'लंबित अनुरोध'} ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            activeTab === 'rejected'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <XCircle className="inline mr-2" size={16} />
          {language === 'en' ? 'Rejected Requests' : 'अस्वीकृत अनुरोध'} ({rejectedRequests.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-slate-600">{language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</p>
        </div>
      ) : activeTab === 'pending' ? (
        // PENDING REQUESTS TABLE
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Clock size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">{language === 'en' ? 'No pending requests' : 'कोई लंबित अनुरोध नहीं'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'NGO Name' : 'एनजीओ नाम'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Registration #' : 'पंजीकरण'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Contact' : 'संपर्क'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Location' : 'स्थान'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Submitted' : 'जमा किया'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Actions' : 'कार्य'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <React.Fragment key={request._id}>
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{request.ngoName}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{request.registrationNumber}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{request.userId?.phone}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{request.state}, {request.district}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                          >
                            <Eye size={14} className="inline mr-1" />
                            {language === 'en' ? 'Details' : 'विवरण'}
                          </button>
                          <button
                            onClick={() => handleApproveClick(request)}
                            className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100"
                          >
                            {language === 'en' ? 'Approve' : 'अनुमोदन'}
                          </button>
                          <button
                            onClick={() => handleRejectClick(request)}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                          >
                            {language === 'en' ? 'Reject' : 'अस्वीकार'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {expandedRequest === request._id && (
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">NGO Details</p>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium text-slate-700">Full Name:</span> {request.ngoName}</p>
                                  <p><span className="font-medium text-slate-700">Registration #:</span> {request.registrationNumber}</p>
                                  <p><span className="font-medium text-slate-700">Phone:</span> {request.phone}</p>
                                  <p><span className="font-medium text-slate-700">Address:</span> {request.address}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Location</p>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium text-slate-700">State:</span> {request.state}</p>
                                  <p><span className="font-medium text-slate-700">District:</span> {request.district}</p>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Documents</p>
                                <div className="flex gap-3">
                                  <a
                                    href={request.documents?.registrationCertificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2"
                                  >
                                    <Download size={14} />
                                    Registration Certificate
                                  </a>
                                  {request.documents?.governmentApprovalLetter && (
                                    <a
                                      href={request.documents.governmentApprovalLetter}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center gap-2"
                                    >
                                      <Download size={14} />
                                      Government Approval Letter
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'approved' ? (
        // APPROVED NGOs CARDS
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedNGOs.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <CheckCircle size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">{language === 'en' ? 'No approved NGOs' : 'कोई अनुमोदित एनजीओ नहीं'}</p>
            </div>
          ) : (
            approvedNGOs.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Building2 size={24} />
                  </div>
                  <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                    {language === 'en' ? 'Approved' : 'अनुमोदित'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{ngo.ngoName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Target size={14} className="text-slate-400" />
                  {ngo.state}, {ngo.district}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="text-sm">
                    <p className="text-slate-600"><span className="font-medium">Registration #:</span> {ngo.registrationNumber}</p>
                    <p className="text-slate-600 mt-1"><span className="font-medium">Contact:</span> {ngo.phone}</p>
                    <p className="text-slate-600 mt-1"><span className="font-medium">Address:</span> {ngo.address}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {language === 'en' ? 'Approved on' : 'अनुमोदित किया गया'}{' '}
                    {ngo.approvedAt ? new Date(ngo.approvedAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <a
                    href={ngo.documents?.registrationCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm font-bold hover:underline"
                  >
                    {language === 'en' ? 'View Docs' : 'दस्तावेज़'}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // REJECTED REQUESTS
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          {rejectedRequests.length === 0 ? (
            <div className="p-12 text-center">
              <XCircle size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">{language === 'en' ? 'No rejected requests' : 'कोई अस्वीकृत अनुरोध नहीं'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'NGO Name' : 'एनजीओ नाम'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Registration #' : 'पंजीकरण'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Contact' : 'संपर्क'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Rejection Reason' : 'अस्वीकृति कारण'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Rejected On' : 'अस्वीकृत'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedRequests.map((request) => (
                    <tr key={request._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{request.ngoName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.registrationNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.phone}</td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">{request.adminComment || 'No reason provided'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {request.rejectedAt ? new Date(request.rejectedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {language === 'en' ? 'Approve NGO Application' : 'एनजीओ आवेदन को अनुमोदित करें'}
            </h3>
            <p className="text-slate-600 mb-4">{approveModal.ngoName}</p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {language === 'en' ? 'Admin Comment (Optional)' : 'व्यवस्थापक टिप्पणी (वैकल्पिक)'}
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder={language === 'en' ? 'Add any notes...' : 'कोई नोट्स जोड़ें...'}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows="4"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setApproveModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={submitApproval}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all"
              >
                {submitting ? (language === 'en' ? 'Approving...' : 'अनुमोदन किया जा रहा है...') : (language === 'en' ? 'Approve' : 'अनुमोदन')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {language === 'en' ? 'Reject NGO Application' : 'एनजीओ आवेदन को अस्वीकार करें'}
            </h3>
            <p className="text-slate-600 mb-4">{rejectModal.ngoName}</p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {language === 'en' ? 'Reason for Rejection' : 'अस्वीकृति का कारण'} *
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder={language === 'en' ? 'Please explain why...' : 'कृपया कारण समझाएं...'}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={submitRejection}
                disabled={submitting || !adminComment.trim()}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all"
              >
                {submitting ? (language === 'en' ? 'Rejecting...' : 'अस्वीकार किया जा रहा है...') : (language === 'en' ? 'Reject' : 'अस्वीकार')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};export default NGOManagementPage;