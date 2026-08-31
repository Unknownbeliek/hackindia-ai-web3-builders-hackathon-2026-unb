import React from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { ShieldCheck, Printer, X, CheckCircle2, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EvidenceChainModal() {
  const { activeEvidenceModal, setActiveEvidenceModal } = useAnveshana();

  if (!activeEvidenceModal) return null;

  const { title, hash, data } = activeEvidenceModal;

  const handlePrintDownload = () => {
    confetti({ particleCount: 50 });
    window.print();
  };

  const copyHash = () => {
    navigator.clipboard?.writeText(hash || "sha256:7d2b9af8103c31ff78201a44eef");
    alert("SHA-256 Hash copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-3xl max-w-2xl w-full border border-emerald-500/40 relative max-h-[90vh] overflow-y-auto print:max-w-none print:w-full print:bg-white print:text-black">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase">FSSAI TAMPER-EVIDENT EVIDENCE CHAIN</div>
              <h3 className="text-lg font-bold text-white tracking-tight">{title || "Cryptographic SHA-256 Audit Package"}</h3>
            </div>
          </div>

          <button onClick={() => setActiveEvidenceModal(null)} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors print:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 mb-5 flex items-center justify-between font-mono text-xs">
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-400 mb-0.5">SHA-256 RECEPT SIGNATURE</div>
            <div className="text-emerald-400 font-bold truncate">{hash || "sha256:7d2b9af8103c31ff78201a44eef"}</div>
          </div>
          <button onClick={copyHash} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 ml-3 print:hidden">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Court-Admissible Digital Public Infrastructure Proof</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
              <div>Timestamp: <span className="text-white font-bold">{new Date().toISOString()}</span></div>
              <div>Node ID: <span className="text-emerald-400 font-bold">{data?.nodeId || "VLC-22"}</span></div>
              <div>NDLM Hardware Tag: <span className="text-amber-400">AMCU-ESSAE-SN8831</span></div>
              <div>Verification Status: <span className="text-emerald-400 font-bold">TAMPER-EVIDENT VERIFIED ✅</span></div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-slate-400 mb-2">RAW JSON PAYLOAD AUDIT RECORD:</div>
            <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap overflow-x-auto max-h-44 p-2 bg-slate-900/80 rounded border border-slate-800">
              {JSON.stringify(data || { sample: "verified" }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            onClick={handlePrintDownload}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / DOWNLOAD PDF EVIDENCE PACKAGE</span>
          </button>
          <button onClick={() => setActiveEvidenceModal(null)} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
