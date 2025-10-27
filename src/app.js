require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Post } = require('./models');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Express Auth API is running!',
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        register: 'POST /auth/register'
      },
      api: {
        getData: 'GET /api/data (requires auth)',
        createPost: 'POST /api/posts (requires auth)',
        getPosts: 'GET /api/posts (requires auth)'
      }
    }
  });
});

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    let user = await User.findOne({ where: { username: 'testuser' } });
    if (!user) {
      user = await User.create({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      });
      console.log('✅ Test user created');
    }

    const postCount = await Post.count();
    if (postCount === 0) {
      await Post.create({
        title: 'Sample post',
        content: 'This is a sample post created automatically. Feel free to create your own posts!',
        userId: user.id
      });
      console.log('✅ Sample post created');
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await initDatabase();
});