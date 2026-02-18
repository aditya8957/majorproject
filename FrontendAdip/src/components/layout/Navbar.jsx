// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { MenuIcon, XIcon } from 'lucide-react';
// import { useAccessibility } from '../../context/AccessibilityContext';

// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();
//   const {
//     language
//   } = useAccessibility();
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const navItems = [{
//     path: '/',
//     label: language === 'en' ? 'Home' : 'होम'
//   }, {
//     path: '/apply',
//     label: language === 'en' ? 'Apply' : 'आवेदन करें'
//   }, {
//     path: '/devices',
//     label: language === 'en' ? 'Devices' : 'उपकरण'
//   }, {
//     path: '/application-status',
//     label: language === 'en' ? 'Track Application' : 'आवेदन ट्रैक करें'
//   }, {
//     path: '/eligibility-checker',
//     label: language === 'en' ? 'Check Eligibility' : 'पात्रता जांचें'
//   }, {
//     path: '/dashboard',
//     label: language === 'en' ? 'Dashboard' : 'डैशबोर्ड'
//   }, {
//     path: '/help',
//     label: language === 'en' ? 'Help/FAQs' : 'सहायता/प्रश्न'
//   }, {
//     path: '/contact',
//     label: language === 'en' ? 'Contact' : 'संपर्क'
//   }];
//   // For desktop menu, we'll show only the main items, with a "More" dropdown
//   const mainNavItems = navItems.slice(0, 5);
//   const moreNavItems = navItems.slice(5);
//   const [showMoreMenu, setShowMoreMenu] = useState(false);
//   return <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <Link to="/" className="flex items-center gap-2">
//             <img src="https://depwd.gov.in/wp-content/themes/sdo-theme/images/emblem.svg" alt="Government of India Emblem" className="h-12" />
//             <div>
//               <h1 className="text-xl font-bold text-blue-900">ADIP Scheme</h1>
//               <p className="text-xs text-gray-600">
//                 {language === 'en' ? 'Assistive Devices for Persons with Disabilities' : 'दिव्यांगजनों के लिए सहायक उपकरण'}
//               </p>
//             </div>
//           </Link>
//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-2 items-center">
//             {mainNavItems.map(item => <Link key={item.path} to={item.path} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`}>
//                 {item.label}
//               </Link>)}
//             {/* More dropdown */}
//             <div className="relative">
//               <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 transition-colors" onClick={() => setShowMoreMenu(!showMoreMenu)} aria-expanded={showMoreMenu} aria-haspopup="true">
//                 {language === 'en' ? 'More' : 'अधिक'} ▼
//               </button>
//               {showMoreMenu && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10" onMouseLeave={() => setShowMoreMenu(false)}>
//                   <div className="py-1">
//                     {moreNavItems.map(item => <Link key={item.path} to={item.path} className={`block px-4 py-2 text-sm ${location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setShowMoreMenu(false)}>
//                         {item.label}
//                       </Link>)}
//                     <Link to="/nearby-centers" className={`block px-4 py-2 text-sm ${location.pathname === '/nearby-centers' ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setShowMoreMenu(false)}>
//                       {language === 'en' ? 'Nearby Centers' : 'नज़दीकी केंद्र'}
//                     </Link>
//                     <Link to="/document-guide" className={`block px-4 py-2 text-sm ${location.pathname === '/document-guide' ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setShowMoreMenu(false)}>
//                       {language === 'en' ? 'Document Guide' : 'दस्तावेज़ गाइड'}
//                     </Link>
//                     <Link to="/compare-devices" className={`block px-4 py-2 text-sm ${location.pathname === '/compare-devices' ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setShowMoreMenu(false)}>
//                       {language === 'en' ? 'Compare Devices' : 'उपकरण तुलना'}
//                     </Link>
//                   </div>
//                 </div>}
//             </div>
//             <Link 
//               to="/auth" 
//               className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
//               title={language === 'en' ? 'Login or create a new account' : 'लॉगिन करें या नया खाता बनाएं'}
//             >
//               {language === 'en' ? 'Login / Sign Up' : 'लॉगिन / साइन अप'}
//             </Link>
//           </div>
//           {/* Mobile menu button */}
//           <button onClick={toggleMenu} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100" aria-expanded={isMenuOpen} aria-label="Toggle menu">
//             {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
//           </button>
//         </div>
//         {/* Mobile Menu */}
//         {isMenuOpen && <div className="md:hidden mt-2 space-y-1 pb-3">
//             {navItems.map(item => <Link key={item.path} to={item.path} className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setIsMenuOpen(false)}>
//                 {item.label}
//               </Link>)}
//             <Link to="/nearby-centers" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/nearby-centers' ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setIsMenuOpen(false)}>
//               {language === 'en' ? 'Nearby Centers' : 'नज़दीकी केंद्र'}
//             </Link>
//             <Link to="/document-guide" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/document-guide' ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setIsMenuOpen(false)}>
//               {language === 'en' ? 'Document Guide' : 'दस्तावेज़ गाइड'}
//             </Link>
//             <Link to="/compare-devices" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/compare-devices' ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100'}`} onClick={() => setIsMenuOpen(false)}>
//               {language === 'en' ? 'Compare Devices' : 'उपकरण तुलना'}
//             </Link>
//           </div>}
//       </div>
//     </nav>;
// }




import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Accessibility, Globe } from "lucide-react";
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
    { path: "/history", label: language === "en" ? "History" : "इतिहास" },
    { path: "/dashboard", label: language === "en" ? "Dashboard" : "डैशबोर्ड" },
    { path: "/help", label: language === "en" ? "Help/FAQs" : "सहायता/प्रश्न" },
    { path: "/contact", label: language === "en" ? "Contact" : "संपर्क" },
  ];

  const mainNavItems = navItems.slice(0, 5);
  const moreNavItems = navItems.slice(5);

  const defaultAvatar = "data:image/jpeg;base64,..."; // shortened

  return (
    <nav className="bg-white shadow-md relative z-50"> {/* Increased navbar z-index */}
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

            {/* More dropdown - Fixed z-index */}
            <div className="relative" ref={moreMenuRef}>
              <button
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 transition-colors"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                {language === "en" ? "More" : "अधिक"} ▼
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-60"> {/* Increased z-index */}
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
                      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md"
                      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
                    >
                      <Globe className="h-5 w-5" />
                      {language === "en" ? "हिंदी" : "English"}
                    </button>
                  </div>
                </div>
              )}
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
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full border"
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-60"> {/* Increased z-index */}
                    <div className="py-2">
                      <span className="block px-4 py-2 text-sm font-medium text-gray-800">
                        {user?.firstName || "User"}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      >
                        {language === "en" ? "Logout" : "लॉगआउट"}
                      </button>
                    </div>
                  </div>
                )}
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

        {/* Mobile Menu - Fixed z-index */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 space-y-1 pb-3 z-50 bg-white relative"> {/* Added z-index and bg-white */}
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

            {/* Mobile Auth */}
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
              >
                {language === "en" ? "Logout" : "लॉगआउट"}
              </button>
            )}

            {/* Mobile Accessibility */}
            <button
              onClick={toggleAccessibility}
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Accessibility className="h-5 w-5" />{" "}
              {language === "en" ? "Accessibility" : "सुगम्यता"}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              title={language === "en" ? "Switch to Hindi" : "Switch to English"}
            >
              <Globe className="h-5 w-5 text-gray-800" />
            </button>
          </div>
        )}
      </div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {showAccessibility && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-[100] p-6 overflow-y-auto" /* Highest z-index */
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold">Accessibility Tools</h1>
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
