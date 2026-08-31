import React, { createContext, useContext, useState, useEffect } from 'react';

const AnveshanaContext = createContext(null);

export const JURISDICTION_CONFIGS = {
  'FSSAI-DL': {
    state: 'Delhi NCR',
    code: 'FSSAI-DL',
    maxExpansionPercent: 0.8, // Strict Capital Compliance
    fatLowerBound: 3.5,
    snfLowerBound: 8.5,
  },
  'FSSAI-HR': {
    state: 'Haryana',
    code: 'FSSAI-HR',
    maxExpansionPercent: 1.0,
    fatLowerBound: 3.5,
    snfLowerBound: 8.5,
  },
  'FSSAI-UP': {
    state: 'Uttar Pradesh',
    code: 'FSSAI-UP',
    maxExpansionPercent: 1.5,
    fatLowerBound: 3.2,
    snfLowerBound: 8.2,
  },
  'FSSAI-MH': {
    state: 'Maharashtra',
    code: 'FSSAI-MH',
    maxExpansionPercent: 1.0,
    fatLowerBound: 3.5,
    snfLowerBound: 8.5,
  },
  'FSSAI-GJ': {
    state: 'Gujarat',
    code: 'FSSAI-GJ',
    maxExpansionPercent: 1.2,
    fatLowerBound: 3.5,
    snfLowerBound: 8.5,
  },
  'FSSAI-PB': {
    state: 'Punjab',
    code: 'FSSAI-PB',
    maxExpansionPercent: 1.0,
    fatLowerBound: 3.8,
    snfLowerBound: 8.8,
  }
};

export const STATE_DISTRICT_DIRECTORY = {
  'FSSAI-DL': {
    code: 'FSSAI-DL',
    state: 'Delhi NCR',
    stateHindi: 'दिल्ली एनसीआर',
    center: [28.6139, 77.2090],
    zoom: 10,
    districts: [
      { name: 'All Delhi NCT Districts', nameHindi: 'सभी दिल्ली क्षेत्र', lat: 28.6139, lng: 77.2090, zoom: 10 },
      { name: 'East Delhi (Patparganj Plant)', nameHindi: 'पूर्वी दिल्ली (पटपड़गंज)', lat: 28.6280, lng: 77.3000, zoom: 12 },
      { name: 'South Delhi (Okhla Terminal)', nameHindi: 'दक्षिणी दिल्ली (ओखला)', lat: 28.5355, lng: 77.2680, zoom: 12 },
      { name: 'West Delhi (Dwarka Distribution)', nameHindi: 'पश्चिम दिल्ली (द्वारका)', lat: 28.5921, lng: 77.0460, zoom: 12 },
      { name: 'North West Delhi (Alipur Gate)', nameHindi: 'उत्तर-पश्चिम दिल्ली (अलीपुर)', lat: 28.8105, lng: 77.1332, zoom: 12 },
      { name: 'Central Delhi (FSSAI HQ)', nameHindi: 'मध्य दिल्ली (एफएसएसएआई मुख्यालय)', lat: 28.6304, lng: 77.2177, zoom: 12 }
    ]
  },
  'FSSAI-HR': {
    code: 'FSSAI-HR',
    state: 'Haryana',
    stateHindi: 'हरियाणा',
    center: [29.5000, 76.8000],
    zoom: 8,
    districts: [
      { name: 'All Haryana Districts', nameHindi: 'सभी हरियाणा जिले', lat: 29.5000, lng: 76.8000, zoom: 8 },
      { name: 'Karnal', nameHindi: 'करनाल', lat: 29.6857, lng: 76.9905, zoom: 11 },
      { name: 'Kaithal', nameHindi: 'कैथल', lat: 29.8015, lng: 76.3996, zoom: 11 },
      { name: 'Hisar', nameHindi: 'हिसार', lat: 29.1492, lng: 75.7217, zoom: 11 },
      { name: 'Sonepat', nameHindi: 'सोनीपत', lat: 28.9931, lng: 77.0151, zoom: 11 },
      { name: 'Ambala', nameHindi: 'अम्बाला', lat: 30.3782, lng: 76.7767, zoom: 11 },
      { name: 'Rohtak', nameHindi: 'रोहतक', lat: 28.8955, lng: 76.6066, zoom: 11 }
    ]
  },
  'FSSAI-UP': {
    code: 'FSSAI-UP',
    state: 'Uttar Pradesh',
    stateHindi: 'उत्तर प्रदेश',
    center: [27.2000, 78.0000],
    zoom: 7,
    districts: [
      { name: 'All UP Districts', nameHindi: 'सभी उत्तर प्रदेश जिले', lat: 27.2000, lng: 78.0000, zoom: 7 },
      { name: 'Mathura', nameHindi: 'मथुरा', lat: 27.4924, lng: 77.6737, zoom: 11 },
      { name: 'Meerut', nameHindi: 'मेरठ', lat: 28.9845, lng: 77.7064, zoom: 11 },
      { name: 'Agra', nameHindi: 'आगरा', lat: 27.1767, lng: 78.0081, zoom: 11 },
      { name: 'Aligarh', nameHindi: 'अलीगढ़', lat: 27.8974, lng: 78.0880, zoom: 11 }
    ]
  },
  'FSSAI-MH': {
    code: 'FSSAI-MH',
    state: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    center: [19.7515, 75.7139],
    zoom: 7,
    districts: [
      { name: 'All Maharashtra Districts', nameHindi: 'सभी महाराष्ट्र जिले', lat: 19.7515, lng: 75.7139, zoom: 7 },
      { name: 'Kolhapur', nameHindi: 'कोल्हापुर', lat: 16.7050, lng: 74.2433, zoom: 11 },
      { name: 'Pune', nameHindi: 'पुणे', lat: 18.5204, lng: 73.8567, zoom: 11 },
      { name: 'Nashik', nameHindi: 'नाशिक', lat: 20.0059, lng: 73.7898, zoom: 11 },
      { name: 'Ahmednagar', nameHindi: 'अहमदनगर', lat: 19.0948, lng: 74.7480, zoom: 11 }
    ]
  },
  'FSSAI-GJ': {
    code: 'FSSAI-GJ',
    state: 'Gujarat',
    stateHindi: 'गुजरात',
    center: [22.2587, 71.1924],
    zoom: 7,
    districts: [
      { name: 'All Gujarat Districts', nameHindi: 'सभी गुजरात जिले', lat: 22.2587, lng: 71.1924, zoom: 7 },
      { name: 'Anand (Amul HQ)', nameHindi: 'आनंद (अमुल)', lat: 22.5645, lng: 72.9289, zoom: 11 },
      { name: 'Banaskantha', nameHindi: 'बनासकांठा', lat: 24.1724, lng: 72.4346, zoom: 11 },
      { name: 'Mehsana', nameHindi: 'मेहसाणा', lat: 23.5880, lng: 72.3693, zoom: 11 }
    ]
  },
  'FSSAI-PB': {
    code: 'FSSAI-PB',
    state: 'Punjab',
    stateHindi: 'पंजाब',
    center: [31.1471, 75.3412],
    zoom: 8,
    districts: [
      { name: 'All Punjab Districts', nameHindi: 'सभी पंजाब जिले', lat: 31.1471, lng: 75.3412, zoom: 8 },
      { name: 'Ludhiana', nameHindi: 'लुधियाना', lat: 30.9010, lng: 75.8573, zoom: 11 },
      { name: 'Sangrur', nameHindi: 'संगरूर', lat: 30.2458, lng: 75.8420, zoom: 11 },
      { name: 'Moga', nameHindi: 'मोगा', lat: 30.8165, lng: 75.1717, zoom: 11 }
    ]
  }
};

const INITIAL_NODES = [
  { nodeId: 'FACTORY-DL-01', name: 'Mother Dairy Patparganj Central Processing Plant', type: 'PLANT', district: 'East Delhi (Patparganj Plant)', state: 'Delhi NCR', coordinates: { lat: 28.6280, lng: 77.3000 } },
  { nodeId: 'TERMINAL-DL-02', name: 'Amul Okhla Dairy Terminal #2', type: 'TERMINAL', district: 'South Delhi (Okhla Terminal)', state: 'Delhi NCR', coordinates: { lat: 28.5355, lng: 77.2680 } },
  { nodeId: 'GATE-DL-03', name: 'Alipur Highway Toll Inspection Gate (NH-44 Entry)', type: 'INSPECTION_GATE', district: 'North West Delhi (Alipur Gate)', state: 'Delhi NCR', coordinates: { lat: 28.8105, lng: 77.1332 } },
  { nodeId: 'HUB-DL-04', name: 'Dwarka Cold Storage Distribution Hub', type: 'MCC', district: 'West Delhi (Dwarka Distribution)', state: 'Delhi NCR', coordinates: { lat: 28.5921, lng: 77.0460 } },
  { nodeId: 'VLC-22', name: 'Nissing Village Collection Center (Haryana Feed)', type: 'VLC', district: 'Karnal', state: 'Haryana', coordinates: { lat: 29.8251, lng: 76.8258 } },
  { nodeId: 'MCC-104', name: 'Kaithal Milk Chilling Center (Haryana Feed)', type: 'MCC', district: 'Kaithal', state: 'Haryana', coordinates: { lat: 29.8015, lng: 76.3996 } },
  { nodeId: 'DC-SNP-02', name: 'Sonepat Processing Plant (Highway Feeder)', type: 'PLANT', district: 'Sonepat', state: 'Haryana', coordinates: { lat: 28.9931, lng: 77.0151 } }
];

const INITIAL_FARMERS = [
  { farmerId: '201410000123', name: 'Ramesh Kumar', ndlmTag: '840003129940112', animalBreed: 'Murrah Buffalo', registeredCows: 4, purityScore: 87 },
  { farmerId: '201410000124', name: 'Sunita Devi', ndlmTag: '840003129940113', animalBreed: 'Sahiwal Cow', registeredCows: 2, purityScore: 92 },
  { farmerId: '201410000125', name: 'Sukhwinder Singh', ndlmTag: '840003129940114', animalBreed: 'Gir Cow', registeredCows: 5, purityScore: 95 }
];

const INITIAL_POUR_EVENTS = [
  {
    eventId: 'PE-20260831-001',
    farmerId: '201410000123',
    farmerName: 'Ramesh Kumar',
    nodeId: 'VLC-22',
    timestamp: '2026-08-31T06:30:00Z',
    weightKg: 8.5,
    fatPercent: 4.2,
    snfPercent: 8.7,
    payoutINR: 382.50,
    yieldStatus: 'PASS',
    receiptHash: 'sha256:7d2b9af8103c31ff78201a44eef938101a44'
  },
  {
    eventId: 'PE-20260831-002',
    farmerId: '201410000124',
    farmerName: 'Sunita Devi',
    nodeId: 'VLC-22',
    timestamp: '2026-08-31T06:42:00Z',
    weightKg: 6.2,
    fatPercent: 4.5,
    snfPercent: 8.9,
    payoutINR: 297.60,
    yieldStatus: 'PASS',
    receiptHash: 'sha256:8e3c0bf9114d42aa89312b55ff012b55'
  }
];

const INITIAL_BATCHES = [
  {
    batchId: 'BATCH-20260831-TN401',
    tankerRegistration: 'HR-07-GA-5541',
    dispatchNodeId: 'VLC-22',
    destinationNodeId: 'MCC-104',
    dispatchVolumeL: 4820,
    receivedVolumeL: 5147,
    volumeDeltaPercent: 6.8,
    batchStatus: 'IN_TRANSIT',
    anomalyScore: 92,
    temperatureLog: [3.8, 3.9, 4.1, 3.8],
    dispatchTimestamp: '2026-08-31T07:15:00Z'
  },
  {
    batchId: 'BATCH-20260831-TN402',
    tankerRegistration: 'HR-08-B-9912',
    dispatchNodeId: 'VLC-77',
    destinationNodeId: 'MCC-104',
    dispatchVolumeL: 3200,
    receivedVolumeL: 3206,
    volumeDeltaPercent: 0.18,
    batchStatus: 'ARRIVED',
    anomalyScore: 12,
    temperatureLog: [3.5, 3.6, 3.7, 3.6],
    dispatchTimestamp: '2026-08-31T07:45:00Z'
  }
];

const INITIAL_ANOMALIES = [
  {
    anomalyId: 'ANO-2026-0901',
    nodeId: 'MCC-104',
    nodeName: 'Kaithal Chilling Center Gate #4',
    riskScore: 92,
    type: 'VOLUME_EXPANSION',
    details: 'Unreconciled expansion +6.8% volume in Transit Batch TN-401 vs VLC-22 dispatch baseline (Exceeds Haryana max ±1.0%).',
    timestamp: '2026-08-31T08:10:00Z',
    status: 'ACTIVE_INVESTIGATION'
  },
  {
    anomalyId: 'ANO-2026-0902',
    nodeId: 'VLC-77',
    nodeName: 'Hisar Dairy Cooperative',
    riskScore: 74,
    type: 'YIELD_SPIKE_CLUSTER',
    details: 'Simultaneous 40% yield increase logged across 6 smallholders within 15min collection window.',
    timestamp: '2026-08-31T07:55:00Z',
    status: 'ACTIVE_INVESTIGATION'
  }
];

// Officer Administrative Hierarchy Directory
export const OFFICER_HIERARCHY = {
  NATIONAL_DIRECTOR: {
    level: 'NATIONAL_DIRECTOR',
    title: 'FSSAI National Director / CEO (Central HQ)',
    titleHindi: 'एफएसएसएआई राष्ट्रीय निदेशक / मुख्य कार्यकारी',
    scopeType: 'NATIONAL',
    badge: 'FSSAI-HQ-001',
    description: 'Full National Oversight — All States, Highway Corridors & Interstate Gates'
  },
  STATE_COMMISSIONER: {
    level: 'STATE_COMMISSIONER',
    title: 'State Food Safety Commissioner (IAS)',
    titleHindi: 'राज्य खाद्य सुरक्षा आयुक्त',
    scopeType: 'STATE',
    badge: 'STATE-COMM-01',
    description: 'State-wide Jurisdiction — All Districts, Chilling Centers & Dairies in State'
  },
  DISTRICT_MAGISTRATE: {
    level: 'DISTRICT_MAGISTRATE',
    title: 'District Magistrate / Designated Officer (DO)',
    titleHindi: 'जिला मजिस्ट्रेट / नामंकित अधिकारी',
    scopeType: 'DISTRICT',
    badge: 'DM-DO-001',
    description: 'District Jurisdiction — Strict Filtering to Assigned District Nodes Only'
  },
  FOOD_SAFETY_OFFICER: {
    level: 'FOOD_SAFETY_OFFICER',
    title: 'Food Safety Officer (FSO - Root Inspector)',
    titleHindi: 'खाद्य सुरक्षा अधिकारी (एफएसओ)',
    scopeType: 'NODE',
    badge: 'FSO-BLOCK-01',
    description: 'Root Block Level — Restricted to Assigned Local Chilling Center / Plant Only'
  }
};

// Valid Registered ID Directory for Role Gatekeeper
export const REGISTERED_ID_DIRECTORY = {
  FARMER: [
    { id: '201410000123', name: 'Ramesh Kumar (Nissing)', tag: '840003129940112' },
    { id: '201410000124', name: 'Sunita Devi (Nissing)', tag: '840003129940113' },
    { id: '201410000125', name: 'Sukhwinder Singh (Hisar)', tag: '840003129940114' }
  ],
  AGGREGATOR: [
    { id: 'AGG-VLC-22', name: 'Nissing Village AMCU Station', tag: 'ESSAE-SN8831' },
    { id: 'AGG-VLC-77', name: 'Hisar Cooperative AMCU Station', tag: 'ESSAE-SN8832' }
  ],
  QC_OFFICER: [
    { id: 'QCO-MCC104-001', name: 'Inspector Kaithal Gate #4', tag: 'FSSAI-BADGE-9940' },
    { id: 'QCO-PLANT-02', name: 'Quality Manager Sonepat', tag: 'FSSAI-BADGE-9941' }
  ],
  GOVT_AUDITOR: [
    { id: 'FSSAI-HR-007', name: 'Auditor Mundhe (Haryana HQ)', tag: 'GOVT-DPI-KEY-2026' },
    { id: 'FSSAI-MH-012', name: 'Auditor FDA Maharashtra', tag: 'GOVT-DPI-KEY-2027' }
  ],
  CONSUMER: [
    { id: 'PUBLIC_GUEST', name: 'Public Consumer QR Guest', tag: 'PUBLIC_PASSPORT' }
  ]
};

export function AnveshanaProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('GOVT_AUDITOR');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('FSSAI-DL');
  const [activeOfficerLevel, setActiveOfficerLevel] = useState('STATE_COMMISSIONER'); // 'NATIONAL_DIRECTOR' | 'STATE_COMMISSIONER' | 'DISTRICT_MAGISTRATE' | 'FOOD_SAFETY_OFFICER'
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI'
  const [isOnline, setIsOnline] = useState(true);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);

  // Authentication State for Role Gatekeeper
  const [authenticatedSessions, setAuthenticatedSessions] = useState({
    FARMER: { isAuthenticated: true, id: '201410000123', name: 'Ramesh Kumar' },
    AGGREGATOR: { isAuthenticated: false, id: null, name: null },
    QC_OFFICER: { isAuthenticated: false, id: null, name: null },
    GOVT_AUDITOR: { isAuthenticated: false, id: null, name: null },
    CONSUMER: { isAuthenticated: true, id: 'PUBLIC_GUEST', name: 'Public Guest' }
  });

  const [authModalState, setAuthModalState] = useState({ isOpen: false, targetRole: 'QC_OFFICER' });

  const [nodes] = useState(INITIAL_NODES);
  const [farmers] = useState(INITIAL_FARMERS);
  const [pourEvents, setPourEvents] = useState(INITIAL_POUR_EVENTS);
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);

  const [liveIncidents, setLiveIncidents] = useState([
    { id: '1', time: '08:12:04', type: 'CRITICAL', text: 'Volume expansion +6.8% detected at MCC-104 Kaithal' },
    { id: '2', time: '08:05:12', type: 'HIGH', text: 'Yield anomaly auto-rejected for NDLM Tag #840003129940113' },
    { id: '3', time: '07:45:00', type: 'INFO', text: 'Tanker HR-08-B-9912 checked in with 0.18% nominal delta' }
  ]);

  const activeJurisdictionConfig = JURISDICTION_CONFIGS[selectedJurisdiction] || JURISDICTION_CONFIGS['FSSAI-HR'];

  // Role Gatekeeper Authentication Handler
  const loginWithRegisteredId = (role, enteredId) => {
    const cleanId = enteredId.trim();

    // MASTER ADMIN PASSCODE: '1234' Unlocks ALL Roles Simultaneously!
    if (cleanId === '1234') {
      const adminSession = {
        isAuthenticated: true,
        id: '1234',
        name: 'Master Admin Overseer',
        token: `jwt_admin_master_1234_${Date.now()}`
      };

      setAuthenticatedSessions({
        FARMER: adminSession,
        AGGREGATOR: adminSession,
        QC_OFFICER: adminSession,
        GOVT_AUDITOR: adminSession,
        CONSUMER: adminSession
      });

      setCurrentRole(role);
      setAuthModalState({ isOpen: false, targetRole: role });
      return { success: true, session: adminSession, isAdmin: true };
    }

    const roleDirectory = REGISTERED_ID_DIRECTORY[role] || [];
    const matchedRecord = roleDirectory.find(
      r => r.id.toLowerCase() === cleanId.toLowerCase() || r.tag.toLowerCase() === cleanId.toLowerCase()
    );

    if (!matchedRecord && role !== 'CONSUMER') {
      return { success: false, error: `Invalid Registered ID / Badge / NDLM Tag for ${role} Role (Hint: Use Master Admin ID '1234')` };
    }

    const session = {
      isAuthenticated: true,
      id: matchedRecord ? matchedRecord.id : 'PUBLIC_GUEST',
      name: matchedRecord ? matchedRecord.name : 'Public Guest',
      token: `jwt_token_${role.toLowerCase()}_${Date.now()}`
    };

    setAuthenticatedSessions(prev => ({
      ...prev,
      [role]: session
    }));

    setCurrentRole(role);
    setAuthModalState({ isOpen: false, targetRole: role });
    return { success: true, session };
  };

  const logoutRole = (role) => {
    setAuthenticatedSessions(prev => ({
      ...prev,
      [role]: { isAuthenticated: false, id: null, name: null }
    }));
  };

  const attemptRoleSwitch = (targetRole) => {
    if (targetRole === 'CONSUMER' || authenticatedSessions[targetRole]?.isAuthenticated) {
      setCurrentRole(targetRole);
    } else {
      setAuthModalState({ isOpen: true, targetRole });
    }
  };

  const addPourEvent = (newEvent) => {
    const eventId = `PE-20260831-${String(pourEvents.length + 1).padStart(3, '0')}`;
    const hash = `sha256:${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    const fullEvent = {
      ...newEvent,
      eventId,
      receiptHash: hash,
      timestamp: new Date().toISOString(),
      payoutINR: +((newEvent.weightKg || 8.0) * 45).toFixed(2)
    };
    setPourEvents([fullEvent, ...pourEvents]);
    return fullEvent;
  };

  const quarantineBatch = (batchId) => {
    setBatches(batches.map(b => b.batchId === batchId ? { ...b, batchStatus: 'QUARANTINED' } : b));
    const incident = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString(),
      type: 'CRITICAL',
      text: `🔒 QC OFFICER QUARANTINED BATCH ${batchId}. Upstream payouts frozen!`
    };
    setLiveIncidents([incident, ...liveIncidents]);
  };

  const acceptBatch = (batchId) => {
    setBatches(batches.map(b => b.batchId === batchId ? { ...b, batchStatus: 'PASSED' } : b));
    const incident = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString(),
      type: 'INFO',
      text: `✅ Batch ${batchId} verified & accepted into chilling tank`
    };
    setLiveIncidents([incident, ...liveIncidents]);
  };

  const dispatchRaid = (anomalyId) => {
    setAnomalies(anomalies.map(a => a.anomalyId === anomalyId ? { ...a, status: 'RAID_DISPATCHED' } : a));
    const incident = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString(),
      type: 'CRITICAL',
      text: `📋 FSSAI Flying Squad dispatched for Anomaly ${anomalyId}`
    };
    setLiveIncidents([incident, ...liveIncidents]);
  };

  const injectVolumeAnomalySimulation = () => {
    const newAnomaly = {
      anomalyId: `ANO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      nodeId: 'MCC-104',
      nodeName: 'Kaithal Chilling Center Gate #2',
      riskScore: 96,
      type: 'VOLUME_EXPANSION',
      details: 'ALERT: Injection of +12.4% volume delta detected by inline mass-flow meter!',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE_INVESTIGATION'
    };
    setAnomalies([newAnomaly, ...anomalies]);
    setLiveIncidents([
      { id: String(Date.now()), time: new Date().toLocaleTimeString(), type: 'CRITICAL', text: newAnomaly.details },
      ...liveIncidents
    ]);
  };

  return (
    <AnveshanaContext.Provider value={{
      currentRole,
      setCurrentRole,
      attemptRoleSwitch,
      authenticatedSessions,
      loginWithRegisteredId,
      logoutRole,
      authModalState,
      setAuthModalState,
      REGISTERED_ID_DIRECTORY,
      selectedJurisdiction,
      setSelectedJurisdiction,
      activeOfficerLevel,
      setActiveOfficerLevel,
      OFFICER_HIERARCHY,
      JURISDICTION_CONFIGS,
      activeJurisdictionConfig,
      STATE_DISTRICT_DIRECTORY,
      language,
      setLanguage,
      isOnline,
      setIsOnline,
      activeEvidenceModal,
      setActiveEvidenceModal,
      nodes,
      farmers,
      pourEvents,
      addPourEvent,
      batches,
      quarantineBatch,
      acceptBatch,
      anomalies,
      dispatchRaid,
      liveIncidents,
      injectVolumeAnomalySimulation
    }}>
      {children}
    </AnveshanaContext.Provider>
  );
}

export function useAnveshana() {
  const ctx = useContext(AnveshanaContext);
  if (!ctx) throw new Error('useAnveshana must be used within an AnveshanaProvider');
  return ctx;
}
