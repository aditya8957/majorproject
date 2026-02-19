import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Accessibility, Globe, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../authSlice";
import { AccessibilityPanel } from "../AccessibilityPanel";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useAccessibility();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const moreMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccessibility = () => setShowAccessibility(!showAccessibility);

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowUserMenu(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { path: "/", label: language === "en" ? "Home" : "होम" },
    { path: "/beneficiary/apply", label: language === "en" ? "Apply" : "आवेदन करें" },
    { path: "/devices", label: language === "en" ? "Devices" : "उपकरण" },
    { path: "/application/status", label: language === "en" ? "Track Application" : "आवेदन ट्रैक करें" },
    { path: "/eligibility-checker", label: language === "en" ? "Check Eligibility" : "पात्रता जांचें" },
    { path: "/help", label: language === "en" ? "Help/FAQs" : "सहायता/प्रश्न" },
    { path: "/contact", label: language === "en" ? "Contact Us" : "संपर्क" },
  ];

  const mainNavItems = navItems.slice(0, 5);
  const moreNavItems = navItems.slice(5);

  const defaultAvatar = "data:image/jpeg;base64,..."; // shortened

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://depwd.gov.in/wp-content/themes/sdo-theme/images/emblem.svg"
              alt="Government of India Emblem"
              className="h-12"
            />
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md inline-flex items-center gap-0.2">
                Divyang
                <img
                  src="https://www.svgrepo.com/show/287846/wheelchair.svg"
                  alt="chair icon"
                  className="w-8 h-7 drop-shadow-sm"
                />
                Sahayak
              </h1>

              <p className="text-xs text-gray-600">
                {language === "en"
                  ? "Empowering Abilities, Enabling Lives"
                  : "सक्षम क्षमताएँ, समर्थ जीवन"}
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2 items-center">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                  ? "bg-blue-700 text-white"
                  : "text-gray-700 hover:bg-blue-100"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 transition-colors flex items-center gap-1"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                {language === "en" ? "More" : "अधिक"} <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {showMoreMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-60"
                  >
                    <div className="py-1">
                      {moreNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-4 py-2 text-sm ${location.pathname === item.path
                            ? "bg-blue-700 text-white"
                            : "text-gray-700 hover:bg-blue-100"
                            }`}
                          onClick={() => setShowMoreMenu(false)}
                        >
                          {item.label}
                        </Link>
                      ))}

                      {/* Language Toggle inside More menu */}
                      <button
                        onClick={() => {
                          setLanguage(language === "en" ? "hi" : "en");
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md"
                        title={language === "en" ? "Switch to Hindi" : "Switch to English"}
                      >
                        <Globe className="h-5 w-5" />
                        {language === "en" ? "हिंदी" : "English"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accessibility Button */}
            <button
              onClick={toggleAccessibility}
              className="ml-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
              title="Accessibility Options"
            >
              <Accessibility className="h-6 w-6 text-blue-700" />
            </button>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <Link
                to="/auth/login"
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
              </Link>
            ) : (
              <div className="relative ml-4" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 rounded-full pl-2 pr-1 py-1 transition-colors"
                >
                 <img
                  src={user?.avatar || "https://www.svgrepo.com/show/295402/user-profile.svg"}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full border-2 border-blue-500"
                />

                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user?.firstName || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-60"
                    >
                      <div className="py-2">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {user?.emailId}
                          </p>
                          {user?.role && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                              {user.role}
                            </span>
                          )}
                        </div>

                        {/* Profile Link */}
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 text-blue-600" />
                          <span>{language === "en" ? "My Profile" : "मेरी प्रोफाइल"}</span>
                          {location.pathname === '/profile' && (
                            <span className="ml-auto text-xs text-blue-600">●</span>
                          )}
                        </Link>

                        {/* Settings Link (if needed) */}
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>{language === "en" ? "Settings" : "सेटिंग्स"}</span>
                        </Link>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-2 space-y-1 pb-3 bg-white overflow-hidden"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                    ? "bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Profile Link in Mobile Menu (when authenticated) */}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>{language === "en" ? "My Profile" : "मेरी प्रोफाइल"}</span>
                </Link>
              )}

              {/* Mobile Auth */}
              {!isAuthenticated ? (
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
                </button>
              )}

              {/* Mobile Accessibility and Language */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={toggleAccessibility}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  <Accessibility className="h-5 w-5" />
                  <span>{language === "en" ? "Accessibility" : "सुगम्यता"}</span>
                </button>

                <button
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                  title={language === "en" ? "Switch to Hindi" : "Switch to English"}
                >
                  <Globe className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {showAccessibility && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-[100] p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold">
                {language === "en" ? "Accessibility Tools" : "सुगम्यता उपकरण"}
              </h1>
              <button
                onClick={toggleAccessibility}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AccessibilityPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}