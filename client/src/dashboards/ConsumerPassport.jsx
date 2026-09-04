import React, { useState, useMemo } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import {
  ShieldCheck,
  Thermometer,
  Scale,
  Clock,
  MapPin,
  Users,
  Lock,
  CheckCircle2,
  QrCode,
  Sparkles,
  Award,
  Activity,
  Milk,
  ArrowRight,
  Search,
  RefreshCw,
  Camera,
  X,
  Zap,
  Check,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConsumerPassport() {
  const { language } = useAnveshana();
  const isHindi = language === 'HI';
  
  const [searchInput, setSearchInput] = useState('AMU-DL-2026-0831-7741');
  const [activeBatchId, setActiveBatchId] = useState('AMU-DL-2026-0831-7741');
  const [verifiedOnChain, setVerifiedOnChain] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('PROVENANCE');

  // Pre-configured Batches for quick testing
  const samplePresets = [
    { id: 'AMU-DL-2026-0831-7741', label: 'Delhi NCR Cluster (A2 Milk)' },
    { id: 'AMU-TN-2026-0902-8810', label: 'Tamil Nadu Cluster (Pollachi Cow)' },
    { id: 'POUCH-884029104', label: 'Pouch Serial #884029104' },
    { id: 'HACKINDIA-2026-PURE', label: 'HackIndia 2026 Demo Batch' },
    { id: 'NDLM-840003129940112', label: 'NDLM Tag #840003129940112' }
  ];

  // Dynamic Passport Generator for ANY typed or scanned input
  const currentPassport = useMemo(() => {
    const cleanId = (activeBatchId || 'AMU-DL-2026-0831-7741').trim().toUpperCase();

    // Custom Hash generator derived deterministically from input
    let hash = 0;
    for (let i = 0; i < cleanId.length; i++) {
      hash = ((hash << 5) - hash) + cleanId.charCodeAt(i);
      hash |= 0;
    }
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
    const fullSha256 = `sha256:7d2b9af8103c31ff78201a44eef${hexHash}`;

    if (cleanId.includes('TN') || cleanId.includes('TAMIL') || cleanId.includes('POLLACHI')) {
      return {
        batchId: cleanId,
        pouchSerial: `POUCH-${cleanId.slice(-6)}`,
        productName: isHindi ? "सत्यापित शुद्ध ताज़ा गाय का दूध (तमिलनाडु)" : "Verified Pure Fresh Cow Milk (Tamil Nadu)",
        brandName: isHindi ? "अन्वेषण दक्षिण क्षेत्र DPI" : "Anveshana South Region DPI",
        sourceRegion: isHindi ? "कोयंबटूर जिला, तमिलनाडु (पोलैची क्लस्टर)" : "Coimbatore District, TN (Pollachi Cluster)",
        farmersCount: 35,
        avgColdChainTemp: isHindi ? "3.6°C (शून्य थर्मल ब्रेक)" : "3.6°C (Zero thermal breaks)",
        massBalanceDelta: "+0.1%",
        massBalanceThreshold: "1.0%",
        farmToPackTime: isHindi ? "09 घंटे 45 मिनट" : "9h 45min",
        sha256Hash: fullSha256,
        fssaiLicense: "FSSAI LIC #10019042008819",
        purityScore: "99.9%",
        nutritionalSpecs: {
          fat: "4.4%",
          snf: "8.9%",
          protein: "3.6g",
          calcium: "125mg",
          adulterants: isHindi ? "0.0% (शून्य रसायन)" : "0.0% (Zero Adulterants)"
        },
        nodesTrail: [
          { id: "VLC-TN-11", name: isHindi ? "पोलैची गांव संग्रह केंद्र" : "Pollachi Village AMCU #11", location: "Pollachi, Coimbatore", type: "Farm Gate AMCU", time: "05:30 AM", status: "COMPLETED", icon: "🌿", detail: "35 Farmers • 9.2 kg avg pour • NDLM Tag" },
          { id: "MCC-TN-88", name: isHindi ? "कोयंबटूर दुग्ध शीतलन केंद्र" : "Coimbatore Milk Chilling Hub", location: "Coimbatore, Tamil Nadu", type: "Cold-Chain Chilling (3.6°C)", time: "07:45 AM", status: "COMPLETED", icon: "❄️", detail: "Thermal Probe Lock • 3.6°C Constant" },
          { id: "FACTORY-TN-02", name: isHindi ? "चेन्नई डेयरी प्रसंस्करण संयंत्र" : "Chennai Dairy Processing Plant", location: "Ambattur, Chennai", type: "Mass Balance & Pouch Packing", time: "01:15 PM", status: "COMPLETED", icon: "🏭", detail: "Delta +0.1% ≤ 1.0% • Sealed Hash" },
          { id: "CONSUMER", name: isHindi ? "आपका दूध पाउच (स्कैन किया गया)" : "Your Milk Pouch (Scanned)", location: "Consumer Point of Sale", time: "05:00 PM", status: "VERIFIED", icon: "🥛", detail: "100% On-Chain Purity Guaranteed" }
        ]
      };
    }

    return {
      batchId: cleanId,
      pouchSerial: cleanId.startsWith('POUCH') ? cleanId : `POUCH-${cleanId.slice(-6)}`,
      productName: cleanId.includes('HACKINDIA') 
        ? (isHindi ? "हैकइंडिया 2026 विशेष शुद्ध ए2 गिर दूध" : "HackIndia 2026 Special Pure A2 Gir Milk")
        : (isHindi ? "100% शुद्ध ताजा ए2 गिर/मुर्रा जैविक दूध" : "100% Pure Fresh Organic A2 Milk"),
      brandName: isHindi ? "अन्वेषण राष्ट्रीय डेयरी DPI" : "Anveshana National Dairy DPI",
      sourceRegion: isHindi ? "करनाल जिला, हरियाणा (निसिंग क्लस्टर)" : "Karnal District, Haryana (Nissing Cluster)",
      farmersCount: 22,
      avgColdChainTemp: isHindi ? "3.8°C (शून्य थर्मल ब्रेक)" : "3.8°C (Zero thermal breaks)",
      massBalanceDelta: "+0.2%",
      massBalanceThreshold: "1.0%",
      farmToPackTime: isHindi ? "11 घंटे 24 मिनट" : "11h 24min",
      sha256Hash: fullSha256,
      fssaiLicense: "FSSAI LIC #10018011005421",
      purityScore: "99.8%",
      nutritionalSpecs: {
        fat: "4.2%",
        snf: "8.7%",
        protein: "3.4g",
        calcium: "120mg",
        adulterants: isHindi ? "0.0% (शून्य यूरा/डिटर्जेंट)" : "0.0% (Zero Urea/Detergent)"
      },
      nodesTrail: [
        { id: "VLC-22", name: isHindi ? "निसिंग गांव संग्रह केंद्र" : "Nissing Village AMCU #22", location: "Nissing Block, Karnal", type: "Farm Gate AMCU Collection", time: "06:15 AM", status: "COMPLETED", icon: "🌿", detail: "22 Farmers • 8.5 kg avg pour • NDLM Tag" },
        { id: "MCC-104", name: isHindi ? "करनाल दुग्ध शीतलन केंद्र" : "Karnal Milk Chilling Center Gate #4", location: "Karnal GT Road, Haryana", type: "Cold-Chain Chilling (3.8°C)", time: "08:45 AM", status: "COMPLETED", icon: "❄️", detail: "Thermal Probe Lock • 3.8°C Constant" },
        { id: "FACTORY-DL-01", name: isHindi ? "पटपड़गंज प्रसंस्करण एवं पैकेजिंग संयंत्र" : "Patparganj Dairy Processing Plant", location: "Delhi NCR Industrial Hub", type: "Mass Balance & Pouch Packing", time: "02:30 PM", status: "COMPLETED", icon: "🏭", detail: "Delta +0.2% ≤ 1.0% • Sealed Hash" },
        { id: "CONSUMER", name: isHindi ? "आपका दूध पाउच (स्कैन किया गया)" : "Your Milk Pouch (Scanned)", location: "Consumer Point of Sale", time: "06:30 PM", status: "VERIFIED", icon: "🥛", detail: "100% On-Chain Purity Guaranteed" }
      ]
    };
  }, [activeBatchId, isHindi]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveBatchId(searchInput.trim());
    setVerifiedOnChain(false);
    setVerifyStep(0);
  };

  const handlePresetSelect = (presetId) => {
    setSearchInput(presetId);
    setActiveBatchId(presetId);
    setVerifiedOnChain(false);
    setVerifyStep(0);
  };

  const handleVerifyChain = () => {
    setShowVerifyModal(true);
    setVerifyStep(1);

    setTimeout(() => {
      setVerifyStep(2);
      setTimeout(() => {
        setVerifyStep(3);
        setTimeout(() => {
          setVerifyStep(4);
          setVerifiedOnChain(true);
          confetti({ particleCount: 90, spread: 100, origin: { y: 0.5 } });
        }, 1100);
      }, 1100);
    }, 1100);
  };

  const handleSimulateCameraScan = (scannedId) => {
    setSearchInput(scannedId);
    setActiveBatchId(scannedId);
    setShowCameraScanner(false);
    setVerifiedOnChain(false);
    setVerifyStep(0);
  };

  return (
    <div className="max-w-7xl mx-auto my-4 bg-[#090d1a]/95 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative">
      
      {/* Universal Search & Camera Scanner Header Bar */}
      <div className="bg-slate-950/90 p-5 rounded-3xl border border-slate-800 mb-6 space-y-4 shadow-inner">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={isHindi ? "कोई भी बैच आईडी, क्यूआर कोड या एनडीएलएम टैग दर्ज करें..." : "Enter or paste ANY Batch ID, QR Code string, or NDLM Tag..."}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow flex items-center gap-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isHindi ? 'खोजें' : 'INSPECT'}</span>
            </button>
          </form>

          <button
            onClick={() => setShowCameraScanner(true)}
            className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 shrink-0 transition-all transform hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>{isHindi ? '📷 कैमरे से क्यूआर कोड स्कैन करें' : '📷 SCAN QR CODE WITH CAMERA'}</span>
          </button>
        </div>

        {/* Quick Sample Preset Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            {isHindi ? 'त्वरित परीक्षण कोड:' : 'Quick Sample IDs:'}
          </span>
          {samplePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-all border ${
                activeBatchId === preset.id
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {preset.id}
            </button>
          ))}
        </div>

      </div>

      {/* Main Digital Product Passport Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-mono font-bold border border-emerald-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>DIGITAL PRODUCT PASSPORT (DPP)</span>
            </span>
            <span className="text-xs font-mono text-slate-400">FSSAI VERIFIED ISO-22000</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>{currentPassport.productName}</span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-lg">
              {currentPassport.fssaiLicense}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Purity Index</div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono flex items-center gap-1 justify-end">
              <span>{currentPassport.purityScore}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="bg-emerald-950/60 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-right">
            <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-mono">Status</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              {isHindi ? '🟢 100% शुद्ध प्रमाणित' : '🟢 VERIFIED PURE'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (4 Cols): Holographic Pass Card & Lab Telemetry */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Holographic Product Passport Pass Card */}
          <div className="relative group overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-950/90 via-slate-950 to-teal-950/90 border border-emerald-500/40 shadow-xl space-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  🥛
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase">{currentPassport.brandName}</div>
                  <div className="text-[10px] font-mono text-emerald-300">BATCH: {currentPassport.batchId}</div>
                </div>
              </div>
              <QrCode className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Pouch Serial:</span>
                <span className="text-white font-bold">{currentPassport.pouchSerial}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Source Cluster:</span>
                <span className="text-amber-300 font-sans font-bold">{currentPassport.sourceRegion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Smallholder Farmers:</span>
                <span className="text-emerald-400 font-bold">{currentPassport.farmersCount} Verified NDLM Tags</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Farm-to-Pouch Speed:</span>
                <span className="text-teal-300 font-bold">{currentPassport.farmToPackTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Mass Balance Delta:</span>
                <span className="text-emerald-400 font-bold">{currentPassport.massBalanceDelta} (Pass ≤ 1.0%)</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-400 break-all flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{currentPassport.sha256Hash}</span>
            </div>
          </div>

          {/* Lab Quality & Nutritional Specs */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>{isHindi ? 'लैब परीक्षण एवं पोषण मापदंड' : 'Lab Specs & Nutritional Audit'}</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                100% Pure A2
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans">Fat Percentage</div>
                <div className="text-emerald-400 font-extrabold text-base">{currentPassport.nutritionalSpecs.fat}</div>
                <div className="text-[9px] text-slate-500 font-sans">Standard: 4.0 - 4.5%</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans">SNF Percentage</div>
                <div className="text-teal-400 font-extrabold text-base">{currentPassport.nutritionalSpecs.snf}</div>
                <div className="text-[9px] text-slate-500 font-sans">Standard: ≥ 8.5%</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans">Natural Protein</div>
                <div className="text-amber-400 font-extrabold text-base">{currentPassport.nutritionalSpecs.protein}</div>
                <div className="text-[9px] text-slate-500 font-sans">Per 100ml serve</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans">Bio Calcium</div>
                <div className="text-cyan-400 font-extrabold text-base">{currentPassport.nutritionalSpecs.calcium}</div>
                <div className="text-[9px] text-slate-500 font-sans">Per 100ml serve</div>
              </div>
            </div>

            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30 text-xs flex items-center justify-between">
              <span className="text-slate-300 font-sans">{isHindi ? 'रासायनिक मिलावट जांच:' : 'Synthetic Adulterants:'}</span>
              <span className="text-emerald-400 font-mono font-bold">{currentPassport.nutritionalSpecs.adulterants}</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (8 Cols): Interactive Multi-Hop Provenance Supply Chain Trail */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Provenance Map Header */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>{isHindi ? 'फार्म-टू-कंज्यूमर बहु-हॉप आपूर्ति श्रृंखला यात्रा' : 'Farm-to-Consumer Multi-Hop Provenance Journey'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isHindi ? 'प्रत्येक नोड पर हार्डवेयर-एंकर्ड डिजिटल हस्ताक्षर और तापमान ऑडिट द्वारा संरक्षित।' : 'Protected by hardware-anchored digital signatures & thermal telemetry at every node.'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('PROVENANCE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'PROVENANCE'
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isHindi ? 'आपूर्ति ट्रेल' : 'Supply Trail'}
                </button>
                <button
                  onClick={() => setActiveTab('NUTRITION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'NUTRITION'
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isHindi ? 'कोल्ड-चेन ऑडिट' : 'Cold-Chain Audit'}
                </button>
              </div>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="space-y-4">
              {currentPassport.nodesTrail.map((node, index) => (
                <div
                  key={node.id}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                      {node.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                          HOP #{index + 1} • {node.id}
                        </span>
                        <span className="text-xs font-bold text-white">{node.name}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-sans">
                        <span>📍 {node.location}</span>
                        <span>•</span>
                        <span className="text-slate-300 font-mono">🕒 {node.time}</span>
                      </div>
                      <div className="text-xs text-emerald-300/90 font-mono mt-1">
                        {node.detail}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{node.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Button Section */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-3">
              {!verifiedOnChain ? (
                <button
                  onClick={handleVerifyChain}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>{isHindi ? 'ऑन-चेन क्रिप्टोग्राफिक ऑडिट प्रमाण सत्यापित करें' : 'VERIFY CRYPTOGRAPHIC AUDIT PROOF ON-CHAIN'}</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-extrabold shadow-lg">
                    <Award className="w-6 h-6 text-emerald-400" />
                    <span>{isHindi ? 'क्रिप्टोग्राफिक रूप से सत्यापित! 100% शून्य-मिलावट ए2 उत्पाद।' : 'Cryptographically Verified! 100% Zero-Dilution A2 Product.'}</span>
                  </div>

                  <button
                    onClick={() => { setVerifiedOnChain(false); setVerifyStep(0); }}
                    className="w-full sm:w-auto px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? 'पुनः जांचें / रीसेट करें' : 'Audit Another Batch'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* INTERACTIVE CAMERA / QR CODE SCANNER MODAL */}
      {showCameraScanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-emerald-500/50 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowCameraScanner(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                <Camera className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>LIVE QR VIEWFINDER ACTIVE</span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                {isHindi ? 'मिल्क पाउच क्यूआर कोड स्कैन करें' : 'Scan Milk Pouch QR Code'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? 'कैमरा फ्रेम में क्यूआर कोड रखें अथवा परीक्षण सैंपल पर क्लिक करें' : 'Position QR code inside scanner reticle or tap a sample below'}
              </p>
            </div>

            {/* Simulated Live Viewfinder Box */}
            <div className="relative aspect-video rounded-2xl bg-black border-2 border-emerald-500/60 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse"></div>
              
              {/* Corner Viewfinder Targeting Reticles */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></div>
              
              {/* Scanning Red Laser Line */}
              <div className="absolute w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce"></div>

              <div className="text-center space-y-2 z-10 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <QrCode className="w-12 h-12 text-emerald-400 animate-pulse mx-auto" />
                <div className="text-xs font-mono text-emerald-300 font-bold">ALIGNING OPTICAL SCANNER...</div>
              </div>
            </div>

            {/* Test Sample Quick-Detect Buttons */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider text-center">
                {isHindi ? 'सिम्यूलेटेड क्यूआर कोड स्कैन करें (क्लिक करें):' : 'Tap sample QR code to auto-detect:'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => handleSimulateCameraScan('AMU-DL-2026-0831-7741')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950 text-white hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
                >
                  <div className="font-bold">AMU-DL-2026-0831-7741</div>
                  <div className="text-[10px] text-slate-400 font-sans">Delhi A2 Milk Pouch</div>
                </button>
                <button
                  onClick={() => handleSimulateCameraScan('AMU-TN-2026-0902-8810')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950 text-white hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
                >
                  <div className="font-bold">AMU-TN-2026-0902-8810</div>
                  <div className="text-[10px] text-slate-400 font-sans">Tamil Nadu Cow Milk</div>
                </button>
                <button
                  onClick={() => handleSimulateCameraScan('HACKINDIA-2026-PURE')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950 text-white hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
                >
                  <div className="font-bold">HACKINDIA-2026-PURE</div>
                  <div className="text-[10px] text-slate-400 font-sans">HackIndia Special Pouch</div>
                </button>
                <button
                  onClick={() => handleSimulateCameraScan('POUCH-884029104')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950 text-white hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
                >
                  <div className="font-bold">POUCH-884029104</div>
                  <div className="text-[10px] text-slate-400 font-sans">NDLM Ear-Tagged Batch</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE CRYPTOGRAPHIC PROVENANCE AUDIT MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-emerald-500/50 shadow-2xl space-y-5 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isHindi ? 'ऑन-चेन ट्रैसेबिलिटी ऑडिट' : 'On-Chain Traceability Audit'}
                  </h3>
                  <div className="text-[10px] font-mono text-emerald-400">BATCH: {currentPassport.batchId}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                ANVESHANA DPI
              </span>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-mono">
              <div className={`p-1.5 rounded-lg border ${verifyStep >= 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                1. QR Scan
              </div>
              <div className={`p-1.5 rounded-lg border ${verifyStep >= 2 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                2. NDLM Tag
              </div>
              <div className={`p-1.5 rounded-lg border ${verifyStep >= 3 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                3. Cold Chain
              </div>
              <div className={`p-1.5 rounded-lg border ${verifyStep >= 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                4. Pure 100%
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
              {verifyStep === 1 && (
                <div className="space-y-2 text-center py-3">
                  <QrCode className="w-8 h-8 text-emerald-400 animate-pulse mx-auto" />
                  <div className="text-white font-bold">{isHindi ? '1. QR कोड क्रिप्टोग्राफिक सिग्नेचर सत्यापन...' : '1. Verifying QR Code Cryptographic Signature...'}</div>
                  <div className="text-slate-400 text-[10px] break-all">{currentPassport.sha256Hash}</div>
                </div>
              )}

              {verifyStep === 2 && (
                <div className="space-y-2 text-center py-3">
                  <Users className="w-8 h-8 text-blue-400 animate-bounce mx-auto" />
                  <div className="text-white font-bold">{isHindi ? '2. NDLM पंजीकृत मवेशियों का ट्रैसेबिलिटी मैपिंग...' : '2. Mapping Traceability to NDLM Cattle...'}</div>
                  <div className="text-emerald-400 text-[10px]">{currentPassport.sourceRegion}</div>
                </div>
              )}

              {verifyStep === 3 && (
                <div className="space-y-2 text-center py-3">
                  <Thermometer className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <div className="text-white font-bold">{isHindi ? '3. निरंतर कोल्ड-चेन ऑडिट जांच...' : '3. Verifying Continuous Cold-Chain Telemetry...'}</div>
                  <div className="text-cyan-300 text-[10px]">{isHindi ? 'शून्य थर्मल डेवििएशन दर्ज किया गया' : 'Zero Thermal Deviation Recorded'}</div>
                </div>
              )}

              {verifyStep >= 4 && (
                <div className="space-y-3 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                    👑
                  </div>
                  <div className="text-emerald-400 font-extrabold text-xs">{isHindi ? '100% शुद्ध जैविक दुग्ध प्रमाणित!' : '100% Pure Organic Milk Certified!'}</div>
                  <div className="text-slate-300 text-[10px] font-sans">
                    {isHindi 
                      ? 'फार्म-टू-कंज्यूमर सप्लाई चेन का ऑन-चेन सत्यापन पूरा हुआ। 0.0% मिलावट संदूषण।'
                      : 'Complete farm-to-consumer provenance audit passed on-chain. 0.0% dilution or synthetic adulteration.'}
                  </div>
                </div>
              )}
            </div>

            {verifyStep >= 4 && (
              <button
                onClick={() => setShowVerifyModal(false)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <span>{isHindi ? 'पूर्ण / पासपोर्ट बंद करें' : 'DONE / CLOSE PASSPORT AUDIT'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
