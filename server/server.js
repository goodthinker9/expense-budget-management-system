import dotenv from 'dotenv';
dotenv.config();

// ── Startup env-var checks ────────────────────────────────────────────────────
// Run these before anything touches the database or JWT.

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set. Set it in your .env file.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Set it in your .env file.');
  process.exit(1);
}

if (
  process.env.NODE_ENV === 'production' &&
  process.env.JWT_SECRET.length < 32
) {
  console.error(
    'FATAL: JWT_SECRET must be at least 32 characters in production.'
  );
  process.exit(1);
}

// ── Dynamic imports so the checks above can exit before modules initialise ────
const { default: pool } = await import('./config/db.js');
const { default: app  } = await import('./app.js');

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
}

startServer();
