import {
  createCategoryService,
  getCategoryService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from '../service/categoryService.js';

export const createCategoryController = async (req, res, next) => {
  try {
    const result = await createCategoryService({ user_id: req.user.id, ...req.body });
    res.status(201).json({ message: 'Category created successfully.', result });
  } catch (err) { next(err); }
};

export const getCategoryController = async (req, res, next) => {
  try {
    const result = await getCategoryService(req.user.id);
    res.status(200).json({ message: 'Categories fetched successfully.', result });
  } catch (err) { next(err); }
};

export const getCategoryByIdController = async (req, res, next) => {
  try {
    const result = await getCategoryByIdService(req.params.id, req.user.id);
    res.status(200).json({ message: 'Category fetched successfully.', result });
  } catch (err) { next(err); }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const result = await updateCategoryService(req.params.id, req.user.id, req.body);
    res.status(200).json({ message: 'Category updated successfully.', result });
  } catch (err) { next(err); }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    await deleteCategoryService(req.params.id, req.user.id);
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (err) { next(err); }
};
