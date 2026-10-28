import { Router } from 'express';
import auth, { allow, withEmployee } from '../middleware/auth.js';
import Training from '../models/Training.js';

const router = Router();
router.use(auth, withEmployee);

router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'employee') {
      const depts = ['All', req.employee?.department].filter(Boolean);
      return res.json(await Training.find({ department: { $in: depts } }).sort({ date: 1 }));
    }
    res.json(await Training.find().sort({ date: 1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', allow('hr', 'manager'), async (req, res) => {
  try { res.status(201).json(await Training.create({ ...req.body, createdBy: req.user.name })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', allow('hr', 'manager'), async (req, res) => {
  try { await Training.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;