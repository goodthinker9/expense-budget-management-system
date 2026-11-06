import pool from '../config/db.js';

/**
 * Monthly income/expense totals for a user.
 * Uses to_char (pg) instead of DATE_FORMAT (MySQL).
 */
export const getReportModel = async (user_id, month) => {
  const { rows } = await pool.query(
    `SELECT c.type,
            SUM(t.amount) AS total
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1
       AND to_char(t.transaction_date, 'YYYY-MM') = $2
     GROUP BY c.type`,
    [user_id, month]
  );
  return rows;
};

/**
 * Category-level totals for a month.
 */
export const getCategoryReportModel = async (user_id, month) => {
  const { rows } = await pool.query(
    `SELECT c.name  AS category_name,
            c.type,
            SUM(t.amount) AS total
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.user_id = $1
       AND to_char(t.transaction_date, 'YYYY-MM') = $2
     GROUP BY c.id, c.name, c.type
     ORDER BY total DESC`,
    [user_id, month]
  );
  return rows;
};
