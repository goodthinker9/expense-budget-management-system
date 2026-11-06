import {
  getBudgetsModel,
  createBudgetModel,
  updateBudgetModel,
  deleteBudgetModel,
  budgetExistsModel,
} from '../model/budgetModel.js';
import { checkIdExist } from '../model/categoryModel.js';
import { isValidMonth } from '../middleware/validateDate.js';

// ── helpers ───────────────────────────────────────────────────────────────────

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function resolveMonth(raw) {
  if (!raw) return currentMonth();
  if (!isValidMonth(raw)) {
    const err = new Error('month must be in YYYY-MM format');
    err.status = 400; throw err;
  }
  return raw;
}

// ── service functions ─────────────────────────────────────────────────────────

export const getBudgetsService = async (user_id, rawMonth) => {
  const month = resolveMonth(rawMonth);
  return await getBudgetsModel(user_id, month);
};

export const createBudgetService = async (user_id, body) => {
  const { category_id, month: rawMonth, limit_amount } = body;

  if (!category_id || !rawMonth || limit_amount === undefined) {
    const err = new Error('category_id, month and limit_amount are required');
    err.status = 400; throw err;
  }

  const month = resolveMonth(rawMonth);

  if (isNaN(limit_amount) || Number(limit_amount) <= 0) {
    const err = new Error('limit_amount must be a positive number');
    err.status = 400; throw err;
  }

  // checkIdExist now returns { id, type } so we can check both ownership and type
  const cat = await checkIdExist(category_id, user_id);
  if (!cat) {
    const err = new Error('Category not found or does not belong to this user');
    err.status = 404; throw err;
  }

  if (cat.type !== 'expense') {
    const err = new Error('Budgets can only be set for expense categories');
    err.status = 400; throw err;
  }

  // Duplicate check — clearer message than the generic constraint error
  const dup = await budgetExistsModel(user_id, Number(category_id), month);
  if (dup) {
    const err = new Error('Budget already exists for this category and month');
    err.status = 409; throw err;
  }

  return await createBudgetModel({
    user_id,
    category_id: Number(category_id),
    month,
    limit_amount: Number(limit_amount),
  });
};

export const updateBudgetService = async (id, user_id, body) => {
  const { limit_amount } = body;

  if (limit_amount === undefined) {
    const err = new Error('limit_amount is required');
    err.status = 400; throw err;
  }
  if (isNaN(limit_amount) || Number(limit_amount) <= 0) {
    const err = new Error('limit_amount must be a positive number');
    err.status = 400; throw err;
  }

  const result = await updateBudgetModel(id, user_id, Number(limit_amount));
  if (!result) {
    const err = new Error('Budget not found');
    err.status = 404; throw err;
  }
  return result;
};

export const deleteBudgetService = async (id, user_id) => {
  const deleted = await deleteBudgetModel(id, user_id);
  if (!deleted) {
    const err = new Error('Budget not found');
    err.status = 404; throw err;
  }
};
