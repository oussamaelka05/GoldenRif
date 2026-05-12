import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCar, FaWhatsapp } from 'react-icons/fa';
import {
  FiArrowLeft, FiMapPin, FiUsers, FiZap, FiDroplet, FiCalendar,
  FiUser, FiCheck, FiHeart, FiStar, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { waLink } from '../utils/whatsapp';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const categoryColors = {
  sedan: 'bg-blue-100 text-blue-700', suv: 'bg-green-100 text-green-700',
  sports: 'bg-red-100 text-red-700',  luxury: 'bg-purple-100 text-purple-700',
  van: 'bg-orange-100 text-orange-700', convertible: 'bg-pink-100 text-pink-700',
};

const Stars = ({ value, size = 16 }) => (
  <span className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((n) => (
      <FiStar key={n} size={size} fill={n <= Math.round(value) ? '#f59e0b' : 'none'} className={n <= Math.round(value) ? 'text-amber-400' : 'text-slate-300'} />
    ))}
  </span>
);

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [car, setCar]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unavailable, setUnavailable] = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [isFav, setIsFav]             = useState(false);
  const [imgIndex, setImgIndex]       = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover]   = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError]     = useState('');
  const [reviewDone, setReviewDone]       = useState(false);
  const userReview = user ? reviews.find((r) => r.user?.id === user.id) : null;

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(searchParams.get('start') || '');
  const [endDate, setEndDate]     = useState(searchParams.get('end')   || '');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError]     = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    setImgIndex(0);
    setReviewDone(false);
    setReviewRating(0);
    setReviewComment('');
    api.get(`/cars/${id}`)
      .then(({ data }) => setCar(data))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
    api.get(`/cars/${id}/unavailable`).then(({ data }) => setUnavailable(data)).catch(() => {});
    api.get(`/cars/${id}/reviews`).then(({ data }) => setReviews(data)).catch(() => {});
    if (user) {
      api.get('/favorites/ids').then(({ data }) => setIsFav(data.includes(parseInt(id))));
    }
  }, [id, user]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { setReviewError('Please select a star rating.'); return; }
    setReviewLoading(true);
    setReviewError('');
    try {
      const { data } = await api.post(`/cars/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setReviews((prev) => {
        const filtered = prev.filter((r) => r.user?.id !== user.id);
        return [data, ...filtered];
      });
      setReviewDone(true);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const toggleFav = async () => {
    if (!user) return;
    const { data } = await api.post(`/favorites/${id}`);
    setIsFav(data.saved);
  };

  const allImages = car
    ? (car.images?.length ? car.images.map((i) => i.image_url) : (car.image_url ? [car.image_url] : []))
    : [];

  const overlapsUnavailable = (start, end) => {
    if (!start || !end) return false;
    return unavailable.some((r) => start < r.end_date && end > r.start_date);
  };

  const offer = car?.active_offer || null;

  const effectivePrice = (() => {
    if (!car || !offer) return car?.price_per_day ?? 0;
    if (offer.discount_type === 'percentage') return car.price_per_day * (1 - offer.discount_value / 100);
    return Math.max(0, car.price_per_day - offer.discount_value);
  })();

  const offerLabel = offer
    ? offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `$${offer.discount_value} OFF/day`
    : null;

  const nights = startDate && endDate ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000) : 0;
  const total  = nights > 0 ? nights * effectivePrice : 0;

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!startDate || !endDate) { setBookingError('Please select both dates.'); return; }
    if (nights <= 0) { setBookingError('Return date must be after pick-up date.'); return; }
    if (overlapsUnavailable(startDate, endDate)) { setBookingError('These dates overlap with an existing booking.'); return; }
    setBookingError('');
    setBookingLoading(true);
    try {
      const payload = { car_id: car.id, start_date: startDate, end_date: endDate };
      if (offer) payload.offer_id = offer.id;
      await api.post('/bookings', payload);
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50"><Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-16 animate-pulse">
        <div className="bg-white rounded-2xl h-96 mb-6" />
        <div className="grid grid-cols-3 gap-6"><div className="col-span-2 bg-white rounded-2xl h-48" /><div className="bg-white rounded-2xl h-48" /></div>
      </div><Footer /></div>
  );

  if (notFound || !car) return (
    <div className="min-h-screen bg-slate-50 flex flex-col"><Navbar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <FaCar className="text-slate-300 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Car not found</h2>
        <Link to="/cars" className="text-amber-500 font-semibold hover:underline">← Back to all cars</Link>
      </div><Footer /></div>
  );

  const specs = [
    { icon: FiCalendar, label: t('detail.year'),         value: car.year },
    { icon: FiUsers,    label: t('detail.seats'),        value: car.seats },
    { icon: FiZap,      label: t('detail.transmission'), value: car.transmission },
    { icon: FiDroplet,  label: t('detail.fuel'),         value: car.fuel_type },
  ];

  const avgRating = car.reviews_avg_rating ? parseFloat(car.reviews_avg_rating) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
          <FiArrowLeft size={16} /> {t('detail.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative h-72 bg-slate-100">
                {allImages.length > 0 ? (
                  <img src={allImages[imgIndex]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FaCar className="text-slate-300 text-6xl" /></div>
                )}
                <span className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1 rounded-full capitalize ${categoryColors[car.category] || 'bg-slate-100 text-slate-600'}`}>
                  {car.category}
                </span>
                {offerLabel && !car.is_booked_now && (
                  <span className="absolute top-4 right-14 bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">{offerLabel}</span>
                )}
                {car.is_booked_now && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Currently Rented</span>
                )}
                {user && (
                  <button onClick={toggleFav}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
                    <FiHeart size={16} fill={isFav ? '#ef4444' : 'none'} className={isFav ? 'text-red-500' : 'text-slate-500'} />
                  </button>
                )}
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setImgIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white">
                      <FiChevronLeft size={16} />
                    </button>
                    <button onClick={() => setImgIndex((i) => (i + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white">
                      <FiChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button key={i} onClick={() => setImgIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {allImages.map((src, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">{car.brand} {car.model}</h1>
                    {car.location && (
                      <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><FiMapPin size={13} /> {car.location}</p>
                    )}
                    {avgRating && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Stars value={avgRating} size={14} />
                        <span className="text-sm font-semibold text-slate-700">{avgRating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({car.reviews_count} review{car.reviews_count !== 1 ? 's' : ''})</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {offer ? (
                      <>
                        <p className="text-slate-400 text-sm line-through">${car.price_per_day}/day</p>
                        <p className="text-2xl font-extrabold text-amber-500">${effectivePrice.toFixed(2)}</p>
                        <p className="text-slate-400 text-xs">per day · {offerLabel}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-extrabold text-amber-500">${car.price_per_day}</p>
                        <p className="text-slate-400 text-xs">per day</p>
                      </>
                    )}
                  </div>
                </div>
                {car.description && <p className="text-slate-600 text-sm leading-relaxed">{car.description}</p>}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-bold text-slate-900 mb-4">{t('detail.specs')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-4 bg-slate-50 rounded-xl">
                    <Icon className="mx-auto text-amber-500 mb-2" size={20} />
                    <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                    <p className="font-bold text-slate-800 capitalize text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">
                  {t('detail.reviews')} {reviews.length > 0 && <span className="text-slate-400 font-normal text-sm">({reviews.length})</span>}
                </h2>
                {avgRating && <div className="flex items-center gap-2"><Stars value={avgRating} size={14} /><span className="font-bold text-slate-700">{avgRating.toFixed(1)}</span></div>}
              </div>
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-sm mb-5">{t('detail.noReviews')}</p>
              ) : (
                <div className="space-y-5 mb-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {r.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm">{r.user?.name}</p>
                          <p className="text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <Stars value={r.rating} size={13} />
                      </div>
                      {r.comment && <p className="text-slate-600 text-sm leading-relaxed ml-11">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Review form — any logged-in user */}
              {user && !reviewDone && !userReview && (
                <form onSubmit={submitReview} className="border-t border-slate-100 pt-5">
                  <p className="text-sm font-bold text-slate-700 mb-3">{t('detail.writeReview')}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} type="button"
                        onMouseEnter={() => setReviewHover(n)} onMouseLeave={() => setReviewHover(0)}
                        onClick={() => setReviewRating(n)}
                        className="transition-transform hover:scale-110">
                        <FiStar size={26} fill={(reviewHover || reviewRating) >= n ? '#f59e0b' : 'none'}
                          className={(reviewHover || reviewRating) >= n ? 'text-amber-400' : 'text-slate-300'} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3}
                    placeholder={t('detail.reviewPlaceholder')}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 resize-none mb-3" />
                  {reviewError && <p className="text-red-500 text-xs mb-2">{reviewError}</p>}
                  <button type="submit" disabled={reviewLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                    {reviewLoading ? t('detail.submittingReview') : t('detail.submitReview')}
                  </button>
                </form>
              )}
              {user && (reviewDone || userReview) && (
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-sm text-green-600 font-semibold">{t('detail.reviewDone')}</p>
                </div>
              )}
              {!user && (
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-400">
                    <a href="/login" className="text-amber-500 font-semibold hover:underline">{t('detail.signInReview')}</a> {t('detail.signInReviewSuffix')}
                  </p>
                </div>
              )}
            </div>

            {/* Similar cars */}
            {car.similar_cars?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 mb-4">{t('detail.similarCars')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {car.similar_cars.map((sc) => (
                    <Link key={sc.id} to={`/cars/${sc.id}`}
                      className="group rounded-xl border border-slate-100 overflow-hidden hover:border-amber-300 transition-all">
                      <div className="h-24 bg-slate-100">
                        {sc.images?.length > 0 ? (
                          <img src={sc.images[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : sc.image_url ? (
                          <img src={sc.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><FaCar className="text-slate-300 text-2xl" /></div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="font-semibold text-slate-800 text-xs truncate">{sc.brand} {sc.model}</p>
                        <p className="text-amber-600 font-bold text-xs">${sc.price_per_day}/day</p>
                        {sc.reviews_avg_rating && (
                          <p className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                            <FiStar size={10} fill="#f59e0b" className="text-amber-400" />
                            {parseFloat(sc.reviews_avg_rating).toFixed(1)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — booking widget */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              {car.is_booked_now ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCalendar className="text-red-500" size={24} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">{t('detail.currentlyRented')}</h3>
                  <p className="text-slate-500 text-sm mb-1">{t('detail.activeRental')}</p>
                  {car.available_from && (
                    <p className="text-amber-600 font-semibold text-sm mb-4">{t('detail.availableFrom')} {car.available_from}</p>
                  )}
                  <Link to="/cars" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm text-center transition-all">
                    {t('detail.browseOthers')}
                  </Link>
                </div>
              ) : bookingSuccess ? (
                <div className="py-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <FiCheck className="text-green-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">{t('detail.requestSent')}</h3>
                      <p className="text-slate-500 text-xs">{t('detail.ownerConfirm')}</p>
                    </div>
                  </div>
                  {car.whatsapp && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('detail.contactOwner')}</p>
                      {car.owner && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {car.owner.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">{car.owner.name}</span>
                        </div>
                      )}
                      <a href={waLink(car.whatsapp, `Hi! I just submitted a booking request for your ${car.brand} ${car.model} on GoldenRif.`)}
                        target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                        <FaWhatsapp size={17} /> {t('detail.messageWA')}
                      </a>
                    </div>
                  )}
                  <Link to="/my-bookings" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm text-center transition-all">
                    {t('detail.viewBookings')}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    {offer ? (
                      <>
                        <p className="text-slate-400 text-sm line-through">${car.price_per_day}/day</p>
                        <p className="text-3xl font-extrabold text-slate-900">${effectivePrice.toFixed(2)}</p>
                        <p className="text-amber-500 text-xs font-bold">{offerLabel} · {offer.title}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-extrabold text-slate-900">${car.price_per_day}</p>
                        <p className="text-slate-500 text-sm">per day</p>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('detail.pickupDate')}</label>
                      <input type="date" min={today} value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value); setBookingError('');
                          if (endDate && overlapsUnavailable(e.target.value, endDate)) setBookingError('These dates overlap with an existing booking.');
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('detail.returnDate')}</label>
                      <input type="date" min={startDate || today} value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value); setBookingError('');
                          if (startDate && overlapsUnavailable(startDate, e.target.value)) setBookingError('These dates overlap with an existing booking.');
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    {unavailable.length > 0 && (
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <p className="font-semibold text-slate-500">{t('detail.alreadyBooked')}</p>
                        {unavailable.map((r, i) => <p key={i}>{r.start_date} → {r.end_date}</p>)}
                      </div>
                    )}
                  </div>

                  {nights > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm space-y-1">
                      {offer && (
                        <div className="flex justify-between text-slate-400 line-through">
                          <span>${car.price_per_day} × {nights} {nights !== 1 ? t('detail.nights') : t('detail.night')}</span>
                          <span>${(car.price_per_day * nights).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>${effectivePrice.toFixed(2)} × {nights} {nights !== 1 ? t('detail.nights') : t('detail.night')}</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      {offer && (
                        <div className="flex justify-between text-amber-600 text-xs">
                          <span>{offerLabel}</span>
                          <span>-${(car.price_per_day * nights - total).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1 mt-1">
                        <span>{t('detail.total')}</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {bookingError && (
                    <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{bookingError}</p>
                  )}

                  <button onClick={handleBook} disabled={bookingLoading}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 text-sm">
                    {bookingLoading ? t('detail.booking') : user ? t('detail.reserveNow') : t('detail.signInBook')}
                  </button>
                  <p className="text-center text-slate-400 text-xs mt-3">{t('detail.freeCancellation')}</p>
                </>
              )}
            </div>

            {car.owner && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-3">{t('detail.listedBy')}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                    {car.owner.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{car.owner.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><FiUser size={10} /> {t('detail.carOwner')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDetail;
