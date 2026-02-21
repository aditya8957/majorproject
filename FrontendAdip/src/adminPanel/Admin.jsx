import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { Layout } from './component/Layout';
import { DashboardOverview } from './page/Dashboard';
import { ApplicationListPage } from './page/Applications/ApplicationList';
import { ApplicationDetailsPage } from './page/Applications/ApplicationDetails';
import { NGOManagementPage } from './page/NGOs';
import { ReportsPage } from './page/Reports';

const AppContent = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Layout><DashboardOverview /></Layout>} />
      <Route path="applications/:id" element={<Layout><ApplicationDetailsPage /></Layout>} />
      <Route path="applications" element={<Layout><ApplicationListPage /></Layout>} />
      <Route path="ngos" element={<Layout><NGOManagementPage /></Layout>} />
      <Route path="reports" element={<Layout><ReportsPage /></Layout>} />
      <Route path="settings" element={<Layout><div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">Settings page content...</div></Layout>} />
      <Route path="/" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

export default function Admin() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}