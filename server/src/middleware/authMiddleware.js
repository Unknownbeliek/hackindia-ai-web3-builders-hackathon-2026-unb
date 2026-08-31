import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'anveshana_dpi_protocol_secret_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo purposes, allow fallback header or default role
    req.user = { role: req.headers['x-role'] || 'FARMER', nodeId: req.headers['x-node-id'] || 'VLC-22' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired JWT token' });
    req.user = user;
    next();
  });
}

export function authorizeRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires one of roles [${roles.join(', ')}]` });
    }
    next();
  };
}
