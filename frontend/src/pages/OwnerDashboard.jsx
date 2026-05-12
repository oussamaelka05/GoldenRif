import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiPlus, FiCalendar, FiDollarSign, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import OwnerLayout from '../components/OwnerLayout';
import api from '../services/api';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/owner/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const cards = [
    { label: t('owner.dashboard.myCarsListed'),  value: stats?.cars ?? '…',                      Icon: FaCar,        color: 'bg-amber-500' },
    { label: t('owner.dashboard.activeBookings'), value: stats?.active_bookings ?? '…',            Icon: FiCalendar,   color: 'bg-blue-500' },
    { label: t('owner.dashboard.totalEarnings'),  value: stats ? `$${stats.total_earnings}` : '…', Icon: FiDollarSign, color: 'bg-green-500' },
    { label: t('owner.dashboard.avgRating'),      value: '—',                                       Icon: FiStar,       color: 'bg-purple-500' },
  ];

  const noCars = stats?.cars === 0;

  return (
    <OwnerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          {t('owner.dashboard.welcome')} {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">{t('owner.dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="text-white text-xl" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {noCars ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCar className="text-amber-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('owner.dashboard.noCars')}</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">{t('owner.dashboard.noCarsText')}</p>
          <Link
            to="/owner/cars/add"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
          >
            <FiPlus size={16} /> {t('owner.dashboard.listFirst')}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t('owner.dashboard.quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/owner/cars/add"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30">
              <FiPlus size={14} /> {t('owner.dashboard.addNew')}
            </Link>
            <Link to="/owner/cars"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
              <FaCar size={14} /> {t('owner.dashboard.manageCars')}
            </Link>
            <Link to="/owner/bookings"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
              <FiCalendar size={14} /> {t('owner.dashboard.viewBookings')}
            </Link>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default OwnerDashboard;
