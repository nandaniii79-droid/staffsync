import { Router } from 'express';
import auth, { allow } from '../middleware/auth.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';

const router = Router();
router.use(auth);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', allow('hr', 'manager'), async (req, res) => {
  try {
    const { q, department } = req.query;
    const f = {};
    if (department && department !== 'All') f.department = department;
    if (q) {
      const r = new RegExp(esc(q), 'i');
      f.$or = [{ name: r }, { email: r }, { position: r }];
    }
    res.json(await Employee.find(f).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', allow('hr'), async (req, res) => {
  try { res.status(201).json(await Employee.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', allow('hr'), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.json(emp);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', allow('hr'), async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    await Leave.deleteMany({ employee: req.params.id });
    await Attendance.deleteMany({ employee: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;