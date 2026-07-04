import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

router.route('/').get(protect, getUsers).post(protect, createUser);
router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
