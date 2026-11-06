import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool, types } = pg;

// ── Type parsers ──────────────────────────────────────────────────────────────
// DATE (1082)  → plain 'YYYY-MM-DD' string (not a JS Date object)
types.setTypeParser(1082, (val) => val);
// NUMERIC (1700) → float so amounts don't come back as strings
types.setTypeParser(1700, (val) => parseFloat(val));
// BIGINT (20)  → Number (safe for our id range)
types.setTypeParser(20, (val) => Number(val));

// ── Pool ──────────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── pg error-code helpers ─────────────────────────────────────────────────────
/**
 * Map a pg error to an application-level HTTP status code.
 *   23505 unique_violation  → 409
 *   23503 foreign_key_violation → 409
 */
export function pgErrorStatus(err) {
  if (err.code === '23505' || err.code === '23503') return 409;
  return 500;
}

/**
 * Human-readable message for common pg constraint violations.
 */
export function pgErrorMessage(err) {
  if (err.code === '23505') return 'A record with that value already exists.';
  if (err.code === '23503') return 'This record is referenced by other data.';
  return err.message || 'Internal server error.';
}

export default pool;
