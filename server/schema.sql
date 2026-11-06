-- ============================================================
-- Expense Budget Management System — Supabase PostgreSQL schema
-- Run once in the Supabase SQL editor; tables must already exist
-- before starting the server or running seed.js.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255)        NOT NULL,
  role       VARCHAR(20)         NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100)        NOT NULL,
  type       VARCHAR(10)         NOT NULL CHECK (type IN ('income','expense')),
  created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS transactions (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id      INTEGER        NOT NULL REFERENCES categories(id),
  amount           NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
  description      TEXT,
  transaction_date DATE           NOT NULL,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budgets (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  INTEGER        NOT NULL REFERENCES categories(id),
  month        CHAR(7)        NOT NULL,          -- 'YYYY-MM'
  limit_amount NUMERIC(12,2)  NOT NULL CHECK (limit_amount > 0),
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category_id, month)
);
