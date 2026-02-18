import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { CheckIcon, XIcon, InfoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DeviceComparison() {
  const { language } = useAccessibility();
  const [deviceCategory, setDeviceCategory] = useState('wheelchair');

  const deviceCategories = {
    wheelchair: {
      title: language === 'en' ? 'Wheelchairs' : 'व्हीलचेयर',
      devices: [
        {
          id: 1,
          name: language === 'en' ? 'Standard Manual Wheelchair' : 'मानक मैनुअल व्हीलचेयर',
          image: 'https://images.unsplash.com/photo-1611242320536-f12d3541249b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          description: language === 'en' ? 'Basic wheelchair suitable for most users with mobility disabilities.' : 'गतिशीलता विकलांगता वाले अधिकांश उपयोगकर्ताओं के लिए उपयुक्त बुनियादी व्हीलचेयर।',
          features: {
            foldable: true,
            adjustableFootrests: true,
            adjustableArmrests: false,
            selfPropelled: true,
            attendantPropelled: true,
            lightWeight: false,
            terrainHandling: 'Standard',
            brakeSystem: language === 'en' ? 'Standard' : 'मानक',
            seatWidth: language === 'en' ? '16-18 inches' : '16-18 इंच',
          },
          suitability: {
            indoorUse: 'high',
            outdoorUse: 'medium',
            longTermUse: 'high',
            transportability: 'medium',
          },
        },
        {
          id: 2,
          name: language === 'en' ? 'Lightweight Wheelchair' : 'हल्का व्हीलचेयर',
          image: 'https://images.unsplash.com/photo-1525328302834-764f32276842?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          description: language === 'en' ? 'Lighter wheelchair for active users who need to transport it frequently.' : 'सक्रिय उपयोगकर्ताओं के लिए हल्का व्हीलचेयर जिन्हें इसे अक्सर परिवहन करने की आवश्यकता होती है।',
          features: {
            foldable: true,
            adjustableFootrests: true,
            adjustableArmrests: true,
            selfPropelled: true,
            attendantPropelled: true,
            lightWeight: true,
            terrainHandling: 'Improved',
            brakeSystem: language === 'en' ? 'Enhanced' : 'उन्नत',
            seatWidth: language === 'en' ? '16-20 inches' : '16-20 इंच',
          },
          suitability: {
            indoorUse: 'high',
            outdoorUse: 'medium',
            longTermUse: 'high',
            transportability: 'high',
          },
        },
        {
          id: 3,
          name: language === 'en' ? 'Motorized Wheelchair' : 'मोटरयुक्त व्हीलचेयर',
          image: 'https://images.unsplash.com/photo-1535981767287-35259dbf7d0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          description: language === 'en' ? 'Battery-powered wheelchair for users with limited upper body strength.' : 'सीमित ऊपरी शरीर की ताकत वाले उपयोगकर्ताओं के लिए बैटरी से चलने वाली व्हीलचेयर।',
          features: {
            foldable: false,
            adjustableFootrests: true,
            adjustableArmrests: true,
            selfPropelled: false,
            attendantPropelled: false,
            lightWeight: false,
            terrainHandling: 'All-Terrain',
            brakeSystem: language === 'en' ? 'Electronic' : 'इलेक्ट्रॉनिक',
            seatWidth: language === 'en' ? '18-22 inches' : '18-22 इंच',
          },
          suitability: {
            indoorUse: 'medium',
            outdoorUse: 'high',
            longTermUse: 'high',
            transportability: 'low',
          },
        },
      ],
    },
    hearing: {
        title: language === 'en' ? 'Hearing Aids' : 'श्रवण यंत्र',
        devices: [
            {
                id: 4,
                name: language === 'en' ? 'Behind-the-ear (BTE) Hearing Aid' : 'कान के पीछे (BTE) श्रवण यंत्र',
                image: 'https://images.unsplash.com/photo-1631563019676-dade0a7c9b6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                description: language === 'en' ? 'Standard hearing aid that sits behind the ear and is suitable for most types of hearing loss.' : 'मानक श्रवण यंत्र जो कान के पीछे बैठता है और अधिकांश प्रकार के श्रवण हानि के लिए उपयुक्त है।',
                features: {
                    batteryLife: language === 'en' ? '5-7 days' : '5-7 दिन',
                    volumeControl: true,
                    noiseReduction: true,
                    waterResistant: false,
                    bluetoothConnectivity: true,
                    rechargeable: false,
                    programmable: true,
                    warranty: language === 'en' ? '1 year' : '1 वर्ष',
                },
                suitability: {
                    mildHearingLoss: 'high',
                    moderateHearingLoss: 'high',
                    severeHearingLoss: 'medium',
                    childrenUse: 'high',
                    elderlyUse: 'high',
                },
            },
            {
                id: 5,
                name: language === 'en' ? 'In-the-ear (ITE) Hearing Aid' : 'कान के अंदर (ITE) श्रवण यंत्र',
                image: 'https://images.unsplash.com/photo-1595859704198-10c31e14ff22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
                description: language === 'en' ? 'Custom-fit hearing aid that fits entirely in the ear canal, less visible but with smaller batteries.' : 'कस्टम-फिट श्रवण यंत्र जो पूरी तरह से कान की नली में फिट होता है, कम दिखाई देता है लेकिन छोटी बैटरी के साथ।',
                features: {
                    batteryLife: language === 'en' ? '3-5 days' : '3-5 दिन',
                    volumeControl: true,
                    noiseReduction: true,
                    waterResistant: true,
                    bluetoothConnectivity: false,
                    rechargeable: true,
                    programmable: true,
                    warranty: language === 'en' ? '1 year' : '1 वर्ष',
                },
                suitability: {
                    mildHearingLoss: 'high',
                    moderateHearingLoss: 'medium',
                    severeHearingLoss: 'low',
                    childrenUse: 'low',
                    elderlyUse: 'medium',
                },
            },
            {
                id: 6,
                name: language === 'en' ? 'Digital Programmable Hearing Aid' : 'डिजिटल प्रोग्रामेबल श्रवण यंत्र',
                image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                description: language === 'en' ? 'Advanced digital hearing aid with multiple programs for different listening environments.' : 'विभिन्न श्रवण वातावरणों के लिए कई प्रोग्राम के साथ उन्नत डिजिटल श्रवण यंत्र।',
                features: {
                    batteryLife: language === 'en' ? '7-10 days' : '7-10 दिन',
                    volumeControl: true,
                    noiseReduction: true,
                    waterResistant: true,
                    bluetoothConnectivity: true,
                    rechargeable: true,
                    programmable: true,
                    warranty: language === 'en' ? '2 years' : '2 वर्ष',
                },
                suitability: {
                    mildHearingLoss: 'high',
                    moderateHearingLoss: 'high',
                    severeHearingLoss: 'high',
                    childrenUse: 'medium',
                    elderlyUse: 'high',
                },
            },
        ],
    },
    prosthetic: {
        title: language === 'en' ? 'Prosthetic Limbs' : 'कृत्रिम अंग',
        devices: [
            {
                id: 7,
                name: language === 'en' ? 'Below Knee Prosthesis' : 'घुटने के नीचे का कृत्रिम अंग',
                image: 'https://images.unsplash.com/photo-1556777956-a8648a2a92d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                description: language === 'en' ? 'Standard prosthetic leg for below-knee amputees, suitable for everyday activities.' : 'घुटने के नीचे के अंग-विच्छेदितों के लिए मानक कृत्रिम पैर, रोजमर्रा की गतिविधियों के लिए उपयुक्त।',
                features: {
                    adjustable: true,
                    waterResistant: true,
                    durability: 'Medium',
                    weight: language === 'en' ? '1.2-1.5 kg' : '1.2-1.5 किलो',
                    ankleMovement: true,
                    customizable: false,
                    maintenance: 'Low',
                    warranty: language === 'en' ? '2 years' : '2 वर्ष',
                },
                suitability: {
                    dailyActivities: 'high',
                    sports: 'low',
                    unevenTerrain: 'low',
                    longTermUse: 'high',
                },
            },
            {
                id: 8,
                name: language === 'en' ? 'Above Knee Prosthesis' : 'घुटने के ऊपर का कृत्रिम अंग',
                image: 'https://images.unsplash.com/photo-1584298042829-812867293c42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                description: language === 'en' ? 'Prosthetic leg for above-knee amputees with knee joint mechanism.' : 'घुटने के जोड़ तंत्र के साथ घुटने के ऊपर के अंग-विच्छेदितों के लिए कृत्रिम पैर।',
                features: {
                    adjustable: true,
                    waterResistant: false,
                    durability: 'Medium',
                    weight: language === 'en' ? '2.5-3 kg' : '2.5-3 किलो',
                    ankleMovement: true,
                    customizable: true,
                    maintenance: 'Medium',
                    warranty: language === 'en' ? '2 years' : '2 वर्ष',
                },
                suitability: {
                    dailyActivities: 'high',
                    sports: 'low',
                    unevenTerrain: 'low',
                    longTermUse: 'high',
                },
            },
            {
                id: 9,
                name: language === 'en' ? 'Dynamic Response Foot' : 'गतिशील प्रतिक्रिया पैर',
                image: 'https://images.unsplash.com/photo-1624204731525-4a3a6d629aba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                description: language === 'en' ? 'Advanced prosthetic foot that stores and releases energy during walking for a more natural gait.' : 'उन्नत कृत्रिम पैर जो अधिक प्राकृतिक चाल के लिए चलने के दौरान ऊर्जा को संग्रहित और जारी करता है।',
                features: {
                    adjustable: true,
                    waterResistant: true,
                    durability: 'High',
                    weight: language === 'en' ? '0.7-1 kg' : '0.7-1 किलो',
                    ankleMovement: true,
                    customizable: true,
                    maintenance: 'Low',
                    warranty: language === 'en' ? '3 years' : '3 वर्ष',
                },
                suitability: {
                    dailyActivities: 'high',
                    sports: 'high',
                    unevenTerrain: 'medium',
                    longTermUse: 'high',
                },
            },
        ],
    },
  };

  const selectedDevices = deviceCategories[deviceCategory].devices;

  const RatingBar = ({ value, label }) => {
    let bgColor = '';
    switch (value) {
      case 'low':
        bgColor = 'bg-red-500';
        break;
      case 'medium':
        bgColor = 'bg-yellow-500';
        break;
      case 'high':
        bgColor = 'bg-green-500';
        break;
      default:
        bgColor = 'bg-gray-300';
    }
    const width = value === 'low' ? 'w-1/3' : value === 'medium' ? 'w-2/3' : 'w-full';
    const ratingText = value === 'low' ? (language === 'en' ? 'Low' : 'कम') : value === 'medium' ? (language === 'en' ? 'Medium' : 'मध्यम') : (language === 'en' ? 'High' : 'उच्च');

    return (
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{ratingText}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className={`${bgColor} ${width} h-2.5 rounded-full`}></div>
        </div>
      </div>
    );
  };

  const camelToTitle = (camelCase) => {
    const result = camelCase.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          {language === 'en' ? 'Device Comparison' : 'उपकरण तुलना'}
        </h1>
        <p className="text-center text-lg text-gray-600 mb-10">
          {language === 'en' ? 'Compare different assistive devices to find the one that best suits your needs.' : 'अपनी जरूरतों के अनुसार सबसे उपयुक्त उपकरण खोजने के लिए विभिन्न सहायक उपकरणों की तुलना करें।'}
        </p>

        <div className="mb-8 text-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button onClick={() => setDeviceCategory('wheelchair')} className={`px-4 py-2 text-sm font-medium ${deviceCategory === 'wheelchair' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700`}>
              {language === 'en' ? 'Wheelchairs' : 'व्हीलचेयर'}
            </button>
            <button onClick={() => setDeviceCategory('hearing')} className={`px-4 py-2 text-sm font-medium ${deviceCategory === 'hearing' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700`}>
              {language === 'en' ? 'Hearing Aids' : 'श्रवण यंत्र'}
            </button>
            <button onClick={() => setDeviceCategory('prosthetic')} className={`px-4 py-2 text-sm font-medium ${deviceCategory === 'prosthetic' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} border border-gray-200 rounded-r-md hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700`}>
              {language === 'en' ? 'Prosthetic Limbs' : 'कृत्रिम अंग'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-600 w-1/4">{language === 'en' ? 'Features' : 'विशेषताएँ'}</th>
                {selectedDevices.map(device => (
                  <th key={device.id} className="p-4 text-center text-sm font-semibold text-gray-600 w-1/4">
                    <img src={device.image} alt={device.name} className="w-full h-32 object-cover rounded-md mx-auto mb-2" />
                    {device.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-800">{language === 'en' ? 'Description' : 'विवरण'}</td>
                {selectedDevices.map(device => (
                  <td key={device.id} className="p-4 text-sm text-gray-600">{device.description}</td>
                ))}
              </tr>
              {Object.keys(selectedDevices[0].features).map(feature => (
                <tr key={feature} className="border-b">
                  <td className="p-4 font-medium text-gray-800">{camelToTitle(feature)}</td>
                  {selectedDevices.map(device => (
                    <td key={device.id} className="p-4 text-center">
                      {typeof device.features[feature] === 'boolean' ? (
                        device.features[feature] ? <CheckIcon className="h-6 w-6 text-green-500 mx-auto" /> : <XIcon className="h-6 w-6 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-800">{device.features[feature]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={selectedDevices.length + 1} className="p-4 bg-gray-100 font-semibold text-gray-700">{language === 'en' ? 'Suitability Ratings' : 'उपयुक्तता रेटिंग'}</td>
              </tr>
              {Object.keys(selectedDevices[0].suitability).map(suitabilityKey => (
                <tr key={suitabilityKey} className="border-b">
                  <td className="p-4 font-medium text-gray-800">{camelToTitle(suitabilityKey)}</td>
                  {selectedDevices.map(device => (
                    <td key={device.id} className="p-4">
                      <RatingBar value={device.suitability[suitabilityKey]} label={''} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <InfoIcon className="h-8 w-8 text-blue-600 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'How to Choose' : 'कैसे चुनें'}</h3>
            </div>
            <p className="text-gray-600 mb-4">{language === 'en' ? 'Consider the following factors:' : 'निम्नलिखित कारकों पर विचार करें:'}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>{language === 'en' ? 'Your specific disability and medical condition' : 'आपकी विशिष्ट विकलांगता और चिकित्सा स्थिति'}</li>
              <li>{language === 'en' ? 'Your daily environment and activities' : 'आपका दैनिक वातावरण और गतिविधियां'}</li>
              <li>{language === 'en' ? 'Ease of use and maintenance' : 'उपयोग में आसानी और रखरखाव'}</li>
              <li>{language === 'en' ? 'Durability and lifespan of the device' : 'उपकरण का टिकाऊपन और जीवनकाल'}</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">{language === 'en' ? 'Consult a healthcare professional before making a final decision.' : 'अंतिम निर्णय लेने से पहले एक स्वास्थ्य देखभाल पेशेवर से परामर्श करें।'}</p>
          </div>

          <div className="text-center bg-blue-600 text-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">{language === 'en' ? 'Ready to Apply?' : 'आवेदन करने के लिए तैयार हैं?'}</h3>
            <p className="mb-6">{language === 'en' ? 'Once you have identified the right device, apply through the ADIP scheme.' : 'सही उपकरण की पहचान करने के बाद, एडीआईपी योजना के माध्यम से आवेदन करें।'}</p>
            <div className="flex justify-center gap-4">
              <Link to="/eligibility" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100">
                {language === 'en' ? 'Check Eligibility' : 'पात्रता जांचें'}
              </Link>
              <Link to="/register" className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-md hover:bg-blue-900">
                {language === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}