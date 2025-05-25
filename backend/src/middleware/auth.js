import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getUser = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
};
