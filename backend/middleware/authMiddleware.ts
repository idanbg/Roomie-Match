import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}
/// Middleware to protect routes
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { id: string };

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, token missing' });
  }
};
