const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/auth');

// protect all routes
router.use(authMiddleware);

// Create task
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title) return res.status(400).json({ msg: 'Title required' });
    const task = await Task.create(payload);
    res.status(201).json(task);
  } catch (err) {
    console.error('CREATE TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get tasks (optionally filter by projectId or assignee)
router.get('/', async (req, res) => {
  try {
    const { projectId, assignee } = req.query;
    const q = {};
    if (projectId) q.projectId = projectId;
    if (assignee) q.assignee = assignee;
    const tasks = await Task.find(q).populate('assignee', 'name email').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('GET TASKS ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get single task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'name email');
    if (!task) return res.status(404).json({ msg: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error('GET TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ msg: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error('UPDATE TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted', id: req.params.id });
  } catch (err) {
    console.error('DELETE TASK ERROR', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
