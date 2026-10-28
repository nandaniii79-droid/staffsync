import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

export default function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role)
    ? next()
    : res.status(403).json({ message: 'You do not have access to this' });

export const withEmployee = async (req, res, next) => {
  try {
    req.employee = await Employee.findOne({ email: req.user.email });
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};