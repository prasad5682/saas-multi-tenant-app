const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ error: 'Superadmin required' });
  }
};

const requireTenantAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'tenantadmin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ error: 'Admin required' });
  }
};

module.exports = { authenticate, requireSuperAdmin, requireTenantAdmin };
