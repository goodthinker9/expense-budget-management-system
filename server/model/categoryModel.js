import pool from '../config/db.js';

/** Create a category and return the full new row. */
export const createCategoryModel = async ({ user_id, name, type }) => {
  const { rows } = await pool.query(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1, $2, $3)
     RETURNING id, name, type`,
    [user_id, name, type]
  );
  return rows[0];
};

/** All categories for a user (returns [] when none). */
export const getCategoryModel = async (user_id) => {
  const { rows } = await pool.query(
    'SELECT id, name, type FROM categories WHERE user_id = $1 ORDER BY id',
    [user_id]
  );
  return rows;
};

/** Single category by id + user_id guard. */
export const getCategoryByIdModel = async (id, user_id) => {
  const { rows } = await pool.query(
    'SELECT id, name, type FROM categories WHERE id = $1 AND user_id = $2',
    [id, user_id]
  );
  return rows[0];
};

/** Check existence only (lightweight). */
export const checkIdExist = async (id, user_id) => {
  const { rows } = await pool.query(
    'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
    [id, user_id]
  );
  return rows[0];
};

/** Find by name for the same user (duplicate check on create). */
export const findcategoryName = async (user_id, name) => {
  const { rows } = await pool.query(
    'SELECT id FROM categories WHERE user_id = $1 AND name = $2',
    [user_id, name]
  );
  return rows[0];
};

/**
 * Check for a duplicate name on update (exclude the row being updated).
 * Returns true when another row has the same name.
 */
export const checkUpdateCategoryExist = async (user_id, name, id) => {
  const { rows } = await pool.query(
    `SELECT id FROM categories
     WHERE user_id = $1 AND name = $2 AND id != $3
     LIMIT 1`,
    [user_id, name, id]
  );
  return rows.length > 0;
};

/** Update name+type; returns the updated row. */
export const updateCategoryModel = async (id, user_id, name, type) => {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1, type = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id, name, type`,
    [name, type, id, user_id]
  );
  return rows[0];
};

/** Delete and return rowCount. */
export const deleteCategoryModel = async (id, user_id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2',
    [id, user_id]
  );
  return rowCount;
};

/**
 * Check whether any transaction references this category.
 * Used to give a friendly 409 instead of a DB FK error.
 */
export const categoryHasTransactions = async (id) => {
  const { rows } = await pool.query(
    'SELECT id FROM transactions WHERE category_id = $1 LIMIT 1',
    [id]
  );
  return rows.length > 0;
};

/** Lookup used by categoryService for the old getUserModelById call. */
export const getUserModelById = async (user_id) => {
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE id = $1',
    [user_id]
  );
  return rows;
};
