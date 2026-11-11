# FinTrackET — Expense & Budget Manager

A personal finance web app for tracking income and expenses, setting monthly budgets per category, and reading spending reports — all in Ethiopian Birr (ETB).

---

## Features

| Area | What it does |
|---|---|
| **Transactions** | Add, edit and delete income/expense records. Search by description or category, sort any column, filter by date range or type, export filtered results to CSV. |
| **Categories** | Create income and expense categories to organise your records. |
| **Budgets** | Set a monthly ETB limit per category. A progress bar tracks spending and an over-budget warning fires the moment you exceed the limit. |
| **Dashboard** | Balance, income, expenses and a spending-by-category chart for the selected month, plus a 6-month income-vs-expenses bar chart. |
| **Reports** | Monthly income-vs-expenses bar chart and category breakdown. Export the full dataset to CSV. |
| **Profile** | Update name, email and password. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL hosted on [Supabase](https://supabase.com) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| HTTP client | Axios |

---

## Project Structure

```
expense-budget-management-system/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Shared UI (Navbar, Sidebar, Icons…)
│   │   ├── context/        # AuthContext
│   │   ├── hooks/          # useDebounce
│   │   ├── layouts/        # MainLayout (Navbar + Sidebar + Outlet)
│   │   ├── pages/          # One file per route
│   │   ├── routes/         # AppRoute, ProtectedRoute
│   │   └── services/       # Axios instance + mock API
│   └── public/
├── server/                 # Express 5 REST API
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── schema.sql          # PostgreSQL table definitions
│   ├── seed.js             # Demo data (optional)
│   └── README.md           # Full API endpoint reference
└── README.md               # This file
```

---

## Run It Locally

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account

---

### 1 — Set up the database

1. Create a new project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** and paste the contents of `server/schema.sql`, then run it.

---

### 2 — Configure the server

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in:

| Variable | Where to find it |
|---|---|
| `DATABASE_URL` | Supabase dashboard → your project → **Connect** → **Session pooler** → URI (port **5432**) |
| `JWT_SECRET` | Any long random string |
| `CLIENT_ORIGIN` | `http://localhost:5173` for local dev |

> **Note:** Use the **Session pooler** (port 5432), not the Transaction pooler (port 6543). Transaction mode breaks `RETURNING` clauses used throughout the API.

---

### 3 — Start the server

```bash
cd server
npm install
npm run dev        # starts on http://localhost:4000
```

**Optional — seed demo data:**

```bash
npm run seed
```

Creates demo user **`abebe@gmail.com`** / **`123456`** with sample categories, transactions and budgets so you can explore the app immediately.

> ⚠️ **Never run the seed script on a production database.** It inserts a known-password account and sample data.

---

### 4 — Configure the client

```bash
cp client/.env.example client/.env
```

Open `client/.env` and set:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `http://localhost:4000` |
| `VITE_USE_MOCK` | `false` (set to `true` to run the frontend without a backend) |

---

### 5 — Start the client

```bash
cd client
npm install
npm run dev        # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Reference

See **[server/README.md](server/README.md)** for the full endpoint reference (auth, categories, transactions, budgets, reports).
