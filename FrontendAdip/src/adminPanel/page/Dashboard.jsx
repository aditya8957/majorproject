import React from 'react';
import { useSelector } from 'react-redux';
import { ApplicationStatus } from '../store';
import { FileText, Clock, CheckCircle2, Building2, Download } from 'lucide-react';
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

  const applications = useSelector((state) => state.app.applications);
  const ngos = useSelector((state) => state.app.ngos);

  const stats = [
    {
      label: 'Total Applications',
      value: applications.length,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending Verification',
      value: applications.filter(
        (a) => a.status === ApplicationStatus.PENDING_VERIFICATION
      ).length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      label: 'Approved',
      value: applications.filter(
        (a) => a.status === ApplicationStatus.APPROVED
      ).length,
      icon: CheckCircle2,
      color: 'bg-green-500'
    },
    {
      label: 'Active NGOs',
      value: ngos.length,
      icon: Building2,
      color: 'bg-purple-500'
    },
  ];

  const chartData = [
    { name: 'Jan', apps: 45 },
    { name: 'Feb', apps: 52 },
    { name: 'Mar', apps: 38 },
    { name: 'Apr', apps: 65 },
    { name: 'May', apps: 48 },
    { name: 'Jun', apps: 72 },
  ];

  const pieData = [
    { name: 'Approved', value: 65, color: '#10b981' },
    { name: 'Rejected', value: 15, color: '#ef4444' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
  ];

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

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Status Distribution
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {pieData.map((item, i) => (
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
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};