import React, { useEffect, useState } from 'react';
import { FiCalendar, FiCheck, FiX, FiMessageCircle } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { waLink } from '../../utils/whatsapp';

const statusStyles = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const Bookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const filterKeys = ['all', 'pending', 'confirmed', 'cancelled'];

  useEffect(() => {
    api.get('/owner/bookings')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { data } = await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
    } catch {
      alert(t('owner.bookings.updateFailed'));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const nights = (start, end) => Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

  const totalLabel = `${bookings.length} ${bookings.length !== 1 ? t('owner.bookings.bookings') : t('owner.bookings.booking')} ${t('owner.bookings.total')}`;

  return (
    <OwnerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">{t('owner.bookings.title')}</h1>
        <p className="text-slate-500 mt-1">{totalLabel}</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filterKeys.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              filter === f ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'
            }`}>
            {t(`owner.bookings.${f === 'all' ? 'all' : f}`)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bookings.filter((b) => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <FiCalendar className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500 font-medium">{t('owner.bookings.noBookings')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const n = nights(b.start_date, b.end_date);
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-slate-900">{b.car?.brand} {b.car?.model}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusStyles[b.status]}`}>
                        {t(`owner.bookings.${b.status}`)}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                      <span className="font-medium text-slate-700">{b.user?.name}</span>
                      <span className="text-slate-400 mx-1">·</span>
                      {b.start_date} → {b.end_date}
                      <span className="text-slate-400 mx-1">·</span>
                      {n} {n !== 1 ? t('owner.bookings.nights') : t('owner.bookings.night')}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <p className="text-xs text-slate-400">{b.user?.email}</p>
                      {b.user?.whatsapp && (
                        <a href={waLink(b.user.whatsapp, `Hi ${b.user.name}! This is regarding your booking for ${b.car?.brand} ${b.car?.model} (${b.start_date} to ${b.end_date}).`)}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                          <FiMessageCircle size={11} /> {t('owner.bookings.whatsappRenter')}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-amber-600 font-extrabold text-lg">${b.total_price}</span>
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(b.id, 'confirmed')} disabled={updatingId === b.id}
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                          <FiCheck size={13} /> {t('owner.bookings.confirm')}
                        </button>
                        <button onClick={() => updateStatus(b.id, 'cancelled')} disabled={updatingId === b.id}
                          className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                          <FiX size={13} /> {t('owner.bookings.decline')}
                        </button>
                      </div>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => updateStatus(b.id, 'cancelled')} disabled={updatingId === b.id}
                        className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50">
                        {t('owner.bookings.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </OwnerLayout>
  );
};

export default Bookings;
