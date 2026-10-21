import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DeviceCatalog() {
  const { language } = useAccessibility();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample device data
  const devices = [
    {
      id: 1,
      name: language === 'en' ? 'Standard Wheelchair' : 'मानक व्हीलचेयर',
      category: 'mobility',
      image: 'https://plus.unsplash.com/premium_photo-1683140581048-94e48dad8955?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaXdmfHx8fHx8fA%3D%3D',
      description: language === 'en'
        ? 'Foldable wheelchair with standard features for everyday mobility.'
        : 'रोजमर्रा की गतिशीलता के लिए मानक सुविधाओं वाली फोल्डेबल व्हीलचेयर।',
      features: language === 'en'
        ? [
            'Lightweight aluminum frame',
            'Foldable design for easy storage',
            'Removable armrests',
            'Swing-away footrests',
            'Weight capacity: 100kg'
          ]
        : [
            'हल्का एल्यूमीनियम फ्रेम',
            'आसान भंडारण के लिए फोल्डेबल डिजाइन',
            'हटाने योग्य आर्मरेस्ट',
            'स्विंग-अवे फुटरेस्ट',
            'वजन क्षमता: 100 किग्रा'
          ],
      availability: language === 'en' ? 'In Stock' : 'स्टॉक में'
    },
    {
      id: 2,
      name: language === 'en' ? 'Digital Hearing Aid' : 'डिजिटल श्रवण यंत्र',
      category: 'hearing',
      image: 'https://media.istockphoto.com/id/835998916/photo/hearing-aid-on-white-isolated-background-deaf-ear-aid-3d.jpg?s=2048x2048&w=is&k=20&c=AJhNxj7hJE27jd1c2s3uR2b1kN-XZOKyE8Oak5W8XG0=',
      description: language === 'en'
        ? 'Advanced digital hearing aid with noise cancellation technology.'
        : 'शोर रद्दीकरण तकनीक के साथ उन्नत डिजिटल श्रवण यंत्र।',
      features: language === 'en'
        ? [
            'Noise cancellation technology',
            'Rechargeable battery',
            'Bluetooth connectivity',
            '4 different sound modes',
            'Up to 20 hours battery life'
          ]
        : [
            'शोर रद्दीकरण तकनीक',
            'रिचार्जेबल बैटरी',
            'ब्लूटूथ कनेक्टिविटी',
            '4 विभिन्न ध्वनि मोड',
            '20 घंटे तक की बैटरी लाइफ'
          ],
      availability: language === 'en' ? 'In Stock' : 'स्टॉक में'
    },
    {
      id: 3,
      name: language === 'en' ? 'Adjustable Crutches' : 'समायोज्य बैसाखी',
      category: 'mobility',
      image: 'https://m.media-amazon.com/images/I/41xNgygBkyL.jpg',
      description: language === 'en'
        ? 'Height-adjustable aluminum crutches with ergonomic handle.'
        : 'एर्गोनोमिक हैंडल के साथ ऊंचाई-समायोज्य एल्यूमीनियम बैसाखी।',
      features: language === 'en'
        ? [
            'Height adjustable (135-165cm)',
            'Ergonomic foam handle',
            'Non-slip rubber tips',
            'Lightweight aluminum construction',
            'Weight capacity: 120kg'
          ]
        : [
            'ऊंचाई समायोज्य (135-165 सेमी)',
            'एर्गोनोमिक फोम हैंडल',
            'नॉन-स्लिप रबर टिप्स',
            'हल्का एल्यूमीनियम निर्माण',
            'वजन क्षमता: 120 किग्रा'
          ],
      availability: language === 'en' ? 'In Stock' : 'स्टॉक में'
    },
    {
      id: 4,
      name: language === 'en' ? 'Braille Display' : 'ब्रेल डिस्प्ले',
      category: 'visual',
      image: 'https://www.orbitresearch.com/wp-content/uploads/2022/07/ISO-20X5-v0.6-1-removebg-preview.jpg',
      description: language === 'en'
        ? 'Refreshable braille display for computer accessibility.'
        : 'कंप्यूटर पहुंच के लिए रिफ्रेशेबल ब्रेल डिस्प्ले।',
      features: language === 'en'
        ? [
            '20-cell refreshable braille display',
            'USB and Bluetooth connectivity',
            'Compatible with iOS and Android',
            '8-key Perkins-style keyboard',
            'Built-in battery for portable use'
          ]
        : [
            '20-सेल रिफ्रेशेबल ब्रेल डिस्प्ले',
            'यूएसबी और ब्लूटूथ कनेक्टिविटी',
            'आईओएस और एंड्रॉइड के साथ संगत',
            '8-की पर्किन्स-स्टाइल कीबोर्ड',
            'पोर्टेबल उपयोग के लिए बिल्ट-इन बैटरी'
          ],
      availability: language === 'en' ? 'Limited Stock' : 'सीमित स्टॉक'
    },
    {
      id: 5,
      name: language === 'en' ? 'Prosthetic Leg' : 'कृत्रिम पैर',
      category: 'prosthetic',
      image: 'https://www.pongratzop.com/wp-content/uploads/2024/06/Untitled-design-39.png',
      description: language === 'en'
        ? 'Below-knee prosthetic leg with dynamic response foot.'
        : 'गतिशील प्रतिक्रिया पैर के साथ घुटने के नीचे कृत्रिम पैर।',
      features: language === 'en'
        ? [
            'Dynamic response foot',
            'Adjustable alignment',
            'Lightweight carbon fiber',
            'Water-resistant design',
            'Customizable socket fitting'
          ]
        : [
            'गतिशील प्रतिक्रिया पैर',
            'समायोज्य संरेखण',
            'हल्का कार्बन फाइबर',
            'जलरोधक डिजाइन',
            'अनुकूलन योग्य सॉकेट फिटिंग'
          ],
      availability: language === 'en' ? 'Made to Order' : 'ऑर्डर पर बनाया गया'
    },
    {
      id: 6,
      name: language === 'en' ? 'White Cane' : 'सफेद छड़ी',
      category: 'visual',
      image: 'https://i0.wp.com/capcity.news/wp-content/uploads/2022/10/white-cane-scaled.jpg?fit=2560%2C1707&ssl=1',
      description: language === 'en'
        ? 'Foldable white cane with reflective material and ergonomic handle.'
        : 'परावर्तक सामग्री और एर्गोनोमिक हैंडल के साथ फोल्डेबल सफेद छड़ी।',
      features: language === 'en'
        ? [
            'Foldable into 4 sections',
            'Reflective tape for visibility',
            'Ergonomic foam handle',
            'Ceramic tip for durability',
            'Lightweight aluminum construction'
          ]
        : [
            '4 खंडों में फोल्डेबल',
            'दृश्यता के लिए परावर्तक टेप',
            'एर्गोनोमिक फोम हैंडल',
            'स्थायित्व के लिए सिरेमिक टिप',
            'हल्का एल्यूमीनियम निर्माण'
          ],
      availability: language === 'en' ? 'In Stock' : 'स्टॉक में'
    },
    {
      id: 7,
      name: language === 'en' ? 'Folding Walker' : 'फोल्डिंग वॉकर',
      category: 'mobility',
      image: 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/walker-rollator/9/1/d/0-499-200-walker-adult17-asr-surgical-original-imagst6qhmfqdqek.jpeg?q=90',
      description: language === 'en'
        ? 'Lightweight foldable walker designed to provide stability and support while walking.'
        : 'चलने के दौरान स्थिरता और समर्थन प्रदान करने के लिए हल्का फोल्डेबल वॉकर।',
      features: language === 'en' ? [
        'Height adjustable frame',
        'Foldable for easy storage',
        'Non-slip rubber grips',
        'Lightweight aluminum body',
        'Strong support for balance'
      ] : [
        'ऊंचाई समायोज्य फ्रेम',
        'आसान भंडारण के लिए फोल्डेबल',
        'नॉन-स्लिप रबर ग्रिप्स',
        'हल्का एल्यूमीनियम बॉडी',
        'बेहतर संतुलन के लिए मजबूत सपोर्ट'
      ],
      availability: language === 'en' ? 'In Stock' : 'स्टॉक में'
    },
    {
      id: 8,
      name: language === 'en' ? 'Communication Board' : 'संचार बोर्ड',
      category: 'communication',
      image: 'https://images.unsplash.com/photo-1599008633840-052c7f756385?ixlib=rb-4.0.3&ixid=MnwxMjA3fHx8fHx8fA%3D%3D',
      description: language === 'en'
        ? 'Visual communication board with symbols for non-verbal individuals.'
        : 'गैर-मौखिक व्यक्तियों के लिए प्रतीकों के साथ दृश्य संचार बोर्ड।',
      features: language === 'en'
        ? [
            'Over 200 picture symbols',
            'Customizable layout',
            'Waterproof and durable',
            'Includes alphabet and numbers',
            'Portable A4 size'
          ]
        : [
            '200 से अधिक चित्र प्रतीक',
            'अनुकूलन योग्य लेआउट',
            'वाटरप्रूफ और टिकाऊ',
            'वर्णमाला और संख्याएं शामिल',
            'पोर्टेबल A4 आकार'
          ],
      availability: language === 'en' ? 'In Stock' : 'स्टॉक में'
    }
  ];

  // Filter devices based on search and category
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         device.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categories for filter
  const categories = [{
    id: 'all',
    name: language === 'en' ? 'All Devices' : 'सभी उपकरण'
  }, {
    id: 'mobility',
    name: language === 'en' ? 'Mobility Aids' : 'गतिशीलता सहायक'
  }, {
    id: 'hearing',
    name: language === 'en' ? 'Hearing Aids' : 'श्रवण यंत्र'
  }, {
    id: 'visual',
    name: language === 'en' ? 'Visual Aids' : 'दृश्य सहायक'
  }, {
    id: 'prosthetic',
    name: language === 'en' ? 'Prosthetics' : 'कृत्रिम अंग'
  }, {
    id: 'communication',
    name: language === 'en' ? 'Communication Aids' : 'संचार सहायक'
  }];

  const handleViewDetails = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleApply = () => {
    navigate('/beneficiary/apply');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          {language === 'en' ? 'Assistive Device Catalog' : 'सहायक उपकरण कैटलॉग'}
        </h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white rounded-lg shadow-md">
          <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={language === 'en' ? 'Search devices...' : 'उपकरण खोजें...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={language === 'en' ? 'Search devices' : 'उपकरण खोजें'}
            />
          </div>

          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              aria-label={language === 'en' ? 'Filter by category' : 'श्रेणी द्वारा फ़िल्टर करें'}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

    
        {/* Device Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDevices.length > 0 ? (
            filteredDevices.map(device => (
              <div key={device.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
                <img src={device.image} alt={device.name} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{device.name}</h2>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{device.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {categories.find(cat => cat.id === device.category)?.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(device)}
                    className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                  >
                    {language === 'en' ? 'View Details' : 'विवरण देखें'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              {language === 'en' ? 'No devices found matching your search criteria.' : 'आपके खोज मानदंडों से मेल खाने वाले कोई उपकरण नहीं मिले।'}
            </p>
          )}
        </div>
      </div>

      {/* Modal for Device Details */}
      {isModalOpen && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDevice.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <img 
                src={selectedDevice.image} 
                alt={selectedDevice.name} 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Description' : 'विवरण'}
                </h3>
                <p className="text-gray-700">{selectedDevice.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Key Features' : 'मुख्य विशेषताएं'}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDevice.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'Availability' : 'उपलब्धता'}
                  </p>
                  <p className={`text-lg font-semibold ${
                    selectedDevice.availability === 'In Stock' || selectedDevice.availability === 'स्टॉक में' 
                      ? 'text-green-600' 
                      : selectedDevice.availability === 'Limited Stock' || selectedDevice.availability === 'सीमित स्टॉक'
                      ? 'text-orange-600'
                      : 'text-blue-600'
                  }`}>
                    {selectedDevice.availability}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    closeModal();
                    handleApply();
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Apply for This Device' : 'इस उपकरण के लिए आवेदन करें'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}