// server/src/routes/adminUsers.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(requireRole('admin'));

// GET /api/admin/users  -> list users (id, name, email, role, createdAt)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error('ADMIN LIST USERS ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT /api/admin/users/:id/role -> change role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['member','manager','admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    // Prevent admin from demoting themselves accidentally
    if (req.user.id === req.params.id && role !== 'admin') {
      return res.status(400).json({ msg: 'Cannot change your own admin role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, fields: 'name email role createdAt' });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('ADMIN UPDATE ROLE ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
