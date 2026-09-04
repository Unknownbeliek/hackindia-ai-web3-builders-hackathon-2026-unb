import React, { useState, useEffect } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { Lock, Tablet, Wifi, WifiOff, AlertTriangle, CheckCircle2, QrCode, RefreshCw, Send, ShieldAlert, Cpu, HardDrive, Key, FileCheck, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AggregatorTablet() {
  const {
    farmers,
    addPourEvent,
    isOnline,
    pourEvents,
    setActiveEvidenceModal,
    language
  } = useAnveshana();

  const isHindi = language === 'HI';

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0].farmerId);
  const selectedFarmer = farmers.find(f => f.farmerId === selectedFarmerId) || farmers[0];

  // Hardware Serial Telemetry Lock State (Essae-SN8831)
  const [amcuStream, setAmcuStream] = useState({
    weightKg: 8.5,
    fatPercent: 4.2,
    snfPercent: 8.7,
    hardwareStatus: 'LOCKED_SERIAL',
    chillerTempC: 3.8,
    gpsSealLocked: true
  });

  const [yieldViolationError, setYieldViolationError] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [showManifestQR, setShowManifestQR] = useState(false);

  // Hardware Signing Interactive Simulation Modal State
  const [signingModal, setSigningModal] = useState({
    isOpen: false,
    step: 1, // 1: RS232 Serial Read, 2: HSM Secp256k1 Signature, 3: Yield Verification, 4: SHA-256 Digest & Payout
    payload: null,
    hardwareSignature: null,
    shaHash: null,
    payoutAmt: 0
  });

  // Live Hardware Simulation Stream
  useEffect(() => {
    const interval = setInterval(() => {
      setAmcuStream(prev => ({
        ...prev,
        weightKg: +(7.8 + Math.random() * 2.2).toFixed(1),
        fatPercent: +(3.9 + Math.random() * 0.5).toFixed(1),
        snfPercent: +(8.4 + Math.random() * 0.4).toFixed(1),
        chillerTempC: +(3.6 + Math.random() * 0.4).toFixed(1)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStartHardwareSigning = () => {
    setYieldViolationError(null);

    // AI Dynamic Yield Limit Check: Max expected yield = registeredCows * 12.0 kg per session
    const maxExpectedKg = selectedFarmer.registeredCows * 12.0;

    if (amcuStream.weightKg > maxExpectedKg) {
      setYieldViolationError({
        farmerName: selectedFarmer.name,
        cows: selectedFarmer.registeredCows,
        maxExpectedKg,
        actualKg: amcuStream.weightKg,
        reason: isHindi
          ? `दूध का वजन ${amcuStream.weightKg}किग्रा ${selectedFarmer.registeredCows} पंजीकृत मवेशियों के लिए अधिकतम जैविक उपज सीमा (${maxExpectedKg}किग्रा) से अधिक है।`
          : `Pour weight ${amcuStream.weightKg}kg exceeds max biological yield limit (${maxExpectedKg}kg) for ${selectedFarmer.registeredCows} registered cows.`
      });
      return;
    }

    const calculatedPayout = +(amcuStream.weightKg * (amcuStream.fatPercent * 6.5 + amcuStream.snfPercent * 4.2)).toFixed(2);
    const mockSignature = `0x8f3a${Math.random().toString(16).substring(2, 10)}9c0b1e4f${Math.random().toString(16).substring(2, 10)}`;
    const mockHash = `sha256:${Math.random().toString(16).substring(2, 18)}...${Math.random().toString(16).substring(2, 8)}`;

    const pourPayload = {
      farmerId: selectedFarmer.farmerId,
      farmerName: selectedFarmer.name,
      nodeId: 'VLC-22',
      weightKg: amcuStream.weightKg,
      fatPercent: amcuStream.fatPercent,
      snfPercent: amcuStream.snfPercent,
      yieldStatus: 'PASS'
    };

    // Launch Hardware Signing Modal
    setSigningModal({
      isOpen: true,
      step: 1,
      payload: pourPayload,
      hardwareSignature: mockSignature,
      shaHash: mockHash,
      payoutAmt: calculatedPayout
    });

    // Step 1 -> 2
    setTimeout(() => {
      setSigningModal(prev => ({ ...prev, step: 2 }));
    }, 900);

    // Step 2 -> 3
    setTimeout(() => {
      setSigningModal(prev => ({ ...prev, step: 3 }));
    }, 1800);

    // Step 3 -> 4 (Final Confirmation)
    setTimeout(() => {
      setSigningModal(prev => ({ ...prev, step: 4 }));
      if (!isOnline) {
        setOfflineQueue(prev => [pourPayload, ...prev]);
      } else {
        addPourEvent(pourPayload);
        confetti({ particleCount: 60, spread: 70 });
      }
    }, 2700);
  };

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    offlineQueue.forEach(item => addPourEvent(item));
    setOfflineQueue([]);
    confetti({ particleCount: 70 });
  };

  return (
    <div className="max-w-7xl mx-auto my-2 space-y-6">
      
      {/* Top Banner / Station Overview */}
      <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold shadow-lg">
            <Tablet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-400 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border border-teal-500/30">
                STATION AMCU-VLC-22
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {isHindi ? 'निसिंग गांव संग्रह केंद्र (करनाल, हरियाणा)' : 'Nissing Village Collection Center (Karnal, HR)'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {isHindi ? 'संग्राहक एएमसीयू संग्रह और हार्डवेयर साइनिंग कंसोल' : 'Aggregator AMCU Milk Collection & Hardware Signing Console'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Hardware Lock Badge */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>ESSAE-SN8831 HSM LOCKED</span>
          </div>

          {/* Connection Status Badge */}
          <div className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
            isOnline ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' : 'bg-amber-950/80 border-amber-500/40 text-amber-400'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 animate-pulse" />}
            <span>
              {isOnline 
                ? (isHindi ? 'ऑनलाइन सिंक (लाइव)' : 'ONLINE SYNC (LIVE)') 
                : (isHindi ? `ऑफ़लाइन कतार (${offlineQueue.length})` : `OFFLINE QUEUE (${offlineQueue.length})`)}
            </span>
          </div>

          {!isOnline && offlineQueue.length > 0 && (
            <button
              onClick={handleSyncOfflineQueue}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> {isHindi ? 'सिंक करें' : 'Sync'} ({offlineQueue.length})
            </button>
          )}
        </div>
      </div>

      {/* Main 12-Column Responsive Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Farmer Selection & Session Config (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {isHindi ? 'किसान चुनें (NDLM टैग प्रमाणित)' : 'SELECT FARMER (NDLM TAG VERIFIED)'}
              </label>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                NDLM Verified
              </span>
            </div>

            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full glass-input text-xs rounded-xl p-3 focus:outline-none text-white font-medium bg-slate-900 border border-slate-700"
            >
              {farmers.map((f) => (
                <option key={f.farmerId} value={f.farmerId} className="bg-slate-900 text-white">
                  {f.name} ({f.farmerId}) — {f.registeredCows} {isHindi ? 'मवेशी' : 'Cattle'}
                </option>
              ))}
            </select>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">NDLM RFID Ear Tag:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedFarmer.ndlmTag}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isHindi ? 'नस्ल और मवेशी संख्या:' : 'Breed & Cattle Count:'}</span>
                <span className="text-white font-semibold">{selectedFarmer.animalBreed} ({selectedFarmer.registeredCows} {isHindi ? 'मवेशी' : 'Cattle'})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{isHindi ? 'अधिकतम जैविक जमाव सीमा:' : 'Max Biological Limit:'}</span>
                <span className="text-amber-400 font-mono font-bold">{selectedFarmer.registeredCows * 12.0} kg</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">{isHindi ? 'अनुमानित भुगतान दर:' : 'Estimated Rate:'}</span>
                <span className="text-teal-300 font-mono font-bold">₹{(amcuStream.fatPercent * 6.5 + amcuStream.snfPercent * 4.2).toFixed(2)} / L</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowManifestQR(true)}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>{isHindi ? 'टैंकर प्रेषण मैनिफेस्ट QR बनाएं' : 'Generate Tanker Dispatch Manifest QR'}</span>
          </button>
        </div>

        {/* Right Column: Live Telemetry Gauges & Hardware Signing (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel-glow p-6 rounded-2xl border border-teal-500/40 relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-400 animate-pulse" />
                <span className="text-xs font-extrabold text-teal-400 tracking-wider uppercase font-mono">
                  {isHindi ? 'एसाए-SN8831 एएमसीयू हार्डवेयर टेलीमेट्री स्ट्रीम' : 'ESSAE-SN8831 AMCU HARDWARE STREAM'}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono bg-teal-950 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-500/30">
                <Lock className="w-3.5 h-3.5 text-teal-400" /> READ-ONLY SERIAL LOCK
              </span>
            </div>

            {/* Read-Only Hardware Metric Telemetry Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{isHindi ? 'दूध वजन' : 'MILK WEIGHT'}</div>
                <div className="text-2xl font-extrabold text-white font-mono mt-1">{amcuStream.weightKg} <span className="text-xs text-slate-400">kg</span></div>
                <div className="text-[9px] text-emerald-400 font-mono mt-1">Load-Cell Scale</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{isHindi ? 'फैट %' : 'FAT %'}</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{amcuStream.fatPercent}%</div>
                <div className="text-[9px] text-teal-400 font-mono mt-1">Ultrasonic Sensor</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{isHindi ? 'एसएनएफ %' : 'SNF %'}</div>
                <div className="text-2xl font-extrabold text-teal-400 font-mono mt-1">{amcuStream.snfPercent}%</div>
                <div className="text-[9px] text-teal-400 font-mono mt-1">Refractometer</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{isHindi ? 'चिलर तापमान' : 'CHILLER TEMP'}</div>
                <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">{amcuStream.chillerTempC}°C</div>
                <div className="text-[9px] text-cyan-400 font-mono mt-1">Thermal Probe</div>
              </div>
            </div>

            {/* Dynamic AI Yield Violation Banner */}
            {yieldViolationError && (
              <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>{isHindi ? 'एआई डायनामिक उपज उल्लंघन — स्वतः निरस्त' : 'AI DYNAMIC YIELD VIOLATION — AUTO-REJECTED'}</span>
                </div>
                <p className="text-[11px] leading-snug opacity-95">{yieldViolationError.reason}</p>
                <div className="text-[10px] text-rose-300 font-mono bg-slate-950 p-2 rounded border border-rose-500/30">
                  {isHindi ? 'FSSAI जिला अलर्ट दर्ज किया गया • करनाल अधिकारी को एसएमएस अलर्ट भेजा गया' : 'FSSAI District Alert Logged • SMS alert dispatched to Karnal Officer'}
                </div>
              </div>
            )}

            {/* Main Interactive Action Button */}
            <button
              onClick={handleStartHardwareSigning}
              className="w-full py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-2xl flex items-center justify-center gap-2 tracking-wider uppercase transition-all ring-1 ring-teal-400/40"
            >
              <Key className="w-5 h-5 text-slate-950" />
              <span>{isHindi ? 'स्वीकार करें और हार्डवेयर हस्ताक्षरित रसीद दर्ज करें' : 'ACCEPT & LOG HARDWARE SIGNED POUR RECEIPT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step Hardware Cryptographic Signing Modal */}
      {signingModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-teal-500/50 space-y-5 relative animate-in fade-in zoom-in duration-200 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-teal-400 animate-spin" />
                <h3 className="text-base font-extrabold text-white">
                  {isHindi ? 'हार्डवेयर क्रिप्टोग्राफिक हस्ताक्षर सिमुलेशन' : 'IoT Hardware Cryptographic Signing Protocol'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-500/40">
                HSM Secp256k1
              </span>
            </div>

            {/* Step Progress Tracker */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold">
              <div className={`p-2 rounded-lg border ${signingModal.step >= 1 ? 'bg-teal-950 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                1. RS232 Read
              </div>
              <div className={`p-2 rounded-lg border ${signingModal.step >= 2 ? 'bg-teal-950 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                2. HSM Sign
              </div>
              <div className={`p-2 rounded-lg border ${signingModal.step >= 3 ? 'bg-teal-950 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                3. AI Verification
              </div>
              <div className={`p-2 rounded-lg border ${signingModal.step >= 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                4. Payout Sent
              </div>
            </div>

            {/* Step Content Visualizer */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
              {signingModal.step === 1 && (
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <Cpu className="w-4 h-4 animate-pulse" />
                    <span>Phase 1: Reading RS232 Encrypted Telemetry</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Weight: {signingModal.payload?.weightKg}kg | Fat: {signingModal.payload?.fatPercent}% | SNF: {signingModal.payload?.snfPercent}%
                  </div>
                  <div className="text-[10px] text-slate-500">Hardware Serial: ESSAE-SN8831-VLC22</div>
                </div>
              )}

              {signingModal.step === 2 && (
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Key className="w-4 h-4 animate-spin" />
                    <span>Phase 2: Generating Secp256k1 Hardware Signature</span>
                  </div>
                  <div className="text-[10px] text-amber-300 break-all bg-slate-900 p-2 rounded border border-amber-500/30">
                    {signingModal.hardwareSignature}
                  </div>
                </div>
              )}

              {signingModal.step === 3 && (
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <FileCheck className="w-4 h-4 text-teal-400" />
                    <span>Phase 3: AI Dynamic Yield Verification & Anchoring</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    ✓ Biological Limit Passed ({signingModal.payload?.weightKg}kg ≤ {selectedFarmer.registeredCows * 12.0}kg)
                  </div>
                  <div className="text-[10px] text-slate-400 break-all">
                    Digest: {signingModal.shaHash}
                  </div>
                </div>
              )}

              {signingModal.step === 4 && (
                <div className="space-y-3 text-slate-300 text-center py-2 animate-in zoom-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-white font-sans">
                    {isHindi ? 'हार्डवेयर रसीद क्रिप्टोग्राफिक रूप से लॉक!' : 'Hardware Receipt Cryptographically Locked!'}
                  </h4>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    ₹{signingModal.payoutAmt} <span className="text-xs text-slate-400">Direct Bank Credit</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Farmer: {signingModal.payload?.farmerName} ({signingModal.payload?.farmerId})
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer */}
            {signingModal.step === 4 && (
              <button
                onClick={() => setSigningModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl uppercase tracking-wider"
              >
                {isHindi ? 'पूर्ण / बंद करें' : 'Done / Close Receipt'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Manifest QR Modal */}
      {showManifestQR && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-teal-500/40 text-center relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400/40 mx-auto flex items-center justify-center text-teal-400 text-2xl mb-2 font-mono">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{isHindi ? 'टैंकर प्रेषण मैनिफेस्ट QR' : 'Tanker Dispatch Manifest QR'}</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Batch #BATCH-20260903-TN401 (4,820 L)</p>

            <div className="my-5 p-4 bg-white rounded-2xl max-w-[200px] mx-auto border-4 border-teal-500 shadow-2xl">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ANVESHANA_MANIFEST_BATCH_TN401_SHA256_VERIFIED"
                alt="Manifest QR"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono mb-4">
              {isHindi ? '22 किसान जमाव रसीदें और वे-ब्रिज हैश युक्त क्रिप्टोग्राफिक रूप से हस्ताक्षरित मैनिफेस्ट।' : 'Cryptographically signed manifest containing 22 farmer pour receipts & hardware weigh-bridge hash.'}
            </div>

            <button
              onClick={() => setShowManifestQR(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              {isHindi ? 'पूर्ण / बंद करें' : 'Done / Close Manifest'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
