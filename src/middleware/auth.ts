import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = (await User.findById(decoded.id)) as IUser | undefined;
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
      return;
    }
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: 'Not authorized, token invalid' });
  }
};

export { protect };
