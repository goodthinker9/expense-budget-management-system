import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/app.js';
import { IconEdit, IconTrash } from '../components/Icons';
import './Transaction.css';

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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const TODAY = new Date().toISOString().split('T')[0];

// Form initial state — no "note", no standalone "type" (type drives category filter only)
const EMPTY_FORM = {
  filterType: 'expense',   // used only to narrow the category dropdown
  category_id: '',
  description: '',
  amount: '',
  transaction_date: TODAY,
};

// ── modal with Escape key ────────────────────────────────────────────────────

function Modal({ onClose, title, id, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      ref={overlayRef}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id={id}>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  // Add / Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Delete confirm modal
  const [deleteId, setDeleteId] = useState(null);

  // ── data fetching ────────────────────────────────────────────────────────

  const fetchData = useCallback(async (overrides = {}) => {
    setIsLoading(true);
    setPageError(null);
    try {
      const params = {};
      const type  = overrides.type  !== undefined ? overrides.type  : filterType;
      const start = overrides.start !== undefined ? overrides.start : filterStart;
      const end   = overrides.end   !== undefined ? overrides.end   : filterEnd;

      if (type)  params.type       = type;
      if (start) params.start_date = start;
      if (end)   params.end_date   = end;

      const [txRes, catRes] = await Promise.all([
        api.get('/api/transaction', { params }),
        api.get('/api/category'),
      ]);
      setTransactions(txRes.data?.data || []);
      setCategories(catRes.data?.result || []);
    } catch (err) {
      setPageError(err?.response?.data?.message || 'Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [filterType, filterStart, filterEnd]);

  useEffect(() => {
    (async () => { await fetchData(); })();
  }, [fetchData]);

  // ── filter handlers ──────────────────────────────────────────────────────

  const handleApply = () => fetchData();

  // Reset: clear state AND pass cleared values directly (no setTimeout hack)
  const handleReset = () => {
    setFilterType('');
    setFilterStart('');
    setFilterEnd('');
    fetchData({ type: '', start: '', end: '' });
  };

  // ── modal helpers ────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (tx) => {
    setEditId(tx.id);
    // Determine the filter toggle from the transaction's category_type
    const cat = categories.find((c) => c.id === tx.category_id);
    setForm({
      filterType: tx.category_type || cat?.type || 'expense',
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
      // If the user switches the type toggle, clear the selected category
      ...(name === 'filterType' ? { category_id: '' } : {}),
    }));
  };

  // ── submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Category is required
    if (!form.category_id) {
      setFormError('Please select a category.');
      return;
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    setFormLoading(true);
    setFormError(null);
    try {
      // Send only the fields the backend expects — no "type", no "note"
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
      fetchData();
    } catch (err) {
      setFormError(
        err?.response?.data?.message || 'Failed to save transaction. Please try again.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ── delete ───────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await api.delete(`/api/transaction/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      // Replace alert() with inline error inside the confirm modal
      setDeleteError(
        err?.response?.data?.message || 'Failed to delete transaction.'
      );
    }
  };

  // ── derived summaries ────────────────────────────────────────────────────

  // Use category_type — no "type" field on a transaction
  const income = transactions
    .filter((t) => t.category_type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.category_type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0);

  // Categories filtered by current toggle (for the form dropdown)
  const filteredCats = categories.filter((c) => c.type === form.filterType);

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div className="transactions-page">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Track all your income and expenses</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Transaction
        </button>
      </div>

      {/* ── Summary strip ── */}
      <div className="tx-summary">
        <div className="tx-summary-item">
          <span className="tx-summary-label">Income</span>
          <span className="tx-summary-value income">{formatETB(income)}</span>
        </div>
        <div className="tx-summary-divider" />
        <div className="tx-summary-item">
          <span className="tx-summary-label">Expenses</span>
          <span className="tx-summary-value expense">{formatETB(expenses)}</span>
        </div>
        <div className="tx-summary-divider" />
        <div className="tx-summary-item">
          <span className="tx-summary-label">Balance</span>
          <span
            className={`tx-summary-value ${
              income - expenses >= 0 ? 'income' : 'expense'
            }`}
          >
            {formatETB(income - expenses)}
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card tx-filters">
        <div className="tx-filter-row">
          <div className="form-group" style={{ margin: 0 }}>
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
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="f-start">From</label>
            <input
              id="f-start"
              type="date"
              className="form-input"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="f-end">To</label>
            <input
              id="f-end"
              type="date"
              className="form-input"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
          <button className="btn btn-ghost" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : pageError ? (
          <div className="alert alert-error">{pageError}</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-desc">
              Click &ldquo;+ Add Transaction&rdquo; to get started
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={t.id || i}>
                    <td className="tx-num">{i + 1}</td>
                    <td>
                      <div className="tx-desc">{t.description || '—'}</div>
                    </td>
                    <td>
                      {/* badge driven by category_type */}
                      <span
                        className={`badge ${
                          t.category_type === 'income'
                            ? 'badge-income'
                            : 'badge-expense'
                        }`}
                      >
                        {t.category_type}
                      </span>
                    </td>
                    <td className="tx-cat">{t.category_name || '—'}</td>
                    <td className="tx-date-cell">
                      {formatDate(t.transaction_date)}
                    </td>
                    <td>
                      <span
                        className={
                          t.category_type === 'income'
                            ? 'tx-amount-income'
                            : 'tx-amount-expense'
                        }
                      >
                        {t.category_type === 'income' ? '+' : '−'}{' '}
                        {formatETB(t.amount)}
                      </span>
                    </td>
                    <td>
                      <div className="tx-actions">
                        <button
                          className="tx-action-btn edit"
                          onClick={() => openEdit(t)}
                          title="Edit"
                          aria-label={`Edit transaction: ${t.description}`}
                        >
                          <IconEdit size={15} />
                        </button>
                        <button
                          className="tx-action-btn delete"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteId(t.id);
                          }}
                          title="Delete"
                          aria-label={`Delete transaction: ${t.description}`}
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <Modal
          onClose={closeModal}
          title={editId ? 'Edit Transaction' : 'Add Transaction'}
          id="tx-modal-title"
        >
          {formError && (
            <div className="alert alert-error" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Income / Expense toggle — filters the category list only */}
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="type-toggle">
                {['income', 'expense'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`type-toggle-btn ${
                      form.filterType === t ? `active-${t}` : ''
                    }`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'filterType', value: t },
                      })
                    }
                  >
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category — REQUIRED */}
            <div className="form-group">
              <label className="form-label" htmlFor="tx-cat">
                Category <span className="required-star">*</span>
              </label>
              {categories.length === 0 ? (
                <p className="tx-no-categories">
                  You have no categories yet.{' '}
                  <Link to="/category" className="auth-link">
                    Create one first →
                  </Link>
                </p>
              ) : filteredCats.length === 0 ? (
                <p className="tx-no-categories">
                  No <strong>{form.filterType}</strong> categories found.{' '}
                  <Link to="/category" className="auth-link">
                    Add one →
                  </Link>
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
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="tx-desc">
                Description
              </label>
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

            {/* Amount + Date row */}
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
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
              >
                {formLoading ? (
                  <><span className="btn-spinner" /> Saving…</>
                ) : editId ? (
                  'Update'
                ) : (
                  'Add Transaction'
                )}
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
            Are you sure you want to delete this transaction? This action
            cannot be undone.
          </p>

          {deleteError && (
            <div className="alert alert-error" role="alert">
              {deleteError}
            </div>
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
