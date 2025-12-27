const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// POST /api/projects
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const tenantId = req.user.tenantId;
    
    if (!name) return res.status(400).json({ error: 'Project name required' });
    
    const result = await db.query(
      'INSERT INTO projects (tenant_id, name, description, created_by, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [tenantId, name, description || '', req.user.userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3',
      [req.user.tenantId, offset, limit]
    );
    
    const countResult = await db.query(
      'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
      [req.user.tenantId]
    );
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM projects WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [req.params.id, req.user.tenantId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
