import express from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { validateCategory } from '../middlewares/validators.js';

const router = express.Router();

router.post('/categories', validateCategory, createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', validateCategory, updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;