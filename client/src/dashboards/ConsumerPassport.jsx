import React, { useState } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { ShieldCheck, Thermometer, Scale, Clock, MapPin, Users, Lock, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConsumerPassport() {
  const [verifiedOnChain, setVerifiedOnChain] = useState(false);

  const samplePassport = {
    batchId: "AMU-DL-2026-0831-7741",
    sourceRegion: "Karnal District, Haryana",
    farmersCount: 22,
    avgColdChainTemp: "3.8°C (No breaks)",
    massBalanceDelta: "+0.2%",
    massBalanceThreshold: "1.0%",
    farmToPackTime: "11h 24min",
    sha256Hash: "sha256:7d2b9af8103c31ff78201a44eef",
    nodesTrail: [
      { id: "VLC-22", name: "Nissing Village Collection", type: "Farm Gate" },
      { id: "MCC-104", name: "Karnal Milk Chilling Center", type: "Chilling Node" },
      { id: "FACTORY-DL-01", name: "Patparganj Dairy Plant", type: "Processing" },
      { id: "CONSUMER", name: "Your Milk Pouch", type: "Consumer" }
    ]
  };

  const handleVerifyChain = () => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setVerifiedOnChain(true);
  };

  return (
    <div className="max-w-md mx-auto my-4 bg-[#090d1a]/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

      <div className="text-center mb-6 pt-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400 text-2xl shadow-lg mb-2">
          🌿
        </div>
        <div className="text-[10px] font-extrabold text-emerald-400 tracking-widest uppercase">OPEN DAIRY INTELLIGENCE PROTOCOL</div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Anveshana Purity Passport</h2>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">Scan verified: 31 Aug 2026, 18:32 IST</div>
      </div>

      <div className="glass-panel-glow p-4 rounded-2xl border border-emerald-500/40 text-center mb-6 bg-emerald-950/40">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-extrabold text-xs mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>🟢 BATCH STATUS: VERIFIED CLEAN</span>
        </div>
        <p className="text-[11px] text-slate-300">
          Hardware-anchored NDLM ear tag log verified zero water expansion & continuous cold chain.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-2"><QrCode className="w-4 h-4 text-emerald-400" /> Batch ID</span>
          <span className="font-mono font-bold text-white">{samplePassport.batchId}</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Milk Source</span>
          <span className="font-semibold text-white">{samplePassport.sourceRegion}</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Smallholders</span>
          <span className="font-bold text-emerald-400 font-mono">{samplePassport.farmersCount} Verified NDLM Farmers</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-2"><Thermometer className="w-4 h-4 text-cyan-400" /> Cold Chain</span>
          <span className="font-mono text-cyan-300 font-bold">{samplePassport.avgColdChainTemp}</span>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-2"><Scale className="w-4 h-4 text-purple-400" /> Mass Balance Delta</span>
          <span className="font-mono text-emerald-400 font-bold">{samplePassport.massBalanceDelta} (Pass ≤ {samplePassport.massBalanceThreshold})</span>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl mb-6">
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-3">Full Supply Chain Multi-Hop Trail</div>
        <div className="relative pl-4 border-l-2 border-emerald-500/30 space-y-4">
          {samplePassport.nodesTrail.map((node) => (
            <div key={node.id} className="relative">
              <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
              <div className="text-xs font-bold text-white">{node.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">{node.type} ({node.id})</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{samplePassport.sha256Hash}</span>
        </div>

        {!verifiedOnChain ? (
          <button
            onClick={handleVerifyChain}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>VERIFY CRYPTOGRAPHIC AUDIT PROOF ON-CHAIN</span>
          </button>
        ) : (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified! 100% Tamper-Evident.</span>
          </div>
        )}
      </div>
    </div>
  );
}
