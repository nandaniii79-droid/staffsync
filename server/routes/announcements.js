import { Router } from 'express';
import auth, { allow } from '../middleware/auth.js';
import Announcement from '../models/Announcement.js';

const router = Router();
router.use(auth);

router.get('/', async (_, res) => {
  try { res.json(await Announcement.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', allow('hr'), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and message are required' });
    res.status(201).json(await Announcement.create({ title, body, author: req.user.name }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', allow('hr'), async (req, res) => {
  try { await Announcement.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;