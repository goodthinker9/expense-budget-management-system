import pool from '../config/db.js';

const USER_COLS = `id, name, email, role, created_at AS "createdAt"`;

/** Fetch one user by id (no password). */
export const getUserByIdModel = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${USER_COLS} FROM users WHERE id = $1`,
    [id]
  );
  return rows[0]; // undefined when not found
};

/** Update name/email for a user; returns the updated row. */
export const updateUserModel = async (id, name, email) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET name  = $1,
         email = $2
     WHERE id  = $3
     RETURNING ${USER_COLS}`,
    [name, email, id]
  );
  return rows[0];
};

/** Update (bcrypt-hashed) password for a user. */
export const updatePasswordModel = async (id, hashedPassword) => {
  const { rowCount } = await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashedPassword, id]
  );
  return rowCount > 0;
};

/** Fetch the stored password hash for a user (for change-password check). */
export const getPasswordHash = async (id) => {
  const { rows } = await pool.query(
    'SELECT password FROM users WHERE id = $1',
    [id]
  );
  return rows[0]?.password;
};

/** Check whether an email is already taken by a DIFFERENT user. */
export const emailTakenByOther = async (email, excludeId) => {
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE email = $1 AND id != $2 LIMIT 1',
    [email, excludeId]
  );
  return rows.length > 0;
};
