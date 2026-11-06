import {
  getBudgetsService,
  createBudgetService,
  updateBudgetService,
  deleteBudgetService,
} from '../service/budgetService.js';

export const getBudgetsController = async (req, res, next) => {
  try {
    const result = await getBudgetsService(req.user.id, req.query.month);
    res.status(200).json({ message: 'Budgets fetched successfully.', result });
  } catch (err) { next(err); }
};

export const createBudgetController = async (req, res, next) => {
  try {
    const result = await createBudgetService(req.user.id, req.body);
    res.status(201).json({ message: 'Budget created successfully.', result });
  } catch (err) { next(err); }
};

export const updateBudgetController = async (req, res, next) => {
  try {
    const result = await updateBudgetService(req.params.id, req.user.id, req.body);
    res.status(200).json({ message: 'Budget updated successfully.', result });
  } catch (err) { next(err); }
};

export const deleteBudgetController = async (req, res, next) => {
  try {
    await deleteBudgetService(req.params.id, req.user.id);
    res.status(200).json({ message: 'Budget deleted successfully.' });
  } catch (err) { next(err); }
};
