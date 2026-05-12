import { useEffect, useState } from 'react';
import { categoryAPI } from '../services/api';

const initialCategoryForm = {
  name: '',
  type: 'product',
  description: ''
};

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialCategoryForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialCategoryForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        await categoryAPI.updateCategory(editingId, formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name || '',
      type: category.type || 'product',
      description: category.description || ''
    });
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category?')) return;

    try {
      await categoryAPI.deleteCategory(categoryId);
      if (editingId === categoryId) {
        resetForm();
      }
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="grid gap-4 sm:gap-6">
      <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700">
        <h1 className="text-xl sm:text-2xl font-bold">Store Settings</h1>
        <p className="mt-2 text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">
          Manage storefront categories and other catalog settings from here.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="recharge">Recharge</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold">Categories</h2>
        <p className="mt-2 text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">
          These power filters, product assignment, and catalog structure.
        </p>

        {loading ? (
          <div className="py-8 text-center">Loading categories...</div>
        ) : (
          <div className="mt-4 sm:mt-6 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[400px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3">Name</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Products</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-3">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-brand-muted dark:text-brand-dark-muted">
                        {category.description || 'No description'}
                      </p>
                    </td>
                    <td className="py-3 capitalize">{category.type}</td>
                    <td className="py-3">{category.productCount || 0}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded bg-blue-100 px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category._id)}
                          className="rounded bg-red-100 px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:bg-red-200 dark:bg-red-900/30"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && (
              <p className="py-8 text-center text-slate-500">No categories found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
