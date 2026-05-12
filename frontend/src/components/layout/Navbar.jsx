import { Heart, Menu, Search, ShoppingCart, User2, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../shared/ThemeToggle';
import { logout } from '../../features/auth/authSlice';

// Helper to get avatar URL from avatar object
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  return typeof avatar === 'string' ? avatar : avatar?.url;
};

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/orders', label: 'Orders' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowUserMenu(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-200/80 bg-white/90 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/85' : 'bg-transparent'
      }`}
    >
      <div className="container-shell">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-200 p-2 lg:hidden dark:border-slate-700"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <Menu size={18} />
            </button>
            <Link to="/" className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-primary px-3 py-2 text-sm font-extrabold text-white shadow-soft">
                OM
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight">OmcycleStore</p>
                <p className="text-xs text-brand-muted dark:text-brand-dark-muted">Premium everyday shopping</p>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 lg:flex">
            <div className="mx-auto flex w-full max-w-xl items-center rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <Search size={18} className="text-brand-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, brands, categories"
                className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-brand-muted"
              />
            </div>
          </form>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-brand-primary' : 'text-brand-text dark:text-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-brand-primary' : 'text-brand-text dark:text-slate-100'}`}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/wishlist" className="relative rounded-full border border-slate-200 p-2 dark:border-slate-700">
              <Heart size={18} />
              {!!wishlistCount && (
                <span className="absolute -right-1 -top-1 rounded-full bg-brand-primary px-1.5 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative rounded-full border border-slate-200 p-2 dark:border-slate-700">
              <ShoppingCart size={18} />
              {!!totalItems && (
                <span className="absolute -right-1 -top-1 rounded-full bg-brand-secondary px-1.5 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 dark:border-slate-700"
                >
                  {user?.avatar ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-4 pb-2 dark:border-slate-700">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-brand-muted">{user?.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-brand-primary">
                        {user?.role}
                      </span>
                    </div>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                      My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                      My Orders
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="rounded-full border border-slate-200 p-2 dark:border-slate-700">
                <User2 size={18} />
              </Link>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="glass-panel mb-4 space-y-4 p-4 lg:hidden">
            <form onSubmit={handleSearch}>
              <div className="flex items-center rounded-full border border-slate-200 px-4 py-3 dark:border-slate-700">
                <Search size={18} className="text-brand-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  className="ml-3 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </form>
            {isAuthenticated ? (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{user?.name}</p>
                  <p className="truncate text-xs text-brand-muted dark:text-brand-dark-muted">{user?.email}</p>
                </div>
              </div>
            ) : null}
            <div className="grid gap-2">
              {[...navLinks, ...(isAuthenticated && user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : [])].map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    My Profile
                  </NavLink>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Login / Register
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}