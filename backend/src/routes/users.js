const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// POST /api/tenants/:tenantId/users (add user)
router.post('/:tenantId/users', authenticate, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      'INSERT INTO users (tenant_id, name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, name, email, role',
      [req.params.tenantId, name, email, hashedPassword, role || 'user']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/tenants/:tenantId/users (list users)
router.get('/:tenantId/users', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE tenant_id = $1 ORDER BY created_at DESC',
      [req.params.tenantId]
    );
    
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id (get user)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, tenant_id, created_at FROM users WHERE id = $1',
      [req.params.id]
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

// PUT /api/users/:id (update user)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const result = await db.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role) WHERE id = $4 RETURNING id, name, email, role',
      [name || null, email || null, role || null, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id (delete user)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
