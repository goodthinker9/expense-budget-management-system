import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/app.js';
import {
  IconCalendar, IconPlus, IconEdit, IconTrash,
  IconRefresh, IconAlert, IconBudget,
} from '../components/Icons';
import './Budgets.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatETB(n) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency', currency: 'ETB', minimumFractionDigits: 2,
  }).format(n || 0);
}

function currentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(yyyyMM) {
  if (!yyyyMM) return '';
  const [y, m] = yyyyMM.split('-');
  return new Date(Number(y), Number(m) - 1, 1)
    .toLocaleDateString('en-ET', { month: 'long', year: 'numeric' });
}

/** Compute the progress bar colour class based on % used. */
function barColor(pct) {
  if (pct >= 100) return 'over';
  if (pct >= 80)  return 'warn';
  return 'ok';
}

// ── skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ w = '100%', h = 18, radius = 6 }) {
  return (
    <div
      className="bgt-skeleton"
      style={{ width: w, height: h, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

// ── Modal component with Escape key ──────────────────────────────────────────

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="bgt-modal-title">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="bgt-modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── BudgetCard ────────────────────────────────────────────────────────────────

function BudgetCard({ budget, onEdit, onDelete }) {
  const { category_name, spent, limit_amount } = budget;
  const pct     = limit_amount > 0 ? Math.round((spent / limit_amount) * 100) : 0;
  const color   = barColor(pct);
  const remaining = limit_amount - spent;

  return (
    <div className={`bgt-card bgt-card--${color}`}>
      <div className="bgt-card-top">
        <div className="bgt-card-name">{category_name}</div>
        <div className="bgt-card-actions">
          <button
            className="bgt-action-btn"
            onClick={() => onEdit(budget)}
            aria-label={`Edit budget for ${category_name}`}
          >
            <IconEdit size={15} />
          </button>
          <button
            className="bgt-action-btn delete"
            onClick={() => onDelete(budget)}
            aria-label={`Delete budget for ${category_name}`}
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>

      <div className="bgt-amounts">
        <span className="bgt-spent">{formatETB(spent)}</span>
        <span className="bgt-sep"> / </span>
        <span className="bgt-limit">{formatETB(limit_amount)}</span>
        <span className={`bgt-pct bgt-pct--${color}`}>{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="bgt-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`bgt-bar-fill bgt-bar--${color}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {/* Remaining / over */}
      <div className={`bgt-remaining bgt-remaining--${color}`}>
        {remaining >= 0
          ? `${formatETB(remaining)} remaining`
          : `${formatETB(Math.abs(remaining))} over budget`}
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function Budgets() {
  const [month, setMonth] = useState(currentMonthValue);

  const [budgets,    setBudgets]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Add modal
  const [showAdd,     setShowAdd]     = useState(false);
  const [addForm,     setAddForm]     = useState({ category_id: '', limit_amount: '' });
  const [addLoading,  setAddLoading]  = useState(false);
  const [addError,    setAddError]    = useState(null);

  // Edit modal
  const [editTarget,   setEditTarget]   = useState(null); // budget object
  const [editAmount,   setEditAmount]   = useState('');
  const [editLoading,  setEditLoading]  = useState(false);
  const [editError,    setEditError]    = useState(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError,  setDeleteError]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const addAmountRef = useRef(null);

  // ── data fetching ─────────────────────────────────────────────────────────

  const fetchAll = useCallback(async (m) => {
    setLoading(true);
    setError(null);
    try {
      const [bRes, cRes] = await Promise.all([
        api.get('/api/budget',   { params: { month: m } }),
        api.get('/api/category'),
      ]);
      setBudgets(bRes.data?.result || []);
      setCategories(cRes.data?.result || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load budgets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => { await fetchAll(month); })();
  }, [fetchAll, month]);

  // ── derived ───────────────────────────────────────────────────────────────

  /** Expense categories that don't already have a budget this month. */
  const budgetedCatIds = new Set(budgets.map((b) => String(b.category_id)));
  const availableCats  = categories.filter(
    (c) => c.type === 'expense' && !budgetedCatIds.has(String(c.id))
  );

  const overBudget = budgets.filter(
    (b) => b.limit_amount > 0 && b.spent > b.limit_amount
  );

  // ── add ───────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setAddForm({ category_id: availableCats[0]?.id ?? '', limit_amount: '' });
    setAddError(null);
    setShowAdd(true);
    setTimeout(() => addAmountRef.current?.focus(), 50);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.category_id) { setAddError('Please select a category.'); return; }
    if (!addForm.limit_amount || Number(addForm.limit_amount) <= 0) {
      setAddError('Limit amount must be greater than 0.');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      await api.post('/api/budget', {
        category_id:  Number(addForm.category_id),
        month,
        limit_amount: Number(addForm.limit_amount),
      });
      setShowAdd(false);
      fetchAll(month);
    } catch (err) {
      setAddError(err?.response?.data?.message || 'Failed to create budget.');
    } finally {
      setAddLoading(false);
    }
  };

  // ── edit ──────────────────────────────────────────────────────────────────

  const openEdit = (budget) => {
    setEditTarget(budget);
    setEditAmount(String(budget.limit_amount));
    setEditError(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editAmount || Number(editAmount) <= 0) {
      setEditError('Limit amount must be greater than 0.');
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      await api.put(`/api/budget/${editTarget.id}`, {
        limit_amount: Number(editAmount),
      });
      setEditTarget(null);
      fetchAll(month);
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Failed to update budget.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── delete ────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/api/budget/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchAll(month);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete budget.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="budgets-page">

      {/* ── Header ── */}
      <div className="bgt-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">{monthLabel(month)}</p>
        </div>
        <div className="bgt-header-right">
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
          <button
            className="btn btn-primary"
            onClick={openAdd}
            disabled={loading || availableCats.length === 0}
            title={availableCats.length === 0 ? 'All expense categories already have a budget this month' : ''}
          >
            <IconPlus size={16} /> Add Budget
          </button>
        </div>
      </div>

      {/* ── Over-budget warning banner ── */}
      {!loading && overBudget.length > 0 && (
        <div className="bgt-warning-banner" role="alert">
          <IconAlert size={18} color="#92400e" />
          <span>
            <strong>Over budget:</strong>{' '}
            {overBudget.map((b) => b.category_name).join(', ')}
          </span>
          <Link to="/transaction" className="bgt-warning-link">View transactions →</Link>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bgt-error">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={() => fetchAll(month)}>
            <IconRefresh size={14} /> Retry
          </button>
        </div>
      )}

      {/* ── Budget cards grid ── */}
      {loading ? (
        <div className="bgt-grid">
          {[1,2,3,4].map((k) => (
            <div key={k} className="bgt-card">
              <Skeleton w="60%" h={16} />
              <Skeleton w="80%" h={22} style={{ marginTop: 10 }} />
              <Skeleton w="100%" h={8}  style={{ marginTop: 12 }} radius={999} />
              <Skeleton w="40%" h={12} style={{ marginTop: 8 }} />
            </div>
          ))}
        </div>
      ) : !error && budgets.length === 0 ? (
        <div className="card bgt-empty">
          <IconBudget size={40} color="#d1d5db" />
          <div className="empty-state-title">No budgets for {monthLabel(month)}</div>
          <div className="empty-state-desc">
            {availableCats.length > 0
              ? 'Click "Add Budget" to set a monthly spending limit.'
              : categories.filter((c) => c.type === 'expense').length === 0
              ? <span>Create some <Link to="/category" className="auth-link">expense categories</Link> first.</span>
              : 'All expense categories already have a budget this month.'}
          </div>
        </div>
      ) : (
        <div className="bgt-grid">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={openEdit}
              onDelete={(budget) => { setDeleteTarget(budget); setDeleteError(null); }}
            />
          ))}
        </div>
      )}

      {/* ── Add Modal ── */}
      {showAdd && (
        <Modal title="Add Budget" onClose={() => setShowAdd(false)}>
          {addError && <div className="alert alert-error" role="alert">{addError}</div>}
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label" htmlFor="bgt-cat">Expense Category</label>
              {availableCats.length === 0 ? (
                <p className="bgt-no-cats">
                  All expense categories already have a budget for {monthLabel(month)}.
                </p>
              ) : (
                <select
                  id="bgt-cat"
                  className="form-select"
                  value={addForm.category_id}
                  onChange={(e) => setAddForm((f) => ({ ...f, category_id: e.target.value }))}
                  required
                >
                  <option value="">— Select category —</option>
                  {availableCats.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bgt-limit">
                Monthly Limit (ETB)
              </label>
              <input
                id="bgt-limit"
                ref={addAmountRef}
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                placeholder="e.g. 5000"
                value={addForm.limit_amount}
                onChange={(e) => setAddForm((f) => ({ ...f, limit_amount: e.target.value }))}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addLoading || availableCats.length === 0}
              >
                {addLoading ? <><span className="btn-spinner" /> Saving…</> : 'Create Budget'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <Modal
          title={`Edit — ${editTarget.category_name}`}
          onClose={() => setEditTarget(null)}
        >
          {editError && <div className="alert alert-error" role="alert">{editError}</div>}
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label className="form-label" htmlFor="bgt-edit-limit">
                New Monthly Limit (ETB)
              </label>
              <input
                id="bgt-edit-limit"
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setEditTarget(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={editLoading}>
                {editLoading ? <><span className="btn-spinner" /> Saving…</> : 'Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <Modal
          title="Delete Budget"
          onClose={() => { setDeleteTarget(null); setDeleteError(null); }}
        >
          <p className="bgt-del-text">
            Delete the budget for <strong>{deleteTarget.category_name}</strong>?
            This cannot be undone.
          </p>
          {deleteError && <div className="alert alert-error" role="alert">{deleteError}</div>}
          <div className="modal-footer">
            <button
              className="btn btn-ghost"
              onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? <><span className="btn-spinner" /> Deleting…</> : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Budgets;
