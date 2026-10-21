import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClipboardListIcon,
  UsersIcon,
  HeartHandshakeIcon,
  SearchIcon,
  ClockIcon,
  MapPinIcon,
  FileTextIcon,
  AwardIcon,
  ShieldIcon,
  TrendingUpIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  ChevronRightIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  CalendarIcon,
  MessageCircleIcon,
  BotIcon,
  SendIcon
} from 'lucide-react';

function Reveal({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Home() {
  const { language, hideImages } = useAccessibility();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState(-1);
  const [ci, setCi] = useState(0);
  const [thinking, setThinking] = useState(true);
  const procRef = useRef(null);
  const { scrollYProgress: processProgress } = useScroll({
    target: procRef,
    offset: ['start 0.8', 'end 0.2']
  });
  const lineScale = processProgress;
  const t = (english, hindi) => language === 'en' ? english : hindi;
  const ring = 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500';

  const cats = [
    {
      label: t('Mobility', 'गतिशीलता'),
      title: t('Move with greater independence', 'अधिक स्वतंत्रता से चलें'),
      body: t('Explore mobility aids and assistive devices that can support everyday movement.', 'रोज़मर्रा की आवाजाही में मदद करने वाले गतिशीलता साधनों और सहायक उपकरणों को देखें।'),
      items: [t('Wheelchairs', 'व्हीलचेयर'), t('Walking aids', 'चलने के सहायक साधन'), t('Prosthetics', 'कृत्रिम अंग')],
      icon: UsersIcon,
      color: '#2563EB',
      bg: 'linear-gradient(135deg, #EFF6FF, #E0E7FF)'
    },
    {
      label: t('Hearing', 'श्रवण'),
      title: t('Stay connected to every conversation', 'हर बातचीत से जुड़े रहें'),
      body: t('Find hearing support options and devices suited to different communication needs.', 'अलग-अलग संचार आवश्यकताओं के अनुरूप श्रवण सहायता और उपकरण खोजें।'),
      items: [t('Hearing aids', 'श्रवण यंत्र'), t('Communication support', 'संचार सहायता'), t('Accessories', 'सहायक उपकरण')],
      icon: HeartHandshakeIcon,
      color: '#7C3AED',
      bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)'
    },
    {
      label: t('Daily living', 'दैनिक जीवन'),
      title: t('Make everyday tasks more accessible', 'रोज़मर्रा के कामों को अधिक सुलभ बनाएं'),
      body: t('Discover practical aids that can help with daily routines, learning, and participation.', 'दैनिक दिनचर्या, सीखने और भागीदारी में मदद करने वाले उपयोगी साधन खोजें।'),
      items: [t('Learning aids', 'सीखने के साधन'), t('Daily living aids', 'दैनिक जीवन के साधन'), t('Accessibility tools', 'सुलभता उपकरण')],
      icon: ShieldIcon,
      color: '#059669',
      bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
    }
  ];
  const cat = cats[tab];
  const steps = [
    { title: t('Check your eligibility', 'अपनी पात्रता जांचें'), body: t('Review the basic scheme requirements and available support.', 'योजना की बुनियादी शर्तों और उपलब्ध सहायता की जानकारी लें।') },
    { title: t('Prepare your documents', 'अपने दस्तावेज़ तैयार करें'), body: t('Use the document guide to get ready before submitting an application.', 'आवेदन जमा करने से पहले दस्तावेज़ गाइड की मदद से तैयारी करें।') },
    { title: t('Submit your application', 'अपना आवेदन जमा करें'), body: t('Complete the application with accurate details and supporting documents.', 'सही जानकारी और सहायक दस्तावेज़ों के साथ आवेदन पूरा करें।') },
    { title: t('Track the next steps', 'आगे की प्रक्रिया देखें'), body: t('Check your application status and follow updates from the implementing agency.', 'अपने आवेदन की स्थिति और कार्यान्वयन एजेंसी के अपडेट देखें।') }
  ];
  const chats = [
    {
      q: t('Who can apply for assistance?', 'सहायता के लिए कौन आवेदन कर सकता है?'),
      a: t('Eligibility depends on the scheme and your circumstances. Start with the eligibility checker, then review the official requirements.', 'पात्रता योजना और आपकी परिस्थितियों पर निर्भर करती है। पात्रता जांच से शुरुआत करें और आधिकारिक शर्तें देखें।')
    },
    {
      q: t('What documents should I prepare?', 'मुझे कौन से दस्तावेज़ तैयार रखने चाहिए?'),
      a: t('The required documents vary by application. Use the document guide to review the checklist before applying.', 'आवश्यक दस्तावेज़ आवेदन के अनुसार अलग हो सकते हैं। आवेदन से पहले दस्तावेज़ गाइड में सूची देखें।')
    },
    {
      q: t('Where can I find assistive devices?', 'मुझे सहायक उपकरण कहां मिल सकते हैं?'),
      a: t('Browse the device catalog to explore available assistive devices and their details.', 'उपलब्ध सहायक उपकरणों और उनकी जानकारी के लिए डिवाइस कैटलॉग देखें।')
    }
  ];
  const typed = chats[ci].a;
  const ROUTES = {
    devices: '/devices',
    eligibility: '/eligibility-checker',
    documents: '/document-guide'
  };
  const ASSISTAI_ROUTE = '/assistAi';
  const onTabKey = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const nextTab = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? cats.length - 1
          : (tab + (event.key === 'ArrowRight' ? 1 : cats.length - 1)) % cats.length;
      setTab(nextTab);
      document.getElementById(`tab-${nextTab}`)?.focus();
    }
  };
  const float = (from, to) => ({
    animate: reduce ? {} : { y: [from, to, from] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  });

  useMotionValueEvent(processProgress, 'change', (progress) => {
    setActive(progress <= 0 ? -1 : Math.min(steps.length - 1, Math.floor(progress * steps.length)));
  });

  useEffect(() => {
    setThinking(true);
    const timeout = setTimeout(() => setThinking(false), 450);
    return () => clearTimeout(timeout);
  }, [ci]);
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const images = [
    "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1470&auto=format&fit=crop"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-change background every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const features = [
    {
      icon: <CheckCircleIcon className="h-12 w-12 text-blue-600" />,
      title: language === 'en' ? 'Eligibility Criteria' : 'पात्रता मापदंड',
      description: language === 'en'
        ? 'Indian citizens with 40%+ disability and monthly income below ₹20,000'
        : '40% या अधिक विकलांगता वाले और ₹20,000 से कम मासिक आय वाले भारतीय नागरिक',
      stats: '2.5M+ Eligible'
    },
    {
      icon: <ClipboardListIcon className="h-12 w-12 text-green-600" />,
      title: language === 'en' ? 'Application Process' : 'आवेदन प्रक्रिया',
      description: language === 'en'
        ? 'Simple online registration with real-time tracking'
        : 'वास्तविक समय ट्रैकिंग के साथ सरल ऑनलाइन पंजीकरण',
      stats: '95% Success Rate'
    },
    {
     icon: <BotIcon className="h-12 w-12 text-purple-600" />,
  title: language === 'en' ? 'AssistAI Guidance' : 'AssistAI मार्गदर्शन',
  description: language === 'en'
    ? 'Get AI-powered guidance about assistive devices, eligibility requirements, application steps, and accessibility features.'
    : 'सहायक उपकरणों, पात्रता आवश्यकताओं, आवेदन प्रक्रिया और सुलभता सुविधाओं के बारे में AI-आधारित मार्गदर्शन प्राप्त करें।',
  stats: language === 'en' ? 'AI-Powered Assistance' : 'AI-आधारित सहायता'
},
    {
      icon: <HeartHandshakeIcon className="h-12 w-12 text-red-600" />,
      title: language === 'en' ? 'Support Provided' : 'प्रदान की गई सहायता',
      description: language === 'en'
        ? 'Full/partial cost coverage for 20+ types of devices'
        : '20+ प्रकार के उपकरणों के लिए पूर्ण/आंशिक लागत कवरेज',
      stats: '₹50+ Distributed'
    }
  ];

  const quickTools = [
    {
      icon: <SearchIcon className="h-7 w-7 text-white" />,
      title: language === 'en' ? 'Eligibility Checker' : 'पात्रता जांच',
      description: language === 'en' ? 'Check your qualification instantly' : 'तुरंत अपनी पात्रता जांचें',
      link: '/eligibility-checker',
      bgColor: 'from-blue-500 to-blue-700',
      lightColor: 'from-blue-400 to-blue-600'
    },
    {
      icon: <ClockIcon className="h-7 w-7 text-white" />,
      title: language === 'en' ? 'Track Application' : 'आवेदन ट्रैक करें',
      description: language === 'en' ? 'Real-time status updates' : 'वास्तविक समय स्थिति अपडेट',
      link: '/application/status',
      bgColor: 'from-green-500 to-green-700',
      lightColor: 'from-green-400 to-green-600'
    },
    {
      icon: <MapPinIcon className="h-7 w-7 text-white" />,
      title: language === 'en' ? 'Nearby Centers' : 'नज़दीकी केंद्र',
      description: language === 'en' ? 'Find help in your area' : 'अपने क्षेत्र में सहायता खोजें',
      link: '/nearby-centers',
      bgColor: 'from-purple-500 to-purple-700',
      lightColor: 'from-purple-400 to-purple-600'
    },
    {
      icon: <FileTextIcon className="h-7 w-7 text-white" />,
      title: language === 'en' ? 'Document Guide' : 'दस्तावेज़ गाइड',
      description: language === 'en' ? 'Complete document checklist' : 'पूर्ण दस्तावेज़ चेकलिस्ट',
      link: '/document-guide',
      bgColor: 'from-orange-500 to-orange-700',
      lightColor: 'from-orange-400 to-orange-600'
    }
  ];

  const stats = [
    { number: '20+', label: 'Beneficiaries', icon: <UsersIcon className="h-6 w-6" /> },
    { number: '20+', label: 'Device Types', icon: <AwardIcon className="h-6 w-6" /> },
    { number: '5+', label: 'Centers', icon: <GlobeIcon className="h-6 w-6" /> },
    { number: '24/7', label: 'AI-Powered Guidance', icon: <BotIcon className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      text: 'The ADIP scheme changed my life. Got a high-quality prosthetic leg absolutely free!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    },
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'Quick application process and excellent support from the local agency.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108777-466d20dd2437?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    },
    {
      name: 'Suresh Patel',
      location: 'Ahmedabad',
      text: 'My son received a hearing aid within 2 weeks of applying. Thank you!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    }
  ];

  const footerLinks = {
    about: [
      { name: 'About ADIP', link: '/about' },
      { name: 'How It Works', link: '/how-it-works' },
      { name: 'Success Stories', link: '/stories' },
      { name: 'News & Updates', link: '/news' }
    ],
    support: [
      { name: 'FAQ', link: '/faq' },
      { name: 'Contact Us', link: '/contact' },
      { name: 'Grievance Redressal', link: '/grievance' },
      { name: 'Feedback', link: '/feedback' }
    ],
    resources: [
      { name: 'Device Catalog', link: '/devices' },
      { name: 'Agency List', link: '/agencies' },
      { name: 'Download Forms', link: '/forms' },
      { name: 'Scheme Guidelines', link: '/guidelines' }
    ],
    legal: [
      { name: 'Privacy Policy', link: '/privacy' },
      { name: 'Terms of Use', link: '/terms' },
      { name: 'Disclaimer', link: '/disclaimer' },
      { name: 'RTI', link: '/rti' }
    ]
  };

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 animate-gradient"></div>
        
        {/* Background slideshow with parallax */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="absolute inset-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: hideImages ? 0 : 0.4 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 2 }}
              className="w-full h-full"
            >
              <img
                src={images[currentIndex]}
                alt="Hero background"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -30, 30, -30],
                x: [null, 30, -30, 30],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-8"
            >
              <span className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4" />
                {language === 'en' ? 'Digital Accessibility Platform' : 'डिजिटल सुलभता प्लेटफ़ॉर्म'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              {language === 'en' ? (
                <>
                  Empowering Lives
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                    Through Innovation
                  </span>
                </>
              ) : (
                <>
                  सशक्त जीवन
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                    नवाचार के माध्यम से
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto"
            >
              {language === 'en'
                ? 'Revolutionizing accessibility through advanced assistive devices and comprehensive support for persons with disabilities.'
                : 'दिव्यांग व्यक्तियों के लिए उन्नत सहायक उपकरणों और व्यापक समर्थन के माध्यम से पहुंच में क्रांतिकारी बदलाव।'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/beneficiary/apply"
                className="group relative px-8 py-4 bg-white text-blue-900 rounded-full font-semibold text-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {language === 'en' ? 'Start Your Application' : 'अपना आवेदन शुरू करें'}
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <Link
                to="/devices"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                {language === 'en' ? 'Explore Devices' : 'उपकरण देखें'}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-20 z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl"
              >
                <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                  {stat.icon}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Tools Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Quick Tools' : 'त्वरित उपकरण'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Everything you need at your fingertips' 
                : 'आपकी जरूरत की हर चीज आपकी उंगलियों पर'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link
                  to={tool.link}
                  className="block h-full"
                >
                  <div className="relative h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Icon section */}
                    <div className={`relative p-8 bg-gradient-to-br ${tool.lightColor}`}>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-lg">
                        {tool.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">{tool.title}</h3>
                    </div>

                    {/* Content */}
                    <div className="relative p-8">
                      <p className="text-gray-600 group-hover:text-white transition-colors duration-300 mb-4">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-blue-600 group-hover:text-white transition-colors duration-300">
                        <span className="font-semibold">
                          {language === 'en' ? 'Get Started' : 'शुरू करें'}
                        </span>
                        <ChevronRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Key Features' : 'मुख्य विशेषताएं'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Comprehensive support system designed for your needs'
                : 'आपकी आवश्यकताओं के लिए डिज़ाइन की गई व्यापक सहायता प्रणाली'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="relative h-full p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 mb-4">
                      {feature.description}
                    </p>
                    <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                      {feature.stats}
                    </div>
                  </div>

                  {/* Decorative circle */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
            {/* ================= SUPPORT EXPLORER ================= */}
      <section aria-labelledby="support-title" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal className="max-w-2xl">
            <h2 id="support-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{t('Support That Makes Everyday Life Easier', 'ऐसी सहायता जो रोज़मर्रा का जीवन आसान बनाए')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#33465F]">{t('Pick a category. Availability and eligibility depend on the scheme and your circumstances.', 'एक श्रेणी चुनें। उपलब्धता और पात्रता योजना और आपकी परिस्थितियों पर निर्भर करती है।')}</p>
          </Reveal>

          <div role="tablist" aria-label={t('Support categories', 'सहायता श्रेणियां')} onKeyDown={onTabKey} className="mt-10 flex flex-wrap gap-3">
            {cats.map((c, i) => {
              const Icon = c.icon; const on = i === tab;
              return (
                <button key={c.label} role="tab" id={`tab-${i}`} aria-selected={on} aria-controls="cat-panel" tabIndex={on ? 0 : -1} onClick={() => setTab(i)}
                  className={`relative inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-base font-semibold transition motion-reduce:transition-none ${ring} ${on ? 'text-white' : 'bg-[#EEF2F8] text-[#0B2545] hover:bg-[#E1E8F3]'}`}>
                  {on && <motion.span layoutId="tabpill" className="absolute inset-0 rounded-full" style={{ background: c.color }} transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative flex items-center gap-2"><Icon className="h-5 w-5" aria-hidden="true" />{c.label}</span>
                </button>
              );
            })}
          </div>

          <div id="cat-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? {} : { opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
                className="grid items-center gap-8 rounded-[2.5rem] p-8 sm:p-12 md:grid-cols-5" style={{ background: cat.bg }}>
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-bold sm:text-4xl" style={{ color: '#0B2545' }}>{cat.title}</h3>
                  <p className="mt-3 max-w-lg text-lg leading-relaxed text-[#33465F]">{cat.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {cat.items.map((it, k) => (
                      <motion.li key={it} initial={reduce ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + k * 0.07 }}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm" style={{ color: cat.color }}>{it}</motion.li>
                    ))}
                  </ul>
                  <Link to={ROUTES.devices} className={`mt-8 inline-flex min-h-[50px] items-center gap-2 rounded-full px-7 font-semibold text-white transition hover:opacity-90 ${ring}`} style={{ background: cat.color }}>
                    {t('Browse devices', 'उपकरण देखें')}<ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="hidden justify-center md:col-span-2 md:flex" aria-hidden="true">
                  <motion.div {...float(0, 12)} className="flex h-44 w-44 items-center justify-center rounded-[2.5rem] bg-white shadow-xl">
                    <cat.icon className="h-20 w-20" style={{ color: cat.color }} />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section aria-labelledby="process-title" className="bg-[#0B2545] text-white">
        <div ref={procRef} className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal><h2 id="process-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{t('A Simple, Reassuring Process', 'एक सरल और भरोसेमंद प्रक्रिया')}</h2></Reveal>
          <ol className="relative mt-14 space-y-10">
            <span aria-hidden="true" className="absolute left-6 top-2 h-[calc(100%-1rem)] w-1 rounded bg-white/15" />
            <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : lineScale, transformOrigin: 'top' }} className="absolute left-6 top-2 h-[calc(100%-1rem)] w-1 rounded bg-gradient-to-b from-[#5EEAD4] to-[#60A5FA]" />
            {steps.map((s, i) => {
              const done = i <= active;
              return (
                <li key={s.title} className="relative flex gap-6">
                  <span className={`relative z-10 flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-500 motion-reduce:transition-none ${done ? 'scale-100 bg-[#5EEAD4] text-[#0B2545]' : 'scale-90 bg-[#1B3A63] text-white/70'}`}>{i + 1}</span>
                  <div className={`pt-2 transition-opacity duration-500 motion-reduce:transition-none ${done ? 'opacity-100' : 'opacity-50'}`}>
                    <h3 className="text-xl font-semibold sm:text-2xl">{s.title}</h3>
                    <p className="mt-1 max-w-xl text-base leading-relaxed text-[#C9D5E6]">{s.body}</p>
                    {i === 1 && <div className="mt-3 flex flex-wrap gap-2">
                      <Link to={ROUTES.eligibility} className={`rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0B2545] hover:bg-[#E3ECFF] ${ring} focus-visible:ring-offset-[#0B2545]`}>{t('Check eligibility', 'पात्रता जांचें')}</Link>
                      <Link to={ROUTES.documents} className={`rounded-full border-2 border-white/60 px-5 py-2 text-sm font-semibold hover:bg-white/10 ${ring} focus-visible:ring-offset-[#0B2545]`}>{t('Document guide', 'दस्तावेज़ गाइड')}</Link>
                    </div>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= ASSISTAI ================= */}
      <section aria-labelledby="ai-title" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <h2 id="ai-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{t('Guidance When You Need It. Support at Every Step.', 'जब ज़रूरत हो, मार्गदर्शन। हर कदम पर सहायता।')}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#33465F]">
              {t('Divyang Sahayak AssistAI is an AI-powered companion that helps you understand disability-related schemes, assistive technologies, accessibility, certificates, and application questions.',
                 'दिव्यांग सहायक AssistAI एक AI-आधारित साथी है जो योजनाओं, सहायक तकनीकों, सुलभता, प्रमाणपत्रों और आवेदन संबंधी प्रश्नों को समझने में मदद करता है।')}
            </p>
            <p className="mt-3 text-base text-[#4A5C75]">{t('AssistAI offers information and guidance. It does not decide eligibility.', 'AssistAI जानकारी और मार्गदर्शन देता है। यह पात्रता का निर्णय नहीं करता।')}</p>
            <Link to={ASSISTAI_ROUTE} className={`mt-8 inline-flex min-h-[54px] items-center gap-2 rounded-full bg-[#6D28D9] px-8 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(109,40,217,0.7)] transition hover:-translate-y-0.5 hover:bg-[#5B21B6] motion-reduce:transition-none ${ring}`}>
              <MessageCircleIcon className="h-5 w-5" aria-hidden="true" />{t('Chat with AssistAI', 'AssistAI से चैट करें')}
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-white p-5 shadow-[0_40px_70px_-35px_rgba(11,37,69,0.5)] ring-1 ring-[#0B2545]/5 sm:p-7">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#6D28D9]"><BotIcon className="h-5 w-5" aria-hidden="true" />{t('Try a sample question (preview only)', 'एक नमूना प्रश्न चुनें (केवल पूर्वावलोकन)')}</p>
              <div className="flex flex-wrap gap-2">
                {chats.map((c, i) => (
                  <button key={c.q} onClick={() => setCi(i)} aria-pressed={i === ci}
                    className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition motion-reduce:transition-none ${ring} ${i === ci ? 'bg-[#6D28D9] text-white' : 'bg-[#F1ECFB] text-[#4C1D95] hover:bg-[#E5DBF9]'}`}>{c.q}</button>
                ))}
              </div>
              <div className="mt-5 min-h-[190px] space-y-4" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div key={ci} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="ml-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-br-md bg-[#0B2545] px-5 py-3 text-white">
                    <SendIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />{chats[ci].q}
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FB] text-[#6D28D9]"><BotIcon className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#F1F4F9] px-5 py-3 leading-relaxed">
                    {thinking ? (
                      <span className="flex gap-1.5 py-2" aria-label={t('AssistAI is typing', 'AssistAI लिख रहा है')}>
                        {[0, 1, 2].map((d) => <motion.span key={d} className="h-2 w-2 rounded-full bg-[#6D28D9]" animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }} />)}
                      </span>
                    ) : typed}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Success Stories' : 'सफलता की कहानियां'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Real stories from real people whose lives have been transformed'
                : 'वास्तविक लोगों की वास्तविक कहानियां जिनके जीवन बदल गए हैं'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {/* Quote mark */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
                    "
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4 ml-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Divyang Sahayak
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'en'
                  ? 'Empowering persons with disabilities through innovative assistive technology and comprehensive support.'
                  : 'नवीन सहायक प्रौद्योगिकी और व्यापक समर्थन के माध्यम से दिव्यांग व्यक्तियों को सशक्त बनाना।'}
              </p>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <FacebookIcon className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <TwitterIcon className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <YoutubeIcon className="h-5 w-5" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">About</h4>
              <ul className="space-y-3">
                {footerLinks.about.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    <Link to={link.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRightIcon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    <Link to={link.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRightIcon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    <Link to={link.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRightIcon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    <Link to={link.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRightIcon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="py-8 border-t border-gray-800 border-b mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <PhoneIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Toll Free</div>
                  <div className="text-lg font-semibold">1800-123-4567</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <MailIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="text-lg font-semibold">support@divyangsahayak.in</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <MapPinIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  {/* <div className="text-sm text-gray-400">Head Office</div> */}
                  <div className="text-lg font-semibold">New Delhi, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Divyang Sahayak. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/#" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/#" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/#" className="hover:text-white transition-colors">Sitemap</Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>

          {/* Decorative Footer Wave */}
          <div className="mt-8 relative h-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      {/* <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        className="fixed bottom-5 left-4 z-50"
      >
        <Link
          to="/help"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all"
        >
          <span className="text-lg">?</span>
          <span>{language === 'en' ? 'Need Help?' : 'सहायता चाहिए?'}</span>
        </Link>
      </motion.div> */}
    </div>
  );
}


