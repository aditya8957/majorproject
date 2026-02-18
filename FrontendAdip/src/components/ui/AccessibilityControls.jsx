// import React from 'react';
// import { useAccessibility } from '../../context/AccessibilityContext';
// import { ContrastIcon, TypeIcon, GlobeIcon, Volume2Icon } from 'lucide-react';
// export function AccessibilityControls() {
//   const {
//     toggleHighContrast,
//     increaseFontSize,
//     decreaseFontSize,
//     toggleLanguage,
//     language
//   } = useAccessibility();
//   const speakPageContent = () => {
//     const content = document.body.textContent || '';
//     const utterance = new SpeechSynthesisUtterance(content);
//     utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
//     window.speechSynthesis.speak(utterance);
//   };
//   return 
      
        
          
//           Contrast
        
        
          
//             A-
          
          
//             A+
          
        
        
          
//           Speak
        
        
          
//           {language === 'en' ? 'हिंदी' : 'English'}
        
      
//     ;
// }

// import React, { useState } from "react";
// import { useAccessibility } from "../../context/AccessibilityContext";
// import { Accessibility } from "lucide-react"; // ♿ icon

// // Reusable Toggle
// function Toggle({ enabled, onChange }) {
//   return (
//     <button
//       onClick={onChange}
//       className={`relative w-12 h-6 flex items-center rounded-full transition-colors ${
//         enabled ? "bg-blue-600" : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
//           enabled ? "translate-x-6" : "translate-x-0"
//         }`}
//       />
//     </button>
//   );
// }

// export function AccessibilityControls() {
//   const [open, setOpen] = useState(false);

//   const {
//     contrast,
//     setContrast,
//     fontSize,
//     setFontSize,
//     highlightLinks,
//     setHighlightLinks,
//     textSpacing,
//     setTextSpacing,
//     lineHeight,
//     setLineHeight,
//     hideImages,
//     setHideImages,
//   } = useAccessibility();

//   return (
//     <div className="fixed top-4 right-4 z-50">
//       {/* Toggle Button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
//       >
//         <Accessibility size={24} />
//       </button>

//       {/* Panel */}
//       {open && (
//         <div className="mt-3 w-80 bg-white shadow-2xl rounded-2xl p-5 space-y-4 border border-gray-200 animate-fade-in">
//           <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
//             Accessibility Tools
//           </h2>

//           {/* Contrast */}
//           <div>
//             <p className="font-medium text-gray-700 mb-2">Color Contrast</p>
//             <div className="flex gap-2">
//               {["normal", "high", "invert"].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => setContrast(type)}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                     contrast === type
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {type === "normal" && "Normal"}
//                   {type === "high" && "High"}
//                   {type === "invert" && "Invert"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Font Size */}
//           <div>
//             <p className="font-medium text-gray-700 mb-2">Font Size</p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setFontSize("large")}
//                 className={`px-3 py-2 rounded-lg ${
//                   fontSize === "large"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 A+
//               </button>
//               <button
//                 onClick={() => setFontSize("small")}
//                 className={`px-3 py-2 rounded-lg ${
//                   fontSize === "small"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 A-
//               </button>
//               <button
//                 onClick={() => setFontSize("normal")}
//                 className={`px-3 py-2 rounded-lg ${
//                   fontSize === "normal"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 A
//               </button>
//             </div>
//           </div>

//           {/* Toggles */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-700">Highlight Links</span>
//               <Toggle
//                 enabled={highlightLinks}
//                 onChange={() => setHighlightLinks(!highlightLinks)}
//               />
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-700">Text Spacing</span>
//               <Toggle
//                 enabled={textSpacing}
//                 onChange={() => setTextSpacing(!textSpacing)}
//               />
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-700">Line Height</span>
//               <Toggle
//                 enabled={lineHeight}
//                 onChange={() => setLineHeight(!lineHeight)}
//               />
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-700">Hide Images</span>
//               <Toggle
//                 enabled={hideImages}
//                 onChange={() => setHideImages(!hideImages)}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
