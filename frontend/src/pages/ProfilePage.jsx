import { Camera, User } from 'lucide-react';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userAPI } from '../services/api';
import { fetchCurrentUser, updateUser } from '../features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: ''
  });

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    return typeof avatar === 'string' ? avatar : avatar?.url;
  };

  const currentAvatar = avatarPreview || getAvatarUrl(user?.avatar);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 5MB' });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);

      // Send the file if one was selected
      if (selectedFile) {
        data.append('avatar', selectedFile);
      }

      const response = await userAPI.updateProfile(data);
      const updatedUser = response.data.user;

      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Directly update Redux state with new user data
      dispatch(updateUser(updatedUser));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setAvatarPreview(null);
      setSelectedFile(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <section className="container-shell section-gap">
        <div className="glass-panel p-8 text-center">
          <p className="text-lg font-semibold">Please log in to view your profile</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-shell section-gap grid gap-6 lg:grid-cols-[320px,1fr]">
      <aside className="glass-panel p-6 text-center">
        <div className="relative mx-auto inline-block">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
              <User size={40} className="text-slate-400" />
            </div>
          )}
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 rounded-full bg-brand-primary p-2 text-white shadow-lg hover:bg-brand-primary/90"
            title="Change photo"
          >
            <Camera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="mt-2 text-sm text-brand-muted dark:text-brand-dark-muted">{user.email}</p>
        <span className="mt-3 inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium capitalize text-brand-primary">
          {user.role}
        </span>
      </aside>

      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Profile information</h2>

        {message && (
          <div className={`mt-4 rounded-xl p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Full name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full name"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email address</label>
            <input
              value={formData.email}
              disabled
              placeholder="Email address"
              className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Phone number</label>
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">City</label>
            <input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>

        <div className="mt-10">
          <h3 className="text-xl font-bold">Address book</h3>
          <div className="mt-4 grid gap-4">
            {user.addresses?.map((address, index) => (
              <div key={index} className="rounded-[1.5rem] border border-slate-200 p-4 text-sm dark:border-slate-700">
                {address}
              </div>
            ))}
            {!user.addresses?.length && (
              <p className="text-sm text-brand-muted">No addresses saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}