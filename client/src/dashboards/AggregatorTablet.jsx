import React, { useState, useEffect } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { Lock, Tablet, Wifi, WifiOff, AlertTriangle, CheckCircle2, QrCode, RefreshCw, Send, ShieldAlert, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AggregatorTablet() {
  const {
    farmers,
    addPourEvent,
    isOnline,
    pourEvents,
    setActiveEvidenceModal,
    injectVolumeAnomalySimulation
  } = useAnveshana();

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0].farmerId);
  const selectedFarmer = farmers.find(f => f.farmerId === selectedFarmerId) || farmers[0];

  // Hardware Serial Telemetry Lock State (Essae-SN8831)
  const [amcuStream, setAmcuStream] = useState({
    weightKg: 8.5,
    fatPercent: 4.2,
    snfPercent: 8.7,
    hardwareStatus: 'LOCKED_SERIAL'
  });

  const [yieldViolationError, setYieldViolationError] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [showManifestQR, setShowManifestQR] = useState(false);

  // Live Hardware Simulation Stream
  useEffect(() => {
    const interval = setInterval(() => {
      setAmcuStream({
        weightKg: +(7.8 + Math.random() * 2.2).toFixed(1),
        fatPercent: +(3.9 + Math.random() * 0.5).toFixed(1),
        snfPercent: +(8.4 + Math.random() * 0.4).toFixed(1),
        hardwareStatus: 'LOCKED_SERIAL'
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptPour = () => {
    setYieldViolationError(null);

    // AI Dynamic Yield Limit Check: Max expected yield = registeredCows * 12.0 kg per session
    const maxExpectedKg = selectedFarmer.registeredCows * 12.0;

    if (amcuStream.weightKg > maxExpectedKg) {
      setYieldViolationError({
        farmerName: selectedFarmer.name,
        cows: selectedFarmer.registeredCows,
        maxExpectedKg,
        actualKg: amcuStream.weightKg,
        reason: `Pour weight ${amcuStream.weightKg}kg exceeds max biological yield limit (${maxExpectedKg}kg) for ${selectedFarmer.registeredCows} registered cows.`
      });
      return;
    }

    const pourPayload = {
      farmerId: selectedFarmer.farmerId,
      farmerName: selectedFarmer.name,
      nodeId: 'VLC-22',
      weightKg: amcuStream.weightKg,
      fatPercent: amcuStream.fatPercent,
      snfPercent: amcuStream.snfPercent,
      yieldStatus: 'PASS'
    };

    if (!isOnline) {
      setOfflineQueue([pourPayload, ...offlineQueue]);
      alert("Offline Mode Active: Pour saved locally to tablet sync queue!");
    } else {
      addPourEvent(pourPayload);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    offlineQueue.forEach(item => addPourEvent(item));
    setOfflineQueue([]);
    confetti({ particleCount: 70 });
  };

  return (
    <div className="max-w-4xl mx-auto my-2 bg-[#090d1a]/95 backdrop-blur-xl border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl p-6">
      {/* Tablet Frame Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold">
            <Tablet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-400 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border border-teal-500/30">
                AGG-VLC-22-TAB01
              </span>
              <span className="text-xs text-slate-400">Nissing Village Milk Collection Center</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">Aggregator Milk Collection Tablet</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
            isOnline ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' : 'bg-amber-950/80 border-amber-500/40 text-amber-400'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 animate-pulse" />}
            <span>{isOnline ? 'ONLINE SYNC' : `OFFLINE QUEUE (${offlineQueue.length})`}</span>
          </div>

          {!isOnline && offlineQueue.length > 0 && (
            <button
              onClick={handleSyncOfflineQueue}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync ({offlineQueue.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Collection Session Setup (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-2xl">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Select Farmer (NDLM Tagged)</label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full glass-input text-xs rounded-xl p-3 focus:outline-none text-white font-medium"
            >
              {farmers.map((f) => (
                <option key={f.farmerId} value={f.farmerId} className="bg-slate-900 text-white">
                  {f.name} ({f.farmerId}) — {f.registeredCows} Cows
                </option>
              ))}
            </select>

            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between"><span>NDLM Ear Tag:</span><span className="font-mono text-emerald-400">{selectedFarmer.ndlmTag}</span></div>
              <div className="flex justify-between"><span>Breed & Count:</span><span className="text-white">{selectedFarmer.animalBreed} ({selectedFarmer.registeredCows} Cattle)</span></div>
              <div className="flex justify-between"><span>Max Allowed Pour:</span><span className="text-amber-400 font-bold">{selectedFarmer.registeredCows * 12.0} kg</span></div>
            </div>
          </div>

          <button
            onClick={() => setShowManifestQR(true)}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 shadow"
          >
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>Generate Tanker Dispatch Manifest QR</span>
          </button>
        </div>

        {/* Right Column: Essae AMCU Serial Hardware Telemetry Stream (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="glass-panel-glow p-5 rounded-2xl border border-teal-500/40 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-extrabold text-teal-400 tracking-wider uppercase">ESSAE-SN8831 AMCU HARDWARE STREAM</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                <Lock className="w-3 h-3 text-teal-400" /> READ-ONLY SERIAL LOCK
              </span>
            </div>

            {/* Read-Only Hardware Metric Counters */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-medium">WEIGHT</div>
                <div className="text-2xl font-extrabold text-white font-mono mt-1">{amcuStream.weightKg} <span className="text-xs text-slate-400">kg</span></div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-medium">FAT</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{amcuStream.fatPercent}%</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-medium">SNF</div>
                <div className="text-2xl font-extrabold text-teal-400 font-mono mt-1">{amcuStream.snfPercent}%</div>
              </div>
            </div>

            {/* AI Dynamic Yield Violation Banner */}
            {yieldViolationError && (
              <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs mb-4 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>AI DYNAMIC YIELD VIOLATION — AUTO-REJECTED</span>
                </div>
                <p className="text-[11px] leading-snug opacity-95">{yieldViolationError.reason}</p>
                <div className="text-[10px] text-rose-300 font-mono bg-slate-950 p-2 rounded">
                  FSSAI District Alert Logged • SMS alert dispatched to Officer Kaithal
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <button
              onClick={handleAcceptPour}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>ACCEPT & LOG HARDWARE SIGNED POUR RECEIPT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manifest QR Modal */}
      {showManifestQR && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-teal-500/40 text-center relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400/40 mx-auto flex items-center justify-center text-teal-400 text-2xl mb-2">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tanker Dispatch Manifest QR</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Batch #BATCH-20260831-TN401 (4,820 L)</p>

            <div className="my-5 p-4 bg-white rounded-2xl max-w-[200px] mx-auto border-4 border-teal-500 shadow-2xl">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ANVESHANA_MANIFEST_BATCH_TN401_SHA256_VERIFIED"
                alt="Manifest QR"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono mb-4">
              Cryptographically signed manifest containing 22 farmer pour receipts & hardware weigh-bridge hash.
            </div>

            <button
              onClick={() => setShowManifestQR(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Done / Close Manifest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
