import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = Router();
const ROLES = ['hr', 'manager', 'employee'];
const roleOf = (u) => u.role || 'hr';
const sign = (u) =>
  jwt.sign({ id: u._id, name: u.name, email: u.email, role: roleOf(u) }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ name: u.name, email: u.email, role: roleOf(u) });

router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = (req.body.email || '').toLowerCase().trim();
    const role = ROLES.includes(req.body.role) ? req.body.role : 'employee';
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be 6+ characters' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, role, password: await bcrypt.hash(password, 10) });

    if (role !== 'hr' && !(await Employee.findOne({ email }))) {
      await Employee.create({
        name, email,
        position: role === 'manager' ? 'Manager' : 'Team Member',
        department: 'Operations',
        status: 'Active',
      });
    }
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;