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
create table users (
  id integer generated always as identity primary key,
  name varchar(100) not null,
  email varchar(150) not null unique,
  password varchar(255) not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table categories (
  id integer generated always as identity primary key,
  user_id integer not null references users(id) on delete cascade,
  name varchar(100) not null,
  type text not null check (type in ('income','expense')),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table transactions (
  id integer generated always as identity primary key,
  user_id integer not null references users(id) on delete cascade,
  category_id integer not null references categories(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  description varchar(255) not null,
  transaction_date date not null,
  created_at timestamptz not null default now()
);
create index idx_tx_user_date on transactions (user_id, transaction_date);

create table budgets (
  id integer generated always as identity primary key,
  user_id integer not null references users(id) on delete cascade,
  category_id integer not null references categories(id) on delete cascade,
  month char(7) not null check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  limit_amount numeric(12,2) not null check (limit_amount > 0),
  created_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

-- Block direct public access through Supabase's auto-generated API.
-- Your Express server connects as the database owner, so it is not affected.
alter table users enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;