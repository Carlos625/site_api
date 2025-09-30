import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { validatePost } from '../middlewares/validators.js';

const router = express.Router();

router.post('/posts', validatePost, createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', validatePost, updatePost);
router.delete('/posts/:id', deletePost);

export default router;