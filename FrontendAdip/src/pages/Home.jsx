import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  CalendarIcon
} from 'lucide-react';

export function Home() {
  const { language, hideImages } = useAccessibility();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Background images with better quality
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
      icon: <UsersIcon className="h-12 w-12 text-purple-600" />,
      title: language === 'en' ? 'Implementing Agencies' : 'कार्यान्वयन एजेंसियां',
      description: language === 'en'
        ? '500+ NGOs, National Institutes, and State Corporations'
        : '500+ एनजीओ, राष्ट्रीय संस्थान, और राज्य निगम',
      stats: 'Across 28 States'
    },
    {
      icon: <HeartHandshakeIcon className="h-12 w-12 text-red-600" />,
      title: language === 'en' ? 'Support Provided' : 'प्रदान की गई सहायता',
      description: language === 'en'
        ? 'Full/partial cost coverage for 200+ types of devices'
        : '200+ प्रकार के उपकरणों के लिए पूर्ण/आंशिक लागत कवरेज',
      stats: '₹50Cr+ Distributed'
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
      link: '/application-status',
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
    { number: '2.5M+', label: 'Beneficiaries', icon: <UsersIcon className="h-6 w-6" /> },
    { number: '200+', label: 'Device Types', icon: <AwardIcon className="h-6 w-6" /> },
    { number: '500+', label: 'Centers', icon: <GlobeIcon className="h-6 w-6" /> },
    { number: '50Cr+', label: 'Funds Disbursed', icon: <TrendingUpIcon className="h-6 w-6" /> }
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
                {language === 'en' ? 'Government of India Initiative' : 'भारत सरकार की पहल'}
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-white/10 to-transparent rounded-full"
          />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {language === 'en'
                ? 'Ready to Transform Your Life?'
                : 'अपना जीवन बदलने के लिए तैयार हैं?'}
            </h2>
            <p className="text-xl text-white/90 mb-10">
              {language === 'en'
                ? 'Join thousands of beneficiaries who have already received assistance'
                : 'हजारों लाभार्थियों से जुड़ें जो पहले ही सहायता प्राप्त कर चुके हैं'}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/beneficiary/apply"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-900 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                {language === 'en' ? 'Apply Now - It\'s Free' : 'अभी आवेदन करें - मुफ्त है'}
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
            </motion.div>
          </motion.div>
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
                ADIP Scheme
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
                  <div className="text-lg font-semibold">support@adip.gov.in</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <MapPinIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Head Office</div>
                  <div className="text-lg font-semibold">New Delhi, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2024 ADIP Scheme. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
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
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Link
          to="/help"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all"
        >
          <span className="text-lg">?</span>
          <span>{language === 'en' ? 'Need Help?' : 'सहायता चाहिए?'}</span>
        </Link>
      </motion.div>
    </div>
  );
}