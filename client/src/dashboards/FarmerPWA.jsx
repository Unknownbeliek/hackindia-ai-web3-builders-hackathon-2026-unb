import React, { useState } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { Volume2, Award, Calendar, ChevronRight, Sparkles, CheckCircle2, QrCode, Building2, User, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FarmerPWA() {
  const { farmers, pourEvents, setActiveEvidenceModal } = useAnveshana();
  const farmer = farmers[0]; // Active Ramesh Kumar
  
  const [showKccModal, setShowKccModal] = useState(false);
  const [kccStatus, setKccStatus] = useState('IDLE');
  const [spoken, setSpoken] = useState(false);

  const latestPour = pourEvents[0];

  const speakStatus = () => {
    if (!('speechSynthesis' in window)) {
      alert("TTS Speech Synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const text = `नमस्ते ${farmer.name} जी। आपका आज का दूध कुल ${latestPour.weightKg} किलो दर्ज हुआ है। फैट ${latestPour.fatPercent} प्रतिशत और एसएनएफ ${latestPour.snfPercent} प्रतिशत है। आपकी कुल राशि ₹${latestPour.payoutINR} आपके बैंक खाते में भेजी जा रही है। आपका फार्म शुद्धता स्कोर 87 प्रतिशत है।`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    setSpoken(true);
  };

  const handleApplyKCC = () => {
    setKccStatus('SUBMITTING');
    setTimeout(() => {
      setKccStatus('APPROVED');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto my-2 bg-[#090d1a]/95 backdrop-blur-xl border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl p-5 relative">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">{farmer.name}</h2>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                NDLM TAG VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">ID: {farmer.farmerId} • {farmer.animalBreed} ({farmer.registeredCows} Cattle)</p>
          </div>
        </div>

        {/* Hindi TTS Narration Button */}
        <button
          onClick={speakStatus}
          className={`p-3 rounded-2xl border transition-all ${
            spoken 
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 animate-pulse'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
          }`}
          title="Suno - Speak status in Hindi"
        >
          <Volume2 className="w-5 h-5 text-emerald-400" />
        </button>
      </div>

      {/* Purity Score Gauge Ring Card */}
      <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-500/40 text-center relative overflow-hidden mb-5">
        <div className="text-[11px] font-extrabold tracking-widest text-emerald-400 uppercase mb-1">
          FARM PURITY SCORE (ANVESHANA INDEX)
        </div>

        <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-400 transition-all duration-1000 ease-out"
              strokeDasharray={`${farmer.purityScore}, 100`}
              strokeWidth="3.8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">{farmer.purityScore}</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">GRADE A+</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 max-w-xs mx-auto mt-2">
          NDLM Ear Tag <span className="font-mono text-emerald-400 font-bold">#{farmer.ndlmTag}</span> linked • Zero dilution anomalies recorded in 90 days.
        </div>
      </div>

      {/* KCC Loan Application Card */}
      <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 p-4 rounded-2xl border border-emerald-500/40 mb-5 flex items-center justify-between shadow-lg">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Pre-Approved Kisan Credit Card (KCC)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Instant credit up to ₹1,60,000 based on Purity Score 87.</p>
        </div>
        <button
          onClick={() => setShowKccModal(true)}
          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all whitespace-nowrap ml-2"
        >
          Apply Now
        </button>
      </div>

      {/* Recent Pour History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Today's Verified Pours</span>
          <span className="text-emerald-400 font-mono">2 Sessions Completed</span>
        </div>

        {pourEvents.map((pour) => (
          <div key={pour.eventId} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">{new Date(pour.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                ₹{pour.payoutINR} Direct Payout
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Weight</div>
                <div className="font-bold text-white mt-0.5">{pour.weightKg} <span className="text-[10px]">kg</span></div>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Fat</div>
                <div className="font-bold text-emerald-400 mt-0.5">{pour.fatPercent}%</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">SNF</div>
                <div className="font-bold text-teal-400 mt-0.5">{pour.snfPercent}%</div>
              </div>
            </div>

            <button
              onClick={() => setActiveEvidenceModal({
                type: 'POUR',
                title: `Farmer Pour Receipt ${pour.eventId}`,
                hash: pour.receiptHash,
                data: pour
              })}
              className="w-full text-right text-[10px] text-emerald-400 hover:underline flex items-center justify-end gap-1 font-mono pt-1"
            >
              <span>View SHA-256 Receipt</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* KCC Loan Modal */}
      {showKccModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-emerald-500/40 relative animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400 text-2xl mb-2">
                🏛️
              </div>
              <h3 className="text-lg font-bold text-white">NABARD Instant KCC Loan</h3>
              <p className="text-xs text-slate-400 mt-1">Pre-approved based on Anveshana Purity Score 87.</p>
            </div>

            {kccStatus === 'IDLE' && (
              <div className="space-y-3 mb-5 text-xs text-slate-300 font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between"><span>Approved Credit Limit:</span><span className="text-emerald-400 font-bold">₹1,60,000</span></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between"><span>Interest Rate Subvention:</span><span className="text-white font-bold">4.0% p.a.</span></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between"><span>Discrepancy Guarantee:</span><span className="text-emerald-400 font-bold">FSSAI Hardware Lock</span></div>
              </div>
            )}

            {kccStatus === 'SUBMITTING' && (
              <div className="py-8 text-center text-xs text-emerald-400 font-mono animate-pulse">
                Verifying NDLM Livestock Tag with NABARD API...
              </div>
            )}

            {kccStatus === 'APPROVED' && (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="text-base font-bold text-white">Loan Approved Instantly!</div>
                <div className="text-xs text-slate-400 font-mono">₹1,60,000 credited to SBI Account **4012</div>
              </div>
            )}

            <div className="flex gap-2">
              {kccStatus === 'IDLE' && (
                <button
                  onClick={handleApplyKCC}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                >
                  Confirm & Sanction Loan
                </button>
              )}
              <button
                onClick={() => { setShowKccModal(false); setKccStatus('IDLE'); }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
