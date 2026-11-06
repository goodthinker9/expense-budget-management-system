import {
  createTransactionService,
  getTransactionService,
  getTransactionServiceById,
  updateTransactionService,
  deleteTransactionService,
} from '../service/transactionService.js';

export const createTransactionController = async (req, res, next) => {
  try {
    const data = await createTransactionService(req.body, req.user.id);
    res.status(201).json({ message: 'Transaction created successfully.', data });
  } catch (err) { next(err); }
};

export const getTransactionController = async (req, res, next) => {
  try {
    const { type, start_date, end_date } = req.query;
    const data = await getTransactionService(req.user.id, type, start_date, end_date);
    res.status(200).json({ message: 'Transactions fetched successfully.', data });
  } catch (err) { next(err); }
};

export const getTransactionByIdController = async (req, res, next) => {
  try {
    const data = await getTransactionServiceById(req.user.id, req.params.id);
    res.status(200).json({ message: 'Transaction fetched successfully.', data });
  } catch (err) { next(err); }
};

export const updateTransactionController = async (req, res, next) => {
  try {
    const data = await updateTransactionService(req.user.id, req.params.id, req.body);
    res.status(200).json({ message: 'Transaction updated successfully.', data });
  } catch (err) { next(err); }
};

export const deleteTransactionController = async (req, res, next) => {
  try {
    await deleteTransactionService(req.user.id, req.params.id);
    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (err) { next(err); }
};
