import { checkIdExist } from '../model/categoryModel.js';
import {
  createTransactionModel,
  getTransactionModel,
  getTransactionModelById,
  updateTransactionModel,
  deleteTransactionModel,
  getTransactionByTypeModel,
} from '../model/transactionModel.js';
import { isValidDate } from '../middleware/validateDate.js';

// ── shared validation ─────────────────────────────────────────────────────────

function requireDate(val, field) {
  if (!val || !isValidDate(val)) {
    const err = new Error(`${field} must be a valid date (YYYY-MM-DD)`);
    err.status = 400;
    throw err;
  }
}

function requireDescription(val) {
  if (!val || !String(val).trim()) {
    const err = new Error('description is required');
    err.status = 400;
    throw err;
  }
  const trimmed = String(val).trim();
  if (trimmed.length > 255) {
    const err = new Error('description must be 255 characters or fewer');
    err.status = 400;
    throw err;
  }
  return trimmed;
}

// ── service functions ─────────────────────────────────────────────────────────

export const createTransactionService = async (data, user_id) => {
  const { amount, category_id, transaction_date } = data;

  if (!amount || !category_id || !transaction_date) {
    const err = new Error('category_id, amount and transaction_date are required');
    err.status = 400; throw err;
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    const err = new Error('amount must be a positive number');
    err.status = 400; throw err;
  }

  requireDate(transaction_date, 'transaction_date');

  const description = requireDescription(data.description);

  const cat = await checkIdExist(category_id, user_id);
  if (!cat) {
    const err = new Error('Category not found or does not belong to this user');
    err.status = 404; throw err;
  }

  return await createTransactionModel(
    { ...data, description, amount: Number(amount) },
    user_id
  );
};

export const getTransactionService = async (user_id, type, start_date, end_date) => {
  if (type && type !== 'income' && type !== 'expense') {
    const err = new Error("type must be 'income' or 'expense'");
    err.status = 400; throw err;
  }

  // Each date is validated independently (both alone and together are valid)
  if (start_date) requireDate(start_date, 'start_date');
  if (end_date)   requireDate(end_date,   'end_date');

  if (!type && !start_date && !end_date) {
    return await getTransactionModel(user_id);
  }

  return await getTransactionByTypeModel(user_id, type, start_date, end_date);
};

export const getTransactionServiceById = async (user_id, transaction_id) => {
  const tx = await getTransactionModelById(user_id, transaction_id);
  if (!tx) {
    const err = new Error('Transaction not found');
    err.status = 404; throw err;
  }
  return tx;
};

export const updateTransactionService = async (user_id, transaction_id, data) => {
  const { amount, category_id, transaction_date } = data;

  if (!amount || !category_id || !transaction_date) {
    const err = new Error('category_id, amount and transaction_date are required');
    err.status = 400; throw err;
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    const err = new Error('amount must be a positive number');
    err.status = 400; throw err;
  }

  requireDate(transaction_date, 'transaction_date');

  const description = requireDescription(data.description);

  const cat = await checkIdExist(category_id, user_id);
  if (!cat) {
    const err = new Error('Category not found or does not belong to this user');
    err.status = 404; throw err;
  }

  const updated = await updateTransactionModel(
    user_id,
    transaction_id,
    { ...data, description, amount: Number(amount) }
  );
  if (!updated) {
    const err = new Error('Transaction not found');
    err.status = 404; throw err;
  }
  return updated;
};

export const deleteTransactionService = async (user_id, transaction_id) => {
  const deleted = await deleteTransactionModel(user_id, transaction_id);
  if (!deleted) {
    const err = new Error('Transaction not found');
    err.status = 404; throw err;
  }
};
