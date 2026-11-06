import pool from '../config/db.js';

// Common SELECT columns so every query returns the same shape.
const TX_COLS = `
  t.id,
  t.amount,
  t.description,
  t.transaction_date,
  t.category_id,
  c.name  AS category_name,
  c.type  AS category_type`;

/** Insert and return the new transaction with category info. */
export const createTransactionModel = async (data, user_id) => {
  const { amount, category_id, description, transaction_date } = data;

  // Insert and get the new id in one round-trip
  const { rows: ins } = await pool.query(
    `INSERT INTO transactions
       (user_id, amount, category_id, description, transaction_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [user_id, amount, category_id, description, transaction_date]
  );
  const newId = ins[0].id;

  // Fetch the full row with category join
  const { rows } = await pool.query(
    `SELECT ${TX_COLS}
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.id = $1`,
    [newId]
  );
  return rows[0];
};

/** All transactions for a user, newest first. */
export const getTransactionModel = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT ${TX_COLS}
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1
     ORDER BY t.transaction_date DESC, t.id DESC`,
    [user_id]
  );
  return rows;
};

/** Single transaction by id + user_id guard. */
export const getTransactionModelById = async (user_id, transaction_id) => {
  const { rows } = await pool.query(
    `SELECT ${TX_COLS}
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1 AND t.id = $2`,
    [user_id, transaction_id]
  );
  return rows[0];
};

/**
 * Update and return the updated full row (with category info).
 * Returns undefined if the row was not found for this user.
 */
export const updateTransactionModel = async (user_id, transaction_id, data) => {
  const { amount, category_id, description, transaction_date } = data;

  const { rowCount } = await pool.query(
    `UPDATE transactions
     SET amount           = $1,
         category_id      = $2,
         description      = $3,
         transaction_date = $4
     WHERE user_id = $5 AND id = $6`,
    [amount, category_id, description, transaction_date, user_id, transaction_id]
  );

  if (rowCount === 0) return undefined;

  // Re-fetch the updated row with category join
  const { rows } = await pool.query(
    `SELECT ${TX_COLS}
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.id = $1`,
    [transaction_id]
  );
  return rows[0];
};

/**
 * Delete; returns true if a row was actually deleted.
 */
export const deleteTransactionModel = async (user_id, transaction_id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM transactions WHERE user_id = $1 AND id = $2',
    [user_id, transaction_id]
  );
  return rowCount > 0;
};

/**
 * Filtered query: type and/or date range are each optional independently.
 * Orders by transaction_date DESC, id DESC.
 */
export const getTransactionByTypeModel = async (
  user_id,
  type,
  start_date,
  end_date
) => {
  const values = [user_id];
  let sql = `
    SELECT ${TX_COLS}
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1`;

  if (type) {
    values.push(type);
    sql += ` AND c.type = $${values.length}`;
  }

  if (start_date) {
    values.push(start_date);
    sql += ` AND t.transaction_date >= $${values.length}`;
  }

  if (end_date) {
    values.push(end_date);
    sql += ` AND t.transaction_date <= $${values.length}`;
  }

  sql += ` ORDER BY t.transaction_date DESC, t.id DESC`;

  const { rows } = await pool.query(sql, values);
  return rows;
};
