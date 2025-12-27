const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireSuperAdmin } = require('../middleware/auth');

// GET /api/tenants (superadmin only, with pagination)
router.get('/', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT id, name, subscription_plan, created_at FROM tenants OFFSET $1 LIMIT $2',
      [offset, limit]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM tenants');
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// GET /api/tenants/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, subscription_plan, created_at FROM tenants WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// PUT /api/tenants/:id
router.put('/:id', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const { name, subscription_plan } = req.body;
    
    const result = await db.query(
      'UPDATE tenants SET name = $1, subscription_plan = $2 WHERE id = $3 RETURNING *',
      [name || req.body.name, subscription_plan || 'free', req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

// DELETE /api/tenants/:id
router.delete('/:id', authenticate, requireSuperAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM tenants WHERE id = $1', [req.params.id]);
    res.json({ message: 'Tenant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
});

module.exports = router;
