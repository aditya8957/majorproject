// import React from 'react';
// import { useAccessibility } from '../../context/AccessibilityContext';
// export function Footer() {
//   const {
//     language
//   } = useAccessibility();
//   const currentYear = new Date().getFullYear();
//   return (
//     <footer className="bg-blue-900 text-white py-8">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="text-xl font-bold mb-4">
//               {language === 'en' ? 'ADIP Scheme' : 'एडीआईपी योजना'}
//             </h3>
//             <p className="text-sm">
//               {language === 'en' ? 'Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances' : 'दिव्यांगजनों के लिए सहायक उपकरणों की खरीद/फिटिंग हेतु सहायता'}
//             </p>
//           </div>
//           <div>
//             <h3 className="text-xl font-bold mb-4">
//               {language === 'en' ? 'Important Links' : 'महत्वपूर्ण लिंक्स'}
//             </h3>
//             <ul className="text-sm">
//               <li className="mb-2">
//                 <a href="https://disabilityaffairs.gov.in/" className="hover:underline">
//                   {language === 'en' ? 'Department of Empowerment of PwDs' : 'दिव्यांगजन सशक्तिकरण विभाग'}
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a href="https://www.india.gov.in/" className="hover:underline">
//                   {language === 'en' ? 'National Portal of India' : 'भारत का राष्ट्रीय पोर्टल'}
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a href="#" className="hover:underline">
//                   {language === 'en' ? 'RTI' : 'आरटीआई'}
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-xl font-bold mb-4">
//               {language === 'en' ? 'Contact Us' : 'संपर्क करें'}
//             </h3>
//             <address className="text-sm not-italic">
//               {language === 'en' ? 'Department of Empowerment of Persons with Disabilities' : 'दिव्यांगजन सशक्तिकरण विभाग'}<br />
              
//               {language === 'en' ? 'Ministry of Social Justice and Empowerment' : 'सामाजिक न्याय और अधिकारिता मंत्रालय'}<br />
              
//               {language === 'en' ? 'Government of India' : 'भारत सरकार'}
//             </address>
//           </div>
//         </div>
//         <div className="mt-8 text-center text-sm">
//           {/* Copyright line removed as requested */}
//         </div>
//       </div>
//     </footer>
//   );
// }