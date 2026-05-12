import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Let the browser set the multipart boundary for FormData uploads.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle malformed JSON responses
    if (error.response && typeof error.response.data === 'string') {
      try {
        error.response.data = JSON.parse(error.response.data);
      } catch {
        error.response.data = { message: 'Server error' };
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

// Products
export const productAPI = {
  getProducts: (params = {}) => {
    const sortMap = {
      popularity: '-createdAt',
      'price-asc': 'price',
      'price-desc': '-price',
      rating: '-averageRating'
    };

    const normalizedParams = {
      ...params,
      sort: sortMap[params.sort] || params.sort
    };

    if (!normalizedParams.search) delete normalizedParams.search;
    if (!normalizedParams.category || normalizedParams.category === 'all') delete normalizedParams.category;
    if (normalizedParams.minPrice === undefined || normalizedParams.minPrice === null) delete normalizedParams.minPrice;
    if (normalizedParams.maxPrice === undefined || normalizedParams.maxPrice === null) delete normalizedParams.maxPrice;

    return api.get('/products', { params: normalizedParams });
  },
  getProduct: (id) => api.get(`/products/${id}`),
  getRelated: (id) => api.get(`/products/${id}/related`)
};

// Categories
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

// Cart
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, quantity) => api.patch(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart')
};

// Wishlist
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`)
};

// Orders
export const orderAPI = {
  getOrders: () => api.get('/orders'),
  createOrder: (data) => api.post('/orders', data)
};

// Users
export const userAPI = {
  updateProfile: (data) => api.patch('/users/me', data),
  getProfile: () => api.get('/users/me')
};

// Reviews
export const reviewAPI = {
  getProductReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (productId, data) => api.post(`/reviews/${productId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`)
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}`, data),
  getInventory: () => api.get('/admin/inventory'),
  getSalesReport: () => api.get('/admin/sales-report'),
  getProducts: () => api.get('/admin/products'),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  addProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`)
};

export default api;
