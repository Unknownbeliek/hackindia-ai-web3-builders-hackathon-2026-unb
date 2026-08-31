import React, { useEffect, useRef, useState } from 'react';
import { useAnveshana } from '../context/AnveshanaContext';
import { Shield, ShieldAlert, MapPin, Radio, Send, FileText, CheckCircle2, Flame, Navigation, Globe } from 'lucide-react';
import L from 'leaflet';

export default function GovtAuditorDashboard() {
  const {
    nodes,
    anomalies,
    dispatchRaid,
    liveIncidents,
    selectedJurisdiction,
    setSelectedJurisdiction,
    activeOfficerLevel,
    setActiveOfficerLevel,
    OFFICER_HIERARCHY,
    STATE_DISTRICT_DIRECTORY,
    language,
    setActiveEvidenceModal,
    injectVolumeAnomalySimulation
  } = useAnveshana();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState('ALL');

  const currentJurisdictionData = STATE_DISTRICT_DIRECTORY[selectedJurisdiction] || STATE_DISTRICT_DIRECTORY['FSSAI-DL'];
  const districtList = currentJurisdictionData.districts || [];
  const currentOfficerProfile = OFFICER_HIERARCHY[activeOfficerLevel] || OFFICER_HIERARCHY['STATE_COMMISSIONER'];

  // Calculate Officer Scope Filtered Nodes
  const visibleNodes = React.useMemo(() => {
    if (activeOfficerLevel === 'NATIONAL_DIRECTOR') return nodes;
    if (activeOfficerLevel === 'STATE_COMMISSIONER') {
      return nodes.filter(n => n.state === currentJurisdictionData.state || n.state === 'Delhi NCR');
    }
    if (activeOfficerLevel === 'DISTRICT_MAGISTRATE') {
      if (selectedDistrictName === 'ALL') {
        return nodes.filter(n => n.state === currentJurisdictionData.state);
      }
      return nodes.filter(n => n.district === selectedDistrictName);
    }
    if (activeOfficerLevel === 'FOOD_SAFETY_OFFICER') {
      return nodes.slice(0, 1); // Single local assigned block node
    }
    return nodes;
  }, [nodes, activeOfficerLevel, selectedJurisdiction, selectedDistrictName, currentJurisdictionData]);

  // Calculate Officer Scope Filtered Anomalies
  const visibleAnomalies = React.useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map(n => n.nodeId));
    return anomalies.filter(a => visibleNodeIds.has(a.nodeId));
  }, [anomalies, visibleNodes]);

  // Initialize & update map instance
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) mapInstanceRef.current.remove();

    const initialCenter = visibleNodes.length > 0
      ? [visibleNodes[0].coordinates.lat, visibleNodes[0].coordinates.lng]
      : (currentJurisdictionData.center || [28.6139, 77.2090]);
    const initialZoom = activeOfficerLevel === 'DISTRICT_MAGISTRATE' ? 12 : (currentJurisdictionData.zoom || 10);

    const map = L.map(mapRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: false
    });

    const tileLayerUrl = import.meta.env.VITE_MAP_TILE_LAYER || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayerUrl, {
      maxZoom: 19,
      subdomains: 'abc'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Render SCOPE-FILTERED node markers ONLY
    visibleNodes.forEach(node => {
      const nodeAnomalies = visibleAnomalies.filter(a => a.nodeId === node.nodeId);
      const maxRisk = nodeAnomalies.length > 0 ? Math.max(...nodeAnomalies.map(a => a.riskScore)) : 10;
      const pinColor = maxRisk >= 80 ? '#ef4444' : maxRisk >= 50 ? '#f59e0b' : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${maxRisk >= 80 ? `<div style="position: absolute; width: 36px; height: 36px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="width: 24px; height: 24px; background: ${pinColor}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 12px ${pinColor}; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: black;">
              ${maxRisk >= 50 ? '!' : '✓'}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([node.coordinates.lat, node.coordinates.lng], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        map.flyTo([node.coordinates.lat, node.coordinates.lng], 13, { duration: 1.2 });
      });

      marker.bindPopup(`
        <div style="padding: 4px; font-family: inherit;">
          <div style="font-size: 11px; font-weight: bold; color: #10b981; margin-bottom: 2px;">${node.nodeId}</div>
          <div style="font-size: 13px; font-weight: bold; color: white;">${node.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">District: ${node.district} | ${node.state}</div>
          <div style="font-size: 11px; color: ${pinColor}; font-weight: bold; margin-top: 4px;">Risk Rating: ${maxRisk}/100</div>
        </div>
      `);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedJurisdiction, visibleNodes, visibleAnomalies, activeOfficerLevel]);

  // Smoothly Fly Map to Selected District or State Center
  const handleDistrictChange = (distName) => {
    setSelectedDistrictName(distName);
    if (!mapInstanceRef.current) return;

    if (distName === 'ALL') {
      const stateCenter = currentJurisdictionData.center;
      const stateZoom = currentJurisdictionData.zoom;
      mapInstanceRef.current.flyTo(stateCenter, stateZoom, { duration: 1.2 });
    } else {
      const distObj = districtList.find(d => d.name === distName || d.nameHindi === distName);
      if (distObj) {
        mapInstanceRef.current.flyTo([distObj.lat, distObj.lng], distObj.zoom || 11, { duration: 1.5 });
      }
    }
  };

  const handleStateChange = (stateCode) => {
    setSelectedJurisdiction(stateCode);
    setSelectedDistrictName('ALL');
    const newStateData = STATE_DISTRICT_DIRECTORY[stateCode];
    if (newStateData && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(newStateData.center, newStateData.zoom, { duration: 1.5 });
    }
  };

  const isHindi = language === 'HI';

  return (
    <div className="max-w-7xl mx-auto my-4 bg-[#090d1a]/95 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-400 tracking-wider uppercase">
                {isHindi ? 'अन्वेषण डीपीआई कमान' : 'ANVESHANA DPI COMMAND'}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-rose-400 font-mono bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                <Radio className="w-3 h-3 animate-pulse" /> {isHindi ? 'लाइव स्ट्रीम' : 'LIVE TELEMETRY'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isHindi ? 'एफएसएसएआई राज्य लेखापरीक्षक कमांड सेंटर' : 'FSSAI State Auditor Command Center'}
            </h2>
          </div>
        </div>
      </div>

      {/* Officer Administrative Hierarchy Selector Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              {isHindi ? 'प्रशासनिक अधिकारी पदक्रम नियंत्रण (RBAC Scope)' : 'ADMINISTRATIVE OFFICER HIERARCHY (RBAC SCOPE)'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Active Badge: {currentOfficerProfile.badge}
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.keys(OFFICER_HIERARCHY).map((levelKey) => {
            const prof = OFFICER_HIERARCHY[levelKey];
            const isActive = activeOfficerLevel === levelKey;

            return (
              <button
                key={levelKey}
                onClick={() => {
                  setActiveOfficerLevel(levelKey);
                  if (levelKey === 'DISTRICT_MAGISTRATE' && selectedDistrictName === 'ALL') {
                    const firstDist = districtList[1]?.name || 'ALL';
                    handleDistrictChange(firstDist);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {prof.scopeType}
                    </span>
                    {isActive && <span className="text-amber-400 text-xs">● Active</span>}
                  </div>
                  <div className="text-xs font-bold leading-tight">{isHindi ? prof.titleHindi : prof.title}</div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 line-clamp-1">{prof.description}</div>
              </button>
            );
          })}
        </div>

        {/* Active Officer Scope Indicator Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">🎯 SCOPE RESTRICTION:</span>
            <span>
              {activeOfficerLevel === 'NATIONAL_DIRECTOR' && 'All India Gateway — Unlimited National Access (All Nodes & Corridors)'}
              {activeOfficerLevel === 'STATE_COMMISSIONER' && `State-Wide Jurisdiction — Filtered to ${currentJurisdictionData.state} (${visibleNodes.length} Nodes Active)`}
              {activeOfficerLevel === 'DISTRICT_MAGISTRATE' && `District Magistrate View — Strictly Restricted to ${selectedDistrictName} (${visibleNodes.length} Local Nodes Active)`}
              {activeOfficerLevel === 'FOOD_SAFETY_OFFICER' && `Block Inspector View — Restricted to Local Station ${visibleNodes[0]?.name || 'Node'}`}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">
            Visible Anomalies: {visibleAnomalies.length} / {anomalies.length} Total
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* District Anomaly GIS Heatmap */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {isHindi ? 'जिला विसंगति हीटमैप (जीपीएस स्थान)' : 'DISTRICT ANOMALY HEATMAP (LEAFLET.JS GEOJSON)'}
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                {isHindi ? `ज़ूम: ${selectedDistrictName}` : `Zoom Target: ${selectedDistrictName}`}
              </span>
            </div>

            <div ref={mapRef} className="w-full h-80 rounded-xl overflow-hidden border border-slate-800 shadow-inner z-0"></div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> {isHindi ? 'गंभीर (अंक 80+)' : 'Critical (Score 80+)'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> {isHindi ? 'उच्च (अंक 50-79)' : 'High (Score 50-79)'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> {isHindi ? 'सामान्य (<50)' : 'Nominal (<50)'}</span>
              </div>
              <span className="font-mono text-amber-400 font-bold">
                {isHindi ? `सक्रिय केंद्र: ${nodes.length}` : `Nodes Active: ${nodes.length}`}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Raid Index */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {isHindi ? 'प्राथमिकता छापा सूचकांक (एआई रैंक)' : 'PRIORITY RAID INDEX (AI RANKED)'}
                </h3>
              </div>
              <span className="text-[10px] text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                {isHindi ? 'मुख्य लक्ष्य' : 'Top Targets'}
              </span>
            </div>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {visibleAnomalies.map((ano, idx) => {
                const isDispatched = ano.status === 'RAID_DISPATCHED';

                return (
                  <div key={ano.anomalyId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 text-xs font-mono font-bold flex items-center justify-center border border-amber-500/30">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-xs text-white">{ano.nodeName}</span>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                        {isHindi ? `जोखिम अंक [${ano.riskScore}]` : `Score [${ano.riskScore}]`} 🔴
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">{ano.details}</p>

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                      {!isDispatched ? (
                        <button
                          onClick={() => dispatchRaid(ano.anomalyId)}
                          className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-[11px] rounded-lg shadow flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isHindi ? '📋 उड़न दस्ते को रवाना करें' : '📋 Dispatch Flying Squad'}</span>
                        </button>
                      ) : (
                        <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{isHindi ? 'उड़न दस्ता मार्ग पर (टिकट #884)' : 'Flying Squad En-Route (Ticket #884)'}</span>
                        </div>
                      )}

                      <button
                        onClick={() => setActiveEvidenceModal({
                          type: 'ANOMALY',
                          title: `Tamper-Evident SHA-256 Audit Package (${ano.anomalyId})`,
                          hash: `sha256:${ano.anomalyId.toLowerCase()}`,
                          data: ano
                        })}
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{isHindi ? 'अदालत साक्ष्य पैकेज →' : 'Court Evidence Package →'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Incident Feed */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isHindi ? 'लाइव घटना फ़ीड (वेबसॉकेट चैनल)' : 'LIVE INCIDENT FEED (WEBSOCKET CHANNEL)'}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Channel: room:govt-{selectedJurisdiction.toLowerCase()}</span>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {liveIncidents.map((inc) => (
            <div key={inc.id} className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">{inc.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  inc.type === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                  inc.type === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {inc.type}
                </span>
                <span className="text-slate-200">{inc.text}</span>
              </div>
              <span className="text-[10px] text-emerald-400/80">Socket ACK ✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
