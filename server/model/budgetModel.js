import pool from '../config/db.js';

// Columns returned on every budget query — includes category_name and spent
const BUDGET_SELECT = `
  b.id,
  b.category_id,
  c.name                              AS category_name,
  b.month,
  b.limit_amount,
  COALESCE(SUM(t.amount), 0)::float   AS spent`;

const BUDGET_JOINS = `
  FROM   budgets b
  JOIN   categories c ON c.id = b.category_id
  LEFT JOIN transactions t
         ON  t.category_id     = b.category_id
         AND t.user_id         = b.user_id
         AND to_char(t.transaction_date, 'YYYY-MM') = b.month`;

/**
 * All budgets for a user in a given month, with spent totals.
 */
export const getBudgetsModel = async (user_id, month) => {
  const { rows } = await pool.query(
    `SELECT ${BUDGET_SELECT}
     ${BUDGET_JOINS}
     WHERE b.user_id = $1
       AND b.month   = $2
     GROUP BY b.id, c.name
     ORDER BY b.id`,
    [user_id, month]
  );
  return rows;
};

/**
 * Single budget by id + user_id guard, with spent total.
 */
export const getBudgetByIdModel = async (id, user_id) => {
  const { rows } = await pool.query(
    `SELECT ${BUDGET_SELECT}
     ${BUDGET_JOINS}
     WHERE b.id      = $1
       AND b.user_id = $2
     GROUP BY b.id, c.name`,
    [id, user_id]
  );
  return rows[0];
};

/**
 * Insert a new budget and return it with category_name and spent.
 */
export const createBudgetModel = async ({ user_id, category_id, month, limit_amount }) => {
  const { rows: ins } = await pool.query(
    `INSERT INTO budgets (user_id, category_id, month, limit_amount)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [user_id, category_id, month, limit_amount]
  );
  return getBudgetByIdModel(ins[0].id, user_id);
};

/**
 * Update limit_amount; returns the updated budget with spent.
 * Returns undefined when not found for this user.
 */
export const updateBudgetModel = async (id, user_id, limit_amount) => {
  const { rowCount } = await pool.query(
    `UPDATE budgets
     SET limit_amount = $1
     WHERE id = $2 AND user_id = $3`,
    [limit_amount, id, user_id]
  );
  if (rowCount === 0) return undefined;
  return getBudgetByIdModel(id, user_id);
};

/**
 * Delete; returns true when a row was deleted.
 */
export const deleteBudgetModel = async (id, user_id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM budgets WHERE id = $1 AND user_id = $2',
    [id, user_id]
  );
  return rowCount > 0;
};

/**
 * Check whether a budget already exists for this user + category + month.
 */
export const budgetExistsModel = async (user_id, category_id, month) => {
  const { rows } = await pool.query(
    'SELECT id FROM budgets WHERE user_id = $1 AND category_id = $2 AND month = $3',
    [user_id, category_id, month]
  );
  return rows.length > 0;
};
