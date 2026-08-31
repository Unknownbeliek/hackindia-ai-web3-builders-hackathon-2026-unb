import React from 'react';
import { AnveshanaProvider, useAnveshana } from './context/AnveshanaContext';
import HeaderNav from './components/HeaderNav';
import EvidenceChainModal from './components/EvidenceChainModal';
import RegisteredIdAuthModal from './components/RegisteredIdAuthModal';
import FarmerPWA from './dashboards/FarmerPWA';
import AggregatorTablet from './dashboards/AggregatorTablet';
import QCOfficerDesktop from './dashboards/QCOfficerDesktop';
import GovtAuditorDashboard from './dashboards/GovtAuditorDashboard';
import ConsumerPassport from './dashboards/ConsumerPassport';
import { ShieldCheck, Cpu } from 'lucide-react';

function DashboardRouter() {
  const { currentRole } = useAnveshana();

  switch (currentRole) {
    case 'FARMER':
      return <FarmerPWA />;
    case 'AGGREGATOR':
      return <AggregatorTablet />;
    case 'QC_OFFICER':
      return <QCOfficerDesktop />;
    case 'GOVT_AUDITOR':
      return <GovtAuditorDashboard />;
    case 'CONSUMER':
      return <ConsumerPassport />;
    default:
      return <FarmerPWA />;
  }
}

export default function App() {
  return (
    <AnveshanaProvider>
      <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
        <div>
          <HeaderNav />
          <main className="px-4 py-4 max-w-7xl mx-auto">
            <DashboardRouter />
          </main>
        </div>

        <footer className="border-t border-slate-900 bg-[#04060e] py-6 px-4 text-center text-xs text-slate-500 font-mono space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anveshana Digital Public Infrastructure (DPI)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-teal-400" /> Essae-SN8831 Hardware Lock
            </span>
            <span>•</span>
            <span>FSSAI HackIndia 2026</span>
          </div>
          <p className="text-[11px] text-slate-600 max-w-2xl mx-auto">
            Tamper-evident, hardware-anchored supply chain audit engine linking every milch animal's NDLM tag to every liter of milk in India.
          </p>
        </footer>

        <EvidenceChainModal />
        <RegisteredIdAuthModal />
      </div>
    </AnveshanaProvider>
  );
}
