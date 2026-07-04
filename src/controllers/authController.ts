import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { AppError } from '../services/authService';

// @desc    Register a user
// @route   POST /api/auth/register
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const result = await authService.login({ email, password });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    const err = error as Error;
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, data: req.user });
};

export { register, login, getMe };
