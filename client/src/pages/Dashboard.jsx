import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/app.js';
import './Dashboard.css';

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

function formatETB(amount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

  // Compute summary stats
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  // Recent 5 transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 5);

  // Category breakdown for expenses
  const categoryMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = t.category?.name || t.category_name || 'Uncategorized';
      categoryMap[catName] = (categoryMap[catName] || 0) + Number(t.amount);
    });
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="page-subtitle">Here's your financial overview for today.</p>
        </div>
        <Link to="/transaction" className="btn btn-primary">
          + Add Transaction
        </Link>
      </div>

      {isLoading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
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
              trend={`${transactions.filter((t) => t.type === 'income').length} transactions`}
              color="green"
            />
            <StatCard
              icon="📉"
              label="Total Expenses"
              amount={formatETB(expenses)}
              trend={`${transactions.filter((t) => t.type === 'expense').length} transactions`}
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
                          <td>
                            <div className="tx-name">{t.description || t.note || '—'}</div>
                          </td>
                          <td>
                            <span className="tx-category">
                              {t.category?.name || t.category_name || '—'}
                            </span>
                          </td>
                          <td className="tx-date">
                            {t.date
                              ? new Date(t.date).toLocaleDateString('en-ET')
                              : t.createdAt
                              ? new Date(t.createdAt).toLocaleDateString('en-ET')
                              : '—'}
                          </td>
                          <td>
                            <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                              {t.type === 'income' ? '+' : '-'} {formatETB(t.amount)}
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
                  <div className="empty-state-desc">Add expense transactions to see breakdown</div>
                </div>
              ) : (
                <div className="category-bars">
                  {topCategories.map(([name, amount]) => {
                    const pct = expenses > 0 ? Math.round((amount / expenses) * 100) : 0;
                    return (
                      <div key={name} className="category-bar-item">
                        <div className="category-bar-info">
                          <span className="category-bar-name">{name}</span>
                          <span className="category-bar-amount">{formatETB(amount)}</span>
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
