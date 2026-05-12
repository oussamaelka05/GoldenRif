import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiSearch, FiMapPin, FiUsers, FiZap, FiCalendar, FiX, FiHeart, FiStar, FiSliders } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const categories = ['all', 'sedan', 'suv', 'sports', 'luxury', 'van', 'convertible'];
const PRICE_MIN = 0;
const PRICE_MAX = 1000;

const categoryColors = {
  sedan: 'bg-blue-100 text-blue-700',
  suv: 'bg-green-100 text-green-700',
  sports: 'bg-red-100 text-red-700',
  luxury: 'bg-purple-100 text-purple-700',
  van: 'bg-orange-100 text-orange-700',
  convertible: 'bg-pink-100 text-pink-700',
};

const fmt = (d, locale) => d ? new Date(d + 'T00:00:00').toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const StarRating = ({ value, count }) => {
  if (!value) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
      <FiStar size={11} fill="currentColor" />
      {parseFloat(value).toFixed(1)}
      <span className="text-slate-400 font-normal">({count})</span>
    </span>
  );
};

const Cars = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch]       = useState(searchParams.get('search') || '');
  const [startDate, setStartDate] = useState(searchParams.get('start') || '');
  const [endDate, setEndDate]     = useState(searchParams.get('end') || '');
  const [category, setCategory]   = useState('all');
  const [cars, setCars]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [togglingId, setTogglingId]   = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filters
  const [priceMin, setPriceMin]       = useState('');
  const [priceMax, setPriceMax]       = useState('');
  const [seats, setSeats]             = useState('');
  const [fuelType, setFuelType]       = useState('');
  const [transmission, setTransmission] = useState('');
  const [sort, setSort]               = useState('newest');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setStartDate(searchParams.get('start') || '');
    setEndDate(searchParams.get('end') || '');
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      api.get('/favorites/ids').then(({ data }) => setFavoriteIds(new Set(data)));
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search)             params.search       = search;
    if (category !== 'all') params.category     = category;
    if (startDate)          params.start        = startDate;
    if (endDate)            params.end          = endDate;
    if (priceMin)           params.price_min    = priceMin;
    if (priceMax)           params.price_max    = priceMax;
    if (seats)              params.seats        = seats;
    if (fuelType)           params.fuel_type    = fuelType;
    if (transmission)       params.transmission = transmission;
    if (sort !== 'newest')  params.sort         = sort;
    api.get('/cars', { params })
      .then(({ data }) => setCars(data))
      .finally(() => setLoading(false));
  }, [search, category, startDate, endDate, priceMin, priceMax, seats, fuelType, transmission, sort]);

  const clearDates = () => {
    setStartDate('');
    setEndDate('');
    const next = new URLSearchParams(searchParams);
    next.delete('start');
    next.delete('end');
    setSearchParams(next);
  };

  const clearAdvanced = () => {
    setPriceMin(''); setPriceMax(''); setSeats('');
    setFuelType(''); setTransmission(''); setSort('newest');
  };

  const hasAdvanced = priceMin || priceMax || seats || fuelType || transmission || sort !== 'newest';

  const toggleFavorite = async (e, carId) => {
    e.preventDefault();
    if (!user) return;
    setTogglingId(carId);
    try {
      const { data } = await api.post(`/favorites/${carId}`);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        data.saved ? next.add(carId) : next.delete(carId);
        return next;
      });
    } finally {
      setTogglingId(null);
    }
  };

  const carLink = (id) => {
    const p = new URLSearchParams();
    if (startDate) p.set('start', startDate);
    if (endDate)   p.set('end', endDate);
    const qs = p.toString();
    return `/cars/${id}${qs ? `?${qs}` : ''}`;
  };

  const datesActive = startDate && endDate;
  const nights = datesActive ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero header */}
      <div className="bg-slate-900 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            {t('cars.title')} <span className="text-amber-400">{t('cars.titleHighlight')}</span>
          </h1>
          <p className="text-slate-400 mb-6">{t('cars.subtitle')}</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('cars.searchPlaceholder')}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input type="date" min={today} value={startDate}
                onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate(''); }}
                className="bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 text-sm w-full sm:w-auto"
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input type="date" min={startDate || today} value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-amber-500 text-sm w-full sm:w-auto"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${showFilters || hasAdvanced ? 'bg-amber-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-500'}`}
            >
              <FiSliders size={15} /> {t('cars.filters')} {hasAdvanced && '•'}
            </button>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="mt-4 bg-slate-800 border border-slate-700 rounded-2xl p-5 max-w-4xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('cars.minPrice')}</label>
                  <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="$0" className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('cars.maxPrice')}</label>
                  <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                    placeholder={t('cars.fuel.any')} className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('cars.minSeats')}</label>
                  <select value={seats} onChange={(e) => setSeats(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500">
                    <option value="">{t('cars.fuel.any')}</option>
                    {[2,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('cars.fuelType')}</label>
                  <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500">
                    <option value="">{t('cars.fuel.any')}</option>
                    <option value="petrol">{t('cars.fuel.petrol')}</option>
                    <option value="diesel">{t('cars.fuel.diesel')}</option>
                    <option value="electric">{t('cars.fuel.electric')}</option>
                    <option value="hybrid">{t('cars.fuel.hybrid')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('cars.transmission')}</label>
                  <select value={transmission} onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500">
                    <option value="">{t('cars.trans.any')}</option>
                    <option value="automatic">{t('cars.trans.automatic')}</option>
                    <option value="manual">{t('cars.trans.manual')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('cars.sortBy')}</label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-500">
                    <option value="newest">{t('cars.sort.newest')}</option>
                    <option value="price_asc">{t('cars.sort.priceAsc')}</option>
                    <option value="price_desc">{t('cars.sort.priceDesc')}</option>
                    <option value="rating">{t('cars.sort.rating')}</option>
                  </select>
                </div>
              </div>
              {hasAdvanced && (
                <button onClick={clearAdvanced} className="mt-3 text-xs text-amber-400 hover:underline">
                  {t('cars.clearFilters')}
                </button>
              )}
            </div>
          )}

          {datesActive && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full text-sm font-medium">
              <FiCalendar size={14} />
              {t('cars.available')} {fmt(startDate, locale)} → {fmt(endDate, locale)}
              {nights > 0 && <span className="text-amber-400/70">· {nights} {nights !== 1 ? t('cars.nights') : t('cars.night')}</span>}
              <button onClick={clearDates} className="ml-1 hover:text-white"><FiX size={14} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                category === cat ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600'
              }`}>
              {cat === 'all' ? t('cars.allCars') : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse h-72" />)}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <FaCar className="text-slate-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">{t('cars.noFound')}</h3>
            <p className="text-slate-400">
              {datesActive ? t('cars.noFoundDates') : t('cars.noFoundFilters')}
            </p>
            {(datesActive || hasAdvanced) && (
              <button onClick={() => { clearDates(); clearAdvanced(); }}
                className="mt-4 text-amber-500 font-semibold hover:underline text-sm">
                {t('cars.clearAll')}
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-6">
              {cars.length} {t('cars.available')}
              {datesActive && ` · ${fmt(startDate, locale)} – ${fmt(endDate, locale)}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <Link key={car.id} to={carLink(car.id)}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                  <div className="relative h-44 bg-slate-100">
                    {car.images?.length > 0 ? (
                      <img src={car.images[0].image_url} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : car.image_url ? (
                      <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><FaCar className="text-slate-300 text-4xl" /></div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[car.category] || 'bg-slate-100 text-slate-600'}`}>
                      {car.category}
                    </span>
                    {car.active_offer && (
                      <span className="absolute top-3 right-10 bg-amber-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                        {car.active_offer.discount_type === 'percentage' ? `${car.active_offer.discount_value}% OFF` : `$${car.active_offer.discount_value} OFF`}
                      </span>
                    )}
                    {user && (
                      <button
                        onClick={(e) => toggleFavorite(e, car.id)}
                        disabled={togglingId === car.id}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
                      >
                        <FiHeart size={14} className={favoriteIds.has(car.id) ? 'text-red-500 fill-red-500' : 'text-slate-400'} fill={favoriteIds.has(car.id) ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-0.5">{car.brand} {car.model}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-500 text-xs">{car.year}</p>
                      <StarRating value={car.reviews_avg_rating} count={car.reviews_count} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><FiUsers size={11} /> {car.seats}</span>
                      <span className="flex items-center gap-1"><FiZap size={11} /> {car.transmission}</span>
                      {car.location && <span className="flex items-center gap-1 truncate"><FiMapPin size={11} /> {car.location}</span>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        {car.active_offer ? (() => {
                          const offer = car.active_offer;
                          const disc = offer.discount_type === 'percentage'
                            ? car.price_per_day * (1 - offer.discount_value / 100)
                            : Math.max(0, car.price_per_day - offer.discount_value);
                          return (
                            <>
                              <span className="text-slate-400 text-xs line-through mr-1">${car.price_per_day}</span>
                              <span className="text-amber-600 font-extrabold">${disc.toFixed(2)}</span>
                              <span className="text-slate-400 font-normal text-xs">/day</span>
                              {datesActive && nights > 0 && <p className="text-xs text-slate-400">${(disc * nights).toFixed(0)} {t('cars.total')}</p>}
                            </>
                          );
                        })() : (
                          <>
                            <span className="text-amber-600 font-extrabold">${car.price_per_day}</span>
                            <span className="text-slate-400 font-normal text-xs">/day</span>
                            {datesActive && nights > 0 && <p className="text-xs text-slate-400">${(car.price_per_day * nights).toFixed(0)} {t('cars.total')}</p>}
                          </>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-amber-500 group-hover:underline">{t('cars.viewMore')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cars;
