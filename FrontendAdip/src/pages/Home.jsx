

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ClipboardListIcon,
  UsersIcon,
  HeartHandshakeIcon,
  SearchIcon,
  ClockIcon,
  MapPinIcon,
  FileTextIcon
} from 'lucide-react';

export function Home() {
  const { language, hideImages } = useAccessibility();

  // Background images (5 Unsplash)
  // const images = [
  //   "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1470&q=80",
  //   "https://unsplash.com/photos/woman-standing-near-person-in-wheelchair-near-green-grass-field-0nkFvdcM-X4",
  //   "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1470&q=80",
  //   "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1470&q=80",
  //   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1470&q=80"
  // ];
  const images = [
    "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    // "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1470&q=80",
    // "https://plus.unsplash.com/premium_photo-1661692484841-b2857ca45894?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-change background every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const features = [
    {
      icon: <CheckCircleIcon className="h-12 w-12 text-blue-700" />,
      title: language === 'en' ? 'Eligibility' : 'पात्रता',
      description:
        language === 'en'
          ? 'Indian citizens with 40% or more disability and monthly income below Rs. 20,000.'
          : '40% या अधिक विकलांगता वाले और रु. 20,000 से कम मासिक आय वाले भारतीय नागरिक।'
    },
    {
      icon: <ClipboardListIcon className="h-12 w-12 text-blue-700" />,
      title: language === 'en' ? 'Application Process' : 'आवेदन प्रक्रिया',
      description:
        language === 'en'
          ? 'Simple online registration with required documents. Track your application status easily.'
          : 'आवश्यक दस्तावेजों के साथ सरल ऑनलाइन पंजीकरण। अपने आवेदन की स्थिति को आसानी से ट्रैक करें।'
    },
    {
      icon: <UsersIcon className="h-12 w-12 text-blue-700" />,
      title: language === 'en' ? 'Implementing Agencies' : 'कार्यान्वयन एजेंसियां',
      description:
        language === 'en'
          ? 'Registered NGOs, National Institutes, DDRCs, and State Handicapped Development Corporations.'
          : 'पंजीकृत गैर सरकारी संगठन, राष्ट्रीय संस्थान, डीडीआरसी, और राज्य विकलांग विकास निगम।'
    },
    {
      icon: <HeartHandshakeIcon className="h-12 w-12 text-blue-700" />,
      title: language === 'en' ? 'Support Provided' : 'प्रदान की गई सहायता',
      description:
        language === 'en'
          ? 'Full or partial cost coverage for aids and assistive devices based on income criteria.'
          : 'आय मानदंड के आधार पर सहायक उपकरणों के लिए पूर्ण या आंशिक लागत कवरेज।'
    }
  ];

  const quickTools = [
    {
      icon: <SearchIcon className="h-9 w-8 text-white" />,
      title: language === 'en' ? 'Check Eligibility' : 'पात्रता जांचें',
      description:
        language === 'en'
          ? 'Find out if you qualify for the scheme'
          : 'जांचें कि क्या आप योजना के लिए पात्र हैं',
      link: '/eligibility-checker',
      bgColor: 'bg-blue-600'
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-white" />,
      title: language === 'en' ? 'Track Application' : 'आवेदन ट्रैक करें',
      description:
        language === 'en'
          ? 'Check your application status'
          : 'अपने आवेदन की स्थिति जांचें',
      link: '/application-status',
      bgColor: 'bg-green-600'
    },
    {
      icon: <MapPinIcon className="h-8 w-8 text-white" />,
      title: language === 'en' ? 'Find Nearby Centers' : 'नज़दीकी केंद्र खोजें',
      description:
        language === 'en'
          ? 'Locate implementing agencies near you'
          : 'अपने पास कार्यान्वयन एजेंसियां खोजें',
      link: '/nearby-centers',
      bgColor: 'bg-purple-600'
    },
    {
      icon: <FileTextIcon className="h-8 w-8 text-white" />,
      title: language === 'en' ? 'Document Guide' : 'दस्तावेज़ गाइड',
      description:
        language === 'en'
          ? 'Learn what documents you need'
          : 'जानें आपको किन दस्तावेज़ों की आवश्यकता है',
      link: '/document-guide',
      bgColor: 'bg-orange-600'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section with slideshow */}
           <section className="relative text-white overflow-hidden h-[83vh] flex items-center">
        {/* Colored background that shows when images are hidden */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 z-0 transition-opacity duration-300 ${
            hideImages ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>

        {/* Background slideshow - hidden when images are hidden */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: hideImages ? 0 : 1 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="Hero background"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover no-invert"
            />
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
          >
            {language === 'en'
              ? 'Assistance to Disabled Persons with Interactive Interface'
              : 'पारस्परिक इंटरफ़ेस के साथ दिव्यांग व्यक्तियों के लिए सहायता'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto"
          >
            {language === 'en'
              ? 'Empowering persons with disabilities through assistive devices for improved mobility, education, and social inclusion.'
              : 'बेहतर गतिशीलता, शिक्षा और सामाजिक समावेश के लिए सहायक उपकरणों के माध्यम से दिव्यांगजनों को सशक्त बनाना।'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/beneficiary/apply"
              className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-100 transition-colors"
            >
              {language === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
            </Link>
            <Link
              to="/devices"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-800 transition-colors"
            >
              {language === 'en' ? 'View Devices' : 'उपकरण देखें'}
            </Link>
          </motion.div>
        </div>

        {/* Slanted White Bottom Shape */}
        <div
          className="absolute bottom-0 left-0 w-full h-20 bg-white z-0"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
        ></div>

      </section>

      {/* Quick Tools Section */}
      <section className="py-16 container mx-auto px-4 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickTools.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Link
                to={tool.link}
                className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className={`${tool.bgColor} p-6 flex items-center gap-3`}>
                  <div className="p-3 bg-white/20 rounded-full">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                </div>
                <div className="p-6 flex-grow">
                  <p className="text-gray-600">{tool.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <span className="inline-block px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-900">
                    {language === 'en' ? 'Use Tool' : 'उपयोग करें'} →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {language === 'en'
                ? 'About ADIP Scheme'
                : 'एडीआईपी योजना के बारे में'}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'en'
                ? 'The ADIP scheme aims to assist persons with disabilities in procuring durable, sophisticated, and scientifically manufactured aids and appliances to promote their physical, social, and psychological independence.'
                : 'एडीआईपी योजना का उद्देश्य दिव्यांगजनों को उनकी शारीरिक, सामाजिक और मनोवैज्ञानिक स्वतंत्रता को बढ़ावा देने के लिए टिकाऊ, परिष्कृत और वैज्ञानिक रूप से निर्मित सहायक उपकरणों को प्राप्त करने में सहायता करना है।'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow text-center"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


