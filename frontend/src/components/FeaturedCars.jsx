import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiZap, FiMapPin } from 'react-icons/fi';
import { FaGasPump, FaCar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const categories = ['all', 'sedan', 'suv', 'sports', 'luxury', 'van', 'convertible'];

const categoryBadge = {
  sedan: 'bg-blue-100 text-blue-700', suv: 'bg-green-100 text-green-700',
  sports: 'bg-red-100 text-red-700',  luxury: 'bg-purple-100 text-purple-700',
  van: 'bg-orange-100 text-orange-700', convertible: 'bg-pink-100 text-pink-700',
};

const FeaturedCars = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState('all');
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars').then(({ data }) => setAllCars(data)).finally(() => setLoading(false));
  }, []);

  const countFor  = (cat) => cat === 'all' ? allCars.length : allCars.filter((c) => c.category === cat).length;
  const filtered  = active === 'all' ? allCars : allCars.filter((c) => c.category === active);
  const displayed = filtered.slice(0, 9);

  return (
    <section id="cars" className="py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">{t('featured.tag')}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">{t('featured.title')}</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">{t('featured.subtitle')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 flex items-center gap-1.5 ${
                active === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}>
              {cat === 'all' ? t('featured.all') : cat}
              {!loading && (
                <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 leading-none ${
                  active === cat ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {countFor(cat)}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map((i) => <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse h-80" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <FaCar className="text-slate-300 text-5xl mx-auto mb-3" />
            <p className="text-slate-500">{t('featured.noCars')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((car) => (
              <Link key={car.id} to={`/cars/${car.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group">
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  {car.image_url ? (
                    <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FaCar className="text-slate-300 text-5xl" /></div>
                  )}
                  <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full capitalize ${categoryBadge[car.category] || 'bg-gray-100 text-gray-700'}`}>
                    {car.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {car.brand} {car.model} <span className="text-slate-400 font-normal text-sm">({car.year})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                      <FiUsers size={11} /> {car.seats} {t('featured.seats')}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                      <FiZap size={11} /> {car.transmission}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                      <FaGasPump size={11} /> {car.fuel_type}
                    </span>
                    {car.location && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                        <FiMapPin size={11} /> {car.location}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900">${car.price_per_day}</span>
                      <span className="text-slate-400 text-sm">{t('featured.perDay')}</span>
                    </div>
                    <span className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 group-hover:shadow-lg group-hover:shadow-amber-500/30">
                      {t('featured.view')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <Link to="/cars"
            className="inline-block border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 text-sm">
            {t('featured.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
