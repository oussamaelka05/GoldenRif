import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiGrid, FiCalendar, FiUser, FiBell, FiGlobe } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const navLinks = [
  { key: 'home',    to: '/' },
  { key: 'cars',    to: '/cars' },
  { key: 'about',   to: '/about' },
  { key: 'contact', to: '/about#contact' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, switchLang, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]           = useState(false);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [scrolled, setScrolled]           = useState(false);
  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => api.get('/notifications/unread-count').then(({ data }) => setUnread(data.count)).catch(() => {});
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const openNotifications = async () => {
    setNotifOpen((v) => !v);
    if (!notifOpen) {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      if (unread > 0) {
        await api.put('/notifications/read-all');
        setUnread(0);
      }
    }
  };

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch {}
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-amber-500 p-2 rounded-xl group-hover:bg-amber-600 transition-colors">
              <FaCar className="text-white text-lg" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              Golden<span className="text-amber-400">Rif</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ key, to }) => (
              <Link key={key} to={to} className="text-gray-300 hover:text-amber-400 transition-colors text-sm font-medium">
                {t(`nav.${key}`)}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">

            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => switchLang('en')}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs font-bold transition-colors ${lang === 'en' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <FiGlobe size={11} /> EN
              </button>
              <button
                onClick={() => switchLang('fr')}
                className={`px-2 py-1.5 text-xs font-bold transition-colors ${lang === 'fr' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                FR
              </button>
            </div>

            {user && (
              <div className="relative" ref={notifRef}>
                <button onClick={openNotifications}
                  className="relative p-2 text-slate-400 hover:text-white transition-colors">
                  <FiBell size={18} />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                      <p className="text-white font-semibold text-sm">{t('nav.notifications')}</p>
                      <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-white"><FiX size={14} /></button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">{t('nav.noNotifications')}</p>
                      ) : notifications.map((n) => {
                        const d = n.data || {};
                        const fill = (str) => str
                          .replace('{name}',  d.renter_name || '')
                          .replace('{brand}', d.car_brand   || '')
                          .replace('{model}', d.car_model   || '');
                        let title = n.title;
                        let body  = n.body;
                        if (d.type === 'new_booking') {
                          title = t('nav.notif.newBookingTitle');
                          body  = fill(t('nav.notif.newBookingBody'));
                        } else if (d.type === 'booking_confirmed') {
                          title = t('nav.notif.confirmedTitle');
                          body  = fill(t('nav.notif.confirmedBody'));
                        } else if (d.type === 'booking_declined') {
                          title = t('nav.notif.declinedTitle');
                          body  = fill(t('nav.notif.declinedBody'));
                        }
                        return (
                        <div key={n.id} className={`px-4 py-3 border-b border-slate-700/50 last:border-0 ${!n.read_at ? 'bg-slate-700/30' : ''}`}>
                          <p className="text-white text-sm font-medium">{title}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{body}</p>
                          <p className="text-slate-500 text-xs mt-1">{new Date(n.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl transition-all"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role === 'owner' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.role === 'owner' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.role === 'owner' ? t('nav.ownerBadge') : t('nav.renterBadge')}
                  </span>
                  <FiChevronDown className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={14} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                    {user.role === 'owner' && (
                      <Link to="/owner/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors">
                        <FiGrid size={14} /> {t('nav.dashboard')}
                      </Link>
                    )}
                    {user.role === 'customer' && (
                      <>
                        <Link to="/my-bookings" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors">
                          <FiCalendar size={14} /> {t('nav.myBookings')}
                        </Link>
                        <Link to="/profile" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors">
                          <FiUser size={14} /> {t('nav.profile')}
                        </Link>
                      </>
                    )}
                    {user.role === 'owner' && (
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors">
                        <FiUser size={14} /> {t('nav.profile')}
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-300 hover:text-red-400 hover:bg-red-500/10 text-sm transition-colors">
                      <FiLogOut size={14} /> {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30">
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4">
          {navLinks.map(({ key, to }) => (
            <Link key={key} to={to}
              className="block text-gray-300 hover:text-amber-400 py-3 text-sm font-medium border-b border-slate-800 last:border-0"
              onClick={() => setMenuOpen(false)}>
              {t(`nav.${key}`)}
            </Link>
          ))}
          {/* Mobile language switcher */}
          <div className="flex gap-2 py-3 border-b border-slate-800">
            <button onClick={() => switchLang('en')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${lang === 'en' ? 'bg-amber-500 text-white' : 'border border-slate-600 text-slate-400'}`}>
              🇬🇧 English
            </button>
            <button onClick={() => switchLang('fr')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${lang === 'fr' ? 'bg-amber-500 text-white' : 'border border-slate-600 text-slate-400'}`}>
              🇫🇷 Français
            </button>
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            {user ? (
              <>
                {user.role === 'owner' && (
                  <Link to="/owner/dashboard" className="flex-1 border border-slate-600 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium text-center" onClick={() => setMenuOpen(false)}>
                    {t('nav.dashboard')}
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link to="/my-bookings" className="flex-1 border border-slate-600 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium text-center" onClick={() => setMenuOpen(false)}>
                    {t('nav.myBookings')}
                  </Link>
                )}
                <Link to="/profile" className="flex-1 border border-slate-600 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium text-center" onClick={() => setMenuOpen(false)}>
                  {t('nav.profile')}
                </Link>
                <button onClick={handleLogout} className="flex-1 bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold">
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex-1 border border-slate-600 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium text-center" onClick={() => setMenuOpen(false)}>
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" className="flex-1 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
