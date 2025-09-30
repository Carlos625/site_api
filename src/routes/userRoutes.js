import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserPosts,
} from '../controllers/userController.js';
import { validateUser } from '../middlewares/validators.js';

const router = express.Router();

router.post('/users', validateUser, createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.get('/users/:id/posts', getUserPosts);
router.put('/users/:id', validateUser, updateUser);
router.delete('/users/:id', deleteUser);

export default router;