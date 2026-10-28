import mongoose from 'mongoose';

export default mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['hr', 'manager', 'employee'] },
}, { timestamps: true }));