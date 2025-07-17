import express from 'express';
import cors from 'cors';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config({ path: '../.env' }); // Explicitly specify .env path

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const JWT_SECRET = process.env.VITE_SECRET_TOKEN;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    if (req.params.user_id && parseInt(req.params.user_id) !== user.user_id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
  });
};

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userCheck = await pool.query('SELECT * FROM userinfo WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO userinfo (username, password) VALUES ($1, $2) RETURNING user_id',
      [username, hashedPassword]
    );
    const user_id = result.rows[0].user_id;
    const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user_id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM userinfo WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ user_id: user.user_id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to this API');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM userinfo');
    res.json(result.rows);
    console.log(result.rows[0]?.password);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/users/:user_id/tasks', authenticateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users/:user_id/tasks', authenticateToken, async (req, res) => {
  const { user_id } = req.params;
  const { title, task_text, due_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, task_text, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, title, task_text, due_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.put('/api/tasks/:task_id', authenticateToken, async (req, res) => {
  const { task_id } = req.params;
  const { due_date } = req.body;
  try {
    const taskIdInt = parseInt(task_id, 10);
    if (isNaN(taskIdInt)) {
      return res.status(400).json({ error: 'Invalid task_id: must be an integer' });
    }
    const result = await pool.query(
      'UPDATE tasks SET due_date = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *',
      [due_date, taskIdInt, req.user.user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tasks/:task_id', authenticateToken, async (req, res) => {
  const { task_id } = req.params;
  try {
    const taskIdInt = parseInt(task_id, 10);
    if (isNaN(taskIdInt)) {
      return res.status(400).json({ error: 'Invalid task_id: must be an integer' });
    }
    const result = await pool.query(
      'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 RETURNING *',
      [taskIdInt, req.user.user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});