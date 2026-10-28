import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import leaveRoutes from './routes/leaves.js';
import statsRoutes from './routes/stats.js';
import announcementRoutes from './routes/announcements.js';
import attendanceRoutes from './routes/attendance.js';
import trainingRoutes from './routes/training.js';
import meRoutes from './routes/me.js';

dotenv.config();
const app = express();

app.use(cors({ origin: (process.env.CLIENT_URL || '*').split(',') }));
app.use(express.json());

app.get('/', (_, res) => res.json({ status: 'StaffSync API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/me', meRoutes);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API on ${PORT}`)))
  .catch((e) => { console.error('Mongo error:', e.message); process.exit(1); });