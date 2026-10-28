import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Remote', 'Half Day'], default: 'Present' },
  checkIn: { type: Date, default: Date.now },
});
schema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', schema);