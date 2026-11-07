import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/app.js';
import {
  IconTrendUp, IconTrendDown, IconWallet,
  IconTransactions, IconCalendar, IconRefresh,
  IconCategory, IconUser, IconBudget, IconAlert,
} from '../components/Icons';
import './Dashboard.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatETB(amount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-ET', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function currentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Return the last `n` months as 'YYYY-MM' strings, oldest → newest. */
function lastNMonths(n) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    );
  }
  return months;
}

/** Short label: 'Jan 26' */
function shortMonth(yyyyMM) {
  const [y, m] = yyyyMM.split('-');
  return new Date(Number(y), Number(m) - 1, 1)
    .toLocaleDateString('en-ET', { month: 'short', year: '2-digit' });
}

// ── palette for category chart ────────────────────────────────────────────────

const CAT_COLORS = [
  '#e8572a', '#3b82f6', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

// ── skeleton loader ───────────────────────────────────────────────────────────

function Skeleton({ w = '100%', h = 20, radius = 6, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton w={52} h={52} radius={12} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton w="60%" h={12} />
        <Skeleton w="80%" h={22} />
        <Skeleton w="40%" h={11} />
      </div>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({ Icon, label, amount, trend, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">
        <Icon size={22} color={
          color === 'green' ? '#059669' :
          color === 'red'   ? '#ef4444' :
          color === 'blue'  ? '#2563eb' : '#7c3aed'
        } />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-amount">{amount}</span>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </div>
  );
}

// ── Chart 1: Income vs Expense bar chart (last 6 months) ─────────────────────

function BarChart({ data }) {
  // data = [{ month, income, expense }, ...]
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  const BAR_H = 120;

  return (
    <svg
      viewBox={`0 0 ${data.length * 56} ${BAR_H + 40}`}
      className="bar-chart-svg"
      aria-label="Income vs expense bar chart"
      role="img"
    >
      {data.map((d, i) => {
        const x = i * 56 + 4;
        const incH = Math.round((d.income  / maxVal) * BAR_H);
        const expH = Math.round((d.expense / maxVal) * BAR_H);
        return (
          <g key={d.month}>
            {/* income bar */}
            <rect
              x={x}
              y={BAR_H - incH}
              width={22}
              height={incH || 2}
              rx={3}
              fill="#10b981"
              opacity={0.85}
            >
              <title>{`${shortMonth(d.month)} — Income: ${formatETB(d.income)}`}</title>
            </rect>
            {/* expense bar */}
            <rect
              x={x + 24}
              y={BAR_H - expH}
              width={22}
              height={expH || 2}
              rx={3}
              fill="#e8572a"
              opacity={0.85}
            >
              <title>{`${shortMonth(d.month)} — Expenses: ${formatETB(d.expense)}`}</title>
            </rect>
            {/* month label */}
            <text
              x={x + 24}
              y={BAR_H + 16}
              textAnchor="middle"
              fontSize={9}
              fill="#9ca3af"
            >
              {shortMonth(d.month)}
            </text>
          </g>
        );
      })}
      {/* legend */}
      <g transform={`translate(4, ${BAR_H + 28})`}>
        <rect width={8} height={8} rx={2} fill="#10b981" />
        <text x={11} y={8} fontSize={9} fill="#6b7280">Income</text>
        <rect x={54} width={8} height={8} rx={2} fill="#e8572a" />
        <text x={65} y={8} fontSize={9} fill="#6b7280">Expense</text>
      </g>
    </svg>
  );
}

// ── Chart 2: Expense by category — horizontal bars ────────────────────────────

function CategoryBars({ categories, totalExpense }) {
  if (!categories.length) {
    return (
      <div className="chart-empty">
        <IconCategory size={32} color="#d1d5db" />
        <p>No expense data for this month</p>
      </div>
    );
  }

  const top = categories.filter((c) => c.type === 'expense').slice(0, 6);

  return (
    <div className="cat-bar-list">
      {top.map((c, i) => {
        const pct = totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0;
        const color = CAT_COLORS[i % CAT_COLORS.length];
        return (
          <div key={c.category_name} className="cat-bar-row">
            <div className="cat-bar-label-row">
              <span className="cat-bar-dot" style={{ background: color }} />
              <span className="cat-bar-name">{c.category_name}</span>
              <span className="cat-bar-pct">{pct}%</span>
              <span className="cat-bar-amount">{formatETB(c.total)}</span>
            </div>
            <div className="cat-bar-track">
              <div
                className="cat-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [month, setMonth] = useState(currentMonthValue);

  // Main dashboard data (stats + category chart)
  const [dashboard, setDashboard]     = useState(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError]     = useState(null);

  // 6-month bar chart data
  const [barData, setBarData]         = useState([]);
  const [barLoading, setBarLoading]   = useState(true);
  const [barError, setBarError]       = useState(null);

  // Recent transactions (still from /api/transaction for the list)
  const [recent, setRecent]           = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // ── fetch dashboard (stats + categories) ─────────────────────────────────

  const fetchDashboard = useCallback(async (m) => {
    setDashLoading(true);
    setDashError(null);
    try {
      const res = await api.get('/api/reports/dashboard', { params: { month: m } });
      setDashboard(res.data.result);
    } catch (err) {
      setDashError(err?.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setDashLoading(false);
    }
  }, []);

  // ── fetch last-6-months bar chart ─────────────────────────────────────────

  const fetchBarChart = useCallback(async () => {
    setBarLoading(true);
    setBarError(null);
    try {
      const months = lastNMonths(6);
      const results = await Promise.all(
        months.map((m) =>
          api
            .get('/api/reports/monthly', { params: { month: m } })
            .then((r) => ({ month: m, ...r.data.result }))
            .catch(() => ({ month: m, income: 0, expense: 0, balance: 0 }))
        )
      );
      setBarData(results);
    } catch (err) {
      setBarError(err?.response?.data?.message || 'Failed to load chart data.');
    } finally {
      setBarLoading(false);
    }
  }, []);

  // ── fetch recent transactions ─────────────────────────────────────────────

  const fetchRecent = useCallback(async () => {
    setRecentLoading(true);
    try {
      const res = await api.get('/api/transaction');
      const all = res.data?.data || [];
      const sorted = [...all].sort((a, b) =>
        (b.transaction_date || '').localeCompare(a.transaction_date || '')
      );
      setRecent(sorted.slice(0, 5));
    } catch {
      setRecent([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  // ── fetch budgets for the selected month ─────────────────────────────────

  const [budgets,       setBudgets]       = useState([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);

  const fetchBudgets = useCallback(async (m) => {
    setBudgetsLoading(true);
    try {
      const res = await api.get('/api/budget', { params: { month: m } });
      setBudgets(res.data?.result || []);
    } catch {
      setBudgets([]);
    } finally {
      setBudgetsLoading(false);
    }
  }, []);

  // ── effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => { await fetchDashboard(month); })();
  }, [fetchDashboard, month]);

  useEffect(() => {
    (async () => { await fetchBarChart(); })();
  }, [fetchBarChart]);

  useEffect(() => {
    (async () => { await fetchRecent(); })();
  }, [fetchRecent]);

  useEffect(() => {
    (async () => { await fetchBudgets(month); })();
  }, [fetchBudgets, month]);

  // ── greeting ──────────────────────────────────────────────────────────────

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  // ── render ────────────────────────────────────────────────────────────────

  const income  = dashboard?.income  ?? 0;
  const expense = dashboard?.expense ?? 0;
  const balance = dashboard?.balance ?? 0;
  const categories = dashboard?.categories ?? [];
  const totalExpense = categories
    .filter((c) => c.type === 'expense')
    .reduce((s, c) => s + c.total, 0);

  return (
    <div className="dashboard">

      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">
            {greeting}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="page-subtitle">Here&apos;s your financial overview.</p>
        </div>
        <div className="dash-header-right">
          {/* Month picker */}
          <div className="month-picker">
            <IconCalendar size={16} color="#6b7280" />
            <input
              type="month"
              className="month-input"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Select month"
            />
          </div>
          <Link to="/transaction" className="btn btn-primary">
            + Add Transaction
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dashboard-stats">
        {dashLoading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton />
            <StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : dashError ? (
          <div className="dash-error-block">
            <p>{dashError}</p>
            <button className="btn btn-outline btn-sm" onClick={() => fetchDashboard(month)}>
              <IconRefresh size={14} /> Retry
            </button>
          </div>
        ) : (
          <>
            <StatCard
              Icon={IconWallet}
              label="Net Balance"
              amount={formatETB(balance)}
              color={balance >= 0 ? 'blue' : 'red'}
            />
            <StatCard
              Icon={IconTrendUp}
              label="Income"
              amount={formatETB(income)}
              trend={shortMonth(month)}
              color="green"
            />
            <StatCard
              Icon={IconTrendDown}
              label="Expenses"
              amount={formatETB(expense)}
              trend={shortMonth(month)}
              color="red"
            />
            <StatCard
              Icon={IconCategory}
              label="Categories"
              amount={categories.length}
              trend="this month"
              color="purple"
            />
          </>
        )}
      </div>

      {/* ── Charts row ── */}
      <div className="dashboard-charts">

        {/* Chart 1: 6-month bar chart */}
        <div className="card chart-card">
          <div className="card-header">
            <h2 className="card-title">Income vs Expenses — Last 6 Months</h2>
            {barError && (
              <button className="btn btn-ghost btn-sm" onClick={fetchBarChart}>
                <IconRefresh size={13} /> Retry
              </button>
            )}
          </div>
          {barLoading ? (
            <Skeleton w="100%" h={160} radius={8} />
          ) : barError ? (
            <div className="chart-empty">
              <p className="dash-err-text">{barError}</p>
            </div>
          ) : barData.every((d) => d.income === 0 && d.expense === 0) ? (
            <div className="chart-empty">
              <IconTransactions size={32} color="#d1d5db" />
              <p>No transaction data for the last 6 months</p>
            </div>
          ) : (
            <BarChart data={barData} />
          )}
        </div>

        {/* Chart 2: Expense by category */}
        <div className="card chart-card">
          <div className="card-header">
            <h2 className="card-title">Spending by Category</h2>
            <span className="card-sub">{shortMonth(month)}</span>
          </div>
          {dashLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3,4].map((k) => <Skeleton key={k} w="100%" h={28} radius={6} />)}
            </div>
          ) : (
            <CategoryBars categories={categories} totalExpense={totalExpense} />
          )}
        </div>
      </div>

      {/* ── Budget Status Card ── */}
      <div className="card dash-budget-card">
        <div className="card-header">
          <h2 className="card-title">
            <IconBudget size={16} color="#e8572a" style={{ marginRight: 6 }} />
            Budget Status
          </h2>
          <Link to="/budgets" className="card-link">Manage →</Link>
        </div>
        {budgetsLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map((k) => <Skeleton key={k} w="100%" h={32} radius={6} />)}
          </div>
        ) : budgets.length === 0 ? (
          <div className="dash-budget-empty">
            <IconBudget size={28} color="#d1d5db" />
            <span>No budgets for {shortMonth(month)}</span>
            <Link to="/budgets" className="auth-link">Set one up →</Link>
          </div>
        ) : (
          <>
            {/* Over-budget alert */}
            {budgets.some((b) => b.spent > b.limit_amount) && (
              <div className="dash-budget-alert">
                <IconAlert size={15} color="#92400e" />
                <span>
                  {budgets.filter((b) => b.spent > b.limit_amount).length} categor
                  {budgets.filter((b) => b.spent > b.limit_amount).length === 1 ? 'y is' : 'ies are'} over budget
                </span>
              </div>
            )}
            {/* Top 3 closest to limit */}
            <div className="dash-budget-list">
              {[...budgets]
                .sort((a, b) => {
                  const pctA = a.limit_amount > 0 ? a.spent / a.limit_amount : 0;
                  const pctB = b.limit_amount > 0 ? b.spent / b.limit_amount : 0;
                  return pctB - pctA;
                })
                .slice(0, 3)
                .map((b) => {
                  const pct   = b.limit_amount > 0 ? Math.round((b.spent / b.limit_amount) * 100) : 0;
                  const color = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : 'ok';
                  return (
                    <div key={b.id} className="dash-budget-row">
                      <div className="dash-budget-row-top">
                        <span className="dash-budget-name">{b.category_name}</span>
                        <span className={`dash-budget-pct dash-budget-pct--${color}`}>{pct}%</span>
                      </div>
                      <div className="dash-budget-track">
                        <div
                          className={`dash-budget-fill dash-budget-fill--${color}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="dash-budget-meta">
                        <span className={`dash-budget-meta-val dash-budget-meta--${color}`}>
                          {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(b.spent)}
                        </span>
                        <span className="dash-budget-meta-limit">
                          / {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(b.limit_amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* ── Recent Transactions ── */}
      <div className="card dashboard-recent">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
          <Link to="/transaction" className="card-link">View all →</Link>
        </div>
        {recentLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3,4,5].map((k) => <Skeleton key={k} w="100%" h={36} radius={6} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <IconTransactions size={36} color="#d1d5db" />
            <div className="empty-state-title">No transactions yet</div>
            <div className="empty-state-desc">
              <Link to="/transaction" className="auth-link">Add your first transaction</Link>
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t, i) => (
                  <tr key={t.id || i}>
                    <td><div className="tx-name">{t.description || '—'}</div></td>
                    <td><span className="tx-category">{t.category_name || '—'}</span></td>
                    <td className="tx-date">{formatDate(t.transaction_date)}</td>
                    <td>
                      <span className={`badge ${t.category_type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.category_type === 'income' ? '+' : '−'} {formatETB(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Links ── */}
      <div className="dashboard-quicklinks">
        <Link to="/transaction" className="quicklink">
          <IconTransactions size={16} color="#374151" />
          <span>Add Transaction</span>
        </Link>
        <Link to="/category" className="quicklink">
          <IconCategory size={16} color="#374151" />
          <span>Categories</span>
        </Link>
        <Link to="/profile" className="quicklink">
          <IconUser size={16} color="#374151" />
          <span>Edit Profile</span>
        </Link>
      </div>

    </div>
  );
}

export default Dashboard;
