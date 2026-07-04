import { Request, Response } from 'express';
import * as userService from '../services/userService';

// @desc    Get all users
// @route   GET /api/users
const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id as string);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a user
// @route   POST /api/users
const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.updateUser(req.params.id as string, {
      name,
      email,
      password,
    });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.deleteUser(req.params.id as string);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
