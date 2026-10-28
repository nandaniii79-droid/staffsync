import { Router } from 'express';
import auth, { withEmployee } from '../middleware/auth.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Announcement from '../models/Announcement.js';
import Training from '../models/Training.js';
import { todayIST } from '../utils/date.js';

const router = Router();
router.use(auth, withEmployee);

router.get('/', (req, res) => res.json({ employee: req.employee }));

router.put('/', async (req, res) => {
  try {
    if (!req.employee) return res.status(400).json({ message: 'No employee record found for your account' });
    req.employee.phone = (req.body.phone || '').trim();
    await req.employee.save();
    res.json({ employee: req.employee });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.get('/summary', async (req, res) => {
  try {
    const e = req.employee;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const depts = ['All', e?.department].filter(Boolean);
    const [announcements, trainings] = await Promise.all([
      Announcement.find().sort({ createdAt: -1 }).limit(3),
      Training.find({ date: { $gte: start }, department: { $in: depts } }).sort({ date: 1 }).limit(3),
    ]);
    const leaves = { Pending: 0, Approved: 0, Rejected: 0 };
    let today = null;
    if (e) {
      (await Leave.find({ employee: e._id })).forEach((l) => { leaves[l.status]++; });
      today = await Attendance.findOne({ employee: e._id, date: todayIST() });
    }
    res.json({ employee: e, leaves, today, announcements, trainings });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;