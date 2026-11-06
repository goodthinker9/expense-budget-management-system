# Expense Budget Management System — Server

Express 5 REST API backed by Supabase PostgreSQL.

---

## Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 5
- **Database:** Supabase PostgreSQL via `pg`
- **Auth:** JWT (`jsonwebtoken`) + bcrypt

---

## Setup

### 1. Clone and install

```bash
cd server
npm install
```

### 2. Create the database tables

Open your [Supabase SQL Editor](https://supabase.com/dashboard) and run the contents of **`schema.sql`**.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port to listen on (default `4000`) |
| `DATABASE_URL` | Supabase **Session pooler** URL (port **5432**) — copy from Supabase → Connect → Session pooler |
| `JWT_SECRET` | Long random secret for signing JWTs |
| `CLIENT_ORIGIN` | React app origin for CORS (e.g. `http://localhost:5173`) |

> **Important:** Use the **Session pooler** (port 5432), not the Transaction pooler (port 6543).  
> Transaction mode breaks `RETURNING` clauses used throughout this API.

Example `DATABASE_URL`:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres
```

### 4. Seed demo data

```bash
npm run seed
```

Creates demo user **`abebe@gmail.com / 123456`** with 8 categories, 43 transactions (Aug–Nov 2026), and 7 budgets. Safe to run multiple times.

### 5. Start the server

```bash
npm run dev    # development (nodemon)
npm start      # production
```

Server starts at `http://localhost:4000`.

---

## Endpoint Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/api/auth/register` | — | `{name, email, password}` | `{message, data:{token,user}}` |
| POST | `/api/auth/login` | — | `{email, password}` | `{message, data:{token,user}}` |
| GET | `/api/auth/me` | ✓ | — | `{message, data: user}` |
| PUT | `/api/auth/me` | ✓ | `{name, email}` | `{message, data: user}` |
| PUT | `/api/auth/change-password` | ✓ | `{currentPassword, newPassword}` | `{message}` |

`user` shape: `{ id, name, email, role, createdAt }`

### Categories

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/api/category` | — | `{message, result:[{id,name,type}]}` |
| POST | `/api/category` | `{name, type}` | `{message, result: category}` |
| GET | `/api/category/:id` | — | `{message, result: category}` |
| PUT | `/api/category/:id` | `{name, type}` | `{message, result: category}` |
| DELETE | `/api/category/:id` | — | `{message}` |

### Transactions

| Method | Path | Query / Body | Response |
|--------|------|------|----------|
| GET | `/api/transaction` | `?type=&start_date=&end_date=` | `{message, data:[tx]}` |
| POST | `/api/transaction` | `{category_id, amount, description, transaction_date}` | `{message, data: tx}` |
| GET | `/api/transaction/:id` | — | `{message, data: tx}` |
| PUT | `/api/transaction/:id` | `{category_id, amount, description, transaction_date}` | `{message, data: tx}` |
| DELETE | `/api/transaction/:id` | — | `{message}` |

`tx` shape: `{ id, amount, description, transaction_date, category_id, category_name, category_type }`

### Reports (all require `?month=YYYY-MM`; defaults to current month)

| Method | Path | Response |
|--------|------|----------|
| GET | `/api/reports/monthly` | `{message, result:{month,income,expense,balance}}` |
| GET | `/api/reports/category` | `{message, result:{month,categories:[{category_name,type,total}]}}` |
| GET | `/api/reports/dashboard` | `{message, result:{month,income,expense,balance,categories}}` |

### Budgets

| Method | Path | Query / Body | Response |
|--------|------|------|----------|
| GET | `/api/budget` | `?month=YYYY-MM` | `{message, result:[budget]}` |
| POST | `/api/budget` | `{category_id, month, limit_amount}` | `{message, result: budget}` |
| PUT | `/api/budget/:id` | `{limit_amount}` | `{message, result: budget}` |
| DELETE | `/api/budget/:id` | — | `{message}` |

`budget` shape: `{ id, category_id, category_name, month, limit_amount, spent }`

---

## Status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Missing / invalid / expired token |
| 404 | Resource not found |
| 409 | Conflict (duplicate, FK violation) |
| 500 | Internal server error |
