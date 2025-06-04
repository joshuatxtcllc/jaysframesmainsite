
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        role: string;
        isAdmin: boolean;
      };
    }
  }
}

// Authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = AuthService.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

// Require admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Require staff or admin role
export const requireStaff = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin && req.user?.role !== 'admin' && req.user?.role !== 'staff') {
    return res.status(403).json({ message: 'Staff access required' });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = AuthService.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};
