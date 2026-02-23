import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchApplications, fetchNGOs, fetchDashboardStats, fetchNGORegistrationRequests, approveNGORequest, rejectNGORequest } from '../store';
import { FileText, Clock, CheckCircle2, Building2, Download, AlertCircle, XCircle } from 'lucide-react';
import { motion } from "framer-motion";  
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { applications, ngos, ngoRegistrationRequests, dashboardStats, loading, error } = useSelector((state) => state.app);
  const [expandedNGO, setExpandedNGO] = React.useState(null);
  const [approveModal, setApproveModal] = React.useState(null);
  const [rejectModal, setRejectModal] = React.useState(null);
  const [modalComment, setModalComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    // Check if token exists before fetching
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchApplications());
      dispatch(fetchNGOs());
      dispatch(fetchDashboardStats());
      dispatch(fetchNGORegistrationRequests());
    } else {
      console.error('No token found. Please login again.');
    }
  }, [dispatch]);

  const handleApproveNGO = async () => {
    if (!approveModal) return;
    
    try {
      setSubmitting(true);
      const result = await dispatch(approveNGORequest(approveModal._id, modalComment));
      if (result.success) {
        setApproveModal(null);
        setModalComment('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectNGO = async () => {
    if (!rejectModal) return;
    
    try {
      setSubmitting(true);
      const result = await dispatch(rejectNGORequest(rejectModal._id, modalComment));
      if (result.success) {
        setRejectModal(null);
        setModalComment('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    {
      label: 'Total Applications',
      value: dashboardStats?.stats?.total || 0,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending Verification',
      value: dashboardStats?.stats?.pending || 0,
      icon: Clock,
      color: 'bg-red-500'
    },
    {
      label: 'Approved',
      value: dashboardStats?.stats?.approved || 0,
      icon: CheckCircle2,
      color: 'bg-yellow-500'
    },
    {
      label: 'NGO Assigned',
      value: dashboardStats?.stats?.processing || 0,
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      label: 'Pending NGO Requests',
      value: ngoRegistrationRequests?.pending?.length || 0,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      label: 'Approved NGOs',
      value: ngoRegistrationRequests?.approved?.length || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-500'
    },
  ];

  if (loading && !dashboardStats?.stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => {
              dispatch(fetchApplications());
              dispatch(fetchNGOs());
              dispatch(fetchDashboardStats());
              dispatch(fetchNGORegistrationRequests());
            }}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h2>
          <p className="text-slate-500">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div
              className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white`}
            >
              <stat.icon size={24} />
            </div>

            <p className="text-slate-500 text-sm font-medium">
              {stat.label}
            </p>

            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Pending NGO Registration Requests */}
      {ngoRegistrationRequests?.pending && ngoRegistrationRequests.pending.length > 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pending NGO Registration Requests</h3>
              <p className="text-sm text-slate-500 mt-1">{ngoRegistrationRequests.pending.length} requests awaiting approval</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {ngoRegistrationRequests.pending.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase">NGO Name</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase">Registration #</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase">Submitted</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ngoRegistrationRequests.pending.slice(0, 5).map((ngo) => (
                  <React.Fragment key={ngo._id}>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{ngo.ngoName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{ngo.registrationNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{ngo.phone}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{ngo.state}, {ngo.district}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{new Date(ngo.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => setExpandedNGO(expandedNGO === ngo._id ? null : ngo._id)}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setApproveModal(ngo);
                            setModalComment('');
                          }}
                          className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(ngo);
                            setModalComment('');
                          }}
                          className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                    {expandedNGO === ngo._id && (
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-bold text-slate-600 uppercase mb-2">NGO Details</p>
                              <p><span className="font-medium">Address:</span> {ngo.address}</p>
                              <p className="mt-1"><span className="font-medium">Email:</span> {ngo.userId?.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-600 uppercase mb-2">Documents</p>
                              {ngo.documents?.registrationCertificate && (
                                <a
                                  href={ngo.documents.registrationCertificate}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100"
                                >
                                  View Certificate
                                </a>
                              )}
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
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Application Trends
          </h3>

          <div className="h-80 w-full min-w-[300px] min-h-[300px]">
            {dashboardStats?.chartData && dashboardStats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="apps"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No chart data available
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Status Distribution
          </h3>

           <div className="h-64 w-full min-w-[200px] min-h-[200px]">
            {dashboardStats?.pieData && dashboardStats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardStats.pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color || '#10b981'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available
              </div>
            )}
          </div>

          <div className="space-y-3 mt-4">
            {(dashboardStats?.pieData || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approve NGO Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">Approve NGO</h3>
            <p className="text-slate-600 mb-4">{approveModal.ngoName}</p>
            
            <textarea
              value={modalComment}
              onChange={(e) => setModalComment(e.target.value)}
              placeholder="Add approval comment (optional)..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setApproveModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveNGO}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all"
              >
                {submitting ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject NGO Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reject NGO</h3>
            <p className="text-slate-600 mb-4">{rejectModal.ngoName}</p>
            
            <textarea
              value={modalComment}
              onChange={(e) => setModalComment(e.target.value)}
              placeholder="Please provide reason for rejection..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectNGO}
                disabled={submitting || !modalComment.trim()}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all"
              >
                {submitting ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};