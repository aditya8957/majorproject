import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, Accessibility, Globe, User, LogOut, 
  ChevronDown, Heart, Bell, Moon, Sun, Shield, 
  ChevronRight, Home, ClipboardList, Package, Search,
  HelpCircle, Phone, Award, Sparkles
} from "lucide-react";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../authSlice";
import { AccessibilityPanel } from "../AccessibilityPanel";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useAccessibility();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const moreMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { path: "/", label: language === "en" ? "Home" : "होम", icon: <Home className="h-4 w-4" /> },
    { path: "/beneficiary/apply", label: language === "en" ? "Apply" : "आवेदन करें", icon: <ClipboardList className="h-4 w-4" /> },
    { path: "/devices", label: language === "en" ? "Devices" : "उपकरण", icon: <Package className="h-4 w-4" /> },
    { path: "/application/status", label: language === "en" ? "Track" : "ट्रैक करें", icon: <Search className="h-4 w-4" /> },
    // { path: "/eligibility-checker", label: language === "en" ? "Eligibility" : "पात्रता", icon: <Award className="h-4 w-4" /> },
    { path: "/assistAi", label: language === "en" ? "AssistAI" : "सहायक AI", icon: <Sparkles className="h-4 w-4" /> },

  ];

  const moreNavItems = [
    { path: "/help", label: language === "en" ? "Help/FAQs" : "सहायता/प्रश्न", icon: <HelpCircle className="h-4 w-4" /> },
    { path: "/contact", label: language === "en" ? "Contact Us" : "संपर्क", icon: <Phone className="h-4 w-4" /> },
    { path: "/about", label: language === "en" ? "About Us" : "हमारे बारे में", icon: <Award className="h-4 w-4" /> },
    { path: "/eligibility-checker", label: language === "en" ? "Check Eligibility" : "पात्रता", icon: <Award className="h-4 w-4" /> },
    // { path: "/news", label: language === "en" ? "News & Updates" : "समाचार", icon: <Sparkles className="h-4 w-4" /> },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: "Application Update", message: "Your application is under review", time: "5 min ago", read: false },
    { id: 2, title: "New Device Added", message: "Check out the latest hearing aids", time: "1 hour ago", read: true },
    { id: 3, title: "Camp Near You", message: "Free health camp in your area", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white shadow-md'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo with enhanced animation */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative"
              >
              <img
              src="/mark.svg"
              alt="Divyang Sahayak logo"
              className="h-10 w-10 object-contain"
            />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold flex items-center gap-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Divyang
                  </span>
                  <motion.img
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    src="https://www.svgrepo.com/show/287846/wheelchair.svg"
                    alt="chair icon"
                    className="w-8 h-7 drop-shadow-sm"
                  />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sahayak
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-gray-600"
                >
                  {language === "en"
                    ? "Empowering Abilities, Enabling Lives"
                    : "सक्षम क्षमताएँ, समर्थ जीवन"}
                </motion.p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group flex items-center gap-2 ${
                      location.pathname === item.path
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    <span className={location.pathname === item.path ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}>
                      {item.icon}
                    </span>
                    {item.label}
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* More dropdown with enhanced UI */}
              <div className="relative" ref={moreMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition-all duration-300 flex items-center gap-1 group"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                >
                  {language === "en" ? "More" : "अधिक"} 
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showMoreMenu ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {showMoreMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-60 overflow-hidden"
                    >
                      <div className="py-2">
                        {moreNavItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 group ${
                              location.pathname === item.path
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-blue-50"
                            }`}
                            onClick={() => setShowMoreMenu(false)}
                          >
                            <span className={`${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}>
                              {item.icon}
                            </span>
                            <span className="flex-1">{item.label}</span>
                            <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                              location.pathname === item.path ? 'opacity-100 text-blue-600' : ''
                            }`} />
                          </Link>
                        ))}

                        {/* Divider */}
                        <div className="my-2 border-t border-gray-100" />

                        {/* Language Toggle inside More menu */}
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            setLanguage(language === "en" ? "hi" : "en");
                            setShowMoreMenu(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-300 group"
                        >
                          <Globe className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                          <span>{language === "en" ? "Switch to हिंदी" : "Switch to English"}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
                  title={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
                  className="p-2 rounded-full text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.button>

                {/* Notifications (for authenticated users) */}
                {/* {isAuthenticated && (
                  <div className="relative" ref={notificationsRef}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Bell className="h-5 w-5 text-gray-600" />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center"
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-60 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">
                              {language === "en" ? "Notifications" : "सूचनाएं"}
                            </h3>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                                  !notif.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 text-center border-t border-gray-100">
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              {language === "en" ? "View All" : "सभी देखें"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )} */}

                {/* Accessibility Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleAccessibility}
                  className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 relative group"
                  title="Accessibility Options"
                >
                  <Accessibility className="h-5 w-5 text-blue-700" />
                  {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" /> */}
                </motion.button>

                {/* Auth Section */}
                {!isAuthenticated ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/auth/login"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
                    </Link>
                  </motion.div>
                ) : (
                  <div className="relative" ref={userMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                     className="flex items-center gap-3 focus:outline-none hover:bg-gray-100 rounded-full pl-2 pr-3 py-1 transition-all duration-300 border-2 border-blue-200 bg-blue-50"
                    >
                      <div className="relative">
                        <img
                          src={user?.avatar || "https://www.svgrepo.com/show/295402/user-profile.svg"}
                          alt="User Avatar"
                          className="h-8 w-8 rounded-full border-2 border-blue-500"
                        />
                        {/* <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span> */}
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:block">
                        {user?.firstName || "User"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-60 overflow-hidden"
                        >
                          {/* User Info Header */}
                          <div className="px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                            <p className="text-sm font-medium text-white">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-white/80 mt-1 truncate">
                              {user?.emailId}
                            </p>
                            {user?.role && (
                              <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full capitalize backdrop-blur-sm">
                                {user.role}
                              </span>
                            )}
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-300 group"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <User className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                              <span className="flex-1">{language === "en" ? "My Profile" : "मेरी प्रोफाइल"}</span>
                              {location.pathname === '/profile' && (
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                              )}
                            </Link>

                            {/* <Link
                              to="/settings"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-300 group"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                              <span className="flex-1">{language === "en" ? "Settings" : "सेटिंग्स"}</span>
                            </Link> */}

                            {user?.role === "admin" && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-all duration-300 group"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield className="h-4 w-4 text-gray-500 group-hover:text-purple-600" />
                              <span className="flex-1">
                                {language === "en" ? "Admin Dashboard" : "एडमिन डैशबोर्ड"}
                              </span>
                            </Link>
                          )}

                            <Link
                              to="/profile/applications"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-300 group"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <ClipboardList className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                              <span className="flex-1">{language === "en" ? "My Applications" : "मेरे आवेदन"}</span>
                            </Link>

                            <Link
                              to={user?.role === "ngo" ? "/ngo/dashboard" : "/ngo/register"}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-all duration-300 group"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Award className="h-4 w-4 text-gray-500 group-hover:text-green-600" />
                              <span className="flex-1">
                                {user?.role === "ngo"
                                  ? (language === "en" ? "NGO Dashboard" : "एनजीओ डैशबोर्ड")
                                  : (language === "en" ? "NGO Registration" : "एनजीओ पंजीकरण")}
                              </span>
                            </Link>

                            {/* Divider */}
                            <div className="my-2 border-t border-gray-100" />

                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-300 group"
                            >
                              <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                              <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors relative z-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="py-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-300 ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className={location.pathname === item.path ? "text-blue-600" : "text-gray-500"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}

                  {moreNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-300 ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className={location.pathname === item.path ? "text-blue-600" : "text-gray-500"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}

                  {/* Divider */}
                  <div className="my-2 border-t border-gray-100" />

                  {/* Profile Section in Mobile */}
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>{language === "en" ? "My Profile" : "मेरी प्रोफाइल"}</span>
                      </Link>

                      <Link
                        to="/applications"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ClipboardList className="h-5 w-5" />
                        <span>{language === "en" ? "My Applications" : "मेरे आवेदन"}</span>
                      </Link>
                    </>
                  )}

                  {/* Mobile Auth */}
                  {!isAuthenticated ? (
                    <Link
                      to="/auth/login"
                      className="block mx-3 my-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-semibold text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === "en" ? "Login / Sign Up" : "लॉगिन / साइन अप"}
                    </Link>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 mx-3 my-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">{language === "en" ? "Logout" : "लॉगआउट"}</span>
                    </button>
                  )}

                  {/* Mobile Accessibility and Language */}
                  <div className="flex items-center gap-2 p-3 mt-2 border-t border-gray-100">
                    <button
                      onClick={toggleTheme}
                      aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
                      title={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      <span className="font-medium">{theme === "dark" ? "Day" : "Night"}</span>
                    </button>

                    <button
                      onClick={toggleAccessibility}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
                    >
                      <Accessibility className="h-5 w-5" />
                      <span className="font-medium">{language === "en" ? "Accessibility" : "सुगम्यता"}</span>
                    </button>

                    <button
                      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                      className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
                    >
                      <Globe className="h-5 w-5 text-gray-800" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />

      {/* Accessibility Panel */}
      <AnimatePresence>
        {showAccessibility && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleAccessibility}
              className="fixed inset-0 bg-black z-[90]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[100] overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {language === "en" ? "Accessibility Tools" : "सुगम्यता उपकरण"}
                    </h2>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      onClick={toggleAccessibility}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <AccessibilityPanel />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}