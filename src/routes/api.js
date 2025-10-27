const express = require('express');
const escapeHtml = require('escape-html');
const { authenticateToken } = require('../middleware/auth');
const { Post, User } = require('../models');

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

const sanitizePost = (post) => {
  if (!post) return post;
  
  const sanitized = sanitizeObject(post.toJSON ? post.toJSON() : post);
  
  if (sanitized.User) {
    sanitized.User = sanitizeObject(sanitized.User);
  }
  
  return sanitized;
};

// POST /api/posts - создание поста
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    let { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    title = sanitizeString(title);
    content = sanitizeString(content);

    const post = await Post.create({
      title,
      content,
      userId: req.user.id
    });

    const postWithUser = await Post.findByPk(post.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    const sanitizedPost = sanitizePost(postWithUser);
  
    res.status(201).json({
      message: 'Post created successfully',
      post: sanitizedPost
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts - получение всех постов
router.get('/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    const sanitizedPosts = posts.map(post => sanitizePost(post));

    res.json({
      message: 'Posts retrieved successfully',
      posts: sanitizedPosts || []
    });
  } catch (error) {
    console.error('Posts retrieval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;