import express from 'express';
import auth from '../middleware/auth.js';
import validateId from '../middleware/validateId.js';
import {
  createTransactionController,
  getTransactionController,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/',      auth, createTransactionController);
router.get('/',       auth, getTransactionController);
router.get('/:id',    auth, validateId, getTransactionByIdController);
router.put('/:id',    auth, validateId, updateTransactionController);
router.delete('/:id', auth, validateId, deleteTransactionController);

export default router;
