import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchCategories } from '../features/products/productSlice';
import { adminAPI } from '../services/api';
import { Image, X, Plus } from 'lucide-react';

const initialFormData = {
  name: '',
  description: '',
  brand: '',
  sku: '',
  productType: 'general-shop-product',
  price: '',
  compareAtPrice: '',
  stock: '',
  lowStockThreshold: '5',
  category: '',
  tags: '',
  featured: false,
  isActive: true
};

export default function AdminProductsPage({ mode = 'list' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);
  const categoryList = Array.isArray(categories) ? categories : [];

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const pageTitle = isCreateMode ? 'Add New Product' : 'Edit Product';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const canSubmit = useMemo(
    () => formData.name && formData.description && formData.category && formData.sku && formData.price !== '',
    [formData]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isCreateMode) {
      setFormData(initialFormData);
      setLoading(false);
      return;
    }

    if (isEditMode && id) {
      fetchProduct(id);
    } else {
      fetchProducts();
    }
  }, [id, isCreateMode, isEditMode]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getProduct(productId);
      const product = res.data.product;
      setFormData({
        name: product?.name || '',
        description: product?.description || '',
        brand: product?.brand || '',
        sku: product?.sku || '',
        productType: product?.productType || 'general-shop-product',
        price: product?.price ?? '',
        compareAtPrice: product?.compareAtPrice ?? '',
        stock: product?.stock ?? 0,
        lowStockThreshold: product?.lowStockThreshold ?? 5,
        category: product?.category?._id || product?.category || '',
        tags: product?.tags?.join(', ') || '',
        featured: Boolean(product?.featured),
        isActive: product?.isActive !== false
      });
      // Set existing images for edit mode
      if (product?.images && product.images.length > 0) {
        setImagePreview(
          product.images.map((img) => ({
            kind: 'existing',
            url: img.url,
            public_id: img.public_id
          }))
        );
      } else {
        setImagePreview([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviews = files.map(file => ({
      kind: 'new',
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...files]);
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreview[index];
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    if (imageToRemove?.kind === 'new') {
      setImages((prev) => prev.filter((file) => file !== imageToRemove.file));
    }

    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Create FormData for multipart/form-data request
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('sku', formData.sku.toUpperCase());
    formDataToSend.append('productType', formData.productType);
    formDataToSend.append('price', formData.price);
    if (formData.compareAtPrice) formDataToSend.append('compareAtPrice', formData.compareAtPrice);
    formDataToSend.append('stock', formData.stock || 0);
    formDataToSend.append('lowStockThreshold', formData.lowStockThreshold || 5);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('featured', formData.featured);
    formDataToSend.append('isActive', formData.isActive);

    // Preserve existing images that are still shown in the form.
    imagePreview
      .filter((image) => image.kind === 'existing' && image.url)
      .forEach((image) => {
        formDataToSend.append('imageUrls', image.url);
      });

    // Append new image files
    images.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      if (isCreateMode) {
        await adminAPI.addProduct(formDataToSend);
      } else {
        await adminAPI.updateProduct(id, formDataToSend);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminAPI.deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (isEditMode && id && !formData.name && !error) {
    return <div className="p-8 text-center">Product not found</div>;
  }

  if (isCreateMode || isEditMode) {
    return (
      <div>
        <div className="mb-4 sm:mb-6 flex items-center gap-4">
          <Link to="/admin/products" className="text-brand-primary hover:underline text-sm sm:text-base">
            Back to Products
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">{pageTitle}</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => updateField('brand', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => updateField('sku', e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 sm:p-3 text-sm uppercase dark:border-slate-600 dark:bg-slate-800"
                required
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium">Product Images</label>
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
                {/* Existing/Preview Images */}
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
                    {img.preview ? (
                      <img src={img.preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                    ) : img.url ? (
                      <img src={img.url} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {/* Add Image Button */}
                {imagePreview.length < 5 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-primary hover:text-brand-primary dark:border-slate-600 dark:hover:border-brand-primary">
                    <Plus size={24} />
                    <span className="mt-1 text-xs">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="mt-2 text-xs text-brand-muted dark:text-brand-dark-muted">
                Upload up to 5 images. First image will be the main product image.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
                required
              >
                <option value="">Select Category</option>
                {categoryList.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Product Type</label>
              <select
                value={formData.productType}
                onChange={(e) => updateField('productType', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="cycle-part">Cycle Part</option>
                <option value="bicycle-accessory">Bicycle Accessory</option>
                <option value="electronics-accessory">Electronics Accessory</option>
                <option value="general-shop-product">General Shop Product</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium">Price (Rs.)</label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Compare Price</label>
              <input
                type="number"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) => updateField('compareAtPrice', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Low Stock Alert</label>
              <input
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => updateField('lowStockThreshold', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="e.g. cycle, premium, repair"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
              />
              Featured product
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              Visible in storefront
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isCreateMode ? 'Create Product' : 'Update Product'}
            </button>
            <Link
              to="/admin/products"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Product Management</h1>
          <p className="mt-1 text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">
            Admins can add, edit, and archive products from one place.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 w-full sm:w-auto text-center"
        >
          Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="py-3">Product</th>
              <th className="py-3">SKU</th>
              <th className="py-3">Category</th>
              <th className="py-3">Price</th>
              <th className="py-3">Stock</th>
              <th className="py-3">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-3 font-medium">{product.name}</td>
                <td className="py-3">{product.sku}</td>
                <td className="py-3">{product.category?.name || 'N/A'}</td>
                <td className="py-3">Rs. {product.price?.toLocaleString?.() || product.price}</td>
                <td className="py-3">{product.stock}</td>
                <td className="py-3">
                  <span className={product.isActive ? 'text-green-600' : 'text-slate-500'}>
                    {product.isActive ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="rounded bg-blue-100 px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
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
        {products.length === 0 && (
          <p className="py-8 text-center text-slate-500">No products found</p>
        )}
      </div>
    </div>
  );
}
