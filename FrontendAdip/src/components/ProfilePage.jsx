import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
      fetchApplications();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    try {
     
      const response = await api.get('/user/profile/profile');
      setProfileData(response.data.user);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    }
  };

  const fetchApplications = async () => {
    try {
    
      const response = await api.get('/user/profile/applications');
      setApplications(response.data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setApplications([]);
    }
  };

  const fetchStats = async () => {
    try {
    
      const response = await api.get('/user/profile/applications/stats');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const viewApplicationDetails = async (applicationId) => {
    try {
      
      const response = await api.get(`/user/profile/applications/${applicationId}`);
      setSelectedApplication(response.data.application);
    } catch (err) {
      console.error('Error fetching application details:', err);
    }
  };

  const downloadApplications = async (format = 'json') => {
    try {
      const response = await axios.get(`/user/profile/applications/download?format=${format}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading applications:', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && profileData && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.firstName}</p>
                </div>
                {profileData.lastName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{profileData.lastName}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.emailId}</p>
                </div>
                {profileData.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{profileData.phone}</p>
                  </div>
                )}
                {profileData.age && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Age</label>
                    <p className="mt-1 text-sm text-gray-900">{profileData.age}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{profileData.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(profileData.createdAt)}</p>
                </div>
              </div>

              {profileData.address && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{profileData.address.street}</p>
                    <p className="text-sm text-gray-700">
                      {profileData.address.city}, {profileData.address.state} - {profileData.address.zip}
                    </p>
                    <p className="text-sm text-gray-700">{profileData.address.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadApplications('json')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Download JSON
                </button>
                <button
                  onClick={() => downloadApplications('csv')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Download CSV
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                  <p className="mt-1 text-sm text-gray-500">You haven't submitted any applications yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.map((app) => (
                    <div key={app.applicationId} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-gray-600">
                            #{app.applicationId}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.applicationStatus)}`}>
                            {app.applicationStatus}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.fullName}</h3>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Device:</span>
                            <span className="capitalize">{app.requiredDevice}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Disability:</span>
                            <span>{app.disabilityType} ({app.disabilityPercentage}%)</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Submitted:</span>
                            <span>{formatDate(app.createdAt)}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => viewApplicationDetails(app.applicationId)}
                          className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Application Status</h2>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.byStatus.map((stat) => (
                    <div key={stat._id} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                      <p className="text-sm text-gray-500 capitalize">{stat._id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Devices Requested</h2>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats.byDevice.map((stat) => (
                    <div key={stat._id} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                      <p className="text-sm text-gray-500 capitalize">{stat._id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div 
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Application details content - same as before */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Application ID: <span className="text-gray-900 font-semibold">{selectedApplication.applicationId}</span>
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedApplication.applicationStatus)}`}>
                  {selectedApplication.applicationStatus}
                </span>
              </div>

              {/* Personal Information */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedApplication.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.phone}</p>
                  </div>
                </div>
              </div>

              {/* Disability Details */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Disability Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedApplication.disabilityType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Percentage</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.disabilityPercentage}%</p>
                  </div>
                </div>
              </div>

              {/* Address & Income */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Address & Income</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{selectedApplication.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApplication.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PIN Code</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApplication.pinCode}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Income</p>
                    <p className="text-sm font-medium text-gray-900">₹{selectedApplication.monthlyIncome}</p>
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Device Information</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Required Device</p>
                  <p className="text-lg font-bold text-blue-700 capitalize">{selectedApplication.requiredDevice}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;