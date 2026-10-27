import { Router } from 'express';
import auth from '../middleware/auth.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';

const router = Router();
router.use(auth);

router.get('/', async (_, res) => {
  try {
    const [total, byDept, pending, avg, recent, pendingList] = await Promise.all([
      Employee.countDocuments(),
      Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Leave.countDocuments({ status: 'Pending' }),
      Employee.aggregate([{ $group: { _id: null, avg: { $avg: '$salary' } } }]),
      Employee.find().sort({ createdAt: -1 }).limit(5),
      Leave.find({ status: 'Pending' }).populate('employee', 'name department').sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({
      total,
      departments: byDept.map((d) => ({ name: d._id, count: d.count })),
      pending,
      avgSalary: Math.round(avg[0]?.avg || 0),
      recent,
      pendingList,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;