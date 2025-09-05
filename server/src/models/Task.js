const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Types.ObjectId, ref: 'Project', required: false }, // optional for now
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo','inprogress','review','done'], default: 'todo' },
  assignee: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  dueDate: { type: Date, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
