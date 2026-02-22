import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchApplications, fetchNGOs, fetchDashboardStats } from '../store';
import { FileText, Clock, CheckCircle2, Building2, Download, AlertCircle } from 'lucide-react';
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
  const { applications, ngos, dashboardStats, loading, error } = useSelector((state) => state.app);

  useEffect(() => {
    // Check if token exists before fetching
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchApplications());
      dispatch(fetchNGOs());
      dispatch(fetchDashboardStats());
    } else {
      console.error('No token found. Please login again.');
    }
  }, [dispatch]);

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
      label: 'Active NGOs',
      value: ngos?.length || 0,
      icon: Building2,
      color: 'bg-purple-500'
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
    </div>
  );
};