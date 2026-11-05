import { useState, useEffect } from 'react';
import api from '../services/app.js';
import './Transaction.css';

const EMPTY_FORM = {
  description: '',
  amount: '',
  type: 'expense',
  category_id: '',
  date: new Date().toISOString().split('T')[0],
  note: '',
};

function formatETB(amount) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Filter state
  const [filterType, setFilterType] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  // Delete confirm
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStart) params.start_date = filterStart;
      if (filterEnd) params.end_date = filterEnd;

      const [txRes, catRes] = await Promise.all([
        api.get('/api/transaction', { params }),
        api.get('/api/category'),
      ]);
      setTransactions(txRes.data?.data || []);
      setCategories(catRes.data?.result || []);
    } catch (_err) {
      setError('Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (tx) => {
    setEditId(tx.id);
    setForm({
      description: tx.description || tx.note || '',
      amount: tx.amount || '',
      type: tx.type || 'expense',
      category_id: tx.category_id || tx.category?.id || '',
      date: tx.date ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0],
      note: tx.note || '',
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setFormError('Please enter a valid amount.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const payload = {
        description: form.description,
        amount: Number(form.amount),
        type: form.type,
        category_id: form.category_id || null,
        date: form.date,
        note: form.note,
      };
      if (editId) {
        await api.put(`/api/transaction/${editId}`, payload);
      } else {
        await api.post('/api/transaction', payload);
      }
      closeModal();
      fetchData();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/transaction/${id}`);
      setDeleteId(null);
      fetchData();
    } catch (_err) {
      alert('Failed to delete transaction.');
    }
  };

  const filteredCategories = categories.filter(
    (c) => !form.type || c.type === form.type
  );

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Track all your income and expenses</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Transaction
        </button>
      </div>

      {/* Summary strip */}
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
          <span className={`tx-summary-value ${income - expenses >= 0 ? 'income' : 'expense'}`}>
            {formatETB(income - expenses)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card tx-filters">
        <div className="tx-filter-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Type</label>
            <select
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
            <label className="form-label">From</label>
            <input
              type="date"
              className="form-input"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">To</label>
            <input
              type="date"
              className="form-input"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={fetchData}>
            Apply
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setFilterType('');
              setFilterStart('');
              setFilterEnd('');
              setTimeout(fetchData, 0);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-desc">Click "Add Transaction" to get started</div>
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
                    <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#111827' }}>
                        {t.description || t.note || '—'}
                      </div>
                      {t.note && t.description && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.note}</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {t.category?.name || t.category_name || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {t.date
                        ? new Date(t.date).toLocaleDateString('en-ET')
                        : t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString('en-ET')
                        : '—'}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: t.type === 'income' ? '#059669' : '#ef4444',
                        }}
                      >
                        {t.type === 'income' ? '+' : '-'} {formatETB(t.amount)}
                      </span>
                    </td>
                    <td>
                      <div className="tx-actions">
                        <button
                          className="tx-action-btn edit"
                          onClick={() => openEdit(t)}
                          title="Edit"
                          aria-label="Edit transaction"
                        >
                          ✏️
                        </button>
                        <button
                          className="tx-action-btn delete"
                          onClick={() => setDeleteId(t.id)}
                          title="Delete"
                          aria-label="Delete transaction"
                        >
                          🗑️
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title" id="modal-title">
                {editId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="tx-type">Type</label>
                <div className="type-toggle">
                  {['income', 'expense'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`type-toggle-btn ${form.type === t ? 'active-' + t : ''}`}
                      onClick={() => setForm({ ...form, type: t, category_id: '' })}
                    >
                      {t === 'income' ? '📈 Income' : '📉 Expense'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-desc">Description</label>
                <input
                  id="tx-desc"
                  name="description"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Grocery shopping"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="tx-amount">Amount (ETB)</label>
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
                  <label className="form-label" htmlFor="tx-date">Date</label>
                  <input
                    id="tx-date"
                    name="date"
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-cat">Category</label>
                <select
                  id="tx-cat"
                  name="category_id"
                  className="form-select"
                  value={form.category_id}
                  onChange={handleFormChange}
                >
                  <option value="">Select category (optional)</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-note">Note (optional)</label>
                <input
                  id="tx-note"
                  name="note"
                  type="text"
                  className="form-input"
                  placeholder="Additional notes..."
                  value={form.note}
                  onChange={handleFormChange}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? (
                    <><span className="btn-spinner" /> Saving...</>
                  ) : editId ? 'Update' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Transaction</h2>
              <button className="modal-close" onClick={() => setDeleteId(null)} aria-label="Close">×</button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaction;
