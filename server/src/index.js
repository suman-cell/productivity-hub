// server/src/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('✅ Productivity Hub API is running');
});

// MongoDB connect
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productivity-hub';
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

const adminUsersRoutes = require('./routes/adminUsers');
app.use('/api/admin', adminUsersRoutes);



mongoose.connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
