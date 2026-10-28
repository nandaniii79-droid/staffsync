import mongoose from 'mongoose';

export default mongoose.model('Training', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  date: { type: Date, required: true },
  mode: { type: String, enum: ['Online', 'In person'], default: 'Online' },
  department: { type: String, default: 'All' },
  createdBy: String,
}, { timestamps: true }));