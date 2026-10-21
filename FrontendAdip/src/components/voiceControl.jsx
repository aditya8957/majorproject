import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VoiceControl() {
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const synth = window.speechSynthesis;

  const speak = useCallback(
    (message) => {
      if (synth && !synth.speaking) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        synth.speak(utterance);
      }
    },
    [synth]
  );

  // Check microphone availability
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setIsMicAvailable(true))
      .catch(() => {
        setError("Microphone access denied");
        setIsMicAvailable(false);
      });
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      try {
        recognition?.abort(); // Use abort instead of stop to prevent auto-restart
        setIsListening(false);
        setInterimText("");
        speak("Voice control deactivated");
      } catch (error) {
        console.error("Recognition stop error:", error);
      }
    } else {
      try {
        recognition?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Recognition start error:", error);
        setError("Failed to start voice recognition");
      }
    }
  }, [isListening, recognition, speak]);

  useEffect(() => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported");
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-IN";

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
        setInterimText("");
        speak("Voice control is active. How can I help you?");
      };

      recognitionInstance.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript + " ";
          }
        }

        if (interimTranscript) {
          setInterimText(interimTranscript.trim());
        }

        if (finalTranscript) {
          const command = finalTranscript.trim();
          setText(command);
          setCommandHistory((prev) => [...prev, command]);
          setInterimText("");
          handleCommand(command.toLowerCase());
        }
      };

      recognitionInstance.onerror = (event) => {
        setError(event.error);
        speak(`Error: ${event.error}. Please try again.`);
        if (event.error === "no-speech") {
          recognitionInstance.stop();
          setTimeout(() => recognitionInstance.start(), 1000);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        // Only auto-restart if it was due to an error, not a manual stop
        if (!recognitionInstance.aborted && recognitionInstance.error) {
          try {
            setTimeout(() => recognitionInstance.start(), 1000);
          } catch (e) {
            console.error("Failed to restart recognition:", e);
          }
        }
      };

      setRecognition(recognitionInstance);
    } catch (err) {
      setError(err.message);
      speak("Sorry, voice control is not available in this browser.");
    }

    return () => {
      recognition?.abort();
    };
  }, []);

  // Scroll helper functions
  const smoothScroll = useCallback((direction) => {
    const scrollAmount = window.innerHeight * 0.8; // 80% of viewport height
    const duration = 1000; // 1 second
    const startPosition = window.pageYOffset;
    const distance = direction === 'up' ? -scrollAmount : scrollAmount;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth animation
      const ease = t => t * (2 - t);
      
      window.scrollTo(0, startPosition + (distance * ease(progress)));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }, []);

  const normalizeText = useCallback((value) => {
    return value
      .trim()
      .replace(/\bmy\b/gi, "")
      .replace(/\bplease\b/gi, "")
      .replace(/\bis\b/gi, "")
      .replace(/\bas\b/gi, "")
      .replace(/\bto\b/gi, "")
      .replace(/\bfull\s+name\b/gi, "full name")
      .replace(/\bphone\s+number\b/gi, "phone number")
      .replace(/\bpin\s*code\b/gi, "pin code")
      .replace(/\bpincode\b/gi, "pin code")
      .replace(/\bemail\s+address\b/gi, "email")
      .replace(/\bassistive\s+device\b/gi, "required device")
      .replace(/\bmonthly\s+income\b/gi, "monthly income")
      .replace(/\bdisability\s+type\b/gi, "disability type")
      .replace(/\bdisability\s+percentage\b/gi, "disability percentage")
      .replace(/\bdecleration\b/gi, "declaration")
      .replace(/\bfull\s+address\b/gi, "address")
      .replace(/\bwhat\b/gi, "")
      .replace(/\bthe\b/gi, "")
      .replace(/\bplease\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const titleCase = useCallback((value) => {
    return value
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, []);

  const normalizeNumberValue = useCallback((value) => {
    const wordsToDigits = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
      hundred: 100,
    };

    const cleaned = value
      .replace(/[^a-z0-9\s]/gi, " ")
      .trim()
      .toLowerCase();

    if (/^\d+$/.test(cleaned)) {
      return cleaned;
    }

    const parts = cleaned.split(/\s+/);
    let total = 0;
    let current = 0;

    parts.forEach((part) => {
      if (wordsToDigits[part] !== undefined) {
        const num = wordsToDigits[part];
        if (num === 100) {
          current = current === 0 ? 100 : current * 100;
        } else {
          current += num;
        }
      }
    });

    if (current > 0) {
      total += current;
    }

    return total > 0 ? String(total) : value.replace(/[^0-9]/g, "");
  }, []);

  const fieldLabelMap = useCallback(() => ({
    "full name": "fullName",
    "name": "fullName",
    "age": "age",
    "gender": "gender",
    "phone number": "phone",
    "phone": "phone",
    "mobile number": "phone",
    "mobile": "phone",
    "email": "email",
    "monthly income": "monthlyIncome",
    "income": "monthlyIncome",
    "disability type": "disabilityType",
    "type of disability": "disabilityType",
    "disability percentage": "disabilityPercentage",
    "percentage": "disabilityPercentage",
    "percent": "disabilityPercentage",
    "address": "address",
    "full address": "address",
    "state": "state",
    "pin code": "pinCode",
    "pincode": "pinCode",
    "zip code": "pinCode",
    "zip": "pinCode",
    "required device": "requiredDevice",
    "assistive device": "requiredDevice",
    "device": "requiredDevice",
    "declaration": "declarationAccepted",
  }), []);

  const disabilityTypeMap = useCallback(() => ({
    locomotor: "locomotor",
    visual: "visual",
    hearing: "hearing",
    speech: "speech",
    "speech & language": "speech",
    intellectual: "intellectual",
    learning: "learning",
    autism: "autism",
    "mental illness": "mental_illness",
    "mental": "mental_illness",
    neurological: "neurological",
    "blood disorder": "blood_disorder",
    chronic: "chronic_illness",
    other: "other",
  }), []);

  const deviceTypeMap = useCallback(() => ({
    wheelchair: "wheelchair",
    "wheel chair": "wheelchair",
    crutches: "crutches",
    prosthetic: "prosthetic",
    "prosthetic limb": "prosthetic",
    "walking stick": "walking_stick",
    cane: "walking_stick",
    "hearing aid": "hearing_aid",
    "cochlear implant": "cochlear_implant",
    "braille kit": "braille_kit",
    "screen reader": "screen_reader",
    "speech device": "speech_device",
    "communication board": "communication_board",
    "therapy tools": "therapy_tools",
    "assistive software": "assistive_software",
    other: "other",
  }), []);

  const stateValueMap = useCallback(() => ({
    "andhra pradesh": "andhrapradesh",
    "arunachal pradesh": "arunachalpradesh",
    assam: "assam",
    bihar: "bihar",
    "chhattisgarh": "chhattisgarh",
    delhi: "delhi",
    goa: "goa",
    gujarat: "gujarat",
    haryana: "haryana",
    "himachal pradesh": "himachalpradesh",
    jharkhand: "jharkhand",
    karnataka: "karnataka",
    kerala: "kerala",
    "madhya pradesh": "madhyapradesh",
    maharashtra: "maharashtra",
    manipur: "manipur",
    meghalaya: "meghalaya",
    mizoram: "mizoram",
    nagaland: "nagaland",
    odisha: "odisha",
    punjab: "punjab",
    rajasthan: "rajasthan",
    sikkim: "sikkim",
    "tamil nadu": "tamilnadu",
    telangana: "telangana",
    tripura: "tripura",
    "uttar pradesh": "uttarpradesh",
    uttarakhand: "uttarakhand",
    "west bengal": "westbengal",
    "andaman and nicobar islands": "andamanandnicobarislands",
    chandigarh: "chandigarh",
    "dadra and nagar haveli and daman and diu": "dadranagarlivelashrimadamandiu",
    "jammu and kashmir": "jammuandkashmir",
    ladakh: "ladakh",
    lakshadweep: "lakshadweep",
    puducherry: "puducherry",
  }), []);

  const getFieldNameFromLabel = useCallback((label) => {
    const normalizedLabel = label.trim().toLowerCase();
    const map = fieldLabelMap();
    return map[normalizedLabel] || null;
  }, [fieldLabelMap]);

  const parseFieldCommand = useCallback((command) => {
    const map = fieldLabelMap();
    const labels = Object.keys(map).sort((a, b) => b.length - a.length);

    for (const label of labels) {
      const escapedLabel = label.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`^(?:(?:enter|type|set|fill|select|choose)\\s+)?${escapedLabel}\\s+(.+)$`, "i");
      const match = command.match(regex);
      if (match) {
        return {
          fieldName: map[label],
          label,
          rawValue: match[1].trim(),
        };
      }
    }
    return null;
  }, [fieldLabelMap]);

  // Helper function to set form field value
  const setFieldValue = useCallback((fieldName, value, fieldType = "text") => {
    const fieldSelectors = {
      fullName: ["input[name='fullName']"],
      age: ["input[name='age']"],
      gender: ["select[name='gender']"],
      phone: ["input[name='phone']"],
      email: ["input[name='email']"],
      monthlyIncome: ["input[name='monthlyIncome']"],
      disabilityType: ["select[name='disabilityType']"],
      disabilityPercentage: ["input[name='disabilityPercentage']"],
      address: ["textarea[name='address']"],
      state: ["select[name='state']"],
      pinCode: ["input[name='pinCode']"],
      requiredDevice: ["select[name='requiredDevice']"],
    };

    const selectors = fieldSelectors[fieldName] || [];
    const input = selectors.reduce((found, selector) => 
      found || document.querySelector(selector), null);

    if (input) {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    return false;
  }, []);

  const normalizeFieldValue = useCallback((fieldName, rawValue) => {
    const value = rawValue.trim();

    if (fieldName === "fullName") {
      return titleCase(value.replace(/\s+/g, " "));
    }

    if (fieldName === "email") {
      return value
        .replace(/\s+at\s+/gi, "@")
        .replace(/\s+dot\s+/gi, ".")
        .replace(/\s+/g, "")
        .toLowerCase();
    }

    if (fieldName === "phone") {
      return value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    if (fieldName === "age" || fieldName === "disabilityPercentage" || fieldName === "pinCode" || fieldName === "monthlyIncome") {
      return normalizeNumberValue(value);
    }

    if (fieldName === "gender") {
      const normalized = value.toLowerCase();
      if (/\bfemale\b/.test(normalized)) return "female";
      if (/\bmale\b/.test(normalized)) return "male";
      if (/\bother\b/.test(normalized)) return "other";
      return normalized;
    }

    if (fieldName === "disabilityType") {
      const map = disabilityTypeMap();
      const normalized = value.toLowerCase().replace(/[^a-z\s&]/g, "").trim();
      return map[normalized] || normalized;
    }

    if (fieldName === "requiredDevice") {
      const map = deviceTypeMap();
      const normalized = value.toLowerCase().replace(/[^a-z\s]/g, " ").trim();
      return map[normalized] || normalized.replace(/\s+/g, "_");
    }

    if (fieldName === "state") {
      const map = stateValueMap();
      const normalized = value.toLowerCase().replace(/[^a-z\s]/g, " ").trim();
      return map[normalized] || normalized.replace(/\s+/g, "");
    }

    if (fieldName === "address") {
      return titleCase(value);
    }

    return value;
  }, [disabilityTypeMap, deviceTypeMap, normalizeNumberValue, stateValueMap, titleCase]);

  // Helper function to clear a specific field
  const clearField = useCallback((fieldName) => {
    return setFieldValue(fieldName, "");
  }, [setFieldValue]);

  // Helper function to clear all form fields
  const clearAllFields = useCallback(() => {
    const fieldNames = [
      "fullName", "age", "gender", "phone", "email", 
      "monthlyIncome", "disabilityType", "disabilityPercentage", 
      "address", "state", "pinCode", "requiredDevice"
    ];
    fieldNames.forEach(fieldName => clearField(fieldName));
    
    // Clear checkbox
    const checkbox = document.querySelector("input[name='declarationAccepted']");
    if (checkbox) {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, [clearField]);

  // Helper function to accept declaration
  const acceptDeclaration = useCallback(() => {
    const checkbox = document.querySelector("input[name='declarationAccepted']");
    if (checkbox) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    return false;
  }, []);

  // Helper function to submit form
  const submitForm = useCallback(() => {
    const submitButton = document.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.click();
      return true;
    }
    return false;
  }, []);

  const handleCommand = useCallback(
    (rawCommand) => {
      const command = normalizeText(rawCommand);

      const patterns = {
        stop: /^(?:stop|end|quit|exit)\s+(?:listening|voice|control)$/i,
        scrollUp: /^(?:scroll|go|move)\s+(?:up|back|backward|backwards)$/i,
        scrollDown: /^(?:scroll|go|move)\s+(?:down|forward|forwards)$/i,
        clearAll: /^(?:clear|delete|remove)\s+(?:all|everything|form)$/i,
        clearField: /^(?:clear|delete|remove)\s+(.+?)(?:\s+field)?$/i,
        acceptDeclaration: /^(?:accept|check|confirm)\s+(?:declaration|form|terms)$/i,
        submitForm: /^(?:submit|submit\s+(?:form|application))$/i,
        navigation: {
          home: /\b(?:go\s+to\s+)?home\b/i,
          apply: /\b(?:go\s+to\s+)?apply\b/i,
          devices: /\b(?:go\s+to\s+)?devices?\b/i,
          track: /\b(?:go\s+to\s+)?(?:track|status)\b/i,
          eligibility: /\b(?:go\s+to\s+)?(?:check\s+)?eligibility\b/i,
          dashboard: /\b(?:go\s+to\s+)?dashboard\b/i,
          help: /\b(?:go\s+to\s+)?help\b/i,
          contact: /\b(?:go\s+to\s+)?contact\b/i,
          login: /\b(?:go\s+to\s+)?log\s*in\b/i,
          signup: /\b(?:go\s+to\s+)?sign\s*up\b/i,
        },
      };

      if (patterns.stop.test(command)) {
        speak("Voice control stopping");
        toggleListening();
        return;
      }

      if (patterns.scrollUp.test(command)) {
        speak("Scrolling up");
        smoothScroll('up');
        return;
      }
      if (patterns.scrollDown.test(command)) {
        speak("Scrolling down");
        smoothScroll('down');
        return;
      }

      if (patterns.clearAll.test(command)) {
        clearAllFields();
        speak("All fields cleared");
        return;
      }

      let match;
      if ((match = patterns.clearField.exec(command))) {
        const label = match[1].trim();
        const fieldName = getFieldNameFromLabel(label);
        if (fieldName && clearField(fieldName)) {
          speak(`${titleCase(label)} field cleared`);
          return;
        }
        speak(`Could not find ${label} field`);
        return;
      }

      if (patterns.acceptDeclaration.test(command)) {
        if (acceptDeclaration()) {
          speak("Declaration accepted");
        } else {
          speak("Could not find declaration checkbox");
        }
        return;
      }

      if (patterns.submitForm.test(command)) {
        if (submitForm()) {
          speak("Submitting application");
        } else {
          speak("Could not find submit button");
        }
        return;
      }

      if (/^(?:click\s+)?(?:choose|select)\s+(?:file|disability\s+certificate|certificate)$/i.test(command) || /\b(?:choose|select|upload).*file\b/i.test(command) || /\bfile.*(?:choose|select|upload)\b/i.test(command)) {
        const fileInput = document.querySelector("input[type='file'][name='disabilityCertificate']");
        if (fileInput) {
          fileInput.click();
          speak("File chooser opened");
          return;
        }
        speak("Could not find file chooser");
        return;
      }

      const parsedField = parseFieldCommand(command);
      if (parsedField) {
        const { fieldName, label, rawValue } = parsedField;

        if (fieldName === "declarationAccepted") {
          if (acceptDeclaration()) {
            speak("Declaration accepted");
            return;
          }
        }

        const normalizedValue = normalizeFieldValue(fieldName, rawValue);
        if (setFieldValue(fieldName, normalizedValue)) {
          const spokenValue = fieldName === "fullName" ? normalizedValue : rawValue;
          speak(`${titleCase(label)} set to ${spokenValue}`);
          return;
        }
      }

      const fieldNameByLabel = getFieldNameFromLabel(command);
      if (fieldNameByLabel === "declarationAccepted" && acceptDeclaration()) {
        speak("Declaration accepted");
        return;
      }

      const fallbackAge = /^(?:enter|type|set|fill)\s*(?:is\s*)?(\d+)$/i.exec(command);
      if (fallbackAge) {
        const age = normalizeNumberValue(fallbackAge[1]);
        if (setFieldValue("age", age)) {
          speak(`Age set to ${age}`);
          return;
        }
      }

      for (const [route, pattern] of Object.entries(patterns.navigation)) {
        if (pattern.test(command)) {
          const paths = {
            home: "/",
            apply: "/beneficiary/apply",
            devices: "/devices",
            track: "/application/status",
            eligibility: "/eligibility-checker",
            dashboard: "/dashboard",
            help: "/help",
            contact: "/contact",
            login: "/auth/login",
            signup: "/auth/signup",
          };
          navigate(paths[route]);
          speak(`Navigating to ${route} page`);
          return;
        }
      }

      speak("I didn't understand that command. Please try again.");
    },
    [navigate, location.pathname, speak, setFieldValue, clearField, clearAllFields, acceptDeclaration, submitForm, normalizeText, getFieldNameFromLabel, normalizeFieldValue, normalizeNumberValue, titleCase, smoothScroll, toggleListening]
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: isExpanded ? "20px" : "10px",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        zIndex: 9999,
        width: isExpanded ? "280px" : "auto",
        border: "1px solid #ddd",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer"
      }}
      onClick={(e) => {
        // Don't toggle expansion when clicking the mic button
        if (!e.target.closest('button')) {
          setIsExpanded(!isExpanded);
        }
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent expansion toggle
          toggleListening();
        }}
        disabled={!isMicAvailable}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "none",
          background: isListening ? "#ff4444" : "#4CAF50",
          cursor: isMicAvailable ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transform: isListening ? "scale(1.1)" : "scale(1)",
        }}
        title={isMicAvailable ? "Toggle voice control" : "Microphone access denied"}
      >
        <svg viewBox="0 0 24 24" width="25" height="25" fill="white">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </button>

      {isExpanded && (
        <>
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{
              margin: "5px 0",
              color: isListening ? "#4CAF50" : "#666",
              fontWeight: "bold",
              fontSize: "1.1em"
            }}>
              {isListening ? "Listening..." : "Click mic to start"}
            </p>
            {error && (
              <p style={{
                color: "#ff4444",
                margin: "5px 0",
                fontSize: "0.9em",
                fontWeight: "500"
              }}>
                {error}
              </p>
            )}
            {interimText && (
              <p style={{
                margin: "5px 0",
                fontSize: "0.9em",
                background: "#e8f4ff",
                padding: "8px",
                borderRadius: "5px",
                color: "#0177cc",
                fontStyle: "italic"
              }}>
                Listening: {interimText}
              </p>
            )}
            {text && (
              <p style={{
                margin: "5px 0",
                fontSize: "0.9em",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "5px"
              }}>
                Last command: {text}
              </p>
            )}
          </div>

          <div style={{
            fontSize: "0.9em",
            color: "#444",
            marginTop: "10px",
            textAlign: "left",
            width: "100%",
            background: "#f9f9f9",
            padding: "10px",
            borderRadius: "8px"
          }}>
            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Available Commands:</p>
            <ul style={{
              margin: "5px 0",
              paddingLeft: "20px",
              lineHeight: "1.4"
            }}>
              <li>"go to [home/devices/login/etc]"</li>
              <li>"name [your name]"</li>
              <li>"email [your.email at gmail dot com]"</li>
              <li>"password [your password]"</li>
              <li>"age [number]"</li>
              <li>"gender [male/female/other]"</li>
              <li>"phone number [10 digits]"</li>
              <li>"monthly income [amount]"</li>
              <li>"disability type [type]"</li>
              <li>"disability percentage [percent]"</li>
              <li>"address [your address]"</li>
              <li>"state [state name]"</li>
              <li>"pin code [code]"</li>
              <li>"required device [device type]"</li>
              <li>"choose file" or "click choose file"</li>
              <li>"accept declaration"</li>
              <li>"submit application"</li>
              <li>"clear [field name]"</li>
              <li>"clear all"</li>
              <li>"stop voice control" or "stop listening"</li>
            </ul>
          </div>
        </>
      )}
      
      {!isExpanded && isListening && (
        <div style={{
          position: "absolute",
          top: "-25px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#4CAF50",
          color: "white",
          padding: "3px 10px",
          borderRadius: "10px",
          fontSize: "0.8em",
          whiteSpace: "nowrap"
        }}>
          Listening...
        </div>
      )}
    </div>
  );
}






