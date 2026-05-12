import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name:                  user?.name || '',
    email:                 user?.email || '',
    whatsapp:              user?.whatsapp || '',
    password:              '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        name:     form.name,
        email:    form.email,
        whatsapp: form.whatsapp || null,
      };
      if (form.password) {
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      const { data } = await api.put('/profile', payload);
      updateUser(data);
      setForm((prev) => ({ ...prev, password: '', password_confirmation: '' }));
      setSaved(true);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">{t('profile.title')}</h1>
          <p className="text-slate-500 mt-1">{t('profile.subtitle')}</p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            {t('profile.savedMsg')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t('profile.title')}</h2>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t('profile.name')}</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 text-slate-800 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t('profile.email')}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 text-slate-800 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {t('profile.whatsapp')}
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+212600000000"
                  className="w-full bg-white border border-slate-200 text-slate-800 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp[0]}</p>}
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t('profile.newPassword')}</h2>
            <p className="text-xs text-slate-400">{t('profile.passwordHint')}</p>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t('profile.newPassword')}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full bg-white border border-slate-200 text-slate-800 pl-9 pr-10 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t('profile.confirmPassword')}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                  className="w-full bg-white border border-slate-200 text-slate-800 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 text-sm"
          >
            <FiSave size={15} />
            {loading ? t('profile.saving') : t('profile.save')}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
