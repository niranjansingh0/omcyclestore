import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <section className="container-shell section-gap">
      <div className="mx-auto max-w-md glass-panel p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>
        <p className="mt-3 text-sm text-brand-muted dark:text-brand-dark-muted">Join us for exclusive deals and a personalized shopping experience.</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); dispatch(clearError()); }}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-12 py-3 dark:border-slate-700"
              required
            />
          </div>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-12 py-3 dark:border-slate-700"
              required
            />
          </div>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-12 py-3 dark:border-slate-700"
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
              minLength={6}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            I agree to the Terms of Service and Privacy Policy
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

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
          Already have an account? <Link to="/login" className="font-semibold text-brand-primary">Sign in</Link>
        </p>
      </div>
    </section>
  );
}