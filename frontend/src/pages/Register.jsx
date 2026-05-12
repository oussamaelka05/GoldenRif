import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaUserTie } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiPhone } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const roleIcons = [FaUserTie, FaCar];
const roleColors = ['amber', 'blue'];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const roles = t('register.roles').map((r, i) => ({
    ...r,
    value:  i === 0 ? 'owner' : 'customer',
    Icon:   roleIcons[i],
    color:  roleColors[i],
  }));

  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', whatsapp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setErrors({ role: t('register.roleError') });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post('/register', { ...form, role });
      login(data.user, data.token);
      navigate(data.user.role === 'owner' ? '/owner/dashboard' : '/');
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      setErrors(serverErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 relative">
      <Link to="/" className="absolute top-5 left-5 flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors group">
        <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span> {t('register.backToSite')}
      </Link>
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-amber-500 p-2.5 rounded-xl">
            <FaCar className="text-white text-xl" />
          </div>
          <span className="text-white text-2xl font-extrabold">
            Golden<span className="text-amber-400">Rif</span>
          </span>
        </div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8">
          <h1 className="text-2xl font-extrabold text-white text-center mb-1">{t('register.title')}</h1>
          <p className="text-slate-400 text-sm text-center mb-8">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
              {t('register.signIn')}
            </Link>
          </p>

          {/* Role Selection */}
          <div className="mb-7">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {t('register.iam')}
            </p>
            {errors.role && (
              <p className="text-red-400 text-xs mb-3">{errors.role}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {roles.map(({ value, Icon, title, subtitle, desc, color }) => {
                const selected = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                      selected
                        ? color === 'amber'
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                    }`}
                  >
                    {selected && (
                      <span
                        className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                          color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      >
                        <FiCheck size={11} strokeWidth={3} />
                      </span>
                    )}

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                        selected
                          ? color === 'amber'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <Icon className="text-white text-lg" />
                    </div>

                    <p className="font-bold text-white text-sm mb-0.5">{title}</p>
                    <p
                      className={`text-xs font-medium mb-2 ${
                        selected
                          ? color === 'amber'
                            ? 'text-amber-400'
                            : 'text-blue-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {subtitle}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('register.name')}
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('register.namePlaceholder')}
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('register.email')}
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t('register.whatsapp')} <span className="text-slate-600 normal-case font-normal">{t('register.whatsappOptional')}</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+212600000000"
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                />
              </div>
              {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {t('register.password')}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={t('register.passwordPlaceholder')}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {t('register.confirm')}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder={t('register.confirmPlaceholder')}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 text-sm mt-2"
            >
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
