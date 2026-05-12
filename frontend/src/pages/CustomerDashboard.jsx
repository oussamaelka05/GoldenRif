import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiCalendar, FiClock, FiMapPin, FiLogOut, FiGrid, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch {}
    logout();
    navigate('/');
  };

  const navItems = [
    { key: 'dashboard',   icon: FiGrid,     to: '/dashboard' },
    { key: 'myBookings',  icon: FiCalendar, to: '/my-bookings' },
    { key: 'profile',     icon: FiUser,     to: '/profile' },
  ];

  const cards = [
    { label: t('customer.totalBookings'), value: stats?.total    ?? '—', Icon: FaCar,       color: 'bg-blue-500' },
    { label: t('customer.upcoming'),      value: stats?.upcoming ?? '—', Icon: FiCalendar,  color: 'bg-amber-500' },
    { label: t('customer.pending'),       value: stats?.pending  ?? '—', Icon: FiClock,     color: 'bg-yellow-500' },
    { label: t('customer.cities'),        value: stats?.cities   ?? '—', Icon: FiMapPin,    color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 flex flex-col z-40">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
          <div className="bg-amber-500 p-2 rounded-xl">
            <FaCar className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">
            Drive<span className="text-amber-400">Luxe</span>
          </span>
        </div>

        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                {t('customer.renterBadge')}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ key, icon: Icon, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              <Icon size={16} /> {t(`customer.nav.${key}`)}
            </Link>
          ))}
          <Link
            to="/cars"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            <FaCar size={16} /> {t('customer.browseCars')}
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
          >
            <FiLogOut size={16} /> {t('customer.signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {t('customer.welcome')} {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 mt-1">{t('customer.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {cards.map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="text-white text-xl" />
              </div>
              {loading ? (
                <div className="h-8 bg-slate-100 rounded-lg animate-pulse w-12 mb-2" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              )}
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/my-bookings"
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-amber-300 transition-all group"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <FiCalendar className="text-amber-500" size={18} />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{t('customer.viewBookings')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('customer.viewBookingsText')}</p>
          </Link>
          <Link
            to="/profile"
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-amber-300 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <FiUser className="text-blue-500" size={18} />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{t('customer.editProfile')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('customer.editProfileText')}</p>
          </Link>
        </div>

        {/* Browse CTA */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCar className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t('customer.findCar')}</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            {t('customer.findCarText')}
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30"
          >
            <FaCar size={16} /> {t('customer.browseCars')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
