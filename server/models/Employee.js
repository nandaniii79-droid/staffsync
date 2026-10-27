import mongoose from 'mongoose';
export default mongoose.model('Employee', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  position: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Remote', 'On Leave'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true }));