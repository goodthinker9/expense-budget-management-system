import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool, types } = pg;

// ── Type parsers ──────────────────────────────────────────────────────────────
// DATE (1082)   → plain 'YYYY-MM-DD' string (not a JS Date object)
// NUMERIC (1700)→ float so amounts don't come back as strings
// BIGINT (20)   → Number (safe for our id range)
types.setTypeParser(1082,  (val) => val);
types.setTypeParser(1700,  (val) => parseFloat(val));
types.setTypeParser(20,    (val) => Number(val));

// ── SSL configuration ─────────────────────────────────────────────────────────
// DB_SSL_CA: paste the PEM text of Supabase's root CA certificate.
//   - Download from: Supabase dashboard → Database → Settings → SSL configuration
//   - In .env, escaped newlines (\n) are expanded automatically below.
// If DB_SSL_CA is set  → verify the cert (rejectUnauthorized: true).
// If it is not set     → skip verification (rejectUnauthorized: false).
//   In production a warning is logged when the CA is missing.

let sslConfig;

if (process.env.DB_SSL_CA) {
  // Allow \n in the env value to represent actual newlines
  const ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
  sslConfig = { ca, rejectUnauthorized: true };
} else {
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'WARNING: DB_SSL_CA not set: database certificate is not verified.'
    );
  }
  sslConfig = { rejectUnauthorized: false };
}

// ── Pool ──────────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

// ── pg error-code helpers ─────────────────────────────────────────────────────
export function pgErrorStatus(err) {
  if (err.code === '23505' || err.code === '23503') return 409;
  return 500;
}

export function pgErrorMessage(err) {
  if (err.code === '23505') return 'A record with that value already exists.';
  if (err.code === '23503') return 'This record is referenced by other data.';
  return err.message || 'Internal server error.';
}

export default pool;
