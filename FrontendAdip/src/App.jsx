import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";

import { Navbar } from "./components/layout/Navbar";
// import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { AccessibilityProvider } from "./context/AccessibilityContext";
// import { AccessibilityControls } from "./components/ui/AccessibilityControls";
import { Registration } from "./pages/Registration";
import { DeviceCatalog } from "./pages/DeviceCatalog";
import { Help } from "./pages/Help";
import { Contact } from "./pages/Contact";
import { ApplicationStatus } from "./pages/ApplicationStatus";
import { EligibilityChecker } from "./pages/EligibilityChecker";
import { DocumentGuide } from "./pages/DocumentGuide";
import { DeviceComparison } from "./pages/DeviceComparison";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthPage from "./pages/AuthPage";
import VoiceControl from "./components/voiceControl";
import './index.css'; 
import ErrorBoundary from './components/ErrorBoundary'; 
import ProfilePage from './components/ProfilePage'; 
// import {  ApplicationHistory} from "./pages/History";

// Providers component
const Providers = ({ children }) => (
  <ErrorBoundary>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AccessibilityProvider>
        {children}
      </AccessibilityProvider>
    </GoogleOAuthProvider>
  </ErrorBoundary>
);

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

 
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Providers>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow relative">
          <VoiceControl />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
             <Route path="/profile" element={<ProfilePage />} />
            <Route path="/devices" element={<DeviceCatalog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/eligibility-checker" element={<EligibilityChecker />} />
            <Route path="/document-guide" element={<DocumentGuide />} />
            <Route path="/compare-devices" element={<DeviceComparison />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/:mode" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/beneficiary/apply" element={<Registration />} />
              <Route path="/application/status" element={<ApplicationStatus />} />
              {/* <Route path="/history" element={< ApplicationHistory />} /> */}
            </Route>
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Providers>
  );
}

// Private Route Component
const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default App;
