import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const Earnings = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/owner/earnings')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const nights = (start, end) => Math.round((new Date(end) - new Date(start)) / 86400000);

  if (loading) {
    return (
      <OwnerLayout>
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl h-28" />)}
          </div>
          <div className="bg-white rounded-2xl h-64" />
        </div>
      </OwnerLayout>
    );
  }

  const stats = [
    { label: t('owner.earnings.totalEarned'), value: `$${data?.total ?? 0}`, Icon: FiDollarSign, color: 'bg-green-500', sub: t('owner.earnings.allTime') },
    { label: t('owner.earnings.thisMonth'), value: `$${data?.this_month ?? 0}`, Icon: FiTrendingUp, color: 'bg-amber-500', sub: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) },
    { label: t('owner.earnings.paidBookings'), value: data?.count ?? 0, Icon: FiCalendar, color: 'bg-blue-500', sub: t('owner.earnings.confirmedLabel') },
  ];

  return (
    <OwnerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">{t('owner.earnings.title')}</h1>
        <p className="text-slate-500 mt-1">{t('owner.earnings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="text-white text-lg" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5">{t('owner.earnings.confirmedBookings')}</h2>
        {!data?.bookings?.length ? (
          <div className="text-center py-12">
            <FiDollarSign className="mx-auto text-slate-300 mb-3" size={36} />
            <p className="text-slate-500">{t('owner.earnings.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.bookings.map((b) => {
              const n = nights(b.start_date, b.end_date);
              return (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{b.car?.brand} {b.car?.model}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {b.user?.name} · {b.start_date} → {b.end_date}
                      <span className="text-slate-400 ml-1">({n} {n !== 1 ? t('owner.earnings.nights') : t('owner.earnings.night')})</span>
                    </p>
                  </div>
                  <span className="font-extrabold text-green-600">${b.total_price}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default Earnings;
