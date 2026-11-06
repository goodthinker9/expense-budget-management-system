import {
  getReportService,
  getCategoryReportService,
  getDashboardReportService,
} from '../service/reportService.js';

export const getReportController = async (req, res, next) => {
  try {
    const result = await getReportService(req.user.id, req.query.month);
    res.status(200).json({ message: 'Monthly report fetched successfully.', result });
  } catch (err) { next(err); }
};

export const getReportByCategoryController = async (req, res, next) => {
  try {
    const result = await getCategoryReportService(req.user.id, req.query.month);
    res.status(200).json({ message: 'Category report fetched successfully.', result });
  } catch (err) { next(err); }
};

export const getDashboardReportController = async (req, res, next) => {
  try {
    const result = await getDashboardReportService(req.user.id, req.query.month);
    res.status(200).json({ message: 'Dashboard report fetched successfully.', result });
  } catch (err) { next(err); }
};
