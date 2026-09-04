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
    pourEvents,
    language
  } = useAnveshana();

  const isHindi = language === 'HI';

  const [selectedBatchId, setSelectedBatchId] = useState("BATCH-20260831-TN401");
  const [showUpstreamTrace, setShowUpstreamTrace] = useState(false);
  const [showQuarantineModal, setShowQuarantineModal] = useState(false);
  const [quarantineStep, setQuarantineStep] = useState(0); // 0: Idle, 1: Dilution Check, 2: Weighbridge Hash Sync, 3: Evidence Lock, 4: Warrant Issued

  const selectedBatch = batches.find(b => b.batchId === selectedBatchId) || batches[0];
  const isExpansionViolated = Math.abs(selectedBatch.volumeDeltaPercent) > activeJurisdictionConfig.maxExpansionPercent;

  const handleStartQuarantineProtocol = () => {
    setShowQuarantineModal(true);
    setQuarantineStep(1);

    setTimeout(() => {
      setQuarantineStep(2);
      setTimeout(() => {
        setQuarantineStep(3);
        setTimeout(() => {
          setQuarantineStep(4);
          quarantineBatch(selectedBatch.batchId);
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto my-4 bg-[#090d1a]/95 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-mono border border-blue-500/30">QCO-MCC104-001</span>
            <span className="text-xs text-slate-400">MCC-104 {isHindi ? 'कैथल दुग्ध शीतलन केंद्र गेट #4' : 'Kaithal Milk Chilling Center Gate #4'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>{isHindi ? 'गुणवत्ता अधिकारी समाधान पोर्टल' : 'QC Officer Reconciliation Portal'}</span>
            <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              {isHindi ? 'क्षेत्राधिकार:' : 'Jurisdiction:'} {activeJurisdictionConfig.state} ({activeJurisdictionConfig.code}) — {isHindi ? 'अधिकतम विस्तार:' : 'Max Expansion:'} ±{activeJurisdictionConfig.maxExpansionPercent}%
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">{isHindi ? 'कुल टैंकर:' : 'Total Tankers:'} </span>
            <span className="text-white font-bold">{batches.length}</span>
          </div>
          <div className="bg-rose-950/60 px-3.5 py-2 rounded-xl border border-rose-500/30 text-xs font-mono">
            <span className="text-rose-300">{isHindi ? 'संगरोध:' : 'Quarantined:'} </span>
            <span className="text-rose-400 font-bold">{batches.filter(b => b.batchStatus === 'QUARANTINED').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> {isHindi ? 'आवक टैंकर' : 'Incoming Tankers'}
            </h3>
            <span className="text-[10px] text-slate-400">{batches.length} {isHindi ? 'कतारबद्ध' : 'Queued'}</span>
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
                      {isQuarantined ? (isHindi ? 'संगरोध' : 'QUARANTINED') :
                       isPassed ? (isHindi ? 'स्वीकृत' : 'PASSED') :
                       (isHindi ? 'लंबित' : 'PENDING')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div className="flex justify-between"><span>Batch ID:</span><span className="font-mono text-slate-300">{batch.batchId}</span></div>
                    <div className="flex justify-between"><span>{isHindi ? 'स्रोत नोड:' : 'From:'}</span><span className="text-slate-300">{batch.dispatchNodeId}</span></div>
                    <div className="flex justify-between">
                      <span>{isHindi ? 'मात्रा अंतर:' : 'Volume Delta:'}</span>
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
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isHindi ? 'बैच द्रव्यमान संतुलन समाधान' : 'BATCH MASS BALANCE RECONCILER'}
                </div>
                <h4 className="text-lg font-bold text-white font-mono">{selectedBatch.batchId}</h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">{isHindi ? 'टैंकर पंजीकरण' : 'Tanker Reg'}</div>
                <div className="text-xs font-mono font-bold text-blue-400">{selectedBatch.tankerRegistration}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">{isHindi ? 'प्रेषित मात्रा' : 'DISPATCHED VOLUME'}</div>
                <div className="text-xl font-extrabold text-white font-mono mt-1">
                  {selectedBatch.dispatchVolumeL.toLocaleString()} <span className="text-xs text-slate-400 font-normal">L</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">{isHindi ? 'गेट पर प्राप्त मात्रा' : 'RECEIVED AT GATE'}</div>
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
                  {isHindi ? 'मात्रा अंतर:' : 'Volume Delta:'} {selectedBatch.volumeDeltaPercent > 0 ? `+${selectedBatch.volumeDeltaPercent}%` : `${selectedBatch.volumeDeltaPercent}%`}
                </span>
                <span className="text-xs font-mono font-bold">
                  {isExpansionViolated 
                    ? (isHindi ? '❌ सीमा का उल्लंघन' : '❌ THRESHOLD EXCEEDED') 
                    : (isHindi ? '✅ स्वीकृत' : '✅ PASSED')}
                </span>
              </div>
              <p className="text-xs opacity-90 leading-snug">
                {isHindi ? 'राज्य सीमा' : 'State Limit'} ({activeJurisdictionConfig.state}): {isHindi ? 'अधिकतम' : 'Max'} ±{activeJurisdictionConfig.maxExpansionPercent}%. 
                {isExpansionViolated 
                  ? (isHindi ? ` विसंगति अंक ${selectedBatch.anomalyScore}/100. जल मिलावट का पता चला।` : ` Anomaly score ${selectedBatch.anomalyScore}/100. Water dilution detected.`) 
                  : (isHindi ? ' द्रव्यमान संतुलन सीमा के भीतर समाधानित।' : ' Mass balance reconciled within tolerance.')}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowUpstreamTrace(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{isHindi ? 'अपस्ट्रीम किसान योगदान श्रृंखला ट्रेस करें' : 'TRACE UPSTREAM FARMER CONTRIBUTION CHAIN'}</span>
              </button>

              {selectedBatch.batchStatus !== 'QUARANTINED' ? (
                <button
                  onClick={handleStartQuarantineProtocol}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>🔒 {isHindi ? 'बैच संगरोध करें और भुगतान फ्रिज़ करें' : 'QUARANTINE BATCH & FREEZE UPSTREAM PAYOUTS'}</span>
                </button>
              ) : (
                <div className="bg-rose-950/80 border border-rose-500/40 p-3 rounded-xl text-center text-rose-300 text-xs font-bold flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{isHindi ? 'बैच संगरोधित — भुगतान लॉक और फ्लाइंग स्क्वाड सूचित' : 'BATCH QUARANTINED — Payouts Locked & Flying Squad Notified'}</span>
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
                  <span>✅ {isHindi ? 'स्वीकार करें और प्रसंस्करण टैंक में डालें' : 'PASS & ACCEPT BATCH INTO PROCESSING TANK'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> {isHindi ? 'नोड विसंगति कतार' : 'Node Anomaly Queue'}
            </h3>
            <span className="text-[10px] text-slate-400">{isHindi ? 'एमएल श्रेणीबद्ध' : 'ML Ranked'}</span>
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
                    {isHindi ? 'जोखिम अंक' : 'Risk Score'} {b.anomalyScore}/100
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {b.anomalyScore >= 80 
                    ? (isHindi ? '🔴 मात्रा विस्तार उल्लंघन (+6.8%)' : '🔴 Volume expansion violation (+6.8%)')
                    : (isHindi ? '🟢 सामान्य मापदंड' : '🟢 Nominal parameters')}
                </div>
                <button
                  onClick={() => setActiveEvidenceModal({
                    type: 'BATCH',
                    title: isHindi ? `बैच ऑडिट पैकेज #${b.batchId}` : `Batch Audit Package #${b.batchId}`,
                    hash: `sha256:${b.batchId.toLowerCase()}`,
                    data: b
                  })}
                  className="w-full text-right text-[10px] text-blue-400 hover:underline flex items-center justify-end gap-1"
                >
                  <span>{isHindi ? 'प्रमाण श्रृंखला देखें' : 'View Evidence Trail'}</span>
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
                  <Layers className="w-5 h-5 text-blue-400" /> {isHindi ? 'अपस्ट्रीम किसान योगदान ट्रेस' : 'Upstream Farmer Contribution Trace'}
                </h3>
                <p className="text-xs text-slate-400">{isHindi ? 'बैच:' : 'Batch:'} <span className="font-mono text-blue-400">{selectedBatch.batchId}</span></p>
              </div>
              <button onClick={() => setShowUpstreamTrace(false)} className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg">
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {pourEvents.map((pour) => (
                <div key={pour.eventId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{pour.farmerName} <span className="text-slate-500 font-mono">({pour.farmerId})</span></div>
                    <div className="text-slate-400 mt-0.5">
                      {isHindi ? 'नोड:' : 'Node:'} <span className="text-emerald-400">{pour.nodeId}</span> | {isHindi ? 'वजन:' : 'Weight:'} <span className="text-white font-bold">{pour.weightKg} {isHindi ? 'किग्रा' : 'kg'}</span> | {isHindi ? 'फैट:' : 'Fat:'} {pour.fatPercent}% | {isHindi ? 'एसएनएफ:' : 'SNF:'} {pour.snfPercent}%
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
              {isHindi ? 'ट्रेस पूर्ण' : 'Done Tracing'}
            </button>
          </div>
        </div>
      )}

      {/* INTERACTIVE QUARANTINE PROTOCOL MODAL */}
      {showQuarantineModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-rose-500/50 shadow-2xl space-y-5 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {isHindi ? 'जल मिलावट एवं संगरोध प्रोटोकॉल' : 'Water Addition & Quarantine Protocol'}
                  </h3>
                  <div className="text-[10px] font-mono text-rose-400">BATCH: {selectedBatch.batchId}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                FSSAI ENFORCEMENT
              </span>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded-xl border ${quarantineStep >= 1 ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                1. Dilution
              </div>
              <div className={`p-2 rounded-xl border ${quarantineStep >= 2 ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                2. Hash Sync
              </div>
              <div className={`p-2 rounded-xl border ${quarantineStep >= 3 ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                3. Lock Evidence
              </div>
              <div className={`p-2 rounded-xl border ${quarantineStep >= 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                4. Raid Sent
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs font-mono">
              {quarantineStep === 1 && (
                <div className="space-y-2 text-center py-4">
                  <Activity className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
                  <div className="text-white font-bold">{isHindi ? '1. द्रव्यमान संतुलन एवं अपवर्तनांक विश्लेषण...' : '1. Analyzing Mass Balance & Refractometer Data...'}</div>
                  <div className="text-rose-400 text-[11px]">{isHindi ? 'जल मिलावट का पता चला: +18.4% (मात्रा विस्तार)' : 'Water Dilution Detected: +18.4% (Volume Expansion)'}</div>
                </div>
              )}

              {quarantineStep === 2 && (
                <div className="space-y-2 text-center py-4">
                  <Scale className="w-8 h-8 text-amber-400 animate-bounce mx-auto" />
                  <div className="text-white font-bold">{isHindi ? '2. प्रेषण हैश बनाम वेब्रिज हैश क्रॉस-रेफरेंस...' : '2. Cross-Referencing Weighbridge Hash Digest...'}</div>
                  <div className="text-slate-400 text-[10px] break-all">DISPATCH: sha256:7d2b...9c0b ❌ GATE: sha256:ef44...110a</div>
                </div>
              )}

              {quarantineStep === 3 && (
                <div className="space-y-2 text-center py-4">
                  <Lock className="w-8 h-8 text-blue-400 animate-pulse mx-auto" />
                  <div className="text-white font-bold">{isHindi ? '3. अपरिवर्तनीय साक्ष्य श्रृंखला सील की जा रही है...' : '3. Locking Cryptographic Evidence Package...'}</div>
                  <div className="text-blue-400 text-[10px]">sha256:qc9948277490218ab2c3d901840003</div>
                </div>
              )}

              {quarantineStep >= 4 && (
                <div className="space-y-3 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl mx-auto">
                    🚨
                  </div>
                  <div className="text-emerald-400 font-extrabold text-sm">{isHindi ? 'संगरोध एवं फ्लाइंग स्क्वाड अलर्ट लॉक!' : 'Batch Quarantined & Raid Warrant Issued!'}</div>
                  <div className="text-slate-300 text-[11px] font-sans">
                    {isHindi 
                      ? 'अपस्ट्रीम भुगतान रोक दिए गए हैं। एफएसएसएआई फ्लाइंग स्क्वाड को वेब्रिज जीपीएस निर्देशांक भेजे गए।'
                      : 'Upstream farmer payouts frozen. FSSAI Flying Squad dispatched to Kaithal Milk Chilling Center Gate #4.'}
                  </div>
                </div>
              )}
            </div>

            {quarantineStep >= 4 && (
              <button
                onClick={() => setShowQuarantineModal(false)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow"
              >
                {isHindi ? 'पूर्ण / संगरोध बंद करें' : 'DONE / CLOSE PROTOCOL'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
