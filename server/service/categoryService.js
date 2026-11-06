import {
  createCategoryModel,
  getCategoryModel,
  getCategoryByIdModel,
  findcategoryName,
  checkIdExist,
  checkUpdateCategoryExist,
  updateCategoryModel,
  deleteCategoryModel,
  categoryHasTransactions,
} from '../model/categoryModel.js';

export const createCategoryService = async ({ user_id, name, type }) => {
  if (!name || !type) {
    const err = new Error('name and type are required');
    err.status = 400; throw err;
  }
  if (type !== 'income' && type !== 'expense') {
    const err = new Error("type must be 'income' or 'expense'");
    err.status = 400; throw err;
  }

  const dup = await findcategoryName(user_id, name);
  if (dup) {
    const err = new Error('Category name already exists');
    err.status = 409; throw err;
  }

  return await createCategoryModel({ user_id, name, type });
};

export const getCategoryService = async (user_id) => {
  // Always returns an array (empty is fine — no 404 for empty list)
  return await getCategoryModel(user_id);
};

export const getCategoryByIdService = async (id, user_id) => {
  const cat = await getCategoryByIdModel(id, user_id);
  if (!cat) {
    const err = new Error('Category not found');
    err.status = 404; throw err;
  }
  return cat;
};

export const updateCategoryService = async (id, user_id, { name, type }) => {
  if (!name || !type) {
    const err = new Error('name and type are required');
    err.status = 400; throw err;
  }
  if (type !== 'income' && type !== 'expense') {
    const err = new Error("type must be 'income' or 'expense'");
    err.status = 400; throw err;
  }

  const exists = await checkIdExist(id, user_id);
  if (!exists) {
    const err = new Error('Category not found');
    err.status = 404; throw err;
  }

  const nameTaken = await checkUpdateCategoryExist(user_id, name, id);
  if (nameTaken) {
    const err = new Error('Category name already exists');
    err.status = 409; throw err;
  }

  const updated = await updateCategoryModel(id, user_id, name, type);
  return updated;
};

export const deleteCategoryService = async (id, user_id) => {
  const exists = await checkIdExist(id, user_id);
  if (!exists) {
    const err = new Error('Category not found');
    err.status = 404; throw err;
  }

  const inUse = await categoryHasTransactions(id);
  if (inUse) {
    const err = new Error('Category is used by transactions');
    err.status = 409; throw err;
  }

  await deleteCategoryModel(id, user_id);
};
