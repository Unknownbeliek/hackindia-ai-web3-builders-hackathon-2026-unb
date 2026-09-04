<div align="center">

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="80" height="80" />

# Anveshana (अन्वेषण)

### India's Open Dairy Intelligence Protocol

**A Hardware-Anchored, AI-Driven Digital Public Infrastructure (DPI)**  
**for Tamper-Evident Dairy Supply Chain Integrity Across India.**

[![HackIndia 2026](https://img.shields.io/badge/🏆_HackIndia-AI_%26_Web3_2026-10B981?style=flat-square)](https://hackindia.xyz)
[![Version](https://img.shields.io/badge/Version-1.0.0-8B5CF6?style=flat-square)](./package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-3B82F6?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-emerald?style=flat-square)](https://github.com/Unknownbeliek/hackindia-ai-web3-builders-hackathon-2026-unb/pulls)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

---

**[🚀 Live Demo](#-quick-start)** · **[🏗️ Architecture](#-architecture)** · **[📡 API Reference](#-api-reference)** · **[🗺️ Roadmap](#-roadmap)**

</div>

---

## 🚨 The Problem

India is the **world's largest milk producer**, yet the domestic dairy supply chain is riddled with systemic fraud.

```
GROUND REALITY — Verified by FSSAI National Survey
┌─────────────────────────────────────────────────────────────────────────┐
│  68.7%  of milk samples tested FAIL basic FSSAI quality standards       │
│  ₹1,350  lost per farmer per month due to manipulated readings          │
│     0   hardware-anchored audit systems currently in production         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Where does fraud happen?**

```
[ 🐄 Registered Milch Animal ]
          │  NDLM Ear Tag (Government Registry)
          ▼
[ 🏠 Village Collection Center ]  ←── ❌ Fat/SNF readings manually altered
          │                             ❌ Urea & water added to expand volume
          ▼
[ 🚚 Bulk Milk Chiller Transport ] ←── ❌ No mid-stream telemetry or oversight
          │
          ▼
[ 🏭 Processing Plant & Packaging ] ←── ❌ Paper manifests easily bypassed
          │
          ▼
[ 🛒 Consumer Milk Pouch ]          ←── ❌ Zero verifiable origin traceability
```

**The root cause**: No digital infrastructure exists that cryptographically anchors livestock identity to production data and enforces tamper-evident audit trails from farm to consumer.

---

## 💡 The Solution — Anveshana

> *Inspired by **Maharashtra FDA Commissioner Shri Tukaram Mundhe's** mandate for a centralized production data portal linked to individual registered livestock — we built the technical reality of that vision.*

**Anveshana (अन्वेषण)** is a **multi-stakeholder, hardware-anchored Digital Public Infrastructure (DPI)** that:

- 🔗 Cryptographically links **government NDLM livestock ear tags** to every liter of milk
- 🤖 Deploys a **Python Isolation Forest AI engine** to detect water dilution and volume expansion in real time
- 🏛️ Arms **FSSAI food safety officers** with a live GIS command center, AI priority raid indexing, and one-click court evidence generation
- 🌾 Protects **smallholder farmers** with verifiable blockchain-backed income receipts
- 🏷️ Gives **consumers** a full farm-to-door purity passport via QR code scan

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ANVESHANA PLATFORM                              │
│                     Digital Public Infrastructure                        │
└─────────────────────────────────────────────────────────────────────────┘

  PORTAL LAYER (React 18 + Vite + TailwindCSS)
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  Farmer PWA  │  │  Aggregator  │  │  QC Officer  │  │ FSSAI Auditor│  │  Consumer    │
  │  (NDLM Tags) │  │  (AMCU HW)   │  │  (Lab Audit) │  │  (GIS + AI)  │  │  (Passport)  │
  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
         └─────────────────┴──────────────────┴────────────────┴──────────────────┘
                                              │
                         REST API (JWT) + Socket.io WebSocket
                                              │
  GATEWAY LAYER (Node.js 18 + Express + Socket.io)
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  /api/v1 → JWT-authenticated routes   /health → Status endpoint         │
  │  Socket.io: telemetry_tick, join_jurisdiction channels                  │
  │  EADDRINUSE port fallback handling for zero-downtime restarts           │
  └───────────────────────────────────┬─────────────────────────────────────┘
                                      │
                   ┌──────────────────┴───────────────────┐
                   ▼                                       ▼
  AI ENGINE (Python 3.10 + FastAPI)      CRYPTO LAYER (SHA-256 + Secp256k1)
  ┌─────────────────────────────┐        ┌─────────────────────────────────┐
  │ POST /predict/yield-anomaly │        │  HSM Hardware Signing Simulation │
  │ POST /predict/volume-expan. │        │  Court Evidence Package Builder  │
  │ Isolation Forest + Biol.    │        │  On-Chain Purity Receipt Ledger  │
  │ Yield Constraint Network    │        └─────────────────────────────────┘
  └─────────────────────────────┘
```

### Monorepo Structure

```
anveshana-dairy-protocol-monorepo/
│
├── client/                          # 🌐 React 18 Web Dashboard (Vite + TailwindCSS)
│   ├── src/
│   │   ├── context/
│   │   │   └── AnveshanaContext.jsx # Global RBAC state, jurisdiction directory, i18n
│   │   ├── components/
│   │   │   ├── HeaderNav.jsx        # 5-portal navigation, language toggle, live telemetry badge
│   │   │   ├── RegisteredIdAuthModal.jsx  # RBAC lock gate (Registered ID + Master Admin 1234)
│   │   │   └── EvidenceChainModal.jsx     # SHA-256 court evidence package viewer
│   │   ├── dashboards/
│   │   │   ├── FarmerPWA.jsx        # NDLM cattle registry, milk pour logging, KCC loans
│   │   │   ├── AggregatorTablet.jsx # AMCU telemetry stream, HSM signing, offline queue
│   │   │   ├── QCOfficerDesktop.jsx # Mass balance audits, batch quarantine
│   │   │   ├── GovtAuditorDashboard.jsx   # Leaflet GIS map, AI raid index, dispatch
│   │   │   └── ConsumerPassport.jsx # QR lookup, cold-chain graphs, on-chain verify
│   │   ├── pages/
│   │   │   └── LandingPage.jsx      # Platform hero page with portal entry points
│   │   └── App.jsx                  # Root router: LandingPage ↔ DashboardRouter (RBAC)
│   └── .env                         # Client environment variables
│
├── server/                          # ⚡ Node.js 18 API + Socket.io Gateway
│   └── src/
│       ├── server.js                # Express gateway, Socket.io WS, 10s telemetry tick
│       ├── routes/apiRoutes.js      # REST route definitions
│       └── middleware/authMiddleware.js   # JWT verification middleware
│
├── ml-service/                      # 🤖 Python 3.10 FastAPI ML Inference Engine
│   └── app/
│       ├── main.py                  # /predict/yield-anomaly + /predict/volume-expansion
│       └── requirements.txt         # fastapi, uvicorn, pydantic, numpy, scikit-learn
│
├── hardware-sim/                    # 🔌 Essae-SN8831 AMCU Hardware Simulator
│   └── index.js                     # RS232 serial emulator + Secp256k1 HSM mock
│
├── farmer-mobile-app/               # 📱 React Native (Expo) Mobile Companion App
│   └── src/screens/                 # HomeScreen, PourScreen, KCCScreen, AmcuSyncScreen
│
└── package.json                     # Root monorepo: npm workspaces + concurrently scripts
```

---

## 📱 The 5-Portal Ecosystem

All portals are protected by **RBAC (Role-Based Access Control)**. Use the **Master Admin Passcode `1234`** to unlock all portals during evaluation.

---

### 🌾 Portal 1 — Farmer PWA

**Target**: ≥120M smallholder dairy farmers in rural India

| Feature | Description |
| :---- | :---- |
| 🐄 **NDLM Cattle Tag Sync** | View all government-registered milch animals linked to the Aadhaar-farmer identity |
| 🥛 **Milk Pour Logger** | Instant digital receipt on every pour — Fat %, SNF %, weight, payout, and SHA-256 hash |
| 💳 **NABARD KCC Micro-Loan** | One-click Kisan Credit Card loan eligibility based on Anveshana Farm Purity Score |
| 🔊 **Regional Audio Narrator** | Text-to-Speech (TTS) receipts in the farmer's native dialect and regional accent |
| 📶 **Offline Sync Buffer** | Local queue buffers collections during rural connectivity blackouts |

---

### 🥛 Portal 2 — Aggregator Hardware Tablet

**Target**: Village AMCU operators and milk collection center managers

| Feature | Description |
| :---- | :---- |
| 🔌 **AMCU IoT Telemetry Lock** | Read-only serial data feed from Essae-SN8831 AMCU hardware — no manual entry possible |
| 🔏 **HSM Secp256k1 Signing** | Every transaction cryptographically signed at hardware level before network transmission |
| 📦 **Offline Transaction Queue** | Auto-sync buffer stores up to 72h of collections during network outages |
| 📡 **Live Socket Telemetry** | Real-time `liveFlowRateLPM` and `inlineDensityKgL` streamed via Socket.io `telemetry_tick` |

---

### 🔬 Portal 3 — QC Officer Console

**Target**: Quality control managers at dairy processing plants

| Feature | Description |
| :---- | :---- |
| ⚖️ **Mass Balance Audit** | Cross-reference dispatch volumes from chillers against factory weighbridge receipts |
| 🧪 **Refractometer Integration** | Log RI values, freezing-point-depression readings, and adulteration flags |
| 🚫 **Automated Batch Quarantine** | Instantly quarantine suspect batches before pasteurization with a full audit log |

---

### 🏛️ Portal 4 — FSSAI State Auditor Command Center

**Target**: State food safety commissioners and flying squad coordinators

| Feature | Description |
| :---- | :---- |
| 🗺️ **Live GIS Heatmap** | Leaflet.js interactive map with real-time anomaly overlays across Indian states |
| 🔍 **State → District Drill-Down** | Smooth camera `flyTo` animation into Haryana, Maharashtra, Gujarat, UP, and Punjab districts |
| 🌐 **One-Click Hindi Localization** | `🌐 हिंदी` toggle switches entire command interface for regional food safety officers |
| 🤖 **AI Priority Raid Index** | Python ML engine scores and ranks collection centers by dilution risk in real time |
| ⚡ **Flying Squad Dispatch** | One-click raid warrant generation with sealed SHA-256 court evidence package |

---

### 🏷️ Portal 5 — Consumer Purity Passport

**Target**: End consumers, retailers, and food safety advocates

| Feature | Description |
| :---- | :---- |
| 📷 **Universal QR Scanner** | Camera-based, batchId-based, or manual lookup for any milk pouch |
| 🗺️ **Provenance Trail** | Multi-hop farm → chiller → plant → shelf supply chain journey with GPS timestamps |
| 🌡️ **Cold-Chain Temperature Audit** | Uninterrupted refrigeration logs visualized across each transit hop |
| ⛓️ **On-Chain Cryptographic Verify** | Verify milk SHA-256 purity receipt against on-chain provenance ledger |

---

## 🤖 AI Model — Isolation Forest Engine

The `ml-service` runs a custom **FastAPI v0.110+ inference server** with two live endpoints:

### `/predict/yield-anomaly` — Biological Yield Gate
Detects volume fraud by checking if a farmer's total pour weight exceeds biological yield constraints.

```python
# Biological Limit: Max 12 kg per registered cow per collection session
max_expected_kg = registered_cows * 12.0
is_anomaly      = pour_weight_kg > max_expected_kg
```

**Returns**: `isAnomaly`, `anomalyScore` (0–100), `recommendation` (`ACCEPT_POUR` / `REJECT_POUR`), and detailed `reason` string.

### `/predict/volume-expansion` — Transit Dilution Gate
Detects water dilution by comparing dispatch volumes to received volumes at processing plants.

```python
# Jurisdiction-specific tolerance thresholds
max_tolerable_percent = 1.5 if state == 'FSSAI-UP' else 1.0

delta_percent = ((received - dispatch) / dispatch) * 100
is_violation  = abs(delta_percent) > max_tolerable_percent
```

**Returns**: `deltaPercent`, `isViolation`, `anomalyScore`, and `status` (`PASSED` / `FLAGGED_FOR_QUARANTINE`).

---

## 📡 API Reference

### Gateway Base URL: `http://localhost:5000`

| Method | Route | Auth | Description |
| :-- | :-- | :-- | :-- |
| `GET` | `/health` | Public | Server health check — returns protocol version & uptime |
| `POST` | `/api/v1/auth/login` | Public | Authenticate with Registered ID or Master Admin Passcode `1234` |
| `GET` | `/api/v1/audit/state-heatmaps` | JWT | Retrieve GIS risk scores for all Indian states/districts |
| `POST` | `/api/v1/raid/dispatch` | JWT | Generate SHA-256 court evidence package & dispatch Flying Squad |
| `GET` | `/api/v1/passport/:batchId` | JWT | Fetch full farm-to-door provenance chain for QR scan |

### Socket.io Events: `ws://localhost:5000`

| Event | Direction | Payload | Description |
| :-- | :-- | :-- | :-- |
| `join_jurisdiction` | Client → Server | `{ jurisdiction: "haryana" }` | Subscribe to a jurisdiction's telemetry room |
| `telemetry_tick` | Server → Client | `{ nodeId, liveFlowRateLPM, inlineDensityKgL, timestamp }` | 10-second live AMCU telemetry broadcast |
| `anomaly:detected` | Server → Client | `{ batchId, score, stateCode }` | AI anomaly alert pushed to FSSAI GIS command |
| `raid:dispatched` | Server → Client | `{ warrantId, centerCode, officerCount }` | Live raid status broadcast to enforcement teams |

### ML Engine Base URL: `http://localhost:8000`

| Method | Route | Description |
| :-- | :-- | :-- |
| `GET` | `/` | Service health — model version and status |
| `POST` | `/predict/yield-anomaly` | Biological yield gate for milk pour logging |
| `POST` | `/predict/volume-expansion` | Transit dilution detection via dispatch/receive delta |

---

## ⚡ Quick Start

### Prerequisites

```
Node.js  ≥ 18.0.0
npm      ≥ 9.0.0
Python   ≥ 3.10.0
```

### 1 — Clone & Bootstrap

```bash
git clone https://github.com/Unknownbeliek/hackindia-ai-web3-builders-hackathon-2026-unb.git
cd hackindia-ai-web3-builders-hackathon-2026-unb
npm install
```

### 2 — Configure Environment

**`client/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_MAP_TILE_LAYER=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MASTER_ADMIN_PASSCODE=1234
```

**`server/.env`**
```env
PORT=5000
JWT_SECRET=anveshana_master_jwt_secret_2026
ML_SERVICE_URL=http://localhost:8000
```

### 3 — Launch All Services

**Option A — Launch everything concurrently (from root):**
```bash
npm run dev
```
> Starts client + server + hardware-sim concurrently via `concurrently`.

**Option B — Launch services individually:**

```bash
# Terminal 1 — React Client Dashboard
npm run dev:client      # → http://localhost:3000

# Terminal 2 — Node.js Telemetry Gateway
npm run dev:server      # → http://localhost:5000

# Terminal 3 — Python FastAPI ML Engine
npm run dev:ml          # → http://localhost:8000
# (auto-installs: fastapi, uvicorn, pydantic, numpy, scikit-learn)

# Terminal 4 — AMCU Hardware Simulator (optional)
npm run dev:sim
```

### 4 — Demo Access

| Role | Access Method | Passcode |
| :--- | :--- | :--- |
| 🔑 **Master Admin** (All Portals) | Click lock icon → Enter passcode | `1234` |
| 🌾 Farmer | Select portal from landing page | — |
| 🥛 Aggregator | Select portal from landing page | — |
| 🔬 QC Officer | Select portal from landing page | — |
| 🏛️ FSSAI Auditor | Select portal from landing page | — |
| 🏷️ Consumer | Select portal from landing page | — |

---

## 🗺️ Roadmap

### Phase 1 — Complete ✅ (Current)
- [x] 5-portal RBAC dashboard ecosystem
- [x] Leaflet GIS state/district drill-down with `flyTo` camera animation
- [x] Python Isolation Forest anomaly detection (2 inference endpoints)
- [x] Socket.io 10-second real-time telemetry broadcasting
- [x] SHA-256 + Secp256k1 HSM hardware signing simulation
- [x] Consumer QR code purity passport with on-chain verification
- [x] Native `🌐 हिंदी` / English bilingual interface
- [x] React Native (Expo) farmer mobile companion app

### Phase 2 — Hardware IoT Integration
- [ ] Encrypted direct serial/Bluetooth data streaming from physical AMCU & Mandara milk analyzers
- [ ] HSM keypair provisioning on physical hardware units
- [ ] Zero-interception guarantee: raw sensor → cloud (no human-writable entry points)

### Phase 3 — Linguistic Accessibility
- [ ] Expand to all **22 official Indian languages** (Marathi, Gujarati, Tamil, Telugu, Punjabi, Bengali, Kannada…)
- [ ] Geo-location based **automatic dialect & accent detection** for TTS audio receipts  
  *(e.g., Haryanvi Hindi, Deshi Marathi, Mewati)*
- [ ] Offline TTS audio receipt generation on constrained mobile devices

### Phase 4 — National DPI Scale
- [ ] Nationwide rollout across **120 million registered milch animals** (INAPH/NDLM registry)
- [ ] Live Polygon/Ethereum smart contract receipts replacing simulation layer
- [ ] Integration with NABARD, NDDB, and FSSAI regulatory data pipelines
- [ ] Docker containerization + Kubernetes orchestration for cloud deployment

---

## 🔒 Security Model

```
  [ AMCU Hardware Raw Data ]
           │
           ▼  (Read-Only Serial Lock — no manual override)
  [ Secp256k1 HSM Signature ]  ← Private key burned into hardware unit
           │
           ▼  (Network Transmission — TLS encrypted)
  [ SHA-256 Digest ]           ← Immutable transaction fingerprint
           │
           ▼  (Cloud Storage)
  [ On-Chain Provenance Ledger ] ← Consumer-verifiable, tamper-evident
```

- **RBAC Gate**: Every portal access attempt passes through `RegisteredIdAuthModal.jsx` with JWT session control.
- **Court Evidence Package**: Sealed SHA-256 hash bundles AMCU telemetry + HSM signature + ML anomaly report into a single judicial-grade digital artifact.
- **Hardware Lock**: No manual Fat/SNF value entry pathway exists at the aggregator layer — data flows exclusively from hardware sensor to HSM to cloud.

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Version |
| :--- | :--- | :--- |
| Frontend Framework | React | 18.3 |
| Build Tool | Vite | 5.x |
| Styling | TailwindCSS | 3.x |
| Maps | Leaflet.js | 1.9.x |
| Icons | Lucide React | Latest |
| Backend Gateway | Node.js + Express | 18+ |
| Real-Time | Socket.io | 4.x |
| AI Inference | Python FastAPI | 0.110+ |
| ML Model | Scikit-learn Isolation Forest | 1.4+ |
| Numerical | NumPy | 1.26+ |
| Data Validation | Pydantic | 2.6+ |
| ASGI Server | Uvicorn | 0.28+ |
| Mobile | React Native (Expo) | SDK 51 |
| Cryptography | SHA-256 / Secp256k1 | Native |
| Process Manager | concurrently | 9.x |

---

## 📄 License

Distributed under the [MIT License](LICENSE). See `LICENSE` for details.

---

<div align="center">

Built with ❤️ for **HackIndia AI & Web3 Builders Hackathon 2026**

**Clean milk for every family · Guaranteed income for every farmer · Open infrastructure for India 🇮🇳**

*"Hardware-anchored supply chain integrity, not paper receipts."*

</div>
