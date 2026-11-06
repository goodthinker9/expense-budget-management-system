import express from 'express';
import {
  createCategoryController,
  getCategoryController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';
import validateId from '../middleware/validateId.js';

const router = express.Router();

router.get('/',      auth, getCategoryController);
router.post('/',     auth, createCategoryController);
router.get('/:id',   auth, validateId, getCategoryByIdController);
router.put('/:id',   auth, validateId, updateCategoryController);
router.delete('/:id', auth, validateId, deleteCategoryController);

export default router;
