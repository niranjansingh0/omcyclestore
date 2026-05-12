import { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { fetchCart } from './features/cart/cartSlice';
import { fetchWishlist } from './features/wishlist/wishlistSlice';
import { fetchCategories, fetchProducts } from './features/products/productSlice';
import { fetchCurrentUser, logout } from './features/auth/authSlice';
import { isAuthenticated, isAdmin } from './utils/auth';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
};

function AnimatedRoute({ children }) {
  return (
    <Suspense fallback={<div className="container-shell py-16 text-sm text-brand-muted dark:text-brand-dark-muted">Loading...</div>}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
}

function ProtectedRoute({ children, requireAdmin = false }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const { isAuthenticated: authState } = useSelector((state) => state.auth);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ limit: 60 }));

    if (isAuthenticated()) {
      dispatch(fetchCurrentUser());
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, authState]);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route index element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
            <Route path="/products" element={<AnimatedRoute><ProductsPage /></AnimatedRoute>} />
            <Route path="/product/:id" element={<AnimatedRoute><ProductDetailsPage /></AnimatedRoute>} />
            <Route path="/cart" element={<AnimatedRoute><CartPage /></AnimatedRoute>} />
            <Route path="/wishlist" element={<AnimatedRoute><WishlistPage /></AnimatedRoute>} />
            <Route path="/checkout" element={<AnimatedRoute><ProtectedRoute><CheckoutPage /></ProtectedRoute></AnimatedRoute>} />
            <Route path="/login" element={<AnimatedRoute><PublicOnlyRoute><LoginPage /></PublicOnlyRoute></AnimatedRoute>} />
            <Route path="/register" element={<AnimatedRoute><PublicOnlyRoute><RegisterPage /></PublicOnlyRoute></AnimatedRoute>} />
            <Route path="/profile" element={<AnimatedRoute><ProtectedRoute><ProfilePage /></ProtectedRoute></AnimatedRoute>} />
            <Route path="/orders" element={<AnimatedRoute><ProtectedRoute><OrdersPage /></ProtectedRoute></AnimatedRoute>} />
          </Route>
          <Route path="/admin" element={<AnimatedRoute><ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute></AnimatedRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage mode="list" />} />
            <Route path="products/new" element={<AdminProductsPage mode="create" />} />
            <Route path="products/:id" element={<AdminProductsPage mode="edit" />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="*" element={<AnimatedRoute><NotFoundPage /></AnimatedRoute>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
