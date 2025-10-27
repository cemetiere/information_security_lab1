const express = require('express');
const escapeHtml = require('escape-html');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return escapeHtml(str);
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const sanitizedUser = sanitizeObject({
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.json({
      message: 'Login successful',
      token,
      user: sanitizedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password and email required' });
    }

    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [{ username }, { email }] 
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = await User.create({ username, password, email });

    const sanitizedUser = sanitizeObject({
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.status(201).json({
      message: 'User created successfully',
      user: sanitizedUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;