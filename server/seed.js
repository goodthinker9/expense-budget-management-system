/**
 * seed.js — populate the database with demo data.
 *
 * Safe to run multiple times: existing records are detected and skipped.
 * Usage: npm run seed
 *
 * Demo user: abebe@gmail.com / 123456
 * Mirrors the data in client/src/services/mockApi.js.
 */

import pool from './config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

// ── helpers ──────────────────────────────────────────────────────────────────

async function upsertUser({ name, email, password }) {
  // Check first so we never double-hash an already-hashed password
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );
  if (rows.length > 0) {
    console.log(`  User already exists: ${email}`);
    return rows[0].id;
  }
  const hash = await bcrypt.hash(password, 10);
  const { rows: ins } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id`,
    [name, email, hash]
  );
  console.log(`  Created user: ${email}  (id=${ins[0].id})`);
  return ins[0].id;
}

async function upsertCategory(user_id, name, type) {
  const { rows } = await pool.query(
    'SELECT id FROM categories WHERE user_id = $1 AND name = $2',
    [user_id, name]
  );
  if (rows.length > 0) return rows[0].id;
  const { rows: ins } = await pool.query(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [user_id, name, type]
  );
  return ins[0].id;
}

async function upsertTransaction(user_id, category_id, amount, description, date) {
  // Idempotency key: same user + category + amount + date + description
  const { rows } = await pool.query(
    `SELECT id FROM transactions
     WHERE user_id = $1 AND category_id = $2
       AND amount = $3 AND transaction_date = $4
       AND description = $5`,
    [user_id, category_id, amount, date, description]
  );
  if (rows.length > 0) return rows[0].id;
  const { rows: ins } = await pool.query(
    `INSERT INTO transactions
       (user_id, category_id, amount, description, transaction_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [user_id, category_id, amount, description, date]
  );
  return ins[0].id;
}

async function upsertBudget(user_id, category_id, month, limit_amount) {
  const { rows } = await pool.query(
    'SELECT id FROM budgets WHERE user_id = $1 AND category_id = $2 AND month = $3',
    [user_id, category_id, month]
  );
  if (rows.length > 0) return rows[0].id;
  const { rows: ins } = await pool.query(
    `INSERT INTO budgets (user_id, category_id, month, limit_amount)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [user_id, category_id, month, limit_amount]
  );
  return ins[0].id;
}

// ── seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding database…');

  // ── User ──────────────────────────────────────────────────────────────────
  const userId = await upsertUser({
    name: 'Abebe Kebede',
    email: 'abebe@gmail.com',
    password: '123456',
  });

  // ── Categories ────────────────────────────────────────────────────────────
  console.log('  Seeding categories…');
  const catIds = {};
  const CATEGORIES = [
    { key: 'cat1', name: 'Salary',        type: 'income'  },
    { key: 'cat2', name: 'Freelance',     type: 'income'  },
    { key: 'cat3', name: 'Food & Dining', type: 'expense' },
    { key: 'cat4', name: 'Rent',          type: 'expense' },
    { key: 'cat5', name: 'Transport',     type: 'expense' },
    { key: 'cat6', name: 'Utilities',     type: 'expense' },
    { key: 'cat7', name: 'Health',        type: 'expense' },
    { key: 'cat8', name: 'Entertainment', type: 'expense' },
  ];
  for (const c of CATEGORIES) {
    catIds[c.key] = await upsertCategory(userId, c.name, c.type);
  }

  // ── Transactions ──────────────────────────────────────────────────────────
  console.log('  Seeding transactions…');
  const TX = [
    // August 2026
    ['cat1', 28000,  'Monthly salary',           '2026-08-01'],
    ['cat2',  5500,  'Website project payment',  '2026-08-05'],
    ['cat4',  8500,  'August rent',              '2026-08-02'],
    ['cat3',  3200,  'Weekly groceries',         '2026-08-07'],
    ['cat5',  1100,  'Bus pass',                 '2026-08-08'],
    ['cat6',   850,  'Electric bill',            '2026-08-10'],
    ['cat3',  1650,  'Restaurant lunch',         '2026-08-12'],
    ['cat7',  2200,  'Clinic visit',             '2026-08-15'],
    ['cat8',   900,  'Cinema tickets',           '2026-08-18'],
    ['cat3',  2800,  'Supermarket run',          '2026-08-21'],
    ['cat5',   600,  'Taxi rides',               '2026-08-24'],
    ['cat8',  1400,  'Streaming subscriptions',  '2026-08-28'],
    ['cat6',   450,  'Water bill',               '2026-08-30'],
    // September 2026
    ['cat1', 28000,  'Monthly salary',           '2026-09-01'],
    ['cat2',  7200,  'Mobile app design work',   '2026-09-03'],
    ['cat4',  8500,  'September rent',           '2026-09-02'],
    ['cat3',  3400,  'Weekly groceries',         '2026-09-06'],
    ['cat5',  1100,  'Bus pass',                 '2026-09-08'],
    ['cat6',   920,  'Electric bill',            '2026-09-10'],
    ['cat3',  1800,  'Lunch with colleagues',    '2026-09-13'],
    ['cat8',  2500,  'Concert tickets',          '2026-09-16'],
    ['cat7',   750,  'Pharmacy',                 '2026-09-18'],
    ['cat3',  2600,  'Supermarket run',          '2026-09-20'],
    ['cat5',   800,  'Rideshare',                '2026-09-23'],
    ['cat8',   600,  'Books',                    '2026-09-27'],
    ['cat6',   480,  'Internet bill',            '2026-09-29'],
    // October 2026
    ['cat1', 28000,  'Monthly salary',           '2026-10-01'],
    ['cat2',  9000,  'Dashboard UI project',     '2026-10-04'],
    ['cat4',  8500,  'October rent',             '2026-10-02'],
    ['cat3',  3600,  'Weekly groceries',         '2026-10-05'],
    ['cat5',  1100,  'Bus pass',                 '2026-10-07'],
    ['cat6',   870,  'Electric bill',            '2026-10-09'],
    ['cat3',  2100,  'Family dinner out',        '2026-10-12'],
    ['cat7',  3200,  'Dental appointment',       '2026-10-15'],
    ['cat8',  1800,  'Sports equipment',         '2026-10-18'],
    ['cat3',  2900,  'Supermarket run',          '2026-10-22'],
    ['cat5',   950,  'Taxi & rideshare',         '2026-10-25'],
    ['cat8',   700,  'Netflix & Spotify',        '2026-10-27'],
    ['cat6',   500,  'Water & internet',         '2026-10-29'],
    ['cat2',  4000,  'Logo design bonus',        '2026-10-30'],
    // November 2026 (partial)
    ['cat1', 28000,  'Monthly salary',           '2026-11-01'],
    ['cat4',  8500,  'November rent',            '2026-11-02'],
    ['cat3',  1800,  'Groceries',                '2026-11-03'],
  ];

  for (const [catKey, amount, description, date] of TX) {
    await upsertTransaction(userId, catIds[catKey], amount, description, date);
  }

  // ── Budgets ───────────────────────────────────────────────────────────────
  console.log('  Seeding budgets…');
  const BUDGETS = [
    ['cat3', '2026-10',  9000],
    ['cat4', '2026-10',  8500],
    ['cat5', '2026-10',  2000],
    ['cat8', '2026-10',  2000],
    ['cat3', '2026-11',  9000],
    ['cat4', '2026-11',  8500],
    ['cat5', '2026-11',  2000],
  ];
  for (const [catKey, month, limit] of BUDGETS) {
    await upsertBudget(userId, catIds[catKey], month, limit);
  }

  console.log('Seed complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
