-- ============================================================
-- Expense Budget Management System — Supabase PostgreSQL schema
-- Run this once in the Supabase SQL Editor.
-- ============================================================

create table if not exists users (
  id         serial primary key,
  name       varchar(100)        not null,
  email      varchar(255) unique not null,
  password   varchar(255)        not null,
  role       varchar(20)         not null default 'user',
  created_at timestamptz         not null default now()
);

create table if not exists categories (
  id         serial primary key,
  user_id    integer             not null references users(id) on delete cascade,
  name       varchar(100)        not null,
  type       varchar(10)         not null check (type in ('income','expense')),
  created_at timestamptz         not null default now(),
  unique (user_id, name)
);

create table if not exists transactions (
  id               serial primary key,
  user_id          integer        not null references users(id) on delete cascade,
  category_id      integer        not null references categories(id),
  amount           numeric(12,2)  not null check (amount > 0),
  description      text,
  transaction_date date           not null,
  created_at       timestamptz    not null default now()
);

create table if not exists budgets (
  id           serial primary key,
  user_id      integer        not null references users(id) on delete cascade,
  category_id  integer        not null references categories(id),
  month        char(7)        not null,
  limit_amount numeric(12,2)  not null check (limit_amount > 0),
  created_at   timestamptz    not null default now(),
  unique (user_id, category_id, month)
);
