const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register-tenant
router.post('/register-tenant', async (req, res) => {
  try {
    const { tenant_name, admin_name, admin_email, password } = req.body;
    
    if (!tenant_name || !admin_name || !admin_email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create tenant
    const tenantResult = await db.query(
      'INSERT INTO tenants (name, subscription_plan, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      [tenant_name, 'free']
    );
    
    const tenantId = tenantResult.rows[0].id;
    
    // Create admin user
    await db.query(
      'INSERT INTO users (tenant_id, name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [tenantId, admin_name, admin_email, hashedPassword, 'superadmin']
    );
    
    // Create JWT token
    const token = jwt.sign(
      { tenantId, email: admin_email, role: 'superadmin' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      message: 'Tenant registered successfully',
      token,
      tenant: { id: tenantId, name: tenant_name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, tenant_id FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
