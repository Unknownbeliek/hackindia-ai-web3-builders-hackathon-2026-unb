import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Cpu, ChevronDown, ArrowRight, Leaf, Snowflake,
  Scale, Landmark, QrCode, Sparkles, TrendingDown, Milk,
  Users, CheckCircle2, Zap, Globe, Lock, Award, ExternalLink,
  IndianRupee, Menu, X, Activity, AlertTriangle, Beaker,
  TestTube, Microscope, BarChart3, PieChart, TrendingUp,
  MapPin, Clock, Wifi, Hash, FileText, Link, ShieldAlert,
  HeartPulse, Building2
} from 'lucide-react';

// ── Animated number counter hook ──
function useCountUp(target, duration = 2000, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

// ── Intersection observer hook ──
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Live blockchain tx ticker ──
const TX_SAMPLES = [
  { hash: '0x7d2b…8102', event: 'Milk Pour Logged', farmer: 'Ramesh Kumar, VLC-22', qty: '8.5 kg', fat: '4.2%', time: '2s ago', color: 'text-emerald-400' },
  { hash: '0xa9f1…c430', event: 'HSM Signed', farmer: 'Karnal MCC Gate #4', qty: '342 L', fat: '—', time: '11s ago', color: 'text-teal-400' },
  { hash: '0x3c8d…e891', event: 'QR Scanned', farmer: 'Consumer • Delhi', qty: 'POUCH-884', fat: '99.8%', time: '23s ago', color: 'text-cyan-400' },
  { hash: '0xbb22…f019', event: 'Water Anomaly Alert', farmer: 'Batch #MCC-89', qty: '+18.4% vol', fat: '—', time: '41s ago', color: 'text-amber-400' },
  { hash: '0x5519…8c7a', event: 'Payout Settled', farmer: 'Suresh Yadav, VLC-08', qty: '₹382.50', fat: '4.1%', time: '58s ago', color: 'text-purple-400' },
  { hash: '0x9d3f…1127', event: 'Milk Pour Logged', farmer: 'Priya Devi, VLC-31', qty: '6.2 kg', fat: '4.4%', time: '1m 12s ago', color: 'text-emerald-400' },
  { hash: '0xc7a8…d552', event: 'NDLM Tag Verified', farmer: '#840003129940112', qty: '—', fat: '—', time: '1m 45s ago', color: 'text-blue-400' },
];

const PORTALS = [
  { role: 'FARMER', icon: Leaf, title: 'Farmer PWA', titleHi: 'किसान पोर्टल', subtitle: 'Mobile-first dairy collection', subtitleHi: 'NDLM टैग, AMCU IoT pour logging', desc: 'NDLM tag scanning, AMCU IoT pour logging, NABARD KCC loan status & direct bank payouts.', color: 'emerald', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10', bg: 'from-emerald-950/60 to-slate-950', iconColor: 'text-emerald-400' },
  { role: 'AGGREGATOR', icon: Snowflake, title: 'Aggregator Tablet', titleHi: 'एग्रीगेटर टैबलेट', subtitle: 'Village chilling center IoT console', subtitleHi: 'HSM Secp256k1 hardware signing', desc: 'IoT RS232 telemetry, HSM Secp256k1 hardware signing, AI yield verification & milk receipt.', color: 'teal', border: 'border-teal-500/30', glow: 'shadow-teal-500/10', bg: 'from-teal-950/60 to-slate-950', iconColor: 'text-teal-400' },
  { role: 'QC_OFFICER', icon: Scale, title: 'QC Officer Desktop', titleHi: 'क्यूसी अधिकारी', subtitle: 'Lab analytics & adulteration AI', subtitleHi: 'AI जल मिलावट detection', desc: 'AI mass-balance audit, water addition anomaly detection, batch quarantine & FSSAI escalation.', color: 'amber', border: 'border-amber-500/30', glow: 'shadow-amber-500/10', bg: 'from-amber-950/60 to-slate-950', iconColor: 'text-amber-400' },
  { role: 'GOVT_AUDITOR', icon: Landmark, title: 'FSSAI Auditor Command', titleHi: 'FSSAI राष्ट्रीय कमान', subtitle: 'National surveillance & enforcement', subtitleHi: 'Flying Squad dispatch, GIS निगरानी', desc: 'National GIS drill-down, flying squad dispatch, district-level risk scoring & enforcement warrants.', color: 'red', border: 'border-red-500/30', glow: 'shadow-red-500/10', bg: 'from-red-950/60 to-slate-950', iconColor: 'text-red-400' },
  { role: 'CONSUMER', icon: Milk, title: 'Consumer Passport', titleHi: 'उपभोक्ता पासपोर्ट', subtitle: 'Scan QR → verify milk provenance', subtitleHi: 'QR स्कैन → शुद्धता सत्यापन', desc: 'Scan any pouch QR to see the full Digital Product Passport, lab specs & 4-hop supply chain audit.', color: 'cyan', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/10', bg: 'from-cyan-950/60 to-slate-950', iconColor: 'text-cyan-400' },
];

const STEPS = [
  { icon: Leaf, num: '01', label: 'Farmer', labelHi: 'किसान', detail: 'NDLM ear-tag + AMCU IoT pour', detailHi: 'NDLM कान-टैग + AMCU IoT पोर', color: 'bg-emerald-950 border-emerald-500/60', iconColor: 'text-emerald-400' },
  { icon: Snowflake, num: '02', label: 'Aggregator', labelHi: 'एग्रीगेटर', detail: 'HSM Secp256k1 hardware signing', detailHi: 'HSM हार्डवेयर क्रिप्टो साइनिंग', color: 'bg-teal-950 border-teal-500/60', iconColor: 'text-teal-400' },
  { icon: Scale, num: '03', label: 'QC Officer', labelHi: 'क्यूसी अधिकारी', detail: 'AI mass-balance water detection', detailHi: 'AI जल मिलावट जांच', color: 'bg-amber-950 border-amber-500/60', iconColor: 'text-amber-400' },
  { icon: Landmark, num: '04', label: 'FSSAI Auditor', labelHi: 'FSSAI लेखापरीक्षक', detail: 'National surveillance & dispatch', detailHi: 'राष्ट्रीय निगरानी और प्रवर्तन', color: 'bg-red-950 border-red-500/60', iconColor: 'text-red-400' },
  { icon: Milk, num: '05', label: 'Consumer', labelHi: 'उपभोक्ता', detail: 'QR scan → on-chain verification', detailHi: 'QR स्कैन → ऑन-चेन सत्यापन', color: 'bg-cyan-950 border-cyan-500/60', iconColor: 'text-cyan-400' },
];

// Adulteration breakdown data
const ADULTERANT_DATA = [
  { name: 'Water', nameHi: 'पानी', pct: 70, color: 'bg-blue-500', bar: 'from-blue-500 to-blue-600' },
  { name: 'Detergent', nameHi: 'डिटर्जेंट', pct: 14, color: 'bg-red-500', bar: 'from-red-500 to-red-600' },
  { name: 'Urea', nameHi: 'यूरिया', pct: 9, color: 'bg-amber-500', bar: 'from-amber-500 to-amber-600' },
  { name: 'Starch', nameHi: 'स्टार्च', pct: 4, color: 'bg-purple-500', bar: 'from-purple-500 to-purple-600' },
  { name: 'Other', nameHi: 'अन्य', pct: 3, color: 'bg-slate-500', bar: 'from-slate-500 to-slate-600' },
];

// State-wise adulteration rates
const STATE_DATA = [
  { state: 'Uttar Pradesh', rate: 78, color: 'bg-red-500' },
  { state: 'Bihar', rate: 72, color: 'bg-red-400' },
  { state: 'Rajasthan', rate: 65, color: 'bg-orange-500' },
  { state: 'Punjab', rate: 54, color: 'bg-amber-500' },
  { state: 'Haryana', rate: 48, color: 'bg-amber-400' },
  { state: 'Maharashtra', rate: 31, color: 'bg-yellow-500' },
  { state: 'Gujarat', rate: 22, color: 'bg-green-500' },
];

export default function LandingPage({ onEnterDemo, onEnterPortal }) {
  const [isHindi, setIsHindi] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [txIndex, setTxIndex] = useState(0);
  const [liveCount, setLiveCount] = useState(88427);

  const [statsRef, statsInView] = useInView();
  const [adulterantRef, adulterantInView] = useInView();

  const count1 = useCountUp(150, 2000, statsInView);
  const count2 = useCountUp(68, 2000, statsInView);
  const count3 = useCountUp(21, 2000, statsInView);
  const count4 = useCountUp(500, 2500, statsInView);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live tx ticker
  useEffect(() => {
    const t = setInterval(() => {
      setTxIndex(i => (i + 1) % TX_SAMPLES.length);
      setLiveCount(c => c + Math.floor(Math.random() * 3));
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const t = (en, hi) => isHindi ? hi : en;
  const currentTx = TX_SAMPLES[txIndex];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans overflow-x-hidden">
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
      {/* Glow orbs */}
      <div className="fixed top-0 left-0 w-[700px] h-[700px] bg-emerald-500 opacity-[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-teal-400 opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 right-10 w-[300px] h-[300px] bg-amber-500 opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* ── LIVE ACTIVITY TICKER BAR ── */}
      <div className="sticky top-0 z-50">
        <div className="bg-slate-950/90 border-b border-slate-800/60 px-6 py-1.5 flex items-center gap-4 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">LIVE CHAIN</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div key={txIndex} className="flex items-center gap-4 text-[10px] font-mono animate-in slide-in-from-right duration-500">
              <span className="text-slate-500">{currentTx.hash}</span>
              <span className={`font-bold ${currentTx.color}`}>{currentTx.event}</span>
              <span className="text-slate-400">{currentTx.farmer}</span>
              {currentTx.qty && <span className="text-white">{currentTx.qty}</span>}
              {currentTx.fat && currentTx.fat !== '—' && <span className="text-emerald-400">Fat {currentTx.fat}</span>}
              <span className="text-slate-600">{currentTx.time}</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <Hash className="w-3 h-3 text-slate-600" />
            <span className="text-white font-bold">{liveCount.toLocaleString()}</span>
            <span>{t('events on-chain', 'ऑन-चेन इवेंट्स')}</span>
          </div>
        </div>

        {/* NAVBAR */}
        <nav className={`transition-all duration-300 ${scrolled ? 'bg-[#060913]/97 backdrop-blur-xl shadow-2xl border-b border-slate-800/60' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">Anveshana</span>
                <span className="text-lg font-extrabold text-emerald-400 ml-1.5 font-serif">अन्वेषण</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {[['#crisis', t('Crisis', 'संकट')], ['#how', t('How It Works', 'कैसे काम करता है')], ['#portals', t('Portals', 'पोर्टल')], ['#impact', t('Impact', 'प्रभाव')]].map(([href, label]) => (
                <a key={href} href={href} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">{label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsHindi(!isHindi)} className="hidden md:flex px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold items-center gap-1.5 transition-all">
                <Globe className="w-3.5 h-3.5" />
                <span>{isHindi ? 'EN' : 'हिंदी'}</span>
              </button>
              <button onClick={onEnterDemo} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                <span>{t('Enter Demo', 'डेमो देखें')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 pt-6 pb-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HackIndia 2026 · FSSAI · NDLM · Blockchain-Secured DPI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            {t("India's Open Dairy", "भारत का खुला डेयरी")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
              {t("Intelligence Protocol", "इंटेलिजेंस प्रोटोकॉल")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t(
              "From cow to consumer — every litre of milk, tamper-evident, hardware-anchored, and blockchain-sealed.",
              "गाय से उपभोक्ता तक — दूध का हर लीटर, हार्डवेयर-एंकर्ड, ब्लॉकचेन-सीलबंद।"
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={onEnterDemo} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-500/30 transition-all transform hover:scale-[1.02] hover:shadow-emerald-500/50">
              <Zap className="w-5 h-5" />
              <span>{t('Enter Live Demo', 'लाइव डेमो चालू करें')}</span>
            </button>
            <a href="#crisis" className="px-8 py-4 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 font-bold text-base rounded-2xl flex items-center gap-2 transition-all">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>{t('See The Crisis', 'संकट देखें')}</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {[
              { icon: <Lock className="w-3.5 h-3.5 text-emerald-400" />, label: 'HSM Hardware-Anchored' },
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />, label: 'FSSAI ISO-22000' },
              { icon: <Cpu className="w-3.5 h-3.5 text-amber-400" />, label: 'NDLM Cattle Traceability' },
              { icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />, label: 'AI Adulteration Detection' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
                {b.icon}<span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
        <a href="#crisis" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 hover:text-emerald-400 transition-colors animate-bounce">
          <ChevronDown className="w-7 h-7" />
        </a>
      </section>

      {/* ── SECTION 2: ANIMATED COUNTER STATS ── */}
      <section ref={statsRef} className="py-16 px-6 border-y border-slate-800/60 bg-[#0a0f1e]/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: count1, suffix: 'M+', label: t('Untracked milch cattle', 'बिना NDLM टैग के पशु'), src: '20th Livestock Census', color: 'text-red-400' },
            { value: count2, suffix: '%', label: t('Milk samples adulterated', 'दूध नमूने मिलावटी'), src: 'FSSAI Survey 2024', color: 'text-amber-400' },
            { value: count3, suffix: 'L Cr', prefix: '₹', label: t('Annual adulteration losses', 'वार्षिक मिलावट नुकसान'), src: 'ICAR 2023', color: 'text-orange-400' },
            { value: count4, suffix: '+', label: t('Dairy cooperatives undigitized', 'अडिजिटल डेयरी सहकारी'), src: 'NDDB Annual Report', color: 'text-teal-400' },
          ].map((s, i) => (
            <div key={i} className="text-center space-y-2">
              <div className={`text-4xl md:text-5xl font-extrabold ${s.color} font-mono`}>
                {s.prefix || ''}{s.value}{s.suffix}
              </div>
              <div className="text-sm text-white font-semibold">{s.label}</div>
              <div className="text-[10px] text-slate-500 font-mono">Source: {s.src}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: DAIRY CRISIS DEEP DIVE ── */}
      <section id="crisis" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-wider uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>{t('India\'s Dairy Crisis', 'भारत का डेयरी संकट')}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              {t('An invisible public health emergency', 'एक अदृश्य जन स्वास्थ्य आपातकाल')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Adulteration Breakdown Chart */}
            <div ref={adulterantRef} className="lg:col-span-1 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">{t('What\'s in adulterated milk?', 'मिलावटी दूध में क्या है?')}</div>
                <div className="text-lg font-bold text-white">{t('Adulterant Breakdown', 'मिलावट विश्लेषण')}</div>
              </div>
              <div className="space-y-3">
                {ADULTERANT_DATA.map((a, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{isHindi ? a.nameHi : a.name}</span>
                      <span className="text-white font-bold">{a.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${a.bar} transition-all duration-1000`}
                        style={{ width: adulterantInView ? `${a.pct}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Source: FSSAI National Milk Quality Survey 2024</div>
            </div>

            {/* State-wise Adulteration Chart */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">{t('State-Wise Adulteration Rate', 'राज्यवार मिलावट दर')}</div>
                <div className="text-lg font-bold text-white">{t('Worst Affected States', 'सबसे प्रभावित राज्य')}</div>
              </div>
              <div className="space-y-2.5">
                {STATE_DATA.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 w-24 shrink-0 truncate">{s.state}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all duration-1000`} style={{ width: adulterantInView ? `${s.rate}%` : '0%' }} />
                    </div>
                    <span className="text-white font-bold w-8 text-right">{s.rate}%</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Source: FSSAI State Bureau Reports 2024</div>
            </div>

            {/* Crisis fact cards */}
            <div className="lg:col-span-1 space-y-4">
              {[
                { icon: <TestTube className="w-5 h-5 text-red-400" />, val: '8,491', label: t('Milk samples tested by FSSAI in 2023-24', 'FSSAI द्वारा परीक्षण किए गए नमूने'), sub: '5,764 FAILED quality standards', color: 'border-red-500/30 from-red-950/40' },
                { icon: <HeartPulse className="w-5 h-5 text-amber-400" />, val: '1.5 Cr', label: t('Children affected by milk adulteration annually', 'वार्षिक बाल स्वास्थ्य प्रभाव'), sub: 'Kidney & liver diseases from urea', color: 'border-amber-500/30 from-amber-950/40' },
                { icon: <ShieldAlert className="w-5 h-5 text-purple-400" />, val: '₹12,000', label: t('Max FSSAI fine for adulteration — widely seen as insufficient', 'अपर्याप्त जुर्माना'), sub: 'vs ₹2 Lakh Cr annual fraud scale', color: 'border-purple-500/30 from-purple-950/40' },
                { icon: <Cpu className="w-5 h-5 text-teal-400" />, val: '193M', label: t('Total milch animals in India — 0% digitized', 'NDLM से बाहर पशु'), sub: 'Zero has a verified digital identity', color: 'border-teal-500/30 from-teal-950/40' },
              ].map((f, i) => (
                <div key={i} className={`p-4 rounded-2xl bg-gradient-to-r ${f.color} to-slate-950/60 border ${f.color.split(' ')[0]} flex items-start gap-3`}>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">{f.icon}</div>
                  <div>
                    <div className="font-extrabold text-white font-mono text-base">{f.val}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{f.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why existing solutions fail */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-6">
            <h3 className="text-xl font-bold text-white">{t('Why existing solutions fail', 'मौजूदा समाधान क्यों विफल होते हैं')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: <FileText className="w-5 h-5 text-red-400" />, title: t('Paper-based records', 'कागज़ी रिकॉर्ड'), body: t('Dairy cooperatives still use handwritten ledgers. Easily forged, no audit trail.', 'डेयरी सहकारी अभी भी हाथ से लिखे खाते उपयोग करते हैं। आसानी से जाली।') },
                { icon: <Microscope className="w-5 h-5 text-amber-400" />, title: t('Lab testing only at endpoints', 'केवल अंतिम बिंदु पर परीक्षण'), body: t('FSSAI tests happen after the milk reaches retail. The adulteration has already happened.', 'FSSAI परीक्षण तब होते हैं जब दूध खुदरा बाजार तक पहुंच जाता है।') },
                { icon: <Link className="w-5 h-5 text-teal-400" />, title: t('No end-to-end traceability', 'कोई एंड-टू-एंड ट्रेसेबिलिटी नहीं'), body: t('No system links the milch animal → farm → chilling → processing → pouch. Until Anveshana.', 'कोई सिस्टम पशु → फार्म → शीतलन → प्रसंस्करण → पाउच को नहीं जोड़ता।') },
              ].map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 h-fit">{c.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{c.title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{c.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 bg-[#0b1120]/80">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('The Anveshana Solution', 'अन्वेषण समाधान')}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              {t('Complete traceability in 5 hops', '5 हॉप में पूरी ट्रैसेबिलिटी')}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t('Every node — cryptographically signed, IoT-verified, immutable.', 'हर नोड — क्रिप्टोग्राफिक रूप से हस्ताक्षरित, IoT-सत्यापित, अपरिवर्तनीय।')}
            </p>
          </div>

          {/* Stepper */}
          <div className="relative">
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mx-24" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {STEPS.map((step, i) => {
                const IconComp = step.icon;
                return (
                  <div key={i} className="relative flex flex-col items-center text-center space-y-3">
                    <div className={`relative z-10 w-20 h-20 rounded-3xl ${step.color} border-2 flex items-center justify-center shadow-xl`}>
                      <IconComp className={`w-8 h-8 ${step.iconColor}`} />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0b1120] flex items-center justify-center">
                        <span className="text-[8px] font-bold text-slate-950">{step.num}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">{isHindi ? step.labelHi : step.label}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{isHindi ? step.detailHi : step.detail}</div>
                    </div>
                    {i < STEPS.length - 1 && <ChevronDown className="lg:hidden w-5 h-5 text-emerald-500/50" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech stack callout row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Cpu className="w-5 h-5 text-emerald-400" />, title: 'Essae-SN8831', body: t('IoT Milk Analyzer', 'IoT दूध विश्लेषक'), sub: 'Fat, SNF, Water % real-time' },
              { icon: <Lock className="w-5 h-5 text-teal-400" />, title: 'HSM Secp256k1', body: t('Hardware Key Signing', 'हार्डवेयर की साइनिंग'), sub: 'Physically non-extractable' },
              { icon: <Activity className="w-5 h-5 text-amber-400" />, title: 'AI Mass-Balance', body: t('Adulteration AI Engine', 'मिलावट AI इंजन'), sub: 'Water detection < 2% delta' },
              { icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />, title: 'ONDC DPP', body: t('Digital Product Passport', 'डिजिटल उत्पाद पासपोर्ट'), sub: 'ISO-22000 compliant audit' },
            ].map((t2, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">{t2.icon}<span className="text-xs font-mono font-bold text-white">{t2.title}</span></div>
                <div className="text-sm font-semibold text-slate-200">{t2.body}</div>
                <div className="text-[10px] text-slate-500 font-mono">{t2.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: LIVE BLOCKCHAIN FEED ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              <span>{t('Live On-Chain Activity', 'लाइव ऑन-चेन गतिविधि')}</span>
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-3">{t('Every pour. Every signature. Every scan. Immutable.', 'हर पोर। हर हस्ताक्षर। हर स्कैन। अपरिवर्तनीय।')}</h2>
          </div>
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-3">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-amber-500/60" /><div className="w-3 h-3 rounded-full bg-emerald-500/60" /></div>
              <span className="text-[11px] font-mono text-slate-400">anveshana-chain — live transaction log</span>
              <div className="ml-auto flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /><span className="text-[10px] font-mono text-emerald-400">SYNCING</span></div>
            </div>
            <div className="p-4 font-mono text-xs space-y-2">
              {TX_SAMPLES.map((tx, i) => (
                <div key={i} className={`flex items-center gap-3 py-1.5 px-2 rounded-lg transition-all ${i === txIndex ? 'bg-emerald-500/5 border border-emerald-500/20' : ''}`}>
                  <span className="text-slate-600 w-24 shrink-0">{tx.hash}</span>
                  <span className={`font-bold w-36 shrink-0 ${tx.color}`}>{tx.event}</span>
                  <span className="text-slate-300 flex-1 truncate">{tx.farmer}</span>
                  <span className="text-white shrink-0">{tx.qty}</span>
                  <span className="text-slate-600 shrink-0">{tx.time}</span>
                  {i === txIndex && <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">NEW</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PORTALS ── */}
      <section id="portals" className="py-24 px-6 bg-[#0b1120]/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase">
              {t('WHO USES ANVESHANA', 'कौन उपयोग करता है')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">{t('Built for every stakeholder', 'हर हितधारक के लिए बना')}</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">{t('Five role-based portals — from smallholder farmers to national FSSAI auditors.', 'पांच पोर्टल — किसानों से लेकर राष्ट्रीय FSSAI लेखापरीक्षकों तक।')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {PORTALS.map((portal) => {
              const PortalIcon = portal.icon;
              return (
                <div key={portal.role} className={`group relative p-6 rounded-3xl bg-gradient-to-b ${portal.bg} border ${portal.border} backdrop-blur-sm space-y-4 hover:scale-[1.02] transition-all cursor-pointer shadow-xl ${portal.glow}`} onClick={() => onEnterPortal(portal.role)}>
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
                    <PortalIcon className={`w-6 h-6 ${portal.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{isHindi ? portal.titleHi : portal.title}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-snug">{isHindi ? portal.subtitleHi : portal.subtitle}</div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed hidden xl:block">{portal.desc}</p>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    <span>{t('Enter Portal', 'पोर्टल में जाएं')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: IMPACT NUMBERS ── */}
      <section id="impact" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0b1120] to-teal-950 border border-emerald-500/30 p-12 shadow-2xl shadow-emerald-500/10 space-y-12">
            <div className="text-center space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">{t('Anveshana v1.0 Demo Impact', 'अन्वेषण v1.0 डेमो प्रभाव')}</div>
              <h2 className="text-3xl font-extrabold text-white">{t('Real numbers. Real impact.', 'वास्तविक संख्याएं।')}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '22', label: t('Smallholder Farmers Tracked', 'किसान ट्रैक किए'), color: 'text-emerald-400' },
                { value: '99.8%', label: t('Purity Index Guaranteed', 'शुद्धता सूचकांक'), color: 'text-teal-400' },
                { value: '4-Hop', label: t('End-to-End Traceability', 'पूर्ण ट्रैसेबिलिटी'), color: 'text-amber-400' },
                { value: '<12h', label: t('Farm-to-Consumer', 'फार्म-से-उपभोक्ता'), color: 'text-cyan-400' },
              ].map((s, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className={`text-4xl md:text-5xl font-extrabold ${s.color} font-mono`}>{s.value}</div>
                  <div className="text-xs text-slate-400 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Scalability vision */}
            <div className="border-t border-emerald-500/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, title: t('Scale Target', 'स्केल लक्ष्य'), body: t('193M milch animals → all tagged with NDLM by 2030 per GoI mandate', '193M पशु → 2030 तक सभी NDLM टैग किए जाएं') },
                { icon: <Globe className="w-5 h-5 text-teal-400" />, title: t('National Rollout', 'राष्ट्रीय रोलआउट'), body: t('Integration with 1.5L dairy cooperatives under NDDB network', 'NDDB नेटवर्क के तहत 1.5L डेयरी सहकारी') },
                { icon: <IndianRupee className="w-5 h-5 text-amber-400" />, title: t('Economic Impact', 'आर्थिक प्रभाव'), body: t('Recovering ₹2.1L Cr annually lost to adulteration across India', '₹2.1L Cr वार्षिक मिलावट नुकसान को वापस लाना') },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 h-fit">{item.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: TRUST / POLICY ANCHORS ── */}
      <section className="py-12 px-6 border-y border-slate-800/60 bg-[#0a0f1e]/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-xs font-mono text-slate-500 uppercase tracking-widest mb-8">{t('Anchored in Government Policy & Standards', 'सरकारी नीति और मानकों में निहित')}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { org: 'FSSAI', full: 'Food Safety & Standards Authority of India', color: 'border-emerald-500/20', icon: <Landmark className="w-6 h-6 text-emerald-400 mx-auto" /> },
              { org: 'NDLM', full: 'National Digital Livestock Mission', color: 'border-teal-500/20', icon: <Cpu className="w-6 h-6 text-teal-400 mx-auto" /> },
              { org: 'NABARD', full: 'National Bank for Agriculture', color: 'border-amber-500/20', icon: <Building2 className="w-6 h-6 text-amber-400 mx-auto" /> },
              { org: 'NDDB', full: 'National Dairy Development Board', color: 'border-blue-500/20', icon: <Milk className="w-6 h-6 text-cyan-400 mx-auto" /> },
            ].map((b, i) => (
              <div key={i} className={`p-4 rounded-2xl bg-slate-900/60 border ${b.color} text-center space-y-2`}>
                <div className="flex justify-center">{b.icon}</div>
                <div className="text-sm font-extrabold text-white font-mono">{b.org}</div>
                <div className="text-[10px] text-slate-500 leading-snug">{b.full}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-extrabold text-white">{t('Ready to see Anveshana in action?', 'अन्वेषण को क्रिया में देखने के लिए तैयार हैं?')}</h2>
          <p className="text-slate-400 text-lg">{t('Explore all 5 stakeholder portals — farmer to FSSAI auditor to consumer.', 'सभी 5 पोर्टल एक्सप्लोर करें।')}</p>
          <button onClick={onEnterDemo} className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-lg rounded-2xl flex items-center gap-3 mx-auto shadow-2xl shadow-emerald-500/30 transition-all transform hover:scale-[1.02]">
            <Zap className="w-6 h-6" />
            <span>{t('Launch Live Demo', 'लाइव डेमो शुरू करें')}</span>
          </button>
          <p className="text-slate-600 text-xs font-mono">{t('No login required · 5 portals · Bilingual EN/हिं', 'लॉगिन आवश्यक नहीं · 5 पोर्टल · द्विभाषी EN/हिं')}</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-900 bg-[#04060e] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-base font-extrabold text-white">Anveshana <span className="text-emerald-400 font-serif">अन्वेषण</span></div>
                <div className="text-[10px] text-slate-500 font-mono">India's Open Dairy Intelligence Protocol</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {['FSSAI', 'NDLM', 'NABARD', 'ICAR', 'MoFPI', 'NDDB'].map((org) => (
                <span key={org} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono font-bold">{org}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 font-mono">Built for HackIndia 2026</span>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs font-mono">Anveshana DPI © 2026 · Tamper-evident, hardware-anchored supply chain audit engine</p>
            <p className="text-emerald-500/60 text-sm font-bold font-serif">"दूध का सच, आपकी मुट्ठी में।"</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
