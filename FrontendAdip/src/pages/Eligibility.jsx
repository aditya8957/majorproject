import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export function Eligibility() {
  const { language } = useAccessibility();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {language === 'en' ? 'Eligibility Check' : 'पात्रता जांच'}
        </h1>
        <p className="text-gray-600">
          {language === 'en'
            ? 'This page is under construction. Please check back later for the eligibility checker.'
            : 'यह पृष्ठ निर्माणाधीन है। पात्रता चेकर के लिए कृपया बाद में वापस देखें।'}
        </p>
      </div>
    </div>
  );
}
