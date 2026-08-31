import React, { useState } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { ShieldAlert, ShieldCheck, Truck, Lock, AlertTriangle, Layers, ArrowUpRight, CheckCircle2, Scale, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QCOfficerDesktop() {
  const {
    batches,
    quarantineBatch,
    acceptBatch,
    activeJurisdictionConfig,
    setActiveEvidenceModal,
    pourEvents
  } = useAnveshana();

  const [selectedBatchId, setSelectedBatchId] = useState("BATCH-20260831-TN401");
  const [showUpstreamTrace, setShowUpstreamTrace] = useState(false);

  const selectedBatch = batches.find(b => b.batchId === selectedBatchId) || batches[0];
  const isExpansionViolated = Math.abs(selectedBatch.volumeDeltaPercent) > activeJurisdictionConfig.maxExpansionPercent;

  return (
    <div className="max-w-7xl mx-auto my-4 bg-[#090d1a]/95 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-mono border border-blue-500/30">QCO-MCC104-001</span>
            <span className="text-xs text-slate-400">MCC-104 Kaithal Milk Chilling Center Gate #4</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>QC Officer Reconciliation Portal</span>
            <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              Jurisdiction: {activeJurisdictionConfig.state} ({activeJurisdictionConfig.code}) — Max Expansion: ±{activeJurisdictionConfig.maxExpansionPercent}%
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Total Tankers: </span>
            <span className="text-white font-bold">{batches.length}</span>
          </div>
          <div className="bg-rose-950/60 px-3.5 py-2 rounded-xl border border-rose-500/30 text-xs font-mono">
            <span className="text-rose-300">Quarantined: </span>
            <span className="text-rose-400 font-bold">{batches.filter(b => b.batchStatus === 'QUARANTINED').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> Incoming Tankers
            </h3>
            <span className="text-[10px] text-slate-400">{batches.length} Queued</span>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => {
              const isQuarantined = batch.batchStatus === 'QUARANTINED';
              const isPassed = batch.batchStatus === 'PASSED';

              return (
                <div
                  key={batch.batchId}
                  onClick={() => setSelectedBatchId(batch.batchId)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedBatchId === batch.batchId
                      ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white">{batch.tankerRegistration}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isQuarantined ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {batch.batchStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div className="flex justify-between"><span>Batch ID:</span><span className="font-mono text-slate-300">{batch.batchId}</span></div>
                    <div className="flex justify-between"><span>From:</span><span className="text-slate-300">{batch.dispatchNodeId}</span></div>
                    <div className="flex justify-between">
                      <span>Volume Delta:</span>
                      <span className={`font-mono font-bold ${batch.volumeDeltaPercent > activeJurisdictionConfig.maxExpansionPercent ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {batch.volumeDeltaPercent > 0 ? `+${batch.volumeDeltaPercent}%` : `${batch.volumeDeltaPercent}%`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">BATCH MASS BALANCE RECONCILER</div>
                <h4 className="text-lg font-bold text-white font-mono">{selectedBatch.batchId}</h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Tanker Reg</div>
                <div className="text-xs font-mono font-bold text-blue-400">{selectedBatch.tankerRegistration}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">DISPATCHED VOLUME</div>
                <div className="text-xl font-extrabold text-white font-mono mt-1">
                  {selectedBatch.dispatchVolumeL.toLocaleString()} <span className="text-xs text-slate-400 font-normal">L</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">RECEIVED AT GATE</div>
                <div className="text-xl font-extrabold text-white font-mono mt-1">
                  {selectedBatch.receivedVolumeL.toLocaleString()} <span className="text-xs text-slate-400 font-normal">L</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border mb-5 ${
              isExpansionViolated
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Volume Delta: {selectedBatch.volumeDeltaPercent > 0 ? `+${selectedBatch.volumeDeltaPercent}%` : `${selectedBatch.volumeDeltaPercent}%`}
                </span>
                <span className="text-xs font-mono font-bold">
                  {isExpansionViolated ? '❌ THRESHOLD EXCEEDED' : '✅ PASSED'}
                </span>
              </div>
              <p className="text-xs opacity-90 leading-snug">
                State Limit ({activeJurisdictionConfig.state}): Max ±{activeJurisdictionConfig.maxExpansionPercent}%. 
                {isExpansionViolated ? ` Anomaly score ${selectedBatch.anomalyScore}/100. Water dilution detected.` : ' Mass balance reconciled within tolerance.'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowUpstreamTrace(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>TRACE UPSTREAM FARMER CONTRIBUTION CHAIN</span>
              </button>

              {selectedBatch.batchStatus !== 'QUARANTINED' ? (
                <button
                  onClick={() => quarantineBatch(selectedBatch.batchId)}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>🔒 QUARANTINE BATCH & FREEZE UPSTREAM PAYOUTS</span>
                </button>
              ) : (
                <div className="bg-rose-950/80 border border-rose-500/40 p-3 rounded-xl text-center text-rose-300 text-xs font-bold flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>BATCH QUARANTINED — Payouts Locked & Flying Squad Notified</span>
                </div>
              )}

              {selectedBatch.batchStatus !== 'PASSED' && selectedBatch.batchStatus !== 'QUARANTINED' && (
                <button
                  onClick={() => {
                    acceptBatch(selectedBatch.batchId);
                    confetti({ particleCount: 50 });
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ PASS & ACCEPT BATCH INTO PROCESSING TANK</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Node Anomaly Queue
            </h3>
            <span className="text-[10px] text-slate-400">ML Ranked</span>
          </div>

          <div className="space-y-3">
            {batches.map(b => (
              <div key={b.batchId} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-white">{b.batchId}</span>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    b.anomalyScore >= 80 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    b.anomalyScore >= 50 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    Risk Score {b.anomalyScore}/100
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {b.anomalyScore >= 80 ? '🔴 Volume expansion violation (+6.8%)' : '🟢 Nominal parameters'}
                </div>
                <button
                  onClick={() => setActiveEvidenceModal({
                    type: 'BATCH',
                    title: `Batch Audit Package #${b.batchId}`,
                    hash: `sha256:${b.batchId.toLowerCase()}`,
                    data: b
                  })}
                  className="w-full text-right text-[10px] text-blue-400 hover:underline flex items-center justify-end gap-1"
                >
                  <span>View Evidence Trail</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUpstreamTrace && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-2xl w-full border border-blue-500/40 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" /> Upstream Farmer Contribution Trace
                </h3>
                <p className="text-xs text-slate-400">Batch: <span className="font-mono text-blue-400">{selectedBatch.batchId}</span></p>
              </div>
              <button onClick={() => setShowUpstreamTrace(false)} className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg">Close</button>
            </div>

            <div className="space-y-3 mb-5">
              {pourEvents.map((pour) => (
                <div key={pour.eventId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{pour.farmerName} <span className="text-slate-500 font-mono">({pour.farmerId})</span></div>
                    <div className="text-slate-400 mt-0.5">
                      Node: <span className="text-emerald-400">{pour.nodeId}</span> | Weight: <span className="text-white font-bold">{pour.weightKg} kg</span> | Fat: {pour.fatPercent}% | SNF: {pour.snfPercent}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-mono font-bold">₹{pour.payoutINR}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{pour.receiptHash?.slice(0, 16)}...</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowUpstreamTrace(false)} className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl">
              Done Tracing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
