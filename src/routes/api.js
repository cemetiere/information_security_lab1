const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { Post, User } = require('../models');

const router = express.Router();

// GET /api/data - защищенный маршрут
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Data retrieved successfully',
      user: {
        id: req.user.id,
        username: req.user.username
      },
      posts: posts || []
    });
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts - создание поста
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

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

    res.status(201).json({
      message: 'Post created successfully',
      post: postWithUser
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

    res.json({
      message: 'Posts retrieved successfully',
      posts: posts || []
    });
  } catch (error) {
    console.error('Posts retrieval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;