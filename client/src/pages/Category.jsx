import { useEffect, useState } from 'react';
import api from '../services/app.js';
import './Category.css';

const EMPTY_FORM = { name: '', type: 'expense' };

const CATEGORY_ICONS = {
  food: '🍽️',
  transport: '🚗',
  shopping: '🛍️',
  health: '🏥',
  entertainment: '🎬',
  education: '📚',
  salary: '💼',
  business: '🏢',
  investment: '📈',
  rent: '🏠',
  utilities: '💡',
  default: '📁',
};

function getCategoryIcon(name = '') {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

function Category() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  // Filter
  const [filterType, setFilterType] = useState('all');

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/category');
      setCategories(res.data?.result || []);
    } catch (_err) {
      setError('Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/category/${id}`);
      setDeleteId(null);
      fetchCategories();
    } catch (_err) {
      alert('Failed to delete category. It may be in use by transactions.');
    }
  };

  const filtered = filterType === 'all'
    ? categories
    : categories.filter((c) => c.type === filterType);

  const incomeCount = categories.filter((c) => c.type === 'income').length;
  const expenseCount = categories.filter((c) => c.type === 'expense').length;

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

      {/* Stats */}
      <div className="cat-stats">
        <div
          className={`cat-stat-pill ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setFilterType('all')}
        >
          <span>📁</span>
          <span>All</span>
          <span className="cat-stat-count">{categories.length}</span>
        </div>
        <div
          className={`cat-stat-pill income ${filterType === 'income' ? 'active' : ''}`}
          onClick={() => setFilterType('income')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setFilterType('income')}
        >
          <span>📈</span>
          <span>Income</span>
          <span className="cat-stat-count">{incomeCount}</span>
        </div>
        <div
          className={`cat-stat-pill expense ${filterType === 'expense' ? 'active' : ''}`}
          onClick={() => setFilterType('expense')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setFilterType('expense')}
        >
          <span>📉</span>
          <span>Expense</span>
          <span className="cat-stat-count">{expenseCount}</span>
        </div>
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
                : 'Click "New Category" to create your first category'}
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
                <span className={`badge ${cat.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                  {cat.type}
                </span>
              </div>
              <div className="cat-card-actions">
                <button
                  className="cat-action edit"
                  onClick={() => openEdit(cat)}
                  title="Edit"
                  aria-label={`Edit ${cat.name}`}
                >
                  ✏️
                </button>
                <button
                  className="cat-action delete"
                  onClick={() => setDeleteId(cat.id)}
                  title="Delete"
                  aria-label={`Delete ${cat.name}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cat-modal-title">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title" id="cat-modal-title">
                {editId ? 'Edit Category' : 'New Category'}
              </h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="type-toggle">
                  {['income', 'expense'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`type-toggle-btn ${form.type === t ? 'active-' + t : ''}`}
                      onClick={() => setForm({ ...form, type: t })}
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              {/* Preview */}
              {form.name && (
                <div className="cat-preview">
                  <span className="cat-preview-icon">{getCategoryIcon(form.name)}</span>
                  <div>
                    <span className="cat-preview-name">{form.name}</span>
                    <span className={`badge ${form.type === 'income' ? 'badge-income' : 'badge-expense'}`} style={{ marginLeft: '0.5rem' }}>
                      {form.type}
                    </span>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? (
                    <><span className="btn-spinner" /> Saving...</>
                  ) : editId ? 'Update' : 'Create'}
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
              <h2 className="modal-title">Delete Category</h2>
              <button className="modal-close" onClick={() => setDeleteId(null)} aria-label="Close">×</button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this category? This may affect related transactions.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
