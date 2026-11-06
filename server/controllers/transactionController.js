import {
  createTransactionService,
  getTransactionService,
  getTransactionServiceById,
  updateTransactionService,
  deleteTransactionService,
} from '../service/transactionService.js';

export const createTransactionController = async (req, res) => {
  try {
    const data = await createTransactionService(req.body, req.user.id);
    res.status(201).json({ message: 'Transaction created successfully.', data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

export const getTransactionController = async (req, res) => {
  try {
    const { type, start_date, end_date } = req.query;
    const data = await getTransactionService(req.user.id, type, start_date, end_date);
    res.status(200).json({ message: 'Transactions fetched successfully.', data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

export const getTransactionByIdController = async (req, res) => {
  try {
    const data = await getTransactionServiceById(req.user.id, req.params.id);
    res.status(200).json({ message: 'Transaction fetched successfully.', data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const data = await updateTransactionService(req.user.id, req.params.id, req.body);
    res.status(200).json({ message: 'Transaction updated successfully.', data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    await deleteTransactionService(req.user.id, req.params.id);
    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};
