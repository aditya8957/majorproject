import React from "react";
import { Shield, Users, ClipboardList, BarChart3 } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm opacity-90">
              Welcome back, {user?.firstName} 👋
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="font-semibold text-gray-700">Total Users</h2>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Manage registered users</p>
        </div>

        {/* Applications */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-purple-600" />
            <h2 className="font-semibold text-gray-700">Applications</h2>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Review pending applications</p>
        </div>

        {/* Reports */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <h2 className="font-semibold text-gray-700">Reports</h2>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">View analytics & insights</p>
        </div>
      </div>

      {/* Placeholder Section */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Admin Controls
        </h2>
        <p className="text-gray-600">
          This section will contain tools to manage users, approve applications,
          monitor system performance, and generate reports.
        </p>
      </div>

    </div>
  );
}