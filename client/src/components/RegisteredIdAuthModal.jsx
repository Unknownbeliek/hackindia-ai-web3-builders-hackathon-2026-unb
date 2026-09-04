import React, { useState } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { Lock, Key, ShieldCheck, UserCheck, AlertCircle, X, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisteredIdAuthModal() {
  const {
    authModalState,
    setAuthModalState,
    loginWithRegisteredId,
    REGISTERED_ID_DIRECTORY,
    language
  } = useAnveshana();

  const isHindi = language === 'HI';
  const [enteredId, setEnteredId] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  if (!authModalState.isOpen) return null;

  const targetRole = authModalState.targetRole || 'QC_OFFICER';
  const roleNameMap = {
    FARMER: isHindi ? 'किसान पीडब्ल्यूए पोर्टल' : 'Farmer PWA Portal',
    AGGREGATOR: isHindi ? 'संग्राहक संग्रह टैबलेट' : 'Aggregator Collection Tablet',
    QC_OFFICER: isHindi ? 'गुणवत्ता अधिकारी समाधान पोर्टल' : 'QC Officer Reconciliation Portal',
    GOVT_AUDITOR: isHindi ? 'FSSAI राज्य लेखापरीक्षक कमान' : 'FSSAI State Auditor Command',
    CONSUMER: isHindi ? 'सार्वजनिक उपभोक्ता पासपोर्ट' : 'Public Consumer Passport'
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!enteredId.trim()) {
      setErrorMessage(isHindi ? 'कृपया अपना पंजीकृत आईडी, बैज नंबर या NDLM टैग दर्ज करें।' : 'Please enter your Registered ID, Badge Number, or NDLM Tag.');
      return;
    }

    const res = loginWithRegisteredId(targetRole, enteredId);
    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleQuickDemoLogin = (role, demoId) => {
    setErrorMessage(null);
    const res = loginWithRegisteredId(role, demoId);
    if (res.success) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const demoList = REGISTERED_ID_DIRECTORY[targetRole] || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-emerald-500/40 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase">
                {isHindi ? 'प्रतिबंधित डीपीआई पोर्टल पहुंच' : 'RESTRICTED DPI PORTAL ACCESS'}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{roleNameMap[targetRole]}</h3>
            </div>
          </div>

          <button
            onClick={() => setAuthModalState({ isOpen: false, targetRole })}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{isHindi ? 'पंजीकृत आईडी सत्यापन आवश्यक' : 'Registered ID Verification Required'}</span>
          </div>
          <p className="text-xs text-slate-300">
            {isHindi ? 'पोर्टल ' : 'Access to the '}<span className="font-bold text-white">{roleNameMap[targetRole]}</span>{isHindi ? ' में प्रवेश के लिए पंजीकृत NDLM टैग या मास्टर एडमिन आईडी ' : ' requires authenticating with a registered NDLM tag or Master Admin ID '}<span className="font-mono text-emerald-400 font-bold">1234</span>{isHindi ? ' का उपयोग करें।' : '.'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              {isHindi ? 'पंजीकृत आईडी या एडमिन कोड दर्ज करें (उदा. 1234)' : 'Enter Registered ID or Admin Code (e.g. 1234)'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={enteredId}
                onChange={(e) => setEnteredId(e.target.value)}
                placeholder={isHindi ? "1234 या पंजीकृत आईडी दर्ज करें..." : "Enter 1234 or Registered ID..."}
                className="w-full glass-input text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-400 font-mono text-white placeholder-slate-500"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 tracking-wide uppercase"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isHindi ? 'प्रमाण-पत्र सत्यापित करें और पोर्टल खोलें' : 'VERIFY CREDENTIAL & ACCESS PORTAL'}</span>
          </button>
        </form>

        {/* Master Admin 1234 & Quick Demo Credentials */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          
          {/* Master Admin Button */}
          <button
            type="button"
            onClick={() => handleQuickDemoLogin(targetRole, '1234')}
            className="w-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-left transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-extrabold text-amber-300 group-hover:text-amber-200">🔑 {isHindi ? 'मास्टर एडमिन पासकोड से त्वरित लॉगिन' : 'Quick Login with Master Admin Passcode'}</div>
                <div className="text-[10px] text-slate-300 font-mono">{isHindi ? 'मास्टर पासकोड:' : 'Master Passcode:'} <span className="text-emerald-400 font-bold">1234</span> ({isHindi ? 'सभी पोर्टल खोलता है' : 'Unlocks ALL Portals'})</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Role Credentials */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">{isHindi ? 'पंजीकृत क्रेडेंशियल दर्ज सूची:' : 'Role Registered Credentials:'}</div>
            {demoList.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleQuickDemoLogin(targetRole, demo.id)}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-white group-hover:text-emerald-400 transition-colors text-[11px]">{demo.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono">ID: {demo.id} • Tag: {demo.tag}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
