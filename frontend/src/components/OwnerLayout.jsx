import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiGrid, FiCalendar, FiDollarSign, FiTag, FiGlobe, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const OwnerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { key: 'dashboard', icon: FiGrid,        to: '/owner/dashboard' },
    { key: 'myCars',    icon: FaCar,          to: '/owner/cars' },
    { key: 'myOffers',  icon: FiTag,          to: '/owner/offers' },
    { key: 'bookings',  icon: FiCalendar,     to: '/owner/bookings' },
    { key: 'earnings',  icon: FiDollarSign,   to: '/owner/earnings' },
  ];

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch {}
    logout();
    navigate('/');
  };

  const Sidebar = () => (
    <aside className="h-full w-64 bg-slate-900 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <div className="bg-amber-500 p-2 rounded-xl">
          <FaCar className="text-white" />
        </div>
        <span className="text-white font-bold text-lg">
          Golden<span className="text-amber-400">Rif</span>
        </span>
      </div>

      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{user?.name}</p>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
              {t('owner.layout.carOwner')}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ key, icon: Icon, to }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-500/10 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={16} /> {t(`owner.layout.${key}`)}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800 space-y-1">
        <Link
          to="/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
        >
          <FiUser size={16} /> {t('owner.layout.profile')}
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 text-sm font-medium transition-colors"
        >
          <FiGlobe size={16} /> {t('owner.layout.visitWebsite')}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
        >
          <FiLogOut size={16} /> {t('owner.layout.signOut')}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden md:flex fixed top-0 left-0 h-full w-64 z-40">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg">
              <FaCar className="text-white text-sm" />
            </div>
            <span className="text-white font-bold">GoldenRif</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1">
            <FiMenu size={22} />
          </button>
        </div>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
