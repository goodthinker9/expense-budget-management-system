import { useCallback, useEffect, useState } from 'react';
import api from '../services/app.js';
import { IconTrendUp, IconTrendDown, IconWallet, IconCalendar, IconRefresh, IconDownload, IconReports } from '../components/Icons';
import './Reports.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatETB(amount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

function currentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(yyyyMM) {
  if (!yyyyMM) return '';
  const [y, m] = yyyyMM.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-ET', {
    month: 'long', year: 'numeric',
  });
}

// ── skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ w = '100%', h = 18, radius = 6 }) {
  return (
    <div
      className="rpt-skeleton"
      style={{ width: w, height: h, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCSV(month, categories, monthly) {
  const rows = [
    ['Month', 'Category', 'Type', 'Total (ETB)', '% of Type'],
    ...categories.map((c) => {
      const typeTotal = c.type === 'income' ? monthly.income : monthly.expense;
      const pct = typeTotal > 0 ? ((c.total / typeTotal) * 100).toFixed(1) : '0.0';
      return [month, c.category_name, c.type, c.total.toFixed(2), pct];
    }),
    [],
    ['', 'Income', '', monthly.income.toFixed(2), ''],
    ['', 'Expense', '', monthly.expense.toFixed(2), ''],
    ['', 'Balance', '', monthly.balance.toFixed(2), ''],
  ];

  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `report-${month}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── page ──────────────────────────────────────────────────────────────────────

function Reports() {
  const [month, setMonth]         = useState(currentMonthValue);
  const [monthly, setMonthly]     = useState(null);   // { month, income, expense, balance }
  const [categories, setCategories] = useState([]);   // [{ category_name, type, total }]
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchReports = useCallback(async (m) => {
    setLoading(true);
    setError(null);
    try {
      // Both reports use the same month — run in parallel
      const [mRes, cRes] = await Promise.all([
        api.get('/api/reports/monthly',  { params: { month: m } }),
        api.get('/api/reports/category', { params: { month: m } }),
      ]);
      setMonthly(mRes.data.result);
      setCategories(cRes.data.result.categories || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load report data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => { await fetchReports(month); })();
  }, [fetchReports, month]);

  const hasData    = categories.length > 0;
  const incomeRows = categories.filter((c) => c.type === 'income');
  const expenseRows = categories.filter((c) => c.type === 'expense');

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div className="reports-page">

      {/* ── Header ── */}
      <div className="rpt-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">
            {loading ? 'Loading…' : monthLabel(month)}
          </p>
        </div>
        <div className="rpt-header-right">
          {/* Month selector */}
          <div className="month-picker">
            <IconCalendar size={16} color="#6b7280" />
            <input
              type="month"
              className="month-input"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Select month for report"
            />
          </div>

          {/* Export CSV */}
          <button
            className="btn btn-outline btn-sm rpt-export-btn"
            disabled={loading || !hasData}
            onClick={() => exportCSV(month, categories, monthly)}
            aria-label="Export report as CSV"
          >
            <IconDownload size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="rpt-cards">
        {loading ? (
          <>
            <div className="rpt-card"><Skeleton w="50%" h={12} /><Skeleton w="70%" h={28} style={{ marginTop: 8 }} /></div>
            <div className="rpt-card"><Skeleton w="50%" h={12} /><Skeleton w="70%" h={28} style={{ marginTop: 8 }} /></div>
            <div className="rpt-card"><Skeleton w="50%" h={12} /><Skeleton w="70%" h={28} style={{ marginTop: 8 }} /></div>
          </>
        ) : error ? null : (
          <>
            <div className="rpt-card rpt-card--income">
              <div className="rpt-card-icon">
                <IconTrendUp size={20} color="#059669" />
              </div>
              <div className="rpt-card-body">
                <span className="rpt-card-label">Total Income</span>
                <span className="rpt-card-value">{formatETB(monthly?.income ?? 0)}</span>
              </div>
            </div>

            <div className="rpt-card rpt-card--expense">
              <div className="rpt-card-icon">
                <IconTrendDown size={20} color="#ef4444" />
              </div>
              <div className="rpt-card-body">
                <span className="rpt-card-label">Total Expenses</span>
                <span className="rpt-card-value">{formatETB(monthly?.expense ?? 0)}</span>
              </div>
            </div>

            <div className={`rpt-card rpt-card--balance${(monthly?.balance ?? 0) < 0 ? ' negative' : ''}`}>
              <div className="rpt-card-icon">
                <IconWallet size={20} color={(monthly?.balance ?? 0) >= 0 ? '#2563eb' : '#ef4444'} />
              </div>
              <div className="rpt-card-body">
                <span className="rpt-card-label">Net Balance</span>
                <span className="rpt-card-value">{formatETB(monthly?.balance ?? 0)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rpt-error">
          <p>{error}</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => fetchReports(month)}
          >
            <IconRefresh size={14} /> Retry
          </button>
        </div>
      )}

      {/* ── Category Table ── */}
      {!error && (
        <div className="card rpt-table-card">
          <div className="card-header">
            <h2 className="card-title">Category Breakdown</h2>
            {hasData && !loading && (
              <span className="rpt-row-count">{categories.length} categories</span>
            )}
          </div>

          {loading ? (
            <div className="rpt-table-skeleton">
              {/* fake header */}
              <div className="rpt-skeleton-row header">
                {[120, 80, 100, 80].map((w, i) => (
                  <Skeleton key={i} w={w} h={12} />
                ))}
              </div>
              {[1,2,3,4,5,6].map((k) => (
                <div key={k} className="rpt-skeleton-row">
                  {[140, 70, 110, 70].map((w, i) => (
                    <Skeleton key={i} w={w} h={14} />
                  ))}
                </div>
              ))}
            </div>
          ) : !hasData ? (
            <div className="empty-state">
              <IconReports size={40} color="#d1d5db" />
              <div className="empty-state-title">No data for {monthLabel(month)}</div>
              <div className="empty-state-desc">
                Add transactions in this month to see a report.
              </div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table rpt-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Type</th>
                    <th className="rpt-num-col">Total</th>
                    <th className="rpt-num-col">% of Type</th>
                    <th>Share</th>
                  </tr>
                </thead>

                {/* Income rows */}
                {incomeRows.length > 0 && (
                  <tbody>
                    <tr className="rpt-group-header">
                      <td colSpan={5}>
                        <span className="rpt-group-label income">Income</span>
                      </td>
                    </tr>
                    {incomeRows.map((c) => {
                      const pct = monthly.income > 0
                        ? (c.total / monthly.income) * 100
                        : 0;
                      return (
                        <tr key={c.category_name}>
                          <td className="rpt-cat-name">{c.category_name}</td>
                          <td>
                            <span className="badge badge-income">income</span>
                          </td>
                          <td className="rpt-num-col rpt-income">{formatETB(c.total)}</td>
                          <td className="rpt-num-col rpt-pct">{pct.toFixed(1)}%</td>
                          <td className="rpt-bar-col">
                            <div className="rpt-inline-track">
                              <div
                                className="rpt-inline-fill income"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}

                {/* Expense rows */}
                {expenseRows.length > 0 && (
                  <tbody>
                    <tr className="rpt-group-header">
                      <td colSpan={5}>
                        <span className="rpt-group-label expense">Expenses</span>
                      </td>
                    </tr>
                    {expenseRows.map((c) => {
                      const pct = monthly.expense > 0
                        ? (c.total / monthly.expense) * 100
                        : 0;
                      return (
                        <tr key={c.category_name}>
                          <td className="rpt-cat-name">{c.category_name}</td>
                          <td>
                            <span className="badge badge-expense">expense</span>
                          </td>
                          <td className="rpt-num-col rpt-expense">{formatETB(c.total)}</td>
                          <td className="rpt-num-col rpt-pct">{pct.toFixed(1)}%</td>
                          <td className="rpt-bar-col">
                            <div className="rpt-inline-track">
                              <div
                                className="rpt-inline-fill expense"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}

                {/* Totals footer */}
                <tfoot>
                  <tr className="rpt-totals-row">
                    <td colSpan={2} className="rpt-totals-label">Totals</td>
                    <td className="rpt-num-col">
                      <div className="rpt-total-stack">
                        <span className="rpt-income">+{formatETB(monthly.income)}</span>
                        <span className="rpt-expense">−{formatETB(monthly.expense)}</span>
                      </div>
                    </td>
                    <td className="rpt-num-col" />
                    <td />
                  </tr>
                  <tr className="rpt-balance-row">
                    <td colSpan={2} className="rpt-totals-label">Net Balance</td>
                    <td
                      colSpan={3}
                      className={`rpt-num-col rpt-balance-val ${monthly.balance < 0 ? 'negative' : ''}`}
                    >
                      {formatETB(monthly.balance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
