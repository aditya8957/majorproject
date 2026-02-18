import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ChevronDownIcon, ChevronUpIcon, HelpCircleIcon, SearchIcon } from 'lucide-react';

export function Help() {
  const { language } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = id => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const faqs = [
    {
      id: 1,
      question: language === 'en' ? 'What is the ADIP Scheme?' : 'एडीआईपी योजना क्या है?',
      answer: language === 'en' ? 'The Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP) Scheme is a government initiative to assist persons with disabilities in procuring durable, sophisticated, and scientifically manufactured modern standard aids and appliances that can promote their physical, social, and psychological rehabilitation.' : 'दिव्यांगजनों के लिए सहायक उपकरणों की खरीद/फिटिंग हेतु सहायता (एडीआईपी) योजना एक सरकारी पहल है जो दिव्यांगजनों को टिकाऊ, परिष्कृत और वैज्ञानिक रूप से निर्मित आधुनिक मानक सहायक उपकरणों को प्राप्त करने में सहायता करती है जो उनके शारीरिक, सामाजिक और मनोवैज्ञानिक पुनर्वास को बढ़ावा दे सकते हैं।'
    },
    {
      id: 2,
      question: language === 'en' ? 'Who is eligible for the ADIP Scheme?' : 'एडीआईपी योजना के लिए कौन पात्र है?',
      answer: language === 'en' ? 'Indian citizens with 40% or more disability and monthly income below Rs. 20,000 are eligible for assistance under the ADIP Scheme. The income limit is applicable to the disabled individual and not to their parents or guardians.' : 'भारतीय नागरिक जिनकी विकलांगता 40% या अधिक है और मासिक आय रु. 20,000 से कम है, वे एडीआईपी योजना के तहत सहायता के लिए पात्र हैं। आय सीमा दिव्यांग व्यक्ति पर लागू होती है, न कि उनके माता-पिता या अभिभावकों पर।'
    },
    {
      id: 3,
      question: language === 'en' ? 'What types of assistive devices are available under the scheme?' : 'योजना के तहत किस प्रकार के सहायक उपकरण उपलब्ध हैं?',
      answer: language === 'en' ? 'The scheme covers a wide range of assistive devices including but not limited to wheelchairs, tricycles, crutches, walking sticks, hearing aids, Braille appliances, artificial limbs, and other mobility, visual, and hearing aids.' : 'योजना में कई प्रकार के सहायक उपकरण शामिल हैं, जिनमें व्हीलचेयर, ट्राइसाइकिल, बैसाखी, वॉकिंग स्टिक, श्रवण यंत्र, ब्रेल उपकरण, कृत्रिम अंग और अन्य गतिशीलता, दृश्य और श्रवण सहायक उपकरण शामिल हैं, लेकिन इन्हीं तक सीमित नहीं हैं।'
    },
    {
      id: 4,
      question: language === 'en' ? 'How can I apply for assistance under the ADIP Scheme?' : 'एडीआईपी योजना के तहत सहायता के लिए मैं कैसे आवेदन कर सकता/सकती हूँ?',
      answer: language === 'en' ? 'You can apply online through this portal by filling out the beneficiary registration form. You will need to provide personal information, disability details, and upload a valid disability certificate. Alternatively, you can also approach implementing agencies like registered NGOs, National Institutes, DDRCs, etc.' : 'आप लाभार्थी पंजीकरण फॉर्म भरकर इस पोर्टल के माध्यम से ऑनलाइन आवेदन कर सकते हैं। आपको व्यक्तिगत जानकारी, विकलांगता विवरण प्रदान करने और एक वैध विकलांगता प्रमाण पत्र अपलोड करने की आवश्यकता होगी। वैकल्पिक रूप से, आप पंजीकृत गैर सरकारी संगठनों, राष्ट्रीय संस्थानों, डीडीआरसी आदि जैसी कार्यान्वयन एजेंसियों से भी संपर्क कर सकते हैं।'
    },
    {
      id: 5,
      question: language === 'en' ? 'Is there any cost to the beneficiary?' : 'क्या लाभार्थी को कोई लागत वहन करनी होती है?',
      answer: language === 'en' ? 'The scheme provides aids and appliances completely free of cost to persons with disabilities with a monthly income up to Rs. 15,000. For those with a monthly income between Rs. 15,001 and Rs. 20,000, the beneficiary may need to contribute 50% of the cost of the device.' : 'योजना रु. 15,000 तक की मासिक आय वाले दिव्यांगजनों को पूरी तरह से निःशुल्क सहायक उपकरण प्रदान करती है। रु. 15,001 से रु. 20,000 के बीच की मासिक आय वाले लोगों के लिए, लाभार्थी को उपकरण की लागत का 50% योगदान देना पड़ सकता है।'
    },
    {
      id: 6,
      question: language === 'en' ? 'How long does the application process take?' : 'आवेदन प्रक्रिया में कितना समय लगता है?',
      answer: language === 'en' ? 'The processing time varies depending on the verification process, availability of devices, and the implementing agency. Typically, it takes 30-45 days from the date of application to the approval and distribution of the assistive device.' : 'प्रसंस्करण समय सत्यापन प्रक्रिया, उपकरणों की उपलब्धता और कार्यान्वयन एजेंसी के आधार पर भिन्न होता है। आमतौर पर, आवेदन की तारीख से सहायक उपकरण के अनुमोदन और वितरण तक 30-45 दिन लगते हैं।'
    },
    {
      id: 7,
      question: language === 'en' ? 'Can I apply for multiple devices?' : 'क्या मैं कई उपकरणों के लिए आवेदन कर सकता/सकती हूँ?',
      answer: language === 'en' ? 'Yes, a person with multiple disabilities can apply for more than one assistive device based on their needs. However, there is a limit on the total cost of devices that can be provided to a single beneficiary, which is currently Rs. 10,000.' : 'हां, एक से अधिक विकलांगता वाला व्यक्ति अपनी जरूरतों के आधार पर एक से अधिक सहायक उपकरण के लिए आवेदन कर सकता है। हालांकि, एक लाभार्थी को प्रदान किए जा सकने वाले उपकरणों की कुल लागत पर एक सीमा है, जो वर्तमान में रु. 10,000 है।'
    },
    {
      id: 8,
      question: language === 'en' ? 'Is there any warranty or maintenance support for the devices?' : 'क्या उपकरणों के लिए कोई वारंटी या रखरखाव सहायता है?',
      answer: language === 'en' ? 'Yes, most devices provided under the ADIP Scheme come with a warranty period of 1-3 years depending on the type of device. During this period, the implementing agency is responsible for ensuring proper maintenance and repair of the devices if needed.' : 'हां, एडीआईपी योजना के तहत प्रदान किए गए अधिकांश उपकरणों के साथ उपकरण के प्रकार के आधार पर 1-3 वर्ष की वारंटी अवधि आती है। इस अवधि के दौरान, कार्यान्वयन एजेंसी आवश्यकता पड़ने पर उपकरणों के उचित रखरखाव और मरम्मत सुनिश्चित करने के लिए जिम्मेदार है।'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <HelpCircleIcon className="mr-3 text-blue-500" size={32} />
        {language === 'en' ? 'Help & FAQs' : 'सहायता और अक्सर पूछे जाने वाले प्रश्न'}
      </h1>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
          <input type="text" placeholder={language === 'en' ? 'Search for questions...' : 'प्रश्न खोजें...'}
           value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
           className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
           aria-label={language === 'en' ? 'Search FAQs' : 'प्रश्न खोजें'} />
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => (
            <div key={faq.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <button onClick={() => toggleFaq(faq.id)} 
                      className="flex justify-between items-center w-full p-4 text-left focus:outline-none" 
                      aria-expanded={openFaqId === faq.id} 
                      aria-controls={`faq-answer-${faq.id}`}>
                <span className="font-semibold text-gray-800">{faq.question}</span>
                {openFaqId === faq.id ? <ChevronUpIcon className="text-blue-500" /> : <ChevronDownIcon className="text-gray-500" />}
              </button>
              {openFaqId === faq.id && (
                <div id={`faq-answer-${faq.id}`} className="p-4 border-t border-gray-200 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">{language === 'en' ? 'No FAQs found matching your search.' : 'आपकी खोज से मेल खाने वाले कोई प्रश्न नहीं मिले।'}</p>
        )}
      </div>

      {/* Additional Help */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{language === 'en' ? 'Need More Help?' : 'और सहायता चाहिए?'}</h2>
        <p className="text-gray-700 mb-6">
          {language === 'en' ? "If you couldn't find the answer to your question, please contact us through one of the following channels:" : 'यदि आपको अपने प्रश्न का उत्तर नहीं मिला है, तो कृपया निम्नलिखित चैनलों में से किसी एक के माध्यम से हमसे संपर्क करें:'}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{language === 'en' ? 'Helpline' : 'हेल्पलाइन'}</h3>
            <p className="text-blue-600 font-bold text-xl">1800-XXX-XXXX</p>
            <p className="text-sm text-gray-500">{language === 'en' ? '(Monday to Friday, 9:00 AM to 5:30 PM)' : '(सोमवार से शुक्रवार, सुबह 9:00 बजे से शाम 5:30 बजे तक)'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{language === 'en' ? 'Email Support' : 'ईमेल सहायता'}</h3>
            <p className="text-blue-600 font-bold text-lg">
              <a href="mailto:help@adip.gov.in" className="hover:underline">help@adip.gov.in</a>
            </p>
            <p className="text-sm text-gray-500">{language === 'en' ? '(Response within 48 hours)' : '(48 घंटे के भीतर प्रतिक्रिया)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}