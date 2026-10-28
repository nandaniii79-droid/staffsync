import mongoose from 'mongoose';

export default mongoose.model('Announcement', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  author: String,
}, { timestamps: true }));