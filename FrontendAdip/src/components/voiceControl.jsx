import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VoiceControl() {
  const [text, setText] = useState("");
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
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
        speak("Voice control is active. How can I help you?");
      };

      recognitionInstance.onresult = (event) => {
        const command =
          event.results[event.results.length - 1][0].transcript.trim();
        setText(command);
        setCommandHistory((prev) => [...prev, command]);
        handleCommand(command.toLowerCase());
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

  const handleCommand = useCallback(
    (command) => {
      // Command patterns
      const patterns = {
        name: /^(?:enter|input|set|type)\s+name\s+(.+)$/i,
        email: /^(?:enter|input|set|type)\s+email\s+(.+)$/i,
        password: /^(?:enter|input|set|type)\s+password\s+(.+)$/i,
        stop: /^(?:stop|end|quit|exit)\s+(?:listening|voice|control)$/i,
        scroll: {
          up: /^(?:scroll|go|move)\s+(?:up|back|backward|backwards)$/i,
          down: /^(?:scroll|go|move)\s+(?:down|forward|forwards)$/i,
        },
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

      // Stop command handling
      if (patterns.stop.test(command)) {
        speak("Voice control stopping");
        toggleListening();
        return;
      }

      // Scroll handling
      if (patterns.scroll.up.test(command)) {
        speak("Scrolling up");
        smoothScroll('up');
        return;
      }
      if (patterns.scroll.down.test(command)) {
        speak("Scrolling down");
        smoothScroll('down');
        return;
      }

      // Form handling - now works on any page
      let match;
      if ((match = patterns.name.exec(command))) {
        const name = match[1];
        // Try multiple possible selectors for name input
        const inputSelectors = [
          "input[name='firstName']",
          "input[name='name']",
          "input[placeholder*='name' i]",
          "input[type='text']"
        ];
        const input = inputSelectors.reduce((found, selector) => 
          found || document.querySelector(selector), null);
        
        if (input) {
          input.value = name;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          speak(`Name set to ${name}`);
          return;
        } else {
          speak("Could not find name input field on this page");
          return;
        }
      } else if ((match = patterns.email.exec(command))) {
        const email = match[1]
          .replace(/\s+at\s+/g, "@")
          .replace(/\s+dot\s+/g, ".")
          .toLowerCase();
        // Try multiple possible selectors for email input
        const inputSelectors = [
          "input[name='emailId']",
          "input[name='email']",
          "input[type='email']",
          "input[placeholder*='email' i]"
        ];
        const input = inputSelectors.reduce((found, selector) => 
          found || document.querySelector(selector), null);
        
        if (input) {
          input.value = email;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          speak(`Email set to ${email}`);
          return;
        } else {
          speak("Could not find email input field on this page");
          return;
        }
      } else if ((match = patterns.password.exec(command))) {
        const password = match[1];
        // Try multiple possible selectors for password input
        const inputSelectors = [
          "input[name='password']",
          "input[type='password']",
          "input[placeholder*='password' i]"
        ];
        const input = inputSelectors.reduce((found, selector) => 
          found || document.querySelector(selector), null);
        
        if (input) {
          input.value = password;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          speak("Password has been set");  // For security, don't speak the actual password
          return;
        } else {
          speak("Could not find password input field on this page");
          return;
        }
      }

      // Navigation handling
      for (const [route, pattern] of Object.entries(patterns.navigation)) {
        if (pattern.test(command)) {
          const paths = {
            home: "/",
            apply: "/beneficiary/apply",
            devices: "/devices",
            track: "/application-status",
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

      // Command not recognized
      speak("I didn't understand that command. Please try again.");
    },
    [navigate, location.pathname, speak]
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
              <li>"enter name [your name]"</li>
              <li>"enter email [your.email at gmail dot com]"</li>
              <li>"enter password [your password]"</li>
              <li>"scroll up" or "scroll down"</li>
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






