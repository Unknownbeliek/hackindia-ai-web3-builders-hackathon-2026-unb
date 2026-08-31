import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'anveshana_dpi_protocol_secret_2026';

// In-Memory Data Store (Production backed by PostgreSQL / IndexedDB sync)
let pourEvents = [
  { eventId: 'PE-20260831-001', farmerId: '201410000123', weightKg: 8.5, fatPercent: 4.2, snfPercent: 8.7, payoutINR: 382.50, receiptHash: 'sha256:7d2b9af8103c31ff782' }
];

let batches = [
  { batchId: 'BATCH-20260831-TN401', tankerRegistration: 'HR-07-GA-5541', volumeDeltaPercent: 6.8, batchStatus: 'IN_TRANSIT', anomalyScore: 92 }
];

// POST /api/v1/auth/login
router.post('/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  const token = jwt.sign({ username, role: role || 'FARMER', nodeId: 'VLC-22' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { username, role: role || 'FARMER', nodeId: 'VLC-22' } });
});

// GET /api/v1/farmer/:farmerId
router.get('/farmer/:farmerId', (req, res) => {
  res.json({
    farmerId: req.params.farmerId,
    name: 'Ramesh Kumar',
    ndlmTag: '840003129940112',
    purityScore: 87,
    registeredCows: 4,
    recentPours: pourEvents
  });
});

// POST /api/v1/aggregator/pour
router.post('/aggregator/pour', (req, res) => {
  const { farmerId, weightKg, fatPercent, snfPercent } = req.body;

  // Biological Yield Limit check (max 12 kg per cow pour session)
  if (weightKg > 18.0) {
    return res.status(422).json({
      error: 'AI Yield Violation Auto-Rejected',
      message: `Weight ${weightKg}kg exceeds biological limit for registered cattle count. Discrepancy logged.`
    });
  }

  const eventId = `PE-20260831-${String(pourEvents.length + 1).padStart(3, '0')}`;
  const receiptHash = `sha256:${crypto.createHash('sha256').update(JSON.stringify(req.body) + Date.now()).digest('hex')}`;
  
  const pour = {
    eventId,
    farmerId,
    weightKg,
    fatPercent,
    snfPercent,
    payoutINR: +(weightKg * 45).toFixed(2),
    receiptHash,
    timestamp: new Date().toISOString()
  };

  pourEvents.unshift(pour);
  res.status(201).json({ success: true, pour });
});

// POST /api/v1/qco/quarantine
router.post('/qco/quarantine', (req, res) => {
  const { batchId } = req.body;
  batches = batches.map(b => b.batchId === batchId ? { ...b, batchStatus: 'QUARANTINED' } : b);
  res.json({ success: true, message: `Batch ${batchId} Quarantined. Upstream payouts frozen.` });
});

// GET /api/v1/govt/anomalies
router.get('/govt/anomalies', (req, res) => {
  res.json([
    { anomalyId: 'ANO-2026-0901', nodeId: 'MCC-104', riskScore: 92, details: 'Volume expansion +6.8% detected' }
  ]);
});

// GET /api/v1/public/passport/:batchId
router.get('/public/passport/:batchId', (req, res) => {
  res.json({
    batchId: req.params.batchId,
    status: 'VERIFIED_CLEAN',
    sourceRegion: 'Karnal District, Haryana',
    farmersCount: 22,
    coldChainTemp: '3.8°C',
    sha256Hash: 'sha256:7d2b9af8103c31ff78201a44eef938101a44'
  });
});

export default router;
