import { Router } from 'express';
import auth, { allow, withEmployee } from '../middleware/auth.js';
import Leave from '../models/Leave.js';

const router = Router();
router.use(auth, withEmployee);
const POP = ['employee', 'name department position'];

router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'employee') {
      if (!req.employee) return res.json([]);
      return res.json(await Leave.find({ employee: req.employee._id }).populate(...POP).sort({ createdAt: -1 }));
    }
    res.json(await Leave.find().populate(...POP).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { from, to } = req.body;
    if (new Date(to) < new Date(from)) return res.status(400).json({ message: '"To" date is before "From" date' });
    const data = { ...req.body };
    if (req.user.role !== 'hr') {
      if (!req.employee) return res.status(400).json({ message: 'No employee record found for your account' });
      data.employee = req.employee._id;
    }
    data.status = 'Pending';
    const leave = await Leave.create(data);
    res.status(201).json(await leave.populate(...POP));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.patch('/:id/status', allow('hr', 'manager'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) return res.status(400).json({ message: 'Bad status' });
    const existing = await Leave.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (req.employee && String(existing.employee) === String(req.employee._id))
      return res.status(403).json({ message: 'You cannot decide your own leave request' });
    existing.status = status;
    await existing.save();
    res.json(await existing.populate(...POP));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', allow('hr', 'manager'), async (req, res) => {
  try { await Leave.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;