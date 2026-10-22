import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice"; // adjust path if needed
import { useTheme } from "../context/ThemeContext"; // adjust path if needed
import { useAccessibility } from "../context/AccessibilityContext"; // adjust path if needed

const FIELD_SELECTORS = {
  fullName: "input[name='fullName']",
  dateOfBirth: "input[name='dateOfBirth']",
  gender: "select[name='gender']",
  phone: "input[name='phone']",
  email: "input[name='email']",
  monthlyIncome: "input[name='monthlyIncome']",
  disabilityType: "select[name='disabilityType']",
  disabilityPercentage: "input[name='disabilityPercentage']",
  address: "textarea[name='address']",
  state: "select[name='state']",
  pinCode: "input[name='pinCode']",
  requiredDevice: "select[name='requiredDevice']",
};

const FIELD_LABELS = {
  fullName: "Full name",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  phone: "Phone number",
  email: "Email",
  monthlyIncome: "Monthly income",
  disabilityType: "Disability type",
  disabilityPercentage: "Disability percentage",
  address: "Address",
  state: "State",
  pinCode: "Pin code",
  requiredDevice: "Required device",
  declarationAccepted: "Declaration",
  disabilityCertificate: "Disability certificate",
};

const FIELD_ALIASES = {
  fullName: ["full name", "name"],
  dateOfBirth: ["date of birth", "birth date", "birthday", "dob"],
  gender: ["gender", "sex"],
  phone: ["phone number", "phone", "mobile number", "mobile", "contact number"],
  email: ["email address", "email id", "email", "e-mail"],
  monthlyIncome: ["monthly income", "income", "salary"],
  disabilityType: ["type of disability", "disability type", "disability"],
  disabilityPercentage: ["disability percentage", "disability percent", "percentage", "percent"],
  address: ["full address", "address"],
  state: ["state"],
  pinCode: ["pin code", "pincode", "zip code", "postal code", "pin", "zip"],
  requiredDevice: ["required assistive device", "required device", "assistive device", "device"],
  declarationAccepted: ["declaration"],
};

// longest alias first so "disability percentage" wins over "disability"
const ALIAS_LIST = Object.entries(FIELD_ALIASES)
  .flatMap(([field, list]) => list.map((alias) => [alias, field]))
  .sort((a, b) => b[0].length - a[0].length);

const ALIAS_LOOKUP = Object.fromEntries(ALIAS_LIST);

// Every page reachable from the Navbar
const NAV_ROUTES = [
  // Main tabs
  { re: /^(home|homepage|main|main page)$/, path: "/", name: "home" },
  { re: /^(apply|apply now|apply for benefits|application form|registration|beneficiary registration)$/, path: "/beneficiary/apply", name: "apply" },
  { re: /^(devices?|assistive devices?)$/, path: "/devices", name: "devices" },
  { re: /^(track|track application|track status|status|application status)$/, path: "/application/status", name: "track" },
  { re: /^(assist ?ai|assist a i|assistant ai|ai assistant|assistive ai|assist)$/, path: "/assistAi", name: "assist AI" },

  // "More" menu
  { re: /^(help|faqs?|help and faqs?|help faqs?|support)$/, path: "/help", name: "help" },
  { re: /^(contact|contact us)$/, path: "/contact", name: "contact" },
  { re: /^(about|about us)$/, path: "/about", name: "about" },
  { re: /^(eligibility|eligibility checker|check eligibility)$/, path: "/eligibility-checker", name: "eligibility" },

  // User menu (login required)
  { re: /^profile$/, path: "/profile", name: "profile", auth: true },
  { re: /^settings?$/, path: "/settings", name: "settings", auth: true },
  { re: /^applications?$/, path: "/profile/applications", name: "applications", auth: true },
  { re: /^(admin|admin dashboard)$/, path: "/admin", name: "admin dashboard", auth: true, role: "admin" },
  {
    re: /^(ngo|ngo dashboard|ngo registration|ngo register|register ngo)$/,
    path: (u) => (u?.role === "ngo" ? "/ngo/dashboard" : "/ngo/register"),
    name: "NGO",
    auth: true,
  },

  // Auth
  { re: /^(log ?in|sign in|login or sign ?up|login sign ?up)$/, path: "/auth/login", name: "login" },
  { re: /^(sign ?up|create account|register)$/, path: "/auth/signup", name: "sign up" },
];

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

const escapeRegex = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

const titleCase = (value) =>
  value
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const SMALL_NUMBERS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};

// "15,000" | "fifteen thousand" | "2 lakh" | "forty percent" -> number
const parseSpokenNumber = (text) => {
  const tokens = text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/-/g, " ")
    .replace(/[^a-z0-9.\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let total = 0;
  let current = 0;
  let found = false;

  for (const tk of tokens) {
    if (/^\d+(\.\d+)?$/.test(tk)) {
      current += parseFloat(tk);
      found = true;
    } else if (SMALL_NUMBERS[tk] !== undefined) {
      current += SMALL_NUMBERS[tk];
      found = true;
    } else if (tk === "hundred") {
      current = (current || 1) * 100;
      found = true;
    } else if (tk === "thousand" || tk === "k") {
      total += (current || 1) * 1000;
      current = 0;
      found = true;
    } else if (tk === "lakh" || tk === "lakhs" || tk === "lac") {
      total += (current || 1) * 100000;
      current = 0;
      found = true;
    } else if (tk === "crore" || tk === "crores") {
      total += (current || 1) * 10000000;
      current = 0;
      found = true;
    }
  }
  return found ? total + current : null;
};

const DIGIT_WORDS = {
  zero: "0", oh: "0", o: "0", one: "1", two: "2", to: "2", too: "2",
  three: "3", four: "4", for: "4", five: "5", six: "6", seven: "7",
  eight: "8", ate: "8", nine: "9",
};

// "9 8 7 6 five double two" -> "98765 22"
const spokenToDigits = (text) => {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  let out = "";
  let repeat = 1;
  for (const tk of tokens) {
    if (tk === "double") { repeat = 2; continue; }
    if (tk === "triple") { repeat = 3; continue; }
    let d = null;
    if (/^\d+$/.test(tk)) d = tk;
    else if (DIGIT_WORDS[tk] !== undefined) d = DIGIT_WORDS[tk];
    if (d !== null) out += d.repeat(repeat);
    repeat = 1;
  }
  return out;
};

const MONTHS = {
  january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4,
  may: 5, june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8,
  september: 9, sep: 9, sept: 9, october: 10, oct: 10, november: 11, nov: 11,
  december: 12, dec: 12,
};

// returns "YYYY-MM-DD" or null
const parseSpokenDate = (text) => {
  const t = text
    .toLowerCase()
    .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
    .replace(/\bof\b/g, " ")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  let y, mo, d, m;

  if ((m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) {
    [y, mo, d] = [m[1], m[2], m[3]];
  } else if ((m = t.match(/^(\d{1,2})[-/.\s](\d{1,2})[-/.\s](\d{4})$/))) {
    [d, mo, y] = [m[1], m[2], m[3]]; // Indian format DD/MM/YYYY
  } else if ((m = t.match(/^(\d{1,2}) ([a-z]+) (\d{4})$/)) && MONTHS[m[2]]) {
    [d, mo, y] = [m[1], MONTHS[m[2]], m[3]];
  } else if ((m = t.match(/^([a-z]+) (\d{1,2}) (\d{4})$/)) && MONTHS[m[1]]) {
    [mo, d, y] = [MONTHS[m[1]], m[2], m[3]];
  } else {
    return null;
  }

  y = Number(y); mo = Number(mo); d = Number(d);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) {
    return null;
  }
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

const normalizeEmail = (value) =>
  value
    .toLowerCase()
    .replace(/\s+at\s+the\s+rate(?:\s+of)?\s+/g, "@")
    .replace(/\s+at\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/\s*underscore\s*/g, "_")
    .replace(/\s*(?:dash|hyphen)\s*/g, "-")
    .replace(/\s+/g, "");

const normText = (s) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const squash = (s) => normText(s).replace(/\s/g, "");
const STOP_TOKENS = new Set(["and", "the", "for", "of", "disability", "device"]);
const tokensOf = (s) => normText(s).split(" ").filter((w) => w.length > 2 && !STOP_TOKENS.has(w));

// Find the <option> that best matches what the user said
const findBestOption = (select, spoken) => {
  const spokenSquash = squash(spoken);
  const spokenTokens = tokensOf(spoken);
  if (!spokenSquash) return null;

  let best = null;
  let bestScore = 0;

  Array.from(select.options).forEach((opt) => {
    if (!opt.value) return;
    let score = 0;
    for (const candidate of [opt.text, opt.value]) {
      const c = squash(candidate);
      if (!c) continue;
      if (c === spokenSquash) score = Math.max(score, 3);
      else if (c.includes(spokenSquash) || spokenSquash.includes(c)) score = Math.max(score, 2);
      else {
        const shared = tokensOf(candidate).filter((t) => spokenTokens.includes(t)).length;
        if (shared > 0) score = Math.max(score, 1);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  });

  return best;
};

// Works with React controlled inputs
const setNativeValue = (el, value) => {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value")?.set;
  if (!setter) return false;
  setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
};

const focusEl = (el) => {
  try {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  } catch (_) {
    /* ignore */
  }
};

const setCheckbox = (checked) => {
  const cb = document.querySelector("input[name='declarationAccepted']");
  if (!cb) return false;
  if (cb.checked !== checked) cb.click(); // click() so React's onChange fires
  focusEl(cb);
  return true;
};

// Fill one field. Returns { ok, spoken } or { ok:false, message }
const fillField = (fieldName, rawValue) => {
  const el = document.querySelector(FIELD_SELECTORS[fieldName]);
  if (!el) return { ok: false, message: `Could not find ${FIELD_LABELS[fieldName]} field on this page` };

  const raw = rawValue.trim();
  let value;
  let spoken = raw;

  switch (fieldName) {
    case "fullName":
    case "address":
      value = titleCase(raw);
      spoken = value;
      break;

    case "email":
      value = normalizeEmail(raw);
      spoken = value;
      break;

    case "phone": {
      let digits = spokenToDigits(raw);
      if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
      value = digits.slice(0, 10);
      if (!value) return { ok: false, message: "I could not hear the phone number digits" };
      spoken = value.split("").join(" ");
      break;
    }

    case "pinCode":
      value = spokenToDigits(raw).slice(0, 6);
      if (!value) return { ok: false, message: "I could not hear the pin code digits" };
      spoken = value.split("").join(" ");
      break;

    case "monthlyIncome":
    case "disabilityPercentage": {
      const n = parseSpokenNumber(raw);
      if (n === null) return { ok: false, message: "I could not understand the number" };
      value = String(Math.round(n));
      spoken = value;
      break;
    }

    case "dateOfBirth": {
      const iso = parseSpokenDate(raw);
      if (!iso) {
        return { ok: false, message: "Please say the date like 15 August 1998 or 15 slash 08 slash 1998" };
      }
      value = iso;
      spoken = raw;
      break;
    }

    case "gender":
    case "disabilityType":
    case "state":
    case "requiredDevice": {
      const opt = findBestOption(el, raw);
      if (!opt) return { ok: false, message: `I could not find ${raw} in ${FIELD_LABELS[fieldName]}` };
      value = opt.value;
      spoken = opt.text;
      break;
    }

    default:
      value = raw;
  }

  if (!setNativeValue(el, value)) return { ok: false, message: "Could not set the value" };
  focusEl(el);
  return { ok: true, spoken };
};

const clearField = (fieldName) => {
  if (fieldName === "declarationAccepted") return setCheckbox(false);
  const el = document.querySelector(FIELD_SELECTORS[fieldName]);
  if (!el) return false;
  return setNativeValue(el, "");
};

const parseFieldCommand = (cmd) => {
  for (const [alias, fieldName] of ALIAS_LIST) {
    const aliasRe = alias.split(/\s+/).map(escapeRegex).join("\\s+");
    const re = new RegExp(
      `^(?:please\\s+)?(?:(?:enter|type|set|fill|select|choose|put|write)\\s+)?(?:my\\s+|the\\s+)?${aliasRe}(?:\\s+(?:is|are|to|as|equals|equal to))?\\s+(.+)$`,
      "i"
    );
    const m = cmd.match(re);
    if (m) return { fieldName, rawValue: m[1].trim() };
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function VoiceControl() {
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { toggleTheme } = useTheme();
  const { language, setLanguage } = useAccessibility();

  const recognitionRef = useRef(null);
  const wantListeningRef = useRef(false);
  const speakingRef = useRef(false);
  const lastSpeakEndRef = useRef(0);
  const handleCommandRef = useRef(() => {});

  /* ---------- speech output ---------- */
  const speak = useCallback((message) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;

    speakingRef.current = true;
    const done = () => {
      speakingRef.current = false;
      lastSpeakEndRef.current = Date.now();
    };
    utterance.onend = done;
    utterance.onerror = done;
    synth.speak(utterance);
    // safety net in case onend never fires
    setTimeout(done, Math.max(2000, message.length * 90 + 1000));
  }, []);

  /* ---------- recognition setup ---------- */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported. Please use Chrome or Edge.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          // ignore what the mic picked up from our own speech output
          if (speakingRef.current || Date.now() - lastSpeakEndRef.current < 600) continue;
          const command = transcript.trim();
          if (!command) continue;
          setText(command);
          handleCommandRef.current(command);
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim.trim());
    };

    rec.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        wantListeningRef.current = false;
        setError("Microphone permission denied. Allow it in your browser settings.");
        return;
      }
      setError(event.error);
    };

    rec.onend = () => {
      setIsListening(false);
      setInterimText("");
      // Chrome ends continuous sessions after silence; restart if the user hasn't stopped
      if (wantListeningRef.current) {
        setTimeout(() => {
          if (wantListeningRef.current) {
            try {
              rec.start();
            } catch (_) {
              /* already started */
            }
          }
        }, 300);
      }
    };

    recognitionRef.current = rec;

    return () => {
      wantListeningRef.current = false;
      rec.onend = null;
      try {
        rec.abort();
      } catch (_) {
        /* ignore */
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (wantListeningRef.current) {
      wantListeningRef.current = false;
      try {
        rec.abort();
      } catch (_) {
        /* ignore */
      }
      setIsListening(false);
      setInterimText("");
      speak("Voice control deactivated");
    } else {
      wantListeningRef.current = true;
      try {
        rec.start();
        speak("Voice control is active. How can I help you?");
      } catch (e) {
        console.error("Recognition start error:", e);
        setError("Failed to start voice recognition");
        wantListeningRef.current = false;
      }
    }
  }, [speak]);

  /* ---------- scrolling ---------- */
  const smoothScroll = (direction) => {
    const amount = window.innerHeight * 0.8;
    const start = window.pageYOffset;
    const distance = direction === "up" ? -amount : amount;
    const duration = 600;
    let startTime = null;

    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, start + distance * (progress * (2 - progress)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- submit ---------- */
  const submitForm = () => {
    const form = document.querySelector("form");
    if (!form) {
      speak("Could not find a form on this page");
      return;
    }

    if (!form.checkValidity()) {
      const invalid = form.querySelector(":invalid");
      const label = invalid ? FIELD_LABELS[invalid.name] || invalid.name || "a field" : "a field";
      form.reportValidity(); // shows the browser message and focuses the field
      if (invalid?.type === "file") {
        speak("Please choose the disability certificate file manually, then say submit again");
      } else {
        speak(`Cannot submit. ${label} is missing or invalid`);
      }
      return;
    }

    speak("Submitting application");
    form.requestSubmit();
  };

  /* ---------- command router ---------- */
  const handleCommand = (rawCommand) => {
    const cmd = rawCommand
      .toLowerCase()
      .replace(/[.,!?]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // stop
    if (/^(?:stop|end|quit|exit|turn off)(?:\s+(?:listening|voice(?:\s+control)?|control))?$/.test(cmd)) {
      toggleListening();
      return;
    }

    // scroll / back
    if (/^(?:scroll|move|go)\s+(?:up|upward|upwards)$/.test(cmd)) { speak("Scrolling up"); smoothScroll("up"); return; }
    if (/^(?:scroll|move|go)\s+(?:down|downward|downwards)$/.test(cmd)) { speak("Scrolling down"); smoothScroll("down"); return; }
    if (/^scroll\s+(?:to\s+)?(?:the\s+)?top$/.test(cmd)) { window.scrollTo({ top: 0, behavior: "smooth" }); speak("Scrolling to top"); return; }
    if (/^scroll\s+(?:to\s+)?(?:the\s+)?bottom$/.test(cmd)) { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); speak("Scrolling to bottom"); return; }
    if (/^go back$/.test(cmd)) { speak("Going back"); navigate(-1); return; }

    // clear all
    if (/^(?:clear|delete|remove|erase|reset)\s+(?:all|everything|all fields|(?:the\s+)?form)$/.test(cmd)) {
      Object.keys(FIELD_SELECTORS).forEach(clearField);
      setCheckbox(false);
      speak("All fields cleared");
      return;
    }

    // clear one field
    let m = cmd.match(/^(?:clear|delete|remove|erase|reset)\s+(?:the\s+)?(.+?)(?:\s+field)?$/);
    if (m) {
      const fieldName = ALIAS_LOOKUP[m[1].trim()];
      if (fieldName && clearField(fieldName)) speak(`${titleCase(m[1])} cleared`);
      else speak(`Could not find ${m[1]} field`);
      return;
    }

    // declaration
    if (/\b(?:accept|agree|check|tick|confirm)\b.*\b(?:declaration|terms)\b/.test(cmd) || /^(?:i\s+)?(?:accept|agree)$/.test(cmd)) {
      speak(setCheckbox(true) ? "Declaration accepted" : "Could not find declaration checkbox");
      return;
    }

    // submit
    if (/^(?:please\s+)?(?:click\s+)?(?:submit|send)(?:\s+(?:the\s+)?(?:form|application|it))?$/.test(cmd)) {
      submitForm();
      return;
    }

    // file chooser (browsers block opening it by voice)
    if (/\b(?:choose|select|upload|attach|add)\b.*\b(?:file|certificate|pdf)\b/.test(cmd)) {
      const fileInput = document.querySelector("input[type='file']");
      if (fileInput) {
        focusEl(fileInput);
        speak("I moved to the file field. Browsers do not allow voice to open the file picker, so press Enter or Space to choose your PDF");
      } else {
        speak("Could not find a file upload on this page");
      }
      return;
    }

    // logout
    if (/^(?:log ?out|sign out)$/.test(cmd)) {
      if (!isAuthenticated) { speak("You are not logged in"); return; }
      dispatch(logoutUser());
      navigate("/");
      speak("Logged out");
      return;
    }

    // theme
    if (/^(?:toggle|switch|change)\s+(?:the\s+)?(?:theme|mode)$|^(?:dark|night|light|day)\s+mode$/.test(cmd)) {
      toggleTheme();
      speak("Theme changed");
      return;
    }

    // language
    if (/^(?:switch|change)\s+(?:the\s+)?language$|^(?:switch\s+to\s+|speak\s+)?(?:hindi|english)$/.test(cmd)) {
      const next = /hindi/.test(cmd) ? "hi" : /english/.test(cmd) ? "en" : language === "en" ? "hi" : "en";
      setLanguage(next);
      speak(next === "hi" ? "Language changed to Hindi" : "Language changed to English");
      return;
    }

    // accessibility panel
    if (/^(?:open|show|toggle)\s+(?:the\s+)?accessibility(?:\s+(?:panel|options|tools|menu))?$/.test(cmd)) {
      const btn =
        document.querySelector("button[title='Accessibility Options']") ||
        Array.from(document.querySelectorAll("button")).find((b) => /accessibility|सुगम्यता/i.test(b.textContent));
      if (btn) { btn.click(); speak("Accessibility options"); }
      else speak("Could not find accessibility button");
      return;
    }

    // "<field> <value>"
    const parsed = parseFieldCommand(cmd);
    if (parsed) {
      const { fieldName, rawValue } = parsed;

      if (fieldName === "declarationAccepted") {
        speak(setCheckbox(true) ? "Declaration accepted" : "Could not find declaration checkbox");
        return;
      }

      const result = fillField(fieldName, rawValue);
      speak(result.ok ? `${FIELD_LABELS[fieldName]} set to ${result.spoken}` : result.message);
      return;
    }

    // navigation (all navbar pages)
    const dest = cmd
      .replace(/^(?:please\s+)?(?:go|navigate|open|take me|move|switch|show)\s+(?:to\s+)?/, "")
      .replace(/\b(?:the|my)\b/g, " ")
      .replace(/\b(?:page|tab|section|menu)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const route = NAV_ROUTES.find((r) => r.re.test(dest));
    if (route) {
      if (route.auth && !isAuthenticated) {
        speak("Please login first");
        navigate("/auth/login");
        return;
      }
      if (route.role && user?.role !== route.role) {
        speak(`Only ${route.role} users can open the ${route.name} page`);
        return;
      }
      const path = typeof route.path === "function" ? route.path(user) : route.path;
      speak(`Opening ${route.name}`);
      navigate(path);
      return;
    }

    speak("I didn't understand that command. Please try again.");
  };

  // always point the recognizer at the latest handler (fixes stale state)
  handleCommandRef.current = handleCommand;

  /* ---------- UI ---------- */
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
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #ddd",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
      onClick={(e) => {
        if (!e.target.closest("button")) setIsExpanded((v) => !v);
      }}
    >
      <button
        type="button"
        aria-label={isListening ? "Stop voice control" : "Start voice control"}
        onClick={(e) => {
          e.stopPropagation();
          toggleListening();
        }}
        disabled={!isSupported}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "none",
          background: isListening ? "#ff4444" : "#4CAF50",
          cursor: isSupported ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transform: isListening ? "scale(1.1)" : "scale(1)",
        }}
        title={isSupported ? "Toggle voice control" : "Speech recognition not supported"}
      >
        <svg viewBox="0 0 24 24" width="25" height="25" fill="white">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>

      {isExpanded && (
        <>
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{ margin: "5px 0", color: isListening ? "#4CAF50" : "#666", fontWeight: "bold", fontSize: "1.1em" }}>
              {isListening ? "Listening..." : "Click mic to start"}
            </p>
            {error && (
              <p style={{ color: "#ff4444", margin: "5px 0", fontSize: "0.9em", fontWeight: "500" }}>{error}</p>
            )}
            {interimText && (
              <p style={{ margin: "5px 0", fontSize: "0.9em", background: "#e8f4ff", padding: "8px", borderRadius: "5px", color: "#0177cc", fontStyle: "italic" }}>
                Hearing: {interimText}
              </p>
            )}
            {text && (
              <p style={{ margin: "5px 0", fontSize: "0.9em", background: "#f5f5f5", padding: "8px", borderRadius: "5px" }}>
                Last command: {text}
              </p>
            )}
          </div>

          <div style={{ fontSize: "0.9em", color: "#444", marginTop: "10px", textAlign: "left", width: "100%", background: "#f9f9f9", padding: "10px", borderRadius: "8px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Navigation:</p>
            <ul style={{ margin: "5px 0", paddingLeft: "20px", lineHeight: "1.4" }}>
              <li>"home" / "apply" / "devices" / "track"</li>
              <li>"assist AI"</li>
              <li>"help" / "contact us" / "about us"</li>
              <li>"check eligibility"</li>
              <li>"my profile" / "settings" / "my applications"</li>
              <li>"admin dashboard" / "NGO dashboard"</li>
              <li>"login" / "sign up" / "logout"</li>
              <li>"go back"</li>
            </ul>

            <p style={{ fontWeight: "bold", margin: "10px 0 5px" }}>Form:</p>
            <ul style={{ margin: "5px 0", paddingLeft: "20px", lineHeight: "1.4" }}>
              <li>"name [your name]"</li>
              <li>"date of birth [15 August 1998]"</li>
              <li>"gender [male/female/other]"</li>
              <li>"phone number [10 digits]"</li>
              <li>"email [john at gmail dot com]"</li>
              <li>"monthly income [amount]"</li>
              <li>"disability type [type]"</li>
              <li>"disability percentage [number]"</li>
              <li>"address [your address]"</li>
              <li>"state [state name]"</li>
              <li>"pin code [6 digits]"</li>
              <li>"required device [device]"</li>
              <li>"choose file" (then press Enter)</li>
              <li>"accept declaration"</li>
              <li>"submit application"</li>
              <li>"clear [field name]" / "clear all"</li>
            </ul>

            <p style={{ fontWeight: "bold", margin: "10px 0 5px" }}>Other:</p>
            <ul style={{ margin: "5px 0", paddingLeft: "20px", lineHeight: "1.4" }}>
              <li>"scroll up" / "scroll down"</li>
              <li>"night mode" / "day mode"</li>
              <li>"switch to Hindi" / "switch to English"</li>
              <li>"open accessibility"</li>
              <li>"stop listening"</li>
            </ul>
          </div>
        </>
      )}

      {!isExpanded && isListening && (
        <div
          style={{
            position: "absolute",
            top: "-25px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#4CAF50",
            color: "white",
            padding: "3px 10px",
            borderRadius: "10px",
            fontSize: "0.8em",
            whiteSpace: "nowrap",
          }}
        >
          Listening...
        </div>
      )}
    </div>
  );
}