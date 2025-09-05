const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');

// All task routes require auth
router.use(authMiddleware);

// Create task — assignee is logged-in user by default
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title) return res.status(400).json({ msg: 'Title required' });

    // default assignee = current user if not provided
    if (!payload.assignee) payload.assignee = req.user.id;

    const task = await Task.create(payload);
    res.status(201).json(task);
  } catch (err) {
    console.error('CREATE TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get tasks
router.get('/', async (req, res) => {
  try {
    const { projectId, assignee } = req.query;
    const q = {};
    if (projectId) q.projectId = projectId;
    if (assignee) q.assignee = assignee;
    const tasks = await Task.find(q).populate('assignee', 'name email role').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('GET TASKS ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get single
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'name email role');
    if (!task) return res.status(404).json({ msg: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error('GET TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update — only assignee or admin
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Not found' });

    // allow if admin or assignee
    if (req.user.role !== 'admin' && task.assignee?.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden: not task owner or admin' });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('UPDATE TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete — only admin or assignee
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Not found' });

    if (req.user.role !== 'admin' && task.assignee?.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden: not allowed to delete' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted', id: req.params.id });
  } catch (err) {
    console.error('DELETE TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
