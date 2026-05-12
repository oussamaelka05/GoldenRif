import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'owner' ? '/owner/dashboard' : '/');
    } catch (err) {
      setError(
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex relative">
      <Link to="/" className="absolute top-5 left-5 z-10 flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors group">
        <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span> {t('login.backToSite')}
      </Link>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-amber-500 p-3 rounded-2xl"><FaCar className="text-white text-3xl" /></div>
            <span className="text-white text-4xl font-extrabold">Golden<span className="text-amber-400">Rif</span></span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{t('login.welcomeBack')}</h2>
          <p className="text-slate-400 text-lg max-w-sm">{t('login.welcomeDesc')}</p>
          <div className="flex justify-center gap-8 mt-12">
            {[['500+', t('login.vehicles')], ['10K+', t('login.clients')], ['4.9★', t('login.rating')]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-extrabold text-amber-400">{v}</div>
                <div className="text-sm text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="bg-amber-500 p-2 rounded-xl"><FaCar className="text-white text-lg" /></div>
            <span className="text-white text-2xl font-bold">Golden<span className="text-amber-400">Rif</span></span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">{t('login.title')}</h1>
          <p className="text-slate-400 mb-8">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold">{t('login.createOne')}</Link>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('login.email')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('login.password')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-11 pr-11 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 text-sm mt-2">
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-8">
            {t('login.terms')}{' '}
            <span className="text-slate-400 cursor-pointer hover:text-amber-400">{t('login.termsLink')}</span>
            {' '}{t('login.and')}{' '}
            <span className="text-slate-400 cursor-pointer hover:text-amber-400">{t('login.privacyLink')}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
