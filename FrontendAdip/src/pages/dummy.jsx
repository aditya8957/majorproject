import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent
} from 'framer-motion';
import {
  AccessibilityIcon,
  EarIcon,
  EyeIcon,
  HeartPulseIcon,
  SearchIcon,
  ClipboardListIcon,
  ClockIcon,
  BotIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  LanguagesIcon,
  MessageCircleIcon,
  SendIcon
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

/** Existing routes from your old Home.jsx. Set ASSISTAI_ROUTE to your real chatbot route. */
const ROUTES = {
  devices: '/devices',
  apply: '/beneficiary/apply',
  track: '/application-status',
  eligibility: '/eligibility-checker',
  documents: '/document-guide',
  centers: '/nearby-centers',
  accessibility: '/accessibility'
};
const ASSISTAI_ROUTE = '/help';
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop';

const ring =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2';

/* Card with a soft spotlight that follows the pointer */
function SpotLink({ to, className = '', children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <Link to={to} onMouseMove={onMove} className={`group relative overflow-hidden ${className} ${ring}`}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(320px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.35), transparent 60%)' }}
      />
      {children}
    </Link>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function Home() {
  const { language, hideImages } = useAccessibility();
  const reduce = useReducedMotion();
  const t = (en, hi) => (language === 'en' ? en : hi);

  /* ---------- Hero: rotating word + pointer tilt ---------- */
  const words = [
    t('mobility', 'गतिशीलता'),
    t('hearing', 'श्रवण'),
    t('vision', 'दृष्टि'),
    t('daily living', 'दैनिक जीवन')
  ];
  const [w, setW] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setW((p) => (p + 1) % 4), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18 });
  const sy = useSpring(my, { stiffness: 110, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const shiftX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const onHeroMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onHeroLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* ---------- Data ---------- */
  const access = [
    { icon: SearchIcon, to: ROUTES.devices, grad: 'from-[#1D4ED8] to-[#3B82F6]',
      title: t('Find Assistive Devices', 'सहायक उपकरण खोजें'),
      body: t('Explore wheelchairs, hearing aids, mobility aids, and other assistive equipment.', 'व्हीलचेयर, श्रवण यंत्र, गतिशीलता सहायक और अन्य उपकरण देखें।') },
    { icon: ClipboardListIcon, to: ROUTES.apply, grad: 'from-[#0F766E] to-[#2DD4BF]',
      title: t('Apply for Support', 'सहायता के लिए आवेदन करें'),
      body: t('Understand the application process and required documents.', 'आवेदन प्रक्रिया और आवश्यक दस्तावेज़ समझें।') },
    { icon: ClockIcon, to: ROUTES.track, grad: 'from-[#B45309] to-[#F59E0B]',
      title: t('Track Your Application', 'अपना आवेदन ट्रैक करें'),
      body: t('Check application progress and status.', 'आवेदन की प्रगति और स्थिति देखें।') },
    { icon: BotIcon, to: ASSISTAI_ROUTE, grad: 'from-[#6D28D9] to-[#A78BFA]',
      title: t('Get AI Assistance', 'AI सहायता लें'),
      body: t('Ask questions through the Divyang Sahayak AssistAI chatbot.', 'दिव्यांग सहायक AssistAI चैटबॉट से प्रश्न पूछें।') }
  ];

  const cats = [
    { icon: AccessibilityIcon, label: t('Mobility', 'गतिशीलता'), color: '#1D4ED8', bg: '#E3ECFF',
      title: t('Mobility and wheelchair assistance', 'गतिशीलता और व्हीलचेयर सहायता'),
      body: t('Support for moving around at home, at work, and outdoors.', 'घर, कार्यस्थल और बाहर चलने-फिरने के लिए सहायता।'),
      items: [t('Wheelchairs', 'व्हीलचेयर'), t('Walking aids', 'चलने में सहायक'), t('Crutches', 'बैसाखी')] },
    { icon: EarIcon, label: t('Hearing', 'श्रवण'), color: '#0F766E', bg: '#D5F3EE',
      title: t('Hearing and communication aids', 'श्रवण और संचार सहायक'),
      body: t('Tools that make everyday conversations easier.', 'रोज़ की बातचीत आसान बनाने वाले साधन।'),
      items: [t('Hearing aids', 'श्रवण यंत्र'), t('Communication tools', 'संचार साधन')] },
    { icon: EyeIcon, label: t('Vision', 'दृष्टि'), color: '#B45309', bg: '#FDEBC8',
      title: t('Vision and reading assistance', 'दृष्टि और पठन सहायता'),
      body: t('Aids for reading, writing, and finding your way with low or no vision.', 'कम या बिना दृष्टि के पढ़ने, लिखने और चलने में मदद।'),
      items: [t('Reading aids', 'पठन सहायक'), t('Walking canes', 'सफ़ेद छड़ी')] },
    { icon: HeartPulseIcon, label: t('Daily living', 'दैनिक जीवन'), color: '#6D28D9', bg: '#E9E1FB',
      title: t('Daily living and rehabilitation aids', 'दैनिक जीवन और पुनर्वास सहायक'),
      body: t('Equipment for independence in daily routines and recovery.', 'दैनिक कार्यों में स्वतंत्रता और स्वास्थ्य-लाभ के उपकरण।'),
      items: [t('Daily living aids', 'दैनिक उपयोग सहायक'), t('Rehabilitation aids', 'पुनर्वास सहायक')] }
  ];
  const [tab, setTab] = useState(0);
  const cat = cats[tab];
  const onTabKey = (e) => {
    if (e.key === 'ArrowRight') setTab((tab + 1) % cats.length);
    if (e.key === 'ArrowLeft') setTab((tab + cats.length - 1) % cats.length);
  };

  const steps = [
    { title: t('Explore available support', 'उपलब्ध सहायता देखें'), body: t('Browse devices and schemes to see what could help you.', 'देखें कि कौन से उपकरण और योजनाएं मददगार हो सकती हैं।') },
    { title: t('Understand eligibility and prepare documents', 'पात्रता समझें, दस्तावेज़ तैयार करें'), body: t('Review the criteria and gather the papers you need.', 'मापदंड पढ़ें और ज़रूरी कागज़ात जुटाएं।') },
    { title: t('Submit an application', 'आवेदन जमा करें'), body: t('Apply through the appropriate process.', 'उचित प्रक्रिया के माध्यम से आवेदन करें।') },
    { title: t('Track progress and receive updates', 'प्रगति ट्रैक करें, अपडेट पाएं'), body: t('Follow your application and see what comes next.', 'अपना आवेदन देखें और अगला चरण जानें।') }
  ];
  const procRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: procRef, offset: ['start 65%', 'end 75%'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(3, Math.max(0, Math.floor(v * 4.2)))));

  /* ---------- AssistAI interactive preview ---------- */
  const chats = [
    { q: t('What documents do I usually need?', 'आमतौर पर कौन से दस्तावेज़ चाहिए?'),
      a: t('Requirements vary by scheme, but a disability certificate and identity proof are commonly asked for. The Document Guide lists what to prepare.', 'आवश्यकताएं योजना के अनुसार बदलती हैं, पर दिव्यांगता प्रमाणपत्र और पहचान प्रमाण अक्सर मांगे जाते हैं। दस्तावेज़ गाइड में तैयारी की सूची है।') },
    { q: t('How do I track my application?', 'मैं अपना आवेदन कैसे ट्रैक करूं?'),
      a: t('Open Track Your Application and enter your details to see the latest status.', 'आवेदन ट्रैक करें पेज खोलें और अपनी जानकारी डालकर ताज़ा स्थिति देखें।') },
    { q: t('What are assistive devices?', 'सहायक उपकरण क्या हैं?'),
      a: t('Assistive devices help with mobility, hearing, vision, or daily tasks, such as wheelchairs, hearing aids, and reading aids.', 'सहायक उपकरण चलने-फिरने, सुनने, देखने या दैनिक कार्यों में मदद करते हैं, जैसे व्हीलचेयर, श्रवण यंत्र और पठन सहायक।') }
  ];
  const [ci, setCi] = useState(0);
  const [typed, setTyped] = useState('');
  const [thinking, setThinking] = useState(true);
  useEffect(() => {
    const full = chats[ci].a;
    if (reduce) { setThinking(false); setTyped(full); return; }
    setTyped(''); setThinking(true);
    let i = 0, iv;
    const start = setTimeout(() => {
      setThinking(false);
      iv = setInterval(() => { i += 2; setTyped(full.slice(0, i)); if (i >= full.length) clearInterval(iv); }, 22);
    }, 700);
    return () => { clearTimeout(start); clearInterval(iv); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ci, language, reduce]);

  const float = (d = 0, y = 8) =>
    reduce ? {} : { animate: { y: [0, -y, 0] }, transition: { duration: 5, delay: d, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <div className="w-full overflow-x-hidden bg-[#F7F9FC] text-[#0B2545] antialiased">
      {/* ================= HERO ================= */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden" onMouseMove={onHeroMove} onMouseLeave={onHeroLeave}>
        {/* living colour field */}
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <motion.div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#93C5FD]/60 blur-3xl"
            animate={reduce ? {} : { x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute right-0 top-1/3 h-[26rem] w-[26rem] rounded-full bg-[#5EEAD4]/50 blur-3xl"
            animate={reduce ? {} : { x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#FCD34D]/40 blur-3xl"
            animate={reduce ? {} : { x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-24">
          <div className="lg:col-span-7">
            <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#0F766E] shadow-sm ring-1 ring-[#0B2545]/10 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#14B8A6] opacity-70" />}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0F766E]" />
              </span>
              {t('Support for ', 'सहायता: ')}
              <span aria-hidden="true" className="relative inline-block min-w-[7.5rem]">
                <AnimatePresence mode="wait">
                  <motion.span key={w} initial={reduce ? false : { y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? {} : { y: -14, opacity: 0 }}
                    transition={{ duration: 0.3 }} className="inline-block text-[#1D4ED8]">
                    {words[w]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="sr-only">{t('mobility, hearing, vision and daily living', 'गतिशीलता, श्रवण, दृष्टि और दैनिक जीवन')}</span>
            </motion.p>

            <h1 id="hero-title" className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              {(language === 'en' ? ['Empowering Every Ability.', 'Enabling Every Possibility.'] : ['हर क्षमता को सशक्त बनाएं।', 'हर संभावना को साकार करें।']).map((line, i) => (
                <motion.span key={line} className={`block ${i ? 'bg-gradient-to-r from-[#1D4ED8] via-[#0F766E] to-[#0EA5A4] bg-clip-text text-transparent' : ''}`}
                  initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 + i * 0.18, ease: 'easeOut' }}>
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-[#33465F] sm:text-xl sm:leading-relaxed">
              {t('Divyang Sahayak helps persons with disabilities discover assistive devices, access welfare schemes, and navigate their applications, step by step.',
                 'दिव्यांग सहायक दिव्यांगजनों को सहायक उपकरण खोजने, कल्याणकारी योजनाओं तक पहुंचने और आवेदन को चरण-दर-चरण आगे बढ़ाने में मदद करता है।')}
            </motion.p>

            <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={ROUTES.devices}
                className={`group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-8 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(29,78,216,0.7)] transition hover:-translate-y-0.5 hover:bg-[#1A43B8] motion-reduce:transition-none ${ring}`}>
                {t('Explore Assistive Support', 'सहायक सहायता देखें')}
                <ArrowRightIcon className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link to={ASSISTAI_ROUTE}
                className={`inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border-2 border-[#0B2545] bg-white/70 px-8 text-base font-semibold backdrop-blur transition hover:bg-[#0B2545] hover:text-white motion-reduce:transition-none ${ring}`}>
                <MessageCircleIcon className="h-5 w-5" aria-hidden="true" />
                {t('Get Assistance', 'सहायता प्राप्त करें')}
              </Link>
            </motion.div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#33465F]">
              <li className="flex items-center gap-2"><ShieldCheckIcon className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />{t('Built for accessibility', 'सुलभता के लिए निर्मित')}</li>
              <li className="flex items-center gap-2"><LanguagesIcon className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />{t('English and Hindi', 'अंग्रेज़ी और हिंदी')}</li>
              <li className="flex items-center gap-2"><BotIcon className="h-5 w-5 text-[#0F766E]" aria-hidden="true" />{t('Digital assistance', 'डिजिटल सहायता')}</li>
            </ul>
          </div>

          {/* tilting photo stack */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none" style={{ perspective: 1200 }}>
            <motion.div style={reduce ? {} : { rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div aria-hidden="true" className="absolute -right-5 -top-5 h-full w-full rounded-[2.5rem] bg-gradient-to-br from-[#5EEAD4] to-[#60A5FA] opacity-80" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#E3ECFF] shadow-[0_40px_70px_-30px_rgba(11,37,69,0.55)] ring-4 ring-white">
                {hideImages ? (
                  <div className="flex h-full items-center justify-center"><AccessibilityIcon className="h-24 w-24 text-[#1D4ED8]" aria-hidden="true" /></div>
                ) : (
                  <motion.img src={HERO_IMAGE} style={reduce ? {} : { x: shiftX, y: shiftY, scale: 1.12 }}
                    alt={t('A caregiver and a person with a disability sharing a warm moment', 'एक देखभालकर्ता और एक दिव्यांग व्यक्ति के बीच आत्मीय क्षण')}
                    className="h-full w-full object-cover" />
                )}
              </div>

              <motion.div {...float(0)} style={{ translateZ: 60 }} className="absolute -bottom-6 -left-4 flex max-w-[16rem] items-start gap-3 rounded-2xl bg-white p-4 shadow-[0_18px_40px_-14px_rgba(11,37,69,0.4)] sm:-left-10">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D5F3EE] text-[#0F766E]"><ClockIcon className="h-5 w-5" aria-hidden="true" /></span>
                <div><p className="text-sm font-semibold">{t('Track your application', 'अपना आवेदन ट्रैक करें')}</p><p className="text-sm text-[#4A5C75]">{t('See status updates online.', 'स्थिति अपडेट ऑनलाइन देखें।')}</p></div>
              </motion.div>
              <motion.div {...float(1.2, 10)} style={{ translateZ: 80 }} className="absolute -right-2 top-10 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[0_18px_40px_-14px_rgba(11,37,69,0.4)] sm:-right-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E1FB] text-[#6D28D9]"><BotIcon className="h-5 w-5" aria-hidden="true" /></span>
                <p className="text-sm font-semibold">AssistAI</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= QUICK ACCESS ================= */}
      <section aria-labelledby="help-title">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal><h2 id="help-title" className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">{t('How Can We Help You Today?', 'आज हम आपकी क्या मदद कर सकते हैं?')}</h2></Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {access.map(({ icon: Icon, to, grad, title, body }, i) => (
              <motion.li key={title} initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <SpotLink to={to} className={`flex h-full min-h-[270px] flex-col justify-between rounded-[2rem] bg-gradient-to-br ${grad} p-7 text-white shadow-[0_24px_40px_-24px_rgba(11,37,69,0.6)] transition duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur transition duration-300 group-hover:rotate-6 group-hover:scale-110 motion-reduce:transform-none"><Icon className="h-7 w-7" aria-hidden="true" /></span>
                  <span className="relative">
                    <span className="block text-2xl font-semibold leading-snug">{title}</span>
                    <span className="mt-2 block text-base leading-relaxed text-white/90">{body}</span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">{t('Open', 'खोलें')}<ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-2" aria-hidden="true" /></span>
                  </span>
                </SpotLink>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= SUPPORT EXPLORER ================= */}
      <section aria-labelledby="support-title" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal className="max-w-2xl">
            <h2 id="support-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{t('Support That Makes Everyday Life Easier', 'ऐसी सहायता जो रोज़मर्रा का जीवन आसान बनाए')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#33465F]">{t('Pick a category. Availability and eligibility depend on the scheme and your circumstances.', 'एक श्रेणी चुनें। उपलब्धता और पात्रता योजना और आपकी परिस्थितियों पर निर्भर करती है।')}</p>
          </Reveal>

          <div role="tablist" aria-label={t('Support categories', 'सहायता श्रेणियां')} onKeyDown={onTabKey} className="mt-10 flex flex-wrap gap-3">
            {cats.map((c, i) => {
              const Icon = c.icon; const on = i === tab;
              return (
                <button key={c.label} role="tab" id={`tab-${i}`} aria-selected={on} aria-controls="cat-panel" tabIndex={on ? 0 : -1} onClick={() => setTab(i)}
                  className={`relative inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-base font-semibold transition motion-reduce:transition-none ${ring} ${on ? 'text-white' : 'bg-[#EEF2F8] text-[#0B2545] hover:bg-[#E1E8F3]'}`}>
                  {on && <motion.span layoutId="tabpill" className="absolute inset-0 rounded-full" style={{ background: c.color }} transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative flex items-center gap-2"><Icon className="h-5 w-5" aria-hidden="true" />{c.label}</span>
                </button>
              );
            })}
          </div>

          <div id="cat-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? {} : { opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
                className="grid items-center gap-8 rounded-[2.5rem] p-8 sm:p-12 md:grid-cols-5" style={{ background: cat.bg }}>
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-bold sm:text-4xl" style={{ color: '#0B2545' }}>{cat.title}</h3>
                  <p className="mt-3 max-w-lg text-lg leading-relaxed text-[#33465F]">{cat.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {cat.items.map((it, k) => (
                      <motion.li key={it} initial={reduce ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + k * 0.07 }}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm" style={{ color: cat.color }}>{it}</motion.li>
                    ))}
                  </ul>
                  <Link to={ROUTES.devices} className={`mt-8 inline-flex min-h-[50px] items-center gap-2 rounded-full px-7 font-semibold text-white transition hover:opacity-90 ${ring}`} style={{ background: cat.color }}>
                    {t('Browse devices', 'उपकरण देखें')}<ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="hidden justify-center md:col-span-2 md:flex" aria-hidden="true">
                  <motion.div {...float(0, 12)} className="flex h-44 w-44 items-center justify-center rounded-[2.5rem] bg-white shadow-xl">
                    <cat.icon className="h-20 w-20" style={{ color: cat.color }} />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section aria-labelledby="process-title" className="bg-[#0B2545] text-white">
        <div ref={procRef} className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <Reveal><h2 id="process-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{t('A Simple, Reassuring Process', 'एक सरल और भरोसेमंद प्रक्रिया')}</h2></Reveal>
          <ol className="relative mt-14 space-y-10">
            <span aria-hidden="true" className="absolute left-6 top-2 h-[calc(100%-1rem)] w-1 rounded bg-white/15" />
            <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : lineScale, transformOrigin: 'top' }} className="absolute left-6 top-2 h-[calc(100%-1rem)] w-1 rounded bg-gradient-to-b from-[#5EEAD4] to-[#60A5FA]" />
            {steps.map((s, i) => {
              const done = i <= active;
              return (
                <li key={s.title} className="relative flex gap-6">
                  <span className={`relative z-10 flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-500 motion-reduce:transition-none ${done ? 'scale-100 bg-[#5EEAD4] text-[#0B2545]' : 'scale-90 bg-[#1B3A63] text-white/70'}`}>{i + 1}</span>
                  <div className={`pt-2 transition-opacity duration-500 motion-reduce:transition-none ${done ? 'opacity-100' : 'opacity-50'}`}>
                    <h3 className="text-xl font-semibold sm:text-2xl">{s.title}</h3>
                    <p className="mt-1 max-w-xl text-base leading-relaxed text-[#C9D5E6]">{s.body}</p>
                    {i === 1 && <div className="mt-3 flex flex-wrap gap-2">
                      <Link to={ROUTES.eligibility} className={`rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0B2545] hover:bg-[#E3ECFF] ${ring} focus-visible:ring-offset-[#0B2545]`}>{t('Check eligibility', 'पात्रता जांचें')}</Link>
                      <Link to={ROUTES.documents} className={`rounded-full border-2 border-white/60 px-5 py-2 text-sm font-semibold hover:bg-white/10 ${ring} focus-visible:ring-offset-[#0B2545]`}>{t('Document guide', 'दस्तावेज़ गाइड')}</Link>
                    </div>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= ASSISTAI ================= */}
      <section aria-labelledby="ai-title" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <h2 id="ai-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{t('Guidance When You Need It. Support at Every Step.', 'जब ज़रूरत हो, मार्गदर्शन। हर कदम पर सहायता।')}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#33465F]">
              {t('Divyang Sahayak AssistAI is an AI-powered companion that helps you understand disability-related schemes, assistive technologies, accessibility, certificates, and application questions.',
                 'दिव्यांग सहायक AssistAI एक AI-आधारित साथी है जो योजनाओं, सहायक तकनीकों, सुलभता, प्रमाणपत्रों और आवेदन संबंधी प्रश्नों को समझने में मदद करता है।')}
            </p>
            <p className="mt-3 text-base text-[#4A5C75]">{t('AssistAI offers information and guidance. It does not decide eligibility.', 'AssistAI जानकारी और मार्गदर्शन देता है। यह पात्रता का निर्णय नहीं करता।')}</p>
            <Link to={ASSISTAI_ROUTE} className={`mt-8 inline-flex min-h-[54px] items-center gap-2 rounded-full bg-[#6D28D9] px-8 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(109,40,217,0.7)] transition hover:-translate-y-0.5 hover:bg-[#5B21B6] motion-reduce:transition-none ${ring}`}>
              <MessageCircleIcon className="h-5 w-5" aria-hidden="true" />{t('Chat with AssistAI', 'AssistAI से चैट करें')}
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-white p-5 shadow-[0_40px_70px_-35px_rgba(11,37,69,0.5)] ring-1 ring-[#0B2545]/5 sm:p-7">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#6D28D9]"><BotIcon className="h-5 w-5" aria-hidden="true" />{t('Try a sample question (preview only)', 'एक नमूना प्रश्न चुनें (केवल पूर्वावलोकन)')}</p>
              <div className="flex flex-wrap gap-2">
                {chats.map((c, i) => (
                  <button key={c.q} onClick={() => setCi(i)} aria-pressed={i === ci}
                    className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition motion-reduce:transition-none ${ring} ${i === ci ? 'bg-[#6D28D9] text-white' : 'bg-[#F1ECFB] text-[#4C1D95] hover:bg-[#E5DBF9]'}`}>{c.q}</button>
                ))}
              </div>
              <div className="mt-5 min-h-[190px] space-y-4" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div key={ci} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="ml-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-br-md bg-[#0B2545] px-5 py-3 text-white">
                    <SendIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />{chats[ci].q}
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1FB] text-[#6D28D9]"><BotIcon className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#F1F4F9] px-5 py-3 leading-relaxed">
                    {thinking ? (
                      <span className="flex gap-1.5 py-2" aria-label={t('AssistAI is typing', 'AssistAI लिख रहा है')}>
                        {[0, 1, 2].map((d) => <motion.span key={d} className="h-2 w-2 rounded-full bg-[#6D28D9]" animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }} />)}
                      </span>
                    ) : typed}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section aria-labelledby="trust-title" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <Reveal><h2 id="trust-title" className="text-3xl font-bold tracking-tight sm:text-4xl">{t('Built on Clarity and Inclusion', 'स्पष्टता और समावेश पर आधारित')}</h2></Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t('Accessible digital experience', 'सुलभ डिजिटल अनुभव'), t('High contrast, adjustable text, keyboard-friendly.', 'उच्च कंट्रास्ट, समायोज्य टेक्स्ट, कीबोर्ड-अनुकूल।'), '#E3ECFF'],
              [t('Clear application information', 'आवेदन की स्पष्ट जानकारी'), t('Plain-language guidance on procedures and documents.', 'प्रक्रिया और दस्तावेज़ों की सरल जानकारी।'), '#D5F3EE'],
              [t('Support for diverse needs', 'विविध ज़रूरतों के लिए सहायता'), t('Visual, hearing, mobility, and cognitive needs.', 'दृश्य, श्रवण, गतिशीलता और संज्ञानात्मक ज़रूरतें।'), '#FDEBC8'],
              [t('Authorized partners', 'अधिकृत भागीदार'), t('Handled through authorized government and NGO partners, where applicable.', 'जहां लागू हो, अधिकृत सरकारी और एनजीओ भागीदारों के माध्यम से।'), '#E9E1FB']
            ].map(([h, b, bg], i) => (
              <motion.li key={h} whileHover={reduce ? {} : { y: -6 }} className="rounded-3xl p-6" style={{ background: bg }}>
                <h3 className="text-lg font-semibold">{h}</h3><p className="mt-2 text-base leading-relaxed text-[#33465F]">{b}</p>
              </motion.li>
            ))}
          </ul>
          <p className="mt-8"><Link to={ROUTES.accessibility} className={`rounded font-semibold text-[#1D4ED8] underline underline-offset-4 hover:text-[#12356A] ${ring}`}>{t('Read about accessibility features', 'सुलभता सुविधाओं के बारे में पढ़ें')}</Link></p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0B2545] text-[#C9D5E6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">© {new Date().getFullYear()} Divyang Sahayak</p>
          <nav aria-label={t('Footer', 'फ़ुटर')}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[[ROUTES.devices, t('Devices', 'उपकरण')], [ROUTES.centers, t('Nearby Centers', 'नज़दीकी केंद्र')], [ROUTES.documents, t('Document Guide', 'दस्तावेज़ गाइड')], [ROUTES.accessibility, t('Accessibility', 'सुलभता')]].map(([to, label]) => (
                <li key={to}><Link to={to} className={`rounded underline-offset-4 hover:text-white hover:underline ${ring} focus-visible:ring-offset-[#0B2545]`}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}