import express from 'express';
import auth from '../middleware/auth.js';
import validateId from '../middleware/validateId.js';
import {
  getBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
} from '../controllers/budgetController.js';

const router = express.Router();

router.get('/',       auth, getBudgetsController);
router.post('/',      auth, createBudgetController);
router.put('/:id',    auth, validateId, updateBudgetController);
router.delete('/:id', auth, validateId, deleteBudgetController);

export default router;
