import { useContext } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { Type, Image, Volume2 } from "lucide-react";

export const AccessibilityPanel = () => {
  const {
    highContrast,
    invertColors,
    highlightLinks,
    largeText,
    textSpacing,
    hideImages,
    isReading,
    setHighContrast,
    setInvertColors,
    setHighlightLinks,
    setLargeText,
    setTextSpacing,
    setHideImages,
    startReading,
    stopReading,
  } = useContext(AccessibilityContext);

  return (
    <div className="space-y-6">
      {/* Contrast Options */}
      <div className="flex items-center justify-between">
        <span className="text-sm">Contrast</span>
        <div className="flex gap-2">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              highContrast ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            High
          </button>
          <button
            onClick={() => setInvertColors(!invertColors)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              invertColors ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Invert
          </button>
        </div>
      </div>

      {/* Font Size */}
      <div className="flex items-center justify-between">
        <span className="text-sm flex items-center gap-1">
          <Type size={16} /> Font Size
        </span>
        <button
          onClick={() => setLargeText(!largeText)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            largeText ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              largeText ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Text Spacing */}
      <div className="flex items-center justify-between">
        <span className="text-sm">Text Spacing</span>
        <button
          onClick={() => setTextSpacing(!textSpacing)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            textSpacing ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              textSpacing ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Highlight Links */}
      <div className="flex items-center justify-between">
        <span className="text-sm">Highlight Links</span>
        <button
          onClick={() => setHighlightLinks(!highlightLinks)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            highlightLinks ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              highlightLinks ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Hide Images */}
      <div className="flex items-center justify-between">
        <span className="text-sm flex items-center gap-1">
          <Image size={16} /> Hide Images
        </span>
        <button
          onClick={() => setHideImages(!hideImages)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            hideImages ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              hideImages ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Screen Reader */}
      <div className="flex items-center justify-between">
        <span className="text-sm flex items-center gap-1">
          <Volume2 size={16} /> Screen Reader
        </span>
        {!isReading ? (
          <button
            onClick={startReading}
            className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopReading}
            className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
