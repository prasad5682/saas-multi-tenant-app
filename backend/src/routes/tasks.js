const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// POST /api/projects/:projectId/tasks
router.post('/:projectId/tasks', authenticate, async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    
    const result = await db.query(
      'INSERT INTO tasks (project_id, tenant_id, title, description, status, priority, due_date, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [req.params.projectId, req.user.tenantId, title, description || '', status || 'pending', priority || 'medium', due_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:projectId/tasks
router.get('/:projectId/tasks', authenticate, async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = 'SELECT * FROM tasks WHERE project_id = $1 AND tenant_id = $2';
    let params = [req.params.projectId, req.user.tenantId];
    
    if (status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = $' + (params.length + 1);
      params.push(priority);
    }
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
