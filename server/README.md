# Expense Budget Management System — Server

Express 5 REST API backed by Supabase PostgreSQL.

---

## Security

The following hardening measures are in place:

| Measure | Detail |
|---|---|
| **HTTP security headers** | `helmet` sets `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, removes `X-Powered-By`, and more. |
| **Rate limiting** | `express-rate-limit` with `standardHeaders: true`. Auth endpoints (login/register): 10 req / 15 min. Change-password: 5 req / 15 min. All `/api` routes: 300 req / 15 min. Returns 429 `{ message: "Too many attempts, please try again later." }`. |
| **Proxy trust** | `app.set('trust proxy', 1)` so rate limiting sees client IPs behind Render/Railway. |
| **Body size limit** | `express.json({ limit: '10kb' })` — oversized bodies return 413, never a stack trace. |
| **CORS** | Only origins listed in `CLIENT_ORIGIN` (comma-separated) are allowed. No-Origin requests (curl, health checks) are permitted. |
| **Startup checks** | Server refuses to start if `DATABASE_URL` or `JWT_SECRET` is missing; refuses if `NODE_ENV=production` and `JWT_SECRET` is shorter than 32 chars. |
| **Health endpoint** | `GET /health` → `200 { status: "ok" }` with no DB hit, no auth, before all other middleware. |
| **Database SSL** | If `DB_SSL_CA` is set the PG pool verifies the server certificate (`rejectUnauthorized: true`). Without it, verification is skipped and a warning is logged in production. |
| **Input hygiene** | Email is trimmed and lowercased on register, login, and profile update. Email format is validated (400 `"Invalid email address"`). Name is 1–100 chars. Password is 6–72 chars (bcrypt silently ignores bytes after 72). |
| **Constant-time login** | Unknown email and wrong password return identical `401 "Invalid email or password"` messages to prevent user enumeration. |
| **Seed guard** | `seed.js` exits with code 1 when `NODE_ENV=production` unless `ALLOW_SEED=true` is explicitly set. |

### Security-related environment variables

| Variable | Description |
|---|---|
| `NODE_ENV` | Set to `production` in deployed environments. Enables JWT length check, DB SSL warning, and seed guard. |
| `CLIENT_ORIGIN` | Comma-separated list of allowed CORS origins, e.g. `https://app.example.com,https://www.example.com` |
| `DISABLE_RATE_LIMIT` | Set `true` during local testing to bypass all rate limiters. Never use in production. |
| `DB_SSL_CA` | PEM text of Supabase's root CA certificate (download from Supabase → Database → Settings → SSL configuration). Escaped newlines (`\n`) are accepted. |
| `ALLOW_SEED` | Set `true` to allow `npm run seed` when `NODE_ENV=production`. Not recommended. |

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
> The Session pooler (port 5432) is the safest choice for this app.

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
