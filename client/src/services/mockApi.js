/**
 * mockApi.js — In-memory mock API with localStorage persistence.
 *
 * Implements exactly the same endpoint contract the real backend will use:
 *
 *  AUTH
 *    POST /api/auth/register   body: { name, email, password }
 *                              → { message, data: { token, user } }
 *    POST /api/auth/login      body: { email, password }
 *                              → { message, data: { token, user } }
 *    GET  /api/auth/me         → { message, data: user }
 *    PUT  /api/auth/me         body: { name, email }  → { message, data: user }
 *    PUT  /api/auth/change-password
 *                              body: { currentPassword, newPassword }
 *                              → { message }
 *
 *  CATEGORIES
 *    GET    /api/category          → { message, result: [category] }
 *    GET    /api/category/:id      → { message, result: category }
 *    POST   /api/category          body: { name, type }  → { message, result: category }
 *    PUT    /api/category/:id      body: { name, type }  → { message, result: category }
 *    DELETE /api/category/:id      → { message }
 *
 *  TRANSACTIONS
 *    GET    /api/transaction?type=&start_date=&end_date=
 *                              → { message, data: [transaction] }
 *    GET    /api/transaction/:id   → { message, data: transaction }
 *    POST   /api/transaction   body: { category_id, amount, description, transaction_date }
 *                              → { message, data: transaction }
 *    PUT    /api/transaction/:id   body: same  → { message, data: transaction }
 *    DELETE /api/transaction/:id   → { message }
 *
 *  REPORTS
 *    GET /api/reports/monthly?month=YYYY-MM
 *                              → { message, result: [{ type, total }] }
 *    GET /api/reports/category?month=YYYY-MM
 *                              → { message, result: [{ category_name, type, total }] }
 *
 *  BUDGETS  (shape documented for the real backend)
 *    Budget object: { id, category_id, category_name, month (YYYY-MM), limit_amount, spent }
 *    GET    /api/budget?month=YYYY-MM  → { message, result: [budget] }
 *    POST   /api/budget         body: { category_id, month, limit_amount }
 *                              → { message, result: budget }
 *    PUT    /api/budget/:id     body: { limit_amount }  → { message, result: budget }
 *    DELETE /api/budget/:id     → { message }
 */

// ─── helpers ────────────────────────────────────────────────────────────────

const LATENCY = 300; // ms – makes loading states visible

const delay = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Remove password field from user object before returning to client
function omitPassword(user) {
  const copy = { ...user };
  delete copy.password;
  return copy;
}

// Simple JWT-like token: base64(payload) (NOT cryptographically secure, mock only)
function makeToken(userId) {
  return btoa(JSON.stringify({ userId, iat: Date.now() }));
}

function parseToken(token) {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

// ─── storage helpers ────────────────────────────────────────────────────────

const KEYS = {
  users: 'mock_users',
  categories: 'mock_categories',
  transactions: 'mock_transactions',
  budgets: 'mock_budgets',
  seeded: 'mock_seeded',
};

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch {
    return null;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── seed data ──────────────────────────────────────────────────────────────

function seedData() {
  if (load(KEYS.seeded)) return; // already seeded

  // Default user
  const userId = 'user_abebe';
  const users = [
    {
      id: userId,
      name: 'Abebe Kebede',
      email: 'abebe@gmail.com',
      password: '123456',
      createdAt: '2026-01-15T08:00:00Z',
    },
  ];

  // 8 categories
  const categories = [
    { id: 'cat1', user_id: userId, name: 'Salary',        type: 'income'  },
    { id: 'cat2', user_id: userId, name: 'Freelance',     type: 'income'  },
    { id: 'cat3', user_id: userId, name: 'Food & Dining', type: 'expense' },
    { id: 'cat4', user_id: userId, name: 'Rent',          type: 'expense' },
    { id: 'cat5', user_id: userId, name: 'Transport',     type: 'expense' },
    { id: 'cat6', user_id: userId, name: 'Utilities',     type: 'expense' },
    { id: 'cat7', user_id: userId, name: 'Health',        type: 'expense' },
    { id: 'cat8', user_id: userId, name: 'Entertainment', type: 'expense' },
  ];

  // Helper: build a transaction
  const tx = (id, catId, amount, description, dateStr) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      id,
      user_id: userId,
      category_id: catId,
      category_name: cat.name,
      category_type: cat.type,
      amount,
      description,
      transaction_date: dateStr,
    };
  };

  // ~40 transactions spread across the last 3 months (Aug / Sep / Oct 2026)
  const transactions = [
    // ── August 2026 ──────────────────────────────────────────────────
    tx('t01', 'cat1', 28000,  'Monthly salary',           '2026-08-01'),
    tx('t02', 'cat2',  5500,  'Website project payment',  '2026-08-05'),
    tx('t03', 'cat4',  8500,  'August rent',              '2026-08-02'),
    tx('t04', 'cat3',  3200,  'Weekly groceries',         '2026-08-07'),
    tx('t05', 'cat5',  1100,  'Bus pass',                 '2026-08-08'),
    tx('t06', 'cat6',   850,  'Electric bill',            '2026-08-10'),
    tx('t07', 'cat3',  1650,  'Restaurant lunch',         '2026-08-12'),
    tx('t08', 'cat7',  2200,  'Clinic visit',             '2026-08-15'),
    tx('t09', 'cat8',   900,  'Cinema tickets',           '2026-08-18'),
    tx('t10', 'cat3',  2800,  'Supermarket run',          '2026-08-21'),
    tx('t11', 'cat5',   600,  'Taxi rides',               '2026-08-24'),
    tx('t12', 'cat8',  1400,  'Streaming subscriptions',  '2026-08-28'),
    tx('t13', 'cat6',   450,  'Water bill',               '2026-08-30'),

    // ── September 2026 ───────────────────────────────────────────────
    tx('t14', 'cat1', 28000,  'Monthly salary',           '2026-09-01'),
    tx('t15', 'cat2',  7200,  'Mobile app design work',   '2026-09-03'),
    tx('t16', 'cat4',  8500,  'September rent',           '2026-09-02'),
    tx('t17', 'cat3',  3400,  'Weekly groceries',         '2026-09-06'),
    tx('t18', 'cat5',  1100,  'Bus pass',                 '2026-09-08'),
    tx('t19', 'cat6',   920,  'Electric bill',            '2026-09-10'),
    tx('t20', 'cat3',  1800,  'Lunch with colleagues',    '2026-09-13'),
    tx('t21', 'cat8',  2500,  'Concert tickets',          '2026-09-16'),
    tx('t22', 'cat7',   750,  'Pharmacy',                 '2026-09-18'),
    tx('t23', 'cat3',  2600,  'Supermarket run',          '2026-09-20'),
    tx('t24', 'cat5',   800,  'Rideshare',                '2026-09-23'),
    tx('t25', 'cat8',   600,  'Books',                    '2026-09-27'),
    tx('t26', 'cat6',   480,  'Internet bill',            '2026-09-29'),

    // ── October 2026 ─────────────────────────────────────────────────
    tx('t27', 'cat1', 28000,  'Monthly salary',           '2026-10-01'),
    tx('t28', 'cat2',  9000,  'Dashboard UI project',     '2026-10-04'),
    tx('t29', 'cat4',  8500,  'October rent',             '2026-10-02'),
    tx('t30', 'cat3',  3600,  'Weekly groceries',         '2026-10-05'),
    tx('t31', 'cat5',  1100,  'Bus pass',                 '2026-10-07'),
    tx('t32', 'cat6',   870,  'Electric bill',            '2026-10-09'),
    tx('t33', 'cat3',  2100,  'Family dinner out',        '2026-10-12'),
    tx('t34', 'cat7',  3200,  'Dental appointment',       '2026-10-15'),
    tx('t35', 'cat8',  1800,  'Sports equipment',         '2026-10-18'),
    tx('t36', 'cat3',  2900,  'Supermarket run',          '2026-10-22'),
    tx('t37', 'cat5',   950,  'Taxi & rideshare',         '2026-10-25'),
    tx('t38', 'cat8',   700,  'Netflix & Spotify',        '2026-10-27'),
    tx('t39', 'cat6',   500,  'Water & internet',         '2026-10-29'),
    tx('t40', 'cat2',  4000,  'Logo design bonus',        '2026-10-30'),

    // ── November 2026 (partial, current month) ────────────────────────
    tx('t41', 'cat1', 28000,  'Monthly salary',           '2026-11-01'),
    tx('t42', 'cat4',  8500,  'November rent',            '2026-11-02'),
    tx('t43', 'cat3',  1800,  'Groceries',                '2026-11-03'),
  ];

  // Sample budgets for October & November
  const budgets = [
    { id: 'b1', user_id: userId, category_id: 'cat3', category_name: 'Food & Dining', month: '2026-10', limit_amount: 9000 },
    { id: 'b2', user_id: userId, category_id: 'cat4', category_name: 'Rent',          month: '2026-10', limit_amount: 8500 },
    { id: 'b3', user_id: userId, category_id: 'cat5', category_name: 'Transport',     month: '2026-10', limit_amount: 2000 },
    { id: 'b4', user_id: userId, category_id: 'cat8', category_name: 'Entertainment', month: '2026-10', limit_amount: 2000 },
    { id: 'b5', user_id: userId, category_id: 'cat3', category_name: 'Food & Dining', month: '2026-11', limit_amount: 9000 },
    { id: 'b6', user_id: userId, category_id: 'cat4', category_name: 'Rent',          month: '2026-11', limit_amount: 8500 },
    { id: 'b7', user_id: userId, category_id: 'cat5', category_name: 'Transport',     month: '2026-11', limit_amount: 2000 },
  ];

  save(KEYS.users, users);
  save(KEYS.categories, categories);
  save(KEYS.transactions, transactions);
  save(KEYS.budgets, budgets);
  save(KEYS.seeded, true);
}

// ─── auth helpers ────────────────────────────────────────────────────────────

function getCurrentUser(token) {
  const parsed = parseToken(token);
  if (!parsed) return null;
  const users = load(KEYS.users) || [];
  return users.find((u) => u.id === parsed.userId) || null;
}

// ─── error factory ───────────────────────────────────────────────────────────

function mockError(status, message) {
  const err = new Error(message);
  err.response = { status, data: { message } };
  return err;
}

// ─── mock handler ────────────────────────────────────────────────────────────

/**
 * Intercepts an axios-style config object and returns a resolved/rejected
 * promise shaped exactly like an axios response: { data, status, ... }
 */
export async function handleMockRequest(config) {
  await delay();

  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  // Strip query string from url for matching
  const path = url.split('?')[0].replace(/\/$/, '');
  const body = config.data
    ? typeof config.data === 'string'
      ? JSON.parse(config.data)
      : config.data
    : {};
  const params = config.params || {};

  const token = config.headers?.Authorization?.replace('Bearer ', '') || null;

  // Ensure seed data exists
  seedData();

  // ── AUTH ──────────────────────────────────────────────────────────────────

  if (method === 'post' && path === '/api/auth/register') {
    const users = load(KEYS.users) || [];
    if (users.find((u) => u.email === body.email)) {
      throw mockError(409, 'Email already registered.');
    }
    const newUser = {
      id: uid(),
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date().toISOString(),
    };
    save(KEYS.users, [...users, newUser]);
    const tkn = makeToken(newUser.id);
    const safeUser = omitPassword(newUser);
    return { data: { message: 'Registered successfully.', data: { token: tkn, user: safeUser } }, status: 201 };
  }

  if (method === 'post' && path === '/api/auth/login') {
    const users = load(KEYS.users) || [];
    const user = users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) throw mockError(401, 'Invalid email or password.');
    const tkn = makeToken(user.id);
    const safeUser = omitPassword(user);
    return { data: { message: 'Login successful.', data: { token: tkn, user: safeUser } }, status: 200 };
  }

  if (method === 'get' && path === '/api/auth/me') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const safeUser = omitPassword(user);
    return { data: { message: 'User fetched.', data: safeUser }, status: 200 };
  }

  if (method === 'put' && path === '/api/auth/me') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const users = load(KEYS.users) || [];
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, name: body.name || u.name, email: body.email || u.email } : u
    );
    save(KEYS.users, updated);
    const safeUser = omitPassword(updated.find((u) => u.id === user.id));
    return { data: { message: 'Profile updated.', data: safeUser }, status: 200 };
  }

  if (method === 'put' && path === '/api/auth/change-password') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    if (user.password !== body.currentPassword) throw mockError(400, 'Current password is incorrect.');
    const users = load(KEYS.users) || [];
    save(KEYS.users, users.map((u) => u.id === user.id ? { ...u, password: body.newPassword } : u));
    return { data: { message: 'Password changed successfully.' }, status: 200 };
  }

  // ── CATEGORIES ────────────────────────────────────────────────────────────

  if (method === 'get' && path === '/api/category') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const all = load(KEYS.categories) || [];
    const result = all.filter((c) => c.user_id === user.id);
    return { data: { message: 'Categories fetched.', result }, status: 200 };
  }

  if (method === 'get' && /^\/api\/category\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.categories) || [];
    const result = all.find((c) => c.id === id && c.user_id === user.id);
    if (!result) throw mockError(404, 'Category not found.');
    return { data: { message: 'Category fetched.', result }, status: 200 };
  }

  if (method === 'post' && path === '/api/category') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    if (!body.name?.trim()) throw mockError(400, 'Category name is required.');
    if (!['income', 'expense'].includes(body.type)) throw mockError(400, 'Type must be income or expense.');
    const all = load(KEYS.categories) || [];
    const result = { id: uid(), user_id: user.id, name: body.name.trim(), type: body.type };
    save(KEYS.categories, [...all, result]);
    return { data: { message: 'Category created.', result }, status: 201 };
  }

  if (method === 'put' && /^\/api\/category\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.categories) || [];
    const idx = all.findIndex((c) => c.id === id && c.user_id === user.id);
    if (idx === -1) throw mockError(404, 'Category not found.');
    all[idx] = { ...all[idx], name: body.name ?? all[idx].name, type: body.type ?? all[idx].type };
    save(KEYS.categories, all);
    return { data: { message: 'Category updated.', result: all[idx] }, status: 200 };
  }

  if (method === 'delete' && /^\/api\/category\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.categories) || [];
    const exists = all.find((c) => c.id === id && c.user_id === user.id);
    if (!exists) throw mockError(404, 'Category not found.');
    save(KEYS.categories, all.filter((c) => c.id !== id));
    return { data: { message: 'Category deleted.' }, status: 200 };
  }

  // ── TRANSACTIONS ──────────────────────────────────────────────────────────

  if (method === 'get' && path === '/api/transaction') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    let all = (load(KEYS.transactions) || []).filter((t) => t.user_id === user.id);

    // Filter by type (income/expense via category_type)
    if (params.type) all = all.filter((t) => t.category_type === params.type);
    if (params.start_date) all = all.filter((t) => t.transaction_date >= params.start_date);
    if (params.end_date)   all = all.filter((t) => t.transaction_date <= params.end_date);

    // Sort newest first
    all.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
    return { data: { message: 'Transactions fetched.', data: all }, status: 200 };
  }

  if (method === 'get' && /^\/api\/transaction\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.transactions) || [];
    const data = all.find((t) => t.id === id && t.user_id === user.id);
    if (!data) throw mockError(404, 'Transaction not found.');
    return { data: { message: 'Transaction fetched.', data }, status: 200 };
  }

  if (method === 'post' && path === '/api/transaction') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    if (!body.category_id) throw mockError(400, 'category_id is required.');
    if (!body.amount || Number(body.amount) <= 0) throw mockError(400, 'Amount must be positive.');

    const cats = load(KEYS.categories) || [];
    const cat = cats.find((c) => c.id === body.category_id && c.user_id === user.id);
    if (!cat) throw mockError(404, 'Category not found.');

    const all = load(KEYS.transactions) || [];
    const newTx = {
      id: uid(),
      user_id: user.id,
      category_id: cat.id,
      category_name: cat.name,
      category_type: cat.type,
      amount: Number(body.amount),
      description: body.description || '',
      transaction_date: body.transaction_date || new Date().toISOString().split('T')[0],
    };
    save(KEYS.transactions, [...all, newTx]);
    return { data: { message: 'Transaction created.', data: newTx }, status: 201 };
  }

  if (method === 'put' && /^\/api\/transaction\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.transactions) || [];
    const idx = all.findIndex((t) => t.id === id && t.user_id === user.id);
    if (idx === -1) throw mockError(404, 'Transaction not found.');

    const cats = load(KEYS.categories) || [];
    const catId = body.category_id || all[idx].category_id;
    const cat = cats.find((c) => c.id === catId && c.user_id === user.id);
    if (!cat) throw mockError(404, 'Category not found.');

    all[idx] = {
      ...all[idx],
      category_id: cat.id,
      category_name: cat.name,
      category_type: cat.type,
      amount: body.amount !== undefined ? Number(body.amount) : all[idx].amount,
      description: body.description !== undefined ? body.description : all[idx].description,
      transaction_date: body.transaction_date || all[idx].transaction_date,
    };
    save(KEYS.transactions, all);
    return { data: { message: 'Transaction updated.', data: all[idx] }, status: 200 };
  }

  if (method === 'delete' && /^\/api\/transaction\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.transactions) || [];
    if (!all.find((t) => t.id === id && t.user_id === user.id)) throw mockError(404, 'Transaction not found.');
    save(KEYS.transactions, all.filter((t) => t.id !== id));
    return { data: { message: 'Transaction deleted.' }, status: 200 };
  }

  // ── REPORTS ───────────────────────────────────────────────────────────────

  if (method === 'get' && path === '/api/reports/monthly') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const month = params.month; // YYYY-MM
    if (!month) throw mockError(400, 'month parameter required.');
    const all = (load(KEYS.transactions) || []).filter(
      (t) => t.user_id === user.id && t.transaction_date.startsWith(month)
    );
    const totals = { income: 0, expense: 0 };
    all.forEach((t) => { totals[t.category_type] += Number(t.amount); });
    const result = [
      { type: 'income',  total: totals.income  },
      { type: 'expense', total: totals.expense },
    ];
    return { data: { message: 'Monthly report fetched.', result }, status: 200 };
  }

  if (method === 'get' && path === '/api/reports/category') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const month = params.month;
    if (!month) throw mockError(400, 'month parameter required.');
    const all = (load(KEYS.transactions) || []).filter(
      (t) => t.user_id === user.id && t.transaction_date.startsWith(month)
    );
    const map = {};
    all.forEach((t) => {
      const key = t.category_id;
      if (!map[key]) map[key] = { category_name: t.category_name, type: t.category_type, total: 0 };
      map[key].total += Number(t.amount);
    });
    const result = Object.values(map).sort((a, b) => b.total - a.total);
    return { data: { message: 'Category report fetched.', result }, status: 200 };
  }

  // ── BUDGETS ───────────────────────────────────────────────────────────────

  if (method === 'get' && path === '/api/budget') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const month = params.month;
    let all = (load(KEYS.budgets) || []).filter((b) => b.user_id === user.id);
    if (month) all = all.filter((b) => b.month === month);

    // Compute spent from transactions
    const txAll = (load(KEYS.transactions) || []).filter((t) => t.user_id === user.id);
    const result = all.map((b) => {
      const spent = txAll
        .filter((t) => t.category_id === b.category_id && t.transaction_date.startsWith(b.month))
        .reduce((s, t) => s + Number(t.amount), 0);
      return { ...b, spent };
    });
    return { data: { message: 'Budgets fetched.', result }, status: 200 };
  }

  if (method === 'post' && path === '/api/budget') {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    if (!body.category_id) throw mockError(400, 'category_id required.');
    if (!body.month) throw mockError(400, 'month required.');
    if (!body.limit_amount || Number(body.limit_amount) <= 0) throw mockError(400, 'limit_amount must be positive.');

    const cats = load(KEYS.categories) || [];
    const cat = cats.find((c) => c.id === body.category_id && c.user_id === user.id);
    if (!cat) throw mockError(404, 'Category not found.');
    if (cat.type !== 'expense') throw mockError(400, 'Budgets can only be set for expense categories.');

    const all = load(KEYS.budgets) || [];
    // Prevent duplicates for same category+month
    const dup = all.find((b) => b.category_id === body.category_id && b.month === body.month && b.user_id === user.id);
    if (dup) throw mockError(409, 'Budget already exists for this category and month.');

    const budget = {
      id: uid(),
      user_id: user.id,
      category_id: cat.id,
      category_name: cat.name,
      month: body.month,
      limit_amount: Number(body.limit_amount),
    };
    save(KEYS.budgets, [...all, budget]);
    return { data: { message: 'Budget created.', result: { ...budget, spent: 0 } }, status: 201 };
  }

  if (method === 'put' && /^\/api\/budget\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.budgets) || [];
    const idx = all.findIndex((b) => b.id === id && b.user_id === user.id);
    if (idx === -1) throw mockError(404, 'Budget not found.');
    all[idx] = { ...all[idx], limit_amount: Number(body.limit_amount) };
    save(KEYS.budgets, all);
    return { data: { message: 'Budget updated.', result: all[idx] }, status: 200 };
  }

  if (method === 'delete' && /^\/api\/budget\/[^/]+$/.test(path)) {
    const user = getCurrentUser(token);
    if (!user) throw mockError(401, 'Unauthorized.');
    const id = path.split('/').pop();
    const all = load(KEYS.budgets) || [];
    if (!all.find((b) => b.id === id && b.user_id === user.id)) throw mockError(404, 'Budget not found.');
    save(KEYS.budgets, all.filter((b) => b.id !== id));
    return { data: { message: 'Budget deleted.' }, status: 200 };
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  throw mockError(404, `Mock: no handler for ${method.toUpperCase()} ${url}`);
}
