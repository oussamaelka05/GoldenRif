import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaWhatsapp } from 'react-icons/fa';
import {
  FiCalendar, FiMapPin, FiClock, FiX,
  FiHeart, FiUsers, FiZap,
} from 'react-icons/fi';
import { waLink } from '../utils/whatsapp';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const statusBadge = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const categoryColors = {
  sedan: 'bg-blue-100 text-blue-700', suv: 'bg-green-100 text-green-700',
  sports: 'bg-red-100 text-red-700',  luxury: 'bg-purple-100 text-purple-700',
  van: 'bg-orange-100 text-orange-700', convertible: 'bg-pink-100 text-pink-700',
};

/* ── Saved Cars tab ─────────────────────────────────────────────────── */
const SavedTab = () => {
  const { t } = useLanguage();
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites')
      .then(({ data }) => setCars(data))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (carId) => {
    await api.post(`/favorites/${carId}`);
    setCars((prev) => prev.filter((c) => c.id !== carId));
  };

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1,2,3,4].map((i) => <div key={i} className="bg-white rounded-2xl h-52 animate-pulse" />)}
    </div>
  );

  if (cars.length === 0) return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
      <FiHeart className="mx-auto text-slate-300 mb-3" size={40} />
      <h3 className="text-lg font-bold text-slate-700 mb-2">{t('bookings.noSaved')}</h3>
      <p className="text-slate-400 mb-6">{t('bookings.noSavedText')}</p>
      <Link to="/cars" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30">
        {t('bookings.browseCars')}
      </Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cars.map((car) => (
        <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
          <Link to={`/cars/${car.id}`}>
            <div className="relative h-40 bg-slate-100">
              {car.images?.length > 0 ? (
                <img src={car.images[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : car.image_url ? (
                <img src={car.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><FaCar className="text-slate-300 text-4xl" /></div>
              )}
              <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[car.category] || 'bg-slate-100 text-slate-600'}`}>
                {car.category}
              </span>
            </div>
            <div className="p-4 pb-2">
              <h3 className="font-bold text-slate-900 mb-0.5">{car.brand} {car.model}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1"><FiUsers size={11} /> {car.seats}</span>
                <span className="flex items-center gap-1"><FiZap size={11} /> {car.transmission}</span>
                {car.location && <span className="flex items-center gap-1"><FiMapPin size={11} /> {car.location}</span>}
              </div>
              <p className="text-amber-600 font-extrabold">${car.price_per_day}<span className="text-slate-400 font-normal text-xs">/day</span></p>
            </div>
          </Link>
          <div className="px-4 pb-4">
            <button onClick={() => remove(car.id)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors mt-1">
              <FiHeart size={12} fill="currentColor" /> {t('bookings.removeFromSaved')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── My Bookings tab ────────────────────────────────────────────────── */
const BookingsTab = () => {
  const { t } = useLanguage();
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    api.get('/my-bookings')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm(t('bookings.cancelConfirm'))) return;
    setCancellingId(id);
    try {
      const { data } = await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
    } catch {
      alert(t('bookings.cancelFailed'));
    } finally {
      setCancellingId(null);
    }
  };

  const nights = (start, end) => Math.round((new Date(end) - new Date(start)) / 86400000);

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
    </div>
  );

  if (bookings.length === 0) return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
      <FiCalendar className="mx-auto text-slate-300 mb-3" size={40} />
      <h3 className="text-lg font-bold text-slate-700 mb-2">{t('bookings.noBookings')}</h3>
      <p className="text-slate-400 mb-6">{t('bookings.noBookingsText')}</p>
      <Link to="/cars" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30">
        {t('bookings.browseCars')}
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const badgeCls = statusBadge[b.status] || statusBadge.pending;
        const statusLabel = t(`bookings.status.${b.status}`) || b.status;
        const n = nights(b.start_date, b.end_date);
        return (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex">
              <div className="w-28 sm:w-36 shrink-0 bg-slate-100">
                {b.car?.image_url ? (
                  <img src={b.car.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCar className="text-slate-300 text-2xl" />
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-slate-900">{b.car?.brand} {b.car?.model}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeCls}`}>{statusLabel}</span>
                  </div>
                  {b.car?.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <FiMapPin size={11} /> {b.car.location}
                    </p>
                  )}
                  <p className="text-slate-500 text-sm">
                    {b.start_date} → {b.end_date}
                    <span className="text-slate-400 ml-1">({n} {n !== 1 ? t('bookings.nights') : t('bookings.night')})</span>
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-amber-600 font-extrabold">${b.total_price}</span>
                  <div className="flex items-center gap-3">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <FiX size={12} /> {cancellingId === b.id ? t('bookings.cancelling') : t('bookings.cancel')}
                      </button>
                    )}
                    {b.car?.whatsapp && (
                      <a
                        href={waLink(b.car.whatsapp, `Hi! I have a booking for your ${b.car?.brand} ${b.car?.model} (${b.start_date} → ${b.end_date}).`)}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-green-500 hover:text-green-600 transition-colors"
                      >
                        <FaWhatsapp size={14} /> {t('bookings.whatsappOwner')}
                      </a>
                    )}
                    <Link to={`/cars/${b.car?.id}`} className="text-xs font-semibold text-slate-400 hover:text-amber-500 transition-colors">
                      {t('bookings.viewCar')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {b.status === 'confirmed' && b.car?.whatsapp && (
              <div className="border-t border-slate-100 px-4 py-3 bg-green-50 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {b.car.owner?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{b.car.owner?.name}</span>
                    <span className="text-slate-400 text-xs ml-1">· {t('bookings.ownerLabel')}</span>
                  </div>
                </div>
                <a
                  href={waLink(b.car.whatsapp, `Hi! My booking for your ${b.car.brand} ${b.car.model} (${b.start_date} to ${b.end_date}) is confirmed. I'd like to coordinate the pickup details.`)}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FaWhatsapp size={14} /> {t('bookings.whatsappOwner')}
                </a>
              </div>
            )}

            {b.status === 'pending' && (
              <div className="border-t border-slate-100 px-4 py-3 bg-yellow-50 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-yellow-700">
                  <FiClock size={13} className="shrink-0" />
                  {t('bookings.waitingOwner')}
                </div>
                {b.car?.whatsapp && (
                  <a
                    href={waLink(b.car.whatsapp, `Hi! I just submitted a booking request for your ${b.car.brand} ${b.car.model} (${b.start_date} to ${b.end_date}). Could you please confirm?`)}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FaWhatsapp size={14} /> {t('bookings.whatsappOwner')}
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── Page ───────────────────────────────────────────────────────────── */
const MyBookings = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState('bookings');

  const TABS = [
    { id: 'bookings', label: t('bookings.tabBookings'), icon: FiCalendar },
    { id: 'saved',    label: t('bookings.tabSaved'),    icon: FiHeart },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">{t('bookings.pageTitle')}</h1>
          <p className="text-slate-500 mt-1">{t('bookings.pageSubtitle')}</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-1 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-amber-500 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'bookings' ? <BookingsTab /> : <SavedTab />}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;
