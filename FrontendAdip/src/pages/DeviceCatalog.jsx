import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { SearchIcon, FilterIcon } from 'lucide-react';
export function DeviceCatalog() {
  const {
    language
  } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Sample device data
  const devices = [{
    id: 1,
    name: language === 'en' ? 'Standard Wheelchair' : 'मानक व्हीलचेयर',
    category: 'mobility',
    image: 'https://images.unsplash.com/photo-1611242320536-f12d3541249b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Foldable wheelchair with standard features for everyday mobility.' : 'रोजमर्रा की गतिशीलता के लिए मानक सुविधाओं वाली फोल्डेबल व्हीलचेयर।'
  }, {
    id: 2,
    name: language === 'en' ? 'Digital Hearing Aid' : 'डिजिटल श्रवण यंत्र',
    category: 'hearing',
    image: 'https://images.unsplash.com/photo-1631563019676-dade0a7c9b6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Advanced digital hearing aid with noise cancellation technology.' : 'शोर रद्दीकरण तकनीक के साथ उन्नत डिजिटल श्रवण यंत्र।'
  }, {
    id: 3,
    name: language === 'en' ? 'Adjustable Crutches' : 'समायोज्य बैसाखी',
    category: 'mobility',
    image: 'https://images.unsplash.com/photo-1586374579358-9d19d632b6d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Height-adjustable aluminum crutches with ergonomic handle.' : 'एर्गोनोमिक हैंडल के साथ ऊंचाई-समायोज्य एल्यूमीनियम बैसाखी।'
  }, {
    id: 4,
    name: language === 'en' ? 'Braille Display' : 'ब्रेल डिस्प्ले',
    category: 'visual',
    image: 'https://images.unsplash.com/photo-1582557173807-99f0b8888906?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Refreshable braille display for computer accessibility.' : 'कंप्यूटर पहुंच के लिए रिफ्रेशेबल ब्रेल डिस्प्ले।'
  }, {
    id: 5,
    name: language === 'en' ? 'Prosthetic Leg' : 'कृत्रिम पैर',
    category: 'prosthetic',
    image: 'https://images.unsplash.com/photo-1556777956-a8648a2a92d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Below-knee prosthetic leg with dynamic response foot.' : 'गतिशील प्रतिक्रिया पैर के साथ घुटने के नीचे कृत्रिम पैर।'
  }, {
    id: 6,
    name: language === 'en' ? 'White Cane' : 'सफेद छड़ी',
    category: 'visual',
    image: 'https://images.unsplash.com/photo-1601078074293-56d77a5311e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Foldable white cane with reflective material and ergonomic handle.' : 'परावर्तक सामग्री और एर्गोनोमिक हैंडल के साथ फोल्डेबल सफेद छड़ी।'
  }, {
    id: 7,
    name: language === 'en' ? 'Electric Wheelchair' : 'इलेक्ट्रिक व्हीलचेयर',
    category: 'mobility',
    image: 'https://images.unsplash.com/photo-1535981767287-35259dbf7d0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Battery-powered wheelchair with joystick control and adjustable seating.' : 'जॉयस्टिक नियंत्रण और समायोज्य सीटिंग के साथ बैटरी से चलने वाली व्हीलचेयर।'
  }, {
    id: 8,
    name: language === 'en' ? 'Communication Board' : 'संचार बोर्ड',
    category: 'communication',
    image: 'https://images.unsplash.com/photo-1599008633840-052c7f756385?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: language === 'en' ? 'Visual communication board with symbols for non-verbal individuals.' : 'गैर-मौखिक व्यक्तियों के लिए प्रतीकों के साथ दृश्य संचार बोर्ड।'
  }];
  // Filter devices based on search and category
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || device.description.toLowerCase().includes(searchTerm.toLowerCase());
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
              <div key={device.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src={device.image} alt={device.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{device.name}</h2>
                  <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{device.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {categories.find(cat => cat.id === device.category)?.name}
                    </span>
                    <button className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                      {language === 'en' ? 'View Details' : 'विवरण देखें'}
                    </button>
                  </div>
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
    </div>
  );
}