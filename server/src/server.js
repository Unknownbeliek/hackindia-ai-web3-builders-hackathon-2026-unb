import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[ANVESHANA API] ${req.method} ${req.url}`);
  next();
});

// Mount REST API Routes
app.use('/api/v1', authenticateToken, apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', protocol: 'Anveshana Open Dairy Intelligence Protocol v1.0', timestamp: new Date() });
});

// Socket.io Real-Time Telemetry Broadcasting Channel
io.on('connection', (socket) => {
  console.log(`[SOCKET.IO] Telemetry client connected: ${socket.id}`);

  socket.on('join_jurisdiction', (jurisdiction) => {
    socket.join(`room:${jurisdiction.toLowerCase()}`);
    console.log(`[SOCKET.IO] Client ${socket.id} joined jurisdiction channel room:${jurisdiction.toLowerCase()}`);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET.IO] Telemetry client disconnected: ${socket.id}`);
  });
});

// Simulate 10-second real-time telemetry stream ping
setInterval(() => {
  io.emit('telemetry_tick', {
    timestamp: new Date().toISOString(),
    nodeId: 'MCC-104',
    liveFlowRateLPM: +(120 + Math.random() * 15).toFixed(1),
    inlineDensityKgL: +(1.032 + Math.random() * 0.002).toFixed(4)
  });
}, 10000);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[WARNING] Port ${PORT} is already in use by a running Anveshana Server instance!`);
    console.warn(`The backend server is ALREADY ACTIVE and serving API requests on port ${PORT}.`);
    process.exit(0);
  } else {
    console.error('[ERROR] Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ANVESHANA OPEN DAIRY INTELLIGENCE PROTOCOL SERVER `);
  console.log(` Express API Server listening on port: ${PORT}`);
  console.log(` WebSocket Telemetry Channel running via Socket.io`);
  console.log(`=======================================================`);
});
