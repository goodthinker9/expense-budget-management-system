import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/app.js';
import './Dashboard.css';

// ── helpers ─────────────────────────────────────────────────────────────────

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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ── sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, amount, trend, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-amount">{amount}</span>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [txRes, catRes] = await Promise.all([
        api.get('/api/transaction'),
        api.get('/api/category'),
      ]);
      setTransactions(txRes.data?.data || []);
      setCategories(catRes.data?.result || []);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => { await fetchData(); })();
  }, [fetchData]);
  // ── derived data ────────────────────────────────────────────────────────

  // Use category_type — there is no "type" field on a transaction
  const income = transactions
    .filter((t) => t.category_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.category_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  // Recent 5, sorted by transaction_date descending
  const recent = [...transactions]
    .sort((a, b) => {
      const da = a.transaction_date || '';
      const db = b.transaction_date || '';
      return db.localeCompare(da);
    })
    .slice(0, 5);

  // Top expense categories
  const categoryMap = {};
  transactions
    .filter((t) => t.category_type === 'expense')
    .forEach((t) => {
      const name = t.category_name || 'Uncategorized';
      categoryMap[name] = (categoryMap[name] || 0) + Number(t.amount);
    });
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? 'Good morning'
      : greetingHour < 17
      ? 'Good afternoon'
      : 'Good evening';

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="page-subtitle">Here&apos;s your financial overview for today.</p>
        </div>
        <Link to="/transaction" className="btn btn-primary">
          + Add Transaction
        </Link>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="dashboard-stats">
            <StatCard
              icon="💰"
              label="Net Balance"
              amount={formatETB(balance)}
              color={balance >= 0 ? 'blue' : 'red'}
            />
            <StatCard
              icon="📈"
              label="Total Income"
              amount={formatETB(income)}
              trend={`${transactions.filter((t) => t.category_type === 'income').length} transactions`}
              color="green"
            />
            <StatCard
              icon="📉"
              label="Total Expenses"
              amount={formatETB(expenses)}
              trend={`${transactions.filter((t) => t.category_type === 'expense').length} transactions`}
              color="red"
            />
            <StatCard
              icon="🏷️"
              label="Categories"
              amount={categories.length}
              trend="Active"
              color="purple"
            />
          </div>

          <div className="dashboard-body">
            {/* Recent Transactions */}
            <div className="card dashboard-recent">
              <div className="card-header">
                <h2 className="card-title">Recent Transactions</h2>
                <Link to="/transaction" className="card-link">View all →</Link>
              </div>

              {recent.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💳</div>
                  <div className="empty-state-title">No transactions yet</div>
                  <div className="empty-state-desc">
                    <Link to="/transaction" className="auth-link">
                      Add your first transaction
                    </Link>
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
                          <td>
                            <div className="tx-name">
                              {t.description || '—'}
                            </div>
                          </td>
                          <td>
                            <span className="tx-category">
                              {t.category_name || '—'}
                            </span>
                          </td>
                          <td className="tx-date">
                            {formatDate(t.transaction_date)}
                          </td>
                          <td>
                            {/* income/expense determined by category_type */}
                            <span
                              className={`badge ${
                                t.category_type === 'income'
                                  ? 'badge-income'
                                  : 'badge-expense'
                              }`}
                            >
                              {t.category_type === 'income' ? '+' : '−'}{' '}
                              {formatETB(t.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Spending by Category */}
            <div className="card dashboard-categories">
              <div className="card-header">
                <h2 className="card-title">Top Spending</h2>
                <Link to="/category" className="card-link">Manage →</Link>
              </div>

              {topCategories.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🏷️</div>
                  <div className="empty-state-title">No expense data</div>
                  <div className="empty-state-desc">
                    Add expense transactions to see breakdown
                  </div>
                </div>
              ) : (
                <div className="category-bars">
                  {topCategories.map(([name, amount]) => {
                    const pct =
                      expenses > 0
                        ? Math.round((amount / expenses) * 100)
                        : 0;
                    return (
                      <div key={name} className="category-bar-item">
                        <div className="category-bar-info">
                          <span className="category-bar-name">{name}</span>
                          <span className="category-bar-amount">
                            {formatETB(amount)}
                          </span>
                        </div>
                        <div className="category-bar-track">
                          <div
                            className="category-bar-fill"
                            style={{ width: `${pct}%` }}
                            title={`${pct}% of total expenses`}
                          />
                        </div>
                        <span className="category-bar-pct">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="dashboard-quicklinks">
            <Link to="/transaction" className="quicklink">
              <span>💳</span>
              <span>Add Transaction</span>
            </Link>
            <Link to="/category" className="quicklink">
              <span>🏷️</span>
              <span>Manage Categories</span>
            </Link>
            <Link to="/profile" className="quicklink">
              <span>👤</span>
              <span>Edit Profile</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
