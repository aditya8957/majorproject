// Assumes this file is src/pages/About.jsx; adjust the path if it lives elsewhere
import { useAccessibility } from "../context/AccessibilityContext";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility, Mic, Bot, Languages, FileCheck2, Users, Contrast,
  Sparkles, Send, ArrowRight, HeartPulse, Scale,
} from "lucide-react";

/* Put your own image paths here (e.g. "/images/about-hero.jpg").
   Leave "" to show a simple illustration instead. */
const IMAGES = { hero: "https://images.unsplash.com/photo-1570793005299-c091be91bbad?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", story: "https://images.unsplash.com/photo-1581090122319-8fab9528eaaa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" };

// Add verified members only: { name: { en, hi }, role: { en, hi }, photo? }
const TEAM = [];

const T = {
  en: {
    eyebrow: "About Divyang Sahayak",
    title: "A world where",
    titleB: "accessibility comes first.",
    intro: "Divyang Sahayak brings accessible design and digital technology together to make assistive-device welfare services easier to understand and use.",
    cta1: "Explore Devices",
    cta2: "Explore AssistAI",
    storyTitle: "Technology should open doors, not create barriers.",
    story: "Complex interfaces, hard-to-find information and confusing application steps can keep people from the services meant for them. We start by making the path clear.",
    missionTitle: "Our Mission",
    mission: "Make assistive-device welfare services more accessible and understandable through inclusive design and digital technology.",
    visionTitle: "Our Vision",
    vision: "A future where people can use digital public services with greater independence, dignity, and fewer barriers.",
    featTitle: "What the platform offers",
    feats: [
      ["Accessible interface", "High-contrast mode and adjustable text."],
      ["Voice navigation", "Move around the platform by speaking."],
      ["AssistAI", "Guidance and information about the platform."],
      ["Hindi and English", "Use the platform in either language."],
      ["Apply and track", "Digital application and tracking workflows."],
      ["Coordination", "Workflows for beneficiaries, administrators and approved NGO partners."],
    ],
    stepsTitle: "How it works",
    steps: [
      ["Discover", "Browse available information and assistive devices."],
      ["Apply", "Submit the relevant details and documents."],
      ["Follow", "Track the review and eligibility process."],
      ["Coordinate", "Arrange next steps for approved applications."],
    ],
    sdgTitle: "Our purpose",
    sdgs: [
      ["SDG 3 – Good Health and Well-Being", "Making information about assistive devices easier to find and understand."],
      ["SDG 10 – Reduced Inequalities", "Working toward inclusive digital services and clearer application workflows."],
    ],
    chips: ["Voice navigation", "Hindi · English"],
    aiTitle: "Ask AssistAI for guidance",
    aiText: "Get help understanding the platform and its information, in plain language.",
    chatLabel: "Illustrative chat preview",
    chatQ: "How do I apply for a device?",
    chatA: "Browse the devices, choose one, then submit your details and documents.",
    chatInput: "Ask anything…",
    endTitle: "Let’s make digital access more inclusive.",
    end: "Explore a platform built around accessibility, clarity, and the belief that technology should work for everyone.",
  },
  hi: {
    eyebrow: "दिव्यांग सहायक के बारे में",
    title: "ऐसी दुनिया, जहाँ",
    titleB: "सुलभता सबसे पहले है।",
    intro: "दिव्यांग सहायक सुलभ डिज़ाइन और डिजिटल तकनीक को साथ लाकर सहायक उपकरण कल्याण सेवाओं को समझना और उपयोग करना आसान बनाता है।",
    cta1: "उपकरण देखें",
    cta2: "AssistAI देखें",
    storyTitle: "तकनीक को दरवाज़े खोलने चाहिए, बाधाएँ नहीं बनानी चाहिए।",
    story: "जटिल इंटरफ़ेस, मुश्किल से मिलने वाली जानकारी और उलझी हुई आवेदन प्रक्रिया लोगों को उनके लिए बनी सेवाओं से दूर रख सकती है। हम रास्ता साफ़ करने से शुरुआत करते हैं।",
    missionTitle: "हमारा मिशन",
    mission: "समावेशी डिज़ाइन और डिजिटल तकनीक के माध्यम से सहायक उपकरण कल्याण सेवाओं को अधिक सुलभ और समझने योग्य बनाना।",
    visionTitle: "हमारी दृष्टि",
    vision: "ऐसा भविष्य जहाँ लोग अधिक स्वतंत्रता, गरिमा और कम बाधाओं के साथ डिजिटल सार्वजनिक सेवाओं का उपयोग कर सकें।",
    featTitle: "प्लेटफ़ॉर्म क्या देता है",
    feats: [
      ["सुलभ इंटरफ़ेस", "हाई-कॉन्ट्रास्ट मोड और समायोज्य टेक्स्ट।"],
      ["वॉइस नेविगेशन", "बोलकर प्लेटफ़ॉर्म में आगे बढ़ें।"],
      ["AssistAI", "प्लेटफ़ॉर्म के बारे में मार्गदर्शन और जानकारी।"],
      ["हिंदी और अंग्रेज़ी", "दोनों भाषाओं में प्लेटफ़ॉर्म का उपयोग करें।"],
      ["आवेदन और ट्रैकिंग", "डिजिटल आवेदन और ट्रैकिंग प्रक्रिया।"],
      ["समन्वय", "लाभार्थियों, प्रशासकों और स्वीकृत NGO साझेदारों के लिए प्रक्रियाएँ।"],
    ],
    stepsTitle: "यह कैसे काम करता है",
    steps: [
      ["खोजें", "उपलब्ध जानकारी और सहायक उपकरण देखें।"],
      ["आवेदन करें", "ज़रूरी विवरण और दस्तावेज़ जमा करें।"],
      ["अनुसरण करें", "समीक्षा और पात्रता प्रक्रिया को ट्रैक करें।"],
      ["समन्वय करें", "स्वीकृत आवेदनों के अगले चरण तय करें।"],
    ],
    sdgTitle: "हमारा उद्देश्य",
    sdgs: [
      ["SDG 3 – अच्छा स्वास्थ्य और कल्याण", "सहायक उपकरणों की जानकारी को खोजना और समझना आसान बनाना।"],
      ["SDG 10 – असमानताओं में कमी", "समावेशी डिजिटल सेवाओं और स्पष्ट आवेदन प्रक्रिया की ओर काम करना।"],
    ],
    chips: ["वॉइस नेविगेशन", "हिंदी · English"],
    aiTitle: "मार्गदर्शन के लिए AssistAI से पूछें",
    aiText: "सरल भाषा में प्लेटफ़ॉर्म और उसकी जानकारी समझने में मदद पाएँ।",
    chatLabel: "उदाहरण चैट पूर्वावलोकन",
    chatQ: "उपकरण के लिए आवेदन कैसे करें?",
    chatA: "उपकरण देखें, एक चुनें, फिर अपने विवरण और दस्तावेज़ जमा करें।",
    chatInput: "कुछ भी पूछें…",
    // stackLabel: "तकनीक",
    // teamTitle: "हमारी टीम",
    // teamEmpty: "टीम की जानकारी जल्द जोड़ी जाएगी।",
    endTitle: "आइए डिजिटल पहुँच को और समावेशी बनाएँ।",
    end: "सुलभता, स्पष्टता और इस विश्वास पर बना प्लेटफ़ॉर्म देखें कि तकनीक सबके लिए काम करनी चाहिए।",
  },
};

const ICONS = [Contrast, Mic, Bot, Languages, FileCheck2, Users];
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const grad = "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent";

function Reveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function Picture({ src, alt }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl shadow-indigo-900/10" />
  ) : (
    <div role="img" aria-label={alt}
      className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-200 shadow-xl shadow-indigo-900/10">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-300/40 blur-2xl" />
      <Accessibility className="relative h-28 w-28 text-indigo-600" aria-hidden="true" />
    </div>
  );
}

export function About() {
  const { language } = useAccessibility(); // "en" | "hi", same value the Navbar toggles
  const lang = language === "hi" ? "hi" : "en";
  const reduce = useReducedMotion();
  const t = T[lang];

  return (
    <main lang={lang === "hi" ? "hi" : "en"} className="overflow-x-hidden bg-white text-slate-800">
      {/* Hero */}
      <section className="relative isolate">
        <div aria-hidden="true" className="absolute -left-24 -top-24 -z-10 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-24 top-20 -z-10 h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="pt-6" />
          <div className="grid items-center gap-12 py-12 md:grid-cols-2 md:py-20">
            <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                <Sparkles size={14} aria-hidden="true" /> {t.eyebrow}
              </p>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t.title} <span className={grad}>{t.titleB}</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{t.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/devices" className={`rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 ${focus}`}>{t.cta1}</Link>
                <Link to="/assistAi" className={`rounded-full border border-slate-300 px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-slate-50 ${focus}`}>{t.cta2}</Link>
              </div>
            </motion.div>
            <div className="relative">
              <Picture src={IMAGES.hero} alt={`${t.title} ${t.titleB}`} />
              <motion.div className="absolute -bottom-6 -left-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl backdrop-blur sm:-left-8"
                animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                <div className="flex flex-wrap gap-2">
                  {[[Mic, t.chips[0]], [Languages, t.chips[1]], [Bot, "AssistAI"]].map(([Icon, label]) => (
                    <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                      <Icon size={14} aria-hidden="true" /> {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {/* Story */}
        <section className="grid items-center gap-12 py-16 md:grid-cols-2">
          <Reveal className="md:order-2">
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{t.storyTitle}</h2>
            <p className="mt-4 border-l-4 border-indigo-500 pl-4 text-lg leading-relaxed text-slate-600">{t.story}</p>
          </Reveal>
          <Reveal delay={0.1}><Picture src={IMAGES.story} alt={t.storyTitle} /></Reveal>
        </section>

        {/* Mission / Vision */}
        <section className="grid gap-6 pb-16 md:grid-cols-2">
          <Reveal>
            <article className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 text-white md:rounded-tr-[5rem]">
              <div aria-hidden="true" className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10" />
              <h2 className="relative text-2xl font-bold">{t.missionTitle}</h2>
              <p className="relative mt-3 text-lg leading-relaxed text-blue-50">{t.mission}</p>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:rounded-bl-[5rem]">
              <Accessibility aria-hidden="true" className="absolute -bottom-8 -right-6 h-40 w-40 text-indigo-200/70" />
              <h2 className="relative text-2xl font-bold text-slate-900">{t.visionTitle}</h2>
              <p className="relative mt-3 text-lg leading-relaxed text-slate-700">{t.vision}</p>
            </article>
          </Reveal>
        </section>

        {/* Features */}
        <section className="pb-16">
          <Reveal><h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.featTitle}</h2></Reveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.feats.map(([h, p], i) => {
              const Icon = ICONS[i];
              return (
                <Reveal key={h} delay={i * 0.05}>
                  <li className="h-full list-none rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/10">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-semibold text-slate-900">{h}</h3>
                    <p className="mt-1 text-slate-600">{p}</p>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </section>
      </div>

      {/* AssistAI — dark contrast band */}
      <section className="relative isolate overflow-hidden bg-[#0a1030] py-20 text-white">
        <div aria-hidden="true" className="absolute left-0 top-0 -z-10 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">{t.aiTitle}</h2>
            <p className="mt-4 max-w-md text-lg text-slate-300">{t.aiText}</p>
            <Link to="/assistAi" className={`mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:-translate-y-0.5 ${focus}`}>
              {t.cta2} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl" role="img" aria-label={t.chatLabel}>
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3">{t.chatQ}</div>
              <div className="mt-4 w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">{t.chatA}</div>
              <div className="mt-6 flex items-center justify-between rounded-full border border-white/15 px-4 py-2 text-sm text-slate-400">
                {t.chatInput} <Send size={16} aria-hidden="true" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {/* Steps with connecting line */}
        <section className="py-16">
          <Reveal><h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.stepsTitle}</h2></Reveal>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden="true" className="absolute bottom-0 left-5 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-violet-500 md:bottom-auto md:left-0 md:right-0 md:top-5 md:h-0.5 md:w-auto md:bg-gradient-to-r" />
            {t.steps.map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.1}>
                <li className="relative list-none pl-14 md:pl-0 md:pt-14">
                  <span aria-hidden="true" className="absolute left-2 top-0 grid h-6 w-6 place-items-center rounded-full border-4 border-white bg-indigo-600 md:left-0 md:top-2" />
                  <span className={`text-5xl font-bold ${grad}`}>0{i + 1}</span>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{h}</h3>
                  <p className="mt-1 text-slate-600">{p}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Purpose + stack */}
        <section className="pb-16">
          <Reveal><h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.sdgTitle}</h2></Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {t.sdgs.map(([h, p], i) => {
              const Icon = i === 0 ? HeartPulse : Scale;
              return (
                <Reveal key={h} delay={i * 0.1}>
                  <article className="flex h-full gap-5 rounded-3xl bg-gradient-to-br from-teal-50 to-blue-50 p-7">
                    <Icon className="mt-1 h-9 w-9 shrink-0 text-teal-600" aria-hidden="true" />
                    <div><h3 className="font-semibold text-slate-900">{h}</h3><p className="mt-1 text-slate-600">{p}</p></div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Team */}
        {/* <section className="border-t border-slate-200 pb-16 pt-14">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.teamTitle}</h2>
          {TEAM.length === 0 ? (
            <p className="mt-4 text-slate-600">{t.teamEmpty}</p>
          ) : (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((m) => (
                <li key={m.name.en} className="group list-none">
                  {m.photo && <img src={m.photo} alt={m.name[lang]} className="aspect-square w-full rounded-2xl object-cover grayscale transition group-hover:grayscale-0" />}
                  <h3 className="mt-3 font-semibold">{m.name[lang]}</h3>
                  <p className="text-slate-600">{m.role[lang]}</p>
                </li>
              ))}
            </ul>
          )}
        </section> */}

        {/* CTA */}
        <section className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0a1030] via-indigo-800 to-violet-700 px-8 py-16 text-center text-white">
          <Accessibility aria-hidden="true" className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 text-white/5" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold sm:text-5xl">{t.endTitle}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-indigo-100">{t.end}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/assistAi" className={`rounded-full bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:-translate-y-0.5 ${focus}`}>{t.cta2}</Link>
            <Link to="/devices" className={`rounded-full border border-white/60 px-6 py-3 font-semibold transition hover:bg-white/10 ${focus}`}>{t.cta1}</Link>
          </div>
        </section>
      </div>
    </main>
  );
}