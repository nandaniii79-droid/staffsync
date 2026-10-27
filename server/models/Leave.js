import mongoose from 'mongoose';
export default mongoose.model('Leave', new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, enum: ['Casual', 'Sick', 'Paid', 'Unpaid'], default: 'Casual' },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true }));