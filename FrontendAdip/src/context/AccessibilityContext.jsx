import { createContext, useState, useEffect, useContext } from "react";

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [invertColors, setInvertColors] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [textSpacing, setTextSpacing] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [language, setLanguage] = useState("en");

  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    // Handle high contrast
    highContrast
      ? html.classList.add("contrast-150")
      : html.classList.remove("contrast-150");
    
    // Handle color inversion
    invertColors
      ? html.classList.add("invert-colors")
      : html.classList.remove("invert-colors");
    
    // Handle large text
    largeText
      ? html.classList.add("text-lg")
      : html.classList.remove("text-lg");
    
    // Handle text spacing
    textSpacing
      ? html.classList.add("tracking-wide", "leading-loose")
      : html.classList.remove("tracking-wide", "leading-loose");

    // Handle link highlighting
    document.querySelectorAll("a").forEach((link) => {
      highlightLinks
        ? link.classList.add(
            "bg-yellow-200",
            "underline",
            "px-1",
            "rounded"
          )
        : link.classList.remove(
            "bg-yellow-200",
            "underline",
            "px-1",
            "rounded"
          );
    });

    // Handle image display
    document.querySelectorAll("img").forEach((img) => {
      img.style.display = hideImages ? "none" : "";
    });
  }, [highContrast, invertColors, largeText, textSpacing, highlightLinks, hideImages]);

 
  useEffect(() => {
    const protectImagesFromInversion = () => {
      document.querySelectorAll("img").forEach((img) => {
        if (invertColors) {
          img.classList.add("no-invert");
          
          img.style.filter = "invert(1)";
        } else {
          img.classList.remove("no-invert");
          img.style.filter = "";
        }
      });
      
      // Also protect SVGs
      document.querySelectorAll("svg").forEach((svg) => {
        if (invertColors) {
          svg.classList.add("no-invert");
          svg.style.filter = "invert(1)";
        } else {
          svg.classList.remove("no-invert");
          svg.style.filter = "";
        }
      });
    };

    protectImagesFromInversion();
    

    const timer = setTimeout(protectImagesFromInversion, 100);
    
    return () => clearTimeout(timer);
  }, [invertColors]);

 
  const startReading = () => {
    const text = document.body.innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language === "en" ? "en-IN" : "hi-IN";
    window.speechSynthesis.speak(speech);
    setIsReading(true);

    speech.onend = () => setIsReading(false);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        invertColors,
        highlightLinks,
        largeText,
        textSpacing,
        hideImages,
        language,
        setHighContrast,
        setInvertColors,
        setHighlightLinks,
        setLargeText,
        setTextSpacing,
        setHideImages,
        setLanguage,
        isReading,
        startReading,
        stopReading,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);