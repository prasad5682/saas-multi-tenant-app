require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const tenants = await db.query('SELECT COUNT(*) FROM tenants');
    const users = await db.query('SELECT COUNT(*) FROM users');
    const projects = await db.query('SELECT COUNT(*) FROM projects');
    const tasks = await db.query('SELECT COUNT(*) FROM tasks');
    
    res.json({
      tenants: parseInt(tenants.rows[0].count),
      users: parseInt(users.rows[0].count),
      projects: parseInt(projects.rows[0].count),
      tasks: parseInt(tasks.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
