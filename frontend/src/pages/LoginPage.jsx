import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/');
    }
  };

  const demoCredentials = [
    { email: 'admin@omcyclestore.com', password: 'Admin@123', label: 'Admin Login' },
    { email: 'customer@omcyclestore.com', password: 'Customer@123', label: 'Customer Login' }
  ];

  return (
    <section className="container-shell section-gap">
      <div className="mx-auto max-w-md glass-panel p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-3 text-sm text-brand-muted dark:text-brand-dark-muted">Sign in to access your profile, wishlist, and orders.</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); dispatch(clearError()); }}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-12 py-3 dark:border-slate-700"
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-12 py-3 pr-12 dark:border-slate-700"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked />
            Remember me
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <p className="mb-3 text-center text-sm font-medium text-brand-muted">Quick demo access</p>
          <p className="mb-3 text-center text-xs text-brand-muted dark:text-brand-dark-muted">
            Demo login works after the backend seed data is loaded.
          </p>
          <div className="space-y-2">
            {demoCredentials.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => setFormData({ email: demo.email, password: demo.password })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <span className="font-medium">{demo.label}:</span> {demo.email}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
            <FaGoogle />
            Google
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
            <FaFacebookF />
            Facebook
          </button>
        </div>
        <p className="mt-6 text-sm text-brand-muted dark:text-brand-dark-muted">
          New here? <Link to="/register" className="font-semibold text-brand-primary">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
