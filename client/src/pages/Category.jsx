import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/app.js';
import './Category.css';

// ── helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', type: 'expense' };

const KEYWORD_ICONS = {
  food: '🍽️', transport: '🚗', shopping: '🛍️', health: '🏥',
  entertainment: '🎬', education: '📚', salary: '💼', business: '🏢',
  investment: '📈', rent: '🏠', utilities: '💡',
};

function getCategoryIcon(name = '') {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(KEYWORD_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '📁';
}

// ── modal with Escape support ────────────────────────────────────────────────

function Modal({ onClose, id, title, maxWidth, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby={id}>
      <div className="modal" style={maxWidth ? { maxWidth } : undefined} ref={ref}>
        <div className="modal-header">
          <h2 className="modal-title" id={id}>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

function Category() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [filterType, setFilterType] = useState('all');

  // ── data ─────────────────────────────────────────────────────────────────

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/category');
      setCategories(res.data?.result || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => { await fetchCategories(); })();
  }, [fetchCategories]);

  // ── modal helpers ────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name, type: cat.type });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  // ── submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      if (editId) {
        await api.put(`/api/category/${editId}`, form);
      } else {
        await api.post('/api/category', form);
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save category.');
    } finally {
      setFormLoading(false);
    }
  };

  // ── delete ───────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await api.delete(`/api/category/${deleteId}`);
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      // Inline error instead of alert()
      setDeleteError(
        err?.response?.data?.message ||
          'Failed to delete. This category may be in use by transactions.'
      );
    }
  };

  // ── derived ──────────────────────────────────────────────────────────────

  const filtered =
    filterType === 'all' ? categories : categories.filter((c) => c.type === filterType);
  const incomeCount  = categories.filter((c) => c.type === 'income').length;
  const expenseCount = categories.filter((c) => c.type === 'expense').length;

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize your income and expenses</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + New Category
        </button>
      </div>

      {/* Filter pills */}
      <div className="cat-stats">
        {[
          { key: 'all',     label: 'All',     icon: '📁', count: categories.length },
          { key: 'income',  label: 'Income',  icon: '📈', count: incomeCount },
          { key: 'expense', label: 'Expense', icon: '📉', count: expenseCount },
        ].map(({ key, label, icon, count }) => (
          <div
            key={key}
            className={`cat-stat-pill ${key !== 'all' ? key : ''} ${filterType === key ? 'active' : ''}`}
            onClick={() => setFilterType(key)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setFilterType(key)}
          >
            <span>{icon}</span>
            <span>{label}</span>
            <span className="cat-stat-count">{count}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <div className="empty-state-title">No categories yet</div>
            <div className="empty-state-desc">
              {filterType !== 'all'
                ? `No ${filterType} categories found`
                : 'Click "+ New Category" to get started'}
            </div>
          </div>
        </div>
      ) : (
        <div className="cat-grid">
          {filtered.map((cat) => (
            <div key={cat.id} className={`cat-card cat-card--${cat.type}`}>
              <div className="cat-card-icon">{getCategoryIcon(cat.name)}</div>
              <div className="cat-card-body">
                <span className="cat-card-name">{cat.name}</span>
                <span
                  className={`badge ${
                    cat.type === 'income' ? 'badge-income' : 'badge-expense'
                  }`}
                >
                  {cat.type}
                </span>
              </div>
              <div className="cat-card-actions">
                <button
                  className="cat-action edit"
                  onClick={() => openEdit(cat)}
                  aria-label={`Edit ${cat.name}`}
                >
                  ✏️
                </button>
                <button
                  className="cat-action delete"
                  onClick={() => { setDeleteError(null); setDeleteId(cat.id); }}
                  aria-label={`Delete ${cat.name}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal onClose={closeModal} id="cat-modal-title" title={editId ? 'Edit Category' : 'New Category'}>
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
                    className={`type-toggle-btn ${form.type === t ? `active-${t}` : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                  >
                    {t === 'income' ? '📈 Income' : '📉 Expense'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cat-name">Category Name</label>
              <input
                id="cat-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Food & Groceries"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                autoFocus
              />
            </div>

            {form.name && (
              <div className="cat-preview">
                <span className="cat-preview-icon">{getCategoryIcon(form.name)}</span>
                <div>
                  <span className="cat-preview-name">{form.name}</span>
                  <span
                    className={`badge ${form.type === 'income' ? 'badge-income' : 'badge-expense'}`}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {form.type}
                  </span>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading
                  ? <><span className="btn-spinner" /> Saving…</>
                  : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <Modal
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          id="cat-del-title"
          title="Delete Category"
          maxWidth={380}
        >
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Are you sure you want to delete this category? This may affect
            related transactions.
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

export default Category;
