import pool from '../config/db.js';

/** Return the full user row (including password) or undefined. */
export const checkuserExist = async (email) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0];
};

/**
 * Insert a new user and return the new row's id.
 * Role is always 'user' — never accepted from the caller.
 */
export const registerUserModel = async (userData) => {
  const { name, email, password } = userData;
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id`,
    [name, email, password]
  );
  return rows[0].id;
};

/** Fetch a user by id (no password). */
export const getUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role,
            created_at AS "createdAt"
     FROM users
     WHERE id = $1`,
    [id]
  );
  return rows[0];
};
