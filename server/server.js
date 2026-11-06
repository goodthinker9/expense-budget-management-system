import pool from './config/db.js';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Verify the database connection before accepting traffic
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
