import { Router } from 'express';
import auth from '../middleware/auth.js';
import Leave from '../models/Leave.js';

const router = Router();
router.use(auth);

router.get('/', async (_, res) => {
  try {
    res.json(await Leave.find().populate('employee', 'name department position').sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { from, to } = req.body;
    if (new Date(to) < new Date(from)) return res.status(400).json({ message: '"To" date is before "From" date' });
    const leave = await Leave.create(req.body);
    res.status(201).json(await leave.populate('employee', 'name department position'));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) return res.status(400).json({ message: 'Bad status' });
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('employee', 'name department position');
    res.json(leave);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await Leave.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;