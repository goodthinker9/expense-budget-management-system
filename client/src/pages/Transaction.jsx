import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/app.js';
import useDebounce from '../hooks/useDebounce.js';
import {
  IconEdit, IconTrash, IconDownload, IconRefresh,
  IconSearch, IconSortAsc, IconSortDesc, IconSortNone, IconXCircle,
  IconTrendUp, IconTrendDown, IconWallet,
} from '../components/Icons';
import './Transaction.css';

// ── constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE   = 10;
const TODAY       = new Date().toISOString().split('T')[0];
const EMPTY_FORM  = {
  filterType: 'expense',
  category_id: '',
  description: '',
  amount: '',
  transaction_date: TODAY,
};

// ── pure helpers ──────────────────────────────────────────────────────────────

function formatETB(amount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency', currency: 'ETB', minimumFractionDigits: 2,
  }).format(amount || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-ET', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/** Guard against spreadsheet formula injection. */
function csvEscape(val) {
  const s = val == null ? '' : String(val);
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  // Quote if contains comma, newline or double-quote
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function buildCSV(rows) {
  const header = ['Date', 'Description', 'Category', 'Type', 'Amount (ETB)'];
  const lines  = [header.map(csvEscape).join(',')];
  for (const t of rows) {
    lines.push([
      csvEscape(t.transaction_date),
      csvEscape(t.description),
      csvEscape(t.category_name),
      csvEscape(t.category_type),
      csvEscape(t.amount),
    ].join(','));
  }
  return lines.join('\r\n');
}

function downloadCSV(rows) {
  const csv      = buildCSV(rows);
  const blob     = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  const dateStr  = new Date().toISOString().split('T')[0];
  a.href         = url;
  a.download     = `transactions-${dateStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="skeleton-row" aria-hidden="true">
      {[55, 160, 90, 110, 90, 100, 60].map((w, i) => (
        <td key={i}><div className="skeleton" style={{ width: w, height: 14 }} /></td>
      ))}
    </tr>
  );
}

// ── SortIcon ──────────────────────────────────────────────────────────────────

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <IconSortNone size={13} color="#d1d5db" />;
  return sortDir === 'asc'
    ? <IconSortAsc size={13} color="#e8572a" />
    : <IconSortDesc size={13} color="#e8572a" />;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ onClose, title, id, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby={id}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id={id}>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, total, pageSize, onPage }) {
  if (totalPages <= 1 && total === 0) return null;

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  // Build visible page numbers with "..." gaps (at most 5 slots)
  function pageNums() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (page <= 3) {
      pages.push(1, 2, 3, 4, '…', totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '…', page - 1, page, page + 1, '…', totalPages);
    }
    return pages;
  }

  return (
    <div className="tx-pagination">
      <span className="tx-pag-info">
        {total === 0
          ? 'No results'
          : `Showing ${start}–${end} of ${total}`}
      </span>
      <div className="tx-pag-controls">
        <button
          className="tx-pag-btn"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          aria-label="Previous page"
        >
          ←
        </button>
        {pageNums().map((p, i) =>
          p === '…'
            ? <span key={`gap-${i}`} className="tx-pag-gap">…</span>
            : (
              <button
                key={p}
                className={`tx-pag-btn${p === page ? ' active' : ''}`}
                onClick={() => onPage(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
        )}
        <button
          className="tx-pag-btn"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPage(page + 1)}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function Transaction() {
  // ── raw server data ────────────────────────────────────────────────────────
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories,      setCategories]      = useState([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [pageError,       setPageError]       = useState(null);

  // ── filter controls ────────────────────────────────────────────────────────
  const [filterType,     setFilterType]     = useState('');
  const [filterStart,    setFilterStart]    = useState('');
  const [filterEnd,      setFilterEnd]      = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery,    setSearchQuery]    = useState('');

  // ── sort ───────────────────────────────────────────────────────────────────
  const [sortCol, setSortCol] = useState('transaction_date');
  const [sortDir, setSortDir] = useState('desc');

  // ── pagination ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── add/edit modal ─────────────────────────────────────────────────────────
  const [showModal,   setShowModal]   = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError,   setFormError]   = useState(null);

  // ── delete modal ───────────────────────────────────────────────────────────
  const [deleteId,    setDeleteId]    = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // ── debounced values (300 ms) for server-side params ──────────────────────
  const debouncedType  = useDebounce(filterType,  300);
  const debouncedStart = useDebounce(filterStart, 300);
  const debouncedEnd   = useDebounce(filterEnd,   300);

  // ── debounced search (browser-side, 300 ms) ───────────────────────────────
  const debouncedSearch = useDebounce(searchQuery, 300);

  // ── fetch ──────────────────────────────────────────────────────────────────
  // Use a ref-based abort flag so stale responses never overwrite fresh ones.
  const fetchSeqRef = useRef(0);

  const fetchData = useCallback(async () => {
    const seq = ++fetchSeqRef.current;
    setIsLoading(true);
    setPageError(null);

    try {
      const params = {};
      if (debouncedType)  params.type       = debouncedType;
      if (debouncedStart) params.start_date = debouncedStart;
      if (debouncedEnd)   params.end_date   = debouncedEnd;

      const [txRes, catRes] = await Promise.all([
        api.get('/api/transaction', { params }),
        api.get('/api/category'),
      ]);

      if (seq !== fetchSeqRef.current) return; // stale — discard

      setAllTransactions(txRes.data?.data || []);
      setCategories(catRes.data?.result || []);
    } catch (err) {
      if (seq !== fetchSeqRef.current) return;
      setPageError(err?.response?.data?.message || 'Failed to load transactions.');
    } finally {
      if (seq === fetchSeqRef.current) setIsLoading(false);
    }
  }, [debouncedType, debouncedStart, debouncedEnd]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  // ── reset to page 1 when filters/search/sort change ───────────────────────
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); },
    [debouncedSearch, filterCategory, debouncedType, debouncedStart, debouncedEnd, sortCol, sortDir]);

  // ── browser-side: filter → sort → paginate ─────────────────────────────────
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return allTransactions.filter((t) => {
      if (filterCategory && String(t.category_id) !== String(filterCategory)) return false;
      if (!q) return true;
      return (
        (t.description  || '').toLowerCase().includes(q) ||
        (t.category_name || '').toLowerCase().includes(q)
      );
    });
  }, [allTransactions, debouncedSearch, filterCategory]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va, vb;
      if (sortCol === 'amount') {
        va = Number(a.amount);
        vb = Number(b.amount);
      } else if (sortCol === 'transaction_date') {
        va = a.transaction_date || '';
        vb = b.transaction_date || '';
      } else if (sortCol === 'category_name') {
        va = (a.category_name || '').toLowerCase();
        vb = (b.category_name || '').toLowerCase();
      } else {
        va = (a[sortCol] || '').toLowerCase();
        vb = (b[sortCol] || '').toLowerCase();
      }
      if (va < vb) return sortDir === 'asc' ? -1 :  1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages  = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // Safe-guard: if a delete shrinks the page count below current page, step back
  const safePage    = Math.min(page, totalPages);
  const pageRows    = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── summary from ALL filtered rows (not just current page) ────────────────
  const income   = filtered.filter((t) => t.category_type === 'income')
                            .reduce((s, t) => s + Number(t.amount), 0);
  const expenses = filtered.filter((t) => t.category_type === 'expense')
                            .reduce((s, t) => s + Number(t.amount), 0);
  const balance  = income - expenses;

  // ── sort handler ───────────────────────────────────────────────────────────
  const handleSort = (col) => {
    if (col === sortCol) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  // ── reset all browser-side filters ────────────────────────────────────────
  const handleReset = () => {
    setFilterType('');
    setFilterStart('');
    setFilterEnd('');
    setFilterCategory('');
    setSearchQuery('');
  };

  // ── modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (tx) => {
    setEditId(tx.id);
    setForm({
      filterType: tx.category_type || 'expense',
      category_id: tx.category_id || '',
      description: tx.description || '',
      amount: tx.amount ?? '',
      transaction_date: tx.transaction_date
        ? tx.transaction_date.slice(0, 10)
        : TODAY,
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'filterType' ? { category_id: '' } : {}),
    }));
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) { setFormError('Please select a category.'); return; }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const payload = {
        category_id: form.category_id,
        amount: Number(form.amount),
        description: form.description.trim(),
        transaction_date: form.transaction_date,
      };
      if (editId) {
        await api.put(`/api/transaction/${editId}`, payload);
      } else {
        await api.post('/api/transaction', payload);
      }
      closeModal();
      fetchData();           // keeps current search/sort/filters
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setFormLoading(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await api.delete(`/api/transaction/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete transaction.');
    }
  };

  // ── derived for form ───────────────────────────────────────────────────────
  const filteredCats = categories.filter((c) => c.type === form.filterType);

  const hasActiveFilters =
    filterType || filterStart || filterEnd || filterCategory || searchQuery;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="transactions-page">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Track all your income and expenses</p>
        </div>
        <div className="tx-header-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => sorted.length > 0 && downloadCSV(sorted)}
            disabled={sorted.length === 0}
            title="Export filtered rows as CSV"
          >
            <IconDownload size={15} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Transaction
          </button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="tx-summary">
        <div className="tx-summary-item">
          <div className="tx-summary-icon tx-summary-icon--income">
            <IconTrendUp size={18} color="#059669" />
          </div>
          <div>
            <span className="tx-summary-label">Income</span>
            <span className="tx-summary-value income">{formatETB(income)}</span>
          </div>
        </div>
        <div className="tx-summary-divider" />
        <div className="tx-summary-item">
          <div className="tx-summary-icon tx-summary-icon--expense">
            <IconTrendDown size={18} color="#ef4444" />
          </div>
          <div>
            <span className="tx-summary-label">Expenses</span>
            <span className="tx-summary-value expense">{formatETB(expenses)}</span>
          </div>
        </div>
        <div className="tx-summary-divider" />
        <div className="tx-summary-item">
          <div className={`tx-summary-icon tx-summary-icon--${balance >= 0 ? 'balance' : 'negative'}`}>
            <IconWallet size={18} color={balance >= 0 ? '#2563eb' : '#ef4444'} />
          </div>
          <div>
            <span className="tx-summary-label">Balance</span>
            <span className={`tx-summary-value ${balance >= 0 ? 'income' : 'expense'}`}>
              {formatETB(balance)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card tx-filters">

        {/* Search row */}
        <div className="tx-search-row">
          <div className="tx-search-wrap">
            <IconSearch size={16} color="#9ca3af" className="tx-search-icon" />
            <input
              type="search"
              className="tx-search-input"
              placeholder="Search description or category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search transactions"
            />
            {searchQuery && (
              <button
                className="tx-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <IconXCircle size={15} color="#9ca3af" />
              </button>
            )}
          </div>
        </div>

        {/* Filter row */}
        <div className="tx-filter-row">
          <div className="form-group tx-filter-field" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="f-type">Type</label>
            <select
              id="f-type"
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group tx-filter-field" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="f-cat">Category</label>
            <select
              id="f-cat"
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group tx-filter-field" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="f-start">From</label>
            <input
              id="f-start"
              type="date"
              className="form-input"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
          </div>

          <div className="form-group tx-filter-field" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="f-end">To</label>
            <input
              id="f-end"
              type="date"
              className="form-input"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button className="btn btn-ghost tx-reset-btn" onClick={handleReset}>
              <IconXCircle size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Error banner ── */}
      {pageError && (
        <div className="alert alert-error tx-error-banner">
          <span>{pageError}</span>
          <button className="btn btn-ghost btn-sm" onClick={fetchData}>
            <IconRefresh size={14} /> Retry
          </button>
        </div>
      )}

      {/* ── Table card ── */}
      <div className="card tx-table-card">
        {isLoading ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Description</th><th>Category</th>
                  <th>Date</th><th>Amount</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : !pageError && sorted.length === 0 ? (
          <div className="empty-state">
            <IconSearch size={36} color="#d1d5db" />
            <div className="empty-state-title">
              {hasActiveFilters
                ? 'No transactions match your filters'
                : 'No transactions yet'}
            </div>
            <div className="empty-state-desc">
              {hasActiveFilters ? (
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                  <IconXCircle size={13} /> Clear filters
                </button>
              ) : (
                <span>Click &ldquo;+ Add Transaction&rdquo; to get started</span>
              )}
            </div>
          </div>
        ) : !pageError ? (
          <>
            {/* ── Desktop table ── */}
            <div className="table-wrapper tx-desktop-table">
              <table className="table">
                <thead>
                  <tr>
                    <th className="tx-col-num">#</th>
                    <th
                      className="tx-sortable-th"
                      onClick={() => handleSort('description')}
                    >
                      Description
                      <SortIcon col="description" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th
                      className="tx-sortable-th"
                      onClick={() => handleSort('category_name')}
                    >
                      Category
                      <SortIcon col="category_name" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th
                      className="tx-sortable-th"
                      onClick={() => handleSort('transaction_date')}
                    >
                      Date
                      <SortIcon col="transaction_date" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th
                      className="tx-sortable-th tx-col-amount"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                      <SortIcon col="amount" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th className="tx-col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((t, i) => (
                    <tr key={t.id ?? i}>
                      <td className="tx-num">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                      <td>
                        <div className="tx-desc">{t.description || '—'}</div>
                        <span className={`badge ${t.category_type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {t.category_type}
                        </span>
                      </td>
                      <td className="tx-cat">{t.category_name || '—'}</td>
                      <td className="tx-date-cell">{formatDate(t.transaction_date)}</td>
                      <td>
                        <span className={t.category_type === 'income' ? 'tx-amount-income' : 'tx-amount-expense'}>
                          {t.category_type === 'income' ? '+' : '−'} {formatETB(t.amount)}
                        </span>
                      </td>
                      <td>
                        <div className="tx-actions">
                          <button
                            className="tx-action-btn edit"
                            onClick={() => openEdit(t)}
                            aria-label={`Edit ${t.description}`}
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            className="tx-action-btn delete"
                            onClick={() => { setDeleteError(null); setDeleteId(t.id); }}
                            aria-label={`Delete ${t.description}`}
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* ── Footer totals ── */}
                <tfoot>
                  <tr className="tx-tfoot-row">
                    <td colSpan={3} className="tx-tfoot-label">
                      Totals for {filtered.length} row{filtered.length !== 1 ? 's' : ''}
                    </td>
                    <td />
                    <td>
                      <div className="tx-tfoot-amounts">
                        <span className="tx-amount-income">+{formatETB(income)}</span>
                        <span className="tx-tfoot-sep">·</span>
                        <span className="tx-amount-expense">−{formatETB(expenses)}</span>
                        <span className="tx-tfoot-sep">·</span>
                        <span className={balance >= 0 ? 'tx-amount-income' : 'tx-amount-expense'}>
                          {balance >= 0 ? '+' : '−'}{formatETB(Math.abs(balance))}
                        </span>
                      </div>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ── Mobile stacked cards ── */}
            <div className="tx-mobile-list">
              {pageRows.map((t, i) => (
                <div key={t.id ?? i} className="tx-mobile-card">
                  <div className="tx-mobile-top">
                    <div className="tx-mobile-left">
                      <span className="tx-desc">{t.description || '—'}</span>
                      <span className="tx-cat">{t.category_name || '—'}</span>
                    </div>
                    <span className={t.category_type === 'income' ? 'tx-amount-income' : 'tx-amount-expense'}>
                      {t.category_type === 'income' ? '+' : '−'} {formatETB(t.amount)}
                    </span>
                  </div>
                  <div className="tx-mobile-bottom">
                    <div className="tx-mobile-meta">
                      <span className={`badge ${t.category_type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.category_type}
                      </span>
                      <span className="tx-date-cell">{formatDate(t.transaction_date)}</span>
                    </div>
                    <div className="tx-actions">
                      <button
                        className="tx-action-btn edit"
                        onClick={() => openEdit(t)}
                        aria-label={`Edit ${t.description}`}
                      >
                        <IconEdit size={15} />
                      </button>
                      <button
                        className="tx-action-btn delete"
                        onClick={() => { setDeleteError(null); setDeleteId(t.id); }}
                        aria-label={`Delete ${t.description}`}
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile totals footer */}
              <div className="tx-mobile-totals">
                <span>Totals ({filtered.length})</span>
                <span className="tx-amount-income">+{formatETB(income)}</span>
                <span className="tx-amount-expense">−{formatETB(expenses)}</span>
                <span className={balance >= 0 ? 'tx-amount-income' : 'tx-amount-expense'}>
                  {balance >= 0 ? '+' : '−'}{formatETB(Math.abs(balance))}
                </span>
              </div>
            </div>

            <Pagination
              page={safePage}
              totalPages={totalPages}
              total={sorted.length}
              pageSize={PAGE_SIZE}
              onPage={setPage}
            />
          </>
        ) : null}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <Modal
          onClose={closeModal}
          title={editId ? 'Edit Transaction' : 'Add Transaction'}
          id="tx-modal-title"
        >
          {formError && (
            <div className="alert alert-error" role="alert">{formError}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="type-toggle">
                {['income', 'expense'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`type-toggle-btn ${form.filterType === t ? `active-${t}` : ''}`}
                    onClick={() => handleFormChange({ target: { name: 'filterType', value: t } })}
                  >
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tx-cat">
                Category <span className="required-star">*</span>
              </label>
              {categories.length === 0 ? (
                <p className="tx-no-categories">
                  No categories yet.{' '}
                  <Link to="/category" className="auth-link">Create one first →</Link>
                </p>
              ) : filteredCats.length === 0 ? (
                <p className="tx-no-categories">
                  No <strong>{form.filterType}</strong> categories.{' '}
                  <Link to="/category" className="auth-link">Add one →</Link>
                </p>
              ) : (
                <select
                  id="tx-cat"
                  name="category_id"
                  className="form-select"
                  value={form.category_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">— Select a category —</option>
                  {filteredCats.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tx-desc">Description</label>
              <input
                id="tx-desc"
                name="description"
                type="text"
                className="form-input"
                placeholder="e.g. Weekly groceries"
                value={form.description}
                onChange={handleFormChange}
                autoComplete="off"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="tx-amount">
                  Amount (ETB) <span className="required-star">*</span>
                </label>
                <input
                  id="tx-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tx-date">
                  Date <span className="required-star">*</span>
                </label>
                <input
                  id="tx-date"
                  name="transaction_date"
                  type="date"
                  className="form-input"
                  value={form.transaction_date}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading
                  ? <><span className="btn-spinner" /> Saving…</>
                  : editId ? 'Update' : 'Add Transaction'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <Modal
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          title="Delete Transaction"
          id="del-modal-title"
        >
          <p className="delete-confirm-text">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          {deleteError && (
            <div className="alert alert-error" role="alert">{deleteError}</div>
          )}
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={() => { setDeleteId(null); setDeleteError(null); }}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Transaction;
