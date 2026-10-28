import { Router } from 'express';
import auth, { allow, withEmployee } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import { todayIST } from '../utils/date.js';

const router = Router();
router.use(auth, withEmployee);

router.post('/mark', async (req, res) => {
  try {
    if (!req.employee) return res.status(400).json({ message: 'No employee record found for your account' });
    const status = ['Present', 'Remote', 'Half Day'].includes(req.body.status) ? req.body.status : 'Present';
    const rec = await Attendance.create({ employee: req.employee._id, date: todayIST(), status });
    res.status(201).json(rec);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'You already marked attendance today' });
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    if (!req.employee) return res.json([]);
    res.json(await Attendance.find({ employee: req.employee._id }).sort({ date: -1 }).limit(30));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/', allow('hr', 'manager'), async (req, res) => {
  try {
    const date = req.query.date || todayIST();
    const [emps, recs] = await Promise.all([
      Employee.find().sort({ name: 1 }),
      Attendance.find({ date }),
    ]);
    const map = new Map(recs.map((r) => [String(r.employee), r]));
    const rows = emps.map((e) => {
      const r = map.get(String(e._id));
      return {
        employee: { _id: e._id, name: e.name, department: e.department, position: e.position },
        status: r ? r.status : 'Absent',
        checkIn: r ? r.checkIn : null,
      };
    });
    res.json({ date, rows });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;