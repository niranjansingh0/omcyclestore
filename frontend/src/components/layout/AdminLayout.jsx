import { LayoutDashboard, Package, PlusCircle, Settings, Menu, X } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/products', label: 'Store View', icon: Package },
];

// Helper to get avatar URL
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  return typeof avatar === 'string' ? avatar : avatar?.url;
};

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Mobile sidebar toggle button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-full bg-brand-primary p-3 text-white shadow-lg lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container-shell section-gap grid gap-4 sm:gap-6 lg:grid-cols-[220px,1fr]">
        <aside className={`glass-panel h-fit p-4 sm:p-5 lg:!block ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-64 sm:w-72 overflow-y-auto' : 'hidden'}`}>
          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="mb-4 ml-auto flex lg:hidden"
          >
            <X size={20} />
          </button>

          {/* User Profile Card */}
          <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-800">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user?.name}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-brand-primary text-sm sm:text-lg font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-xs sm:text-sm">{user?.name || 'Admin'}</p>
              <p className="text-[10px] sm:text-xs text-brand-muted dark:text-brand-dark-muted truncate">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-brand-secondary px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white capitalize">
                {user?.role || 'admin'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-brand-primary">Admin Panel</p>
          <div className="mt-3 sm:mt-5 space-y-1 sm:space-y-2">
            {adminLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-secondary text-white'
                      : 'text-brand-muted hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        </aside>
        <section className="glass-panel p-4 sm:p-6 lg:p-7">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
