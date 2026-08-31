import crypto from 'crypto';

console.log("=========================================================");
console.log(" AMCU ESSAE-SN8831 SERIAL HARDWARE TELEMETRY EMULATOR ");
console.log(" Serial Lock: /dev/ttyUSB0 (Baud: 9600 8N1)");
console.log(" Hardware Signature: ESSAE-SN8831-HW-LOCK-99401");
console.log("=========================================================");

setInterval(() => {
  const rawWeight = +(7.5 + Math.random() * 2.5).toFixed(1);
  const rawFat = +(4.0 + Math.random() * 0.5).toFixed(1);
  const rawSnf = +(8.5 + Math.random() * 0.4).toFixed(1);
  
  const payload = `ESSAE-SN8831|W:${rawWeight}KG|F:${rawFat}%|SNF:${rawSnf}%|T:${new Date().toISOString()}`;
  const hwSignature = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);

  console.log(`[HARDWARE TELEMETRY] ${payload} | SIG:${hwSignature}`);
}, 3000);
