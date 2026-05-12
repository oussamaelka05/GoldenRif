import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiHeart, FiMapPin, FiUsers, FiZap } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const categoryColors = {
  sedan: 'bg-blue-100 text-blue-700', suv: 'bg-green-100 text-green-700',
  sports: 'bg-red-100 text-red-700',  luxury: 'bg-purple-100 text-purple-700',
  van: 'bg-orange-100 text-orange-700', convertible: 'bg-pink-100 text-pink-700',
};

const SavedCars = () => {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">{t('bookings.savedTitle')}</h1>
          <p className="text-slate-500 mt-1">
            {t('bookings.savedSubtitle')} — {cars.length} {cars.length !== 1 ? t('bookings.savedCounts') : t('bookings.savedCount')}.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <FiHeart className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{t('bookings.noSaved')}</h3>
            <p className="text-slate-400 mb-6">{t('bookings.noSavedText')}</p>
            <Link to="/cars" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              {t('bookings.browseCars')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                <Link to={`/cars/${car.id}`}>
                  <div className="relative h-44 bg-slate-100">
                    {car.images?.length > 0 ? (
                      <img src={car.images[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : car.image_url ? (
                      <img src={car.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><FaCar className="text-slate-300 text-4xl" /></div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[car.category] || ''}`}>
                      {car.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-0.5">{car.brand} {car.model}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><FiUsers size={11} /> {car.seats}</span>
                      <span className="flex items-center gap-1"><FiZap size={11} /> {car.transmission}</span>
                      {car.location && <span className="flex items-center gap-1"><FiMapPin size={11} /> {car.location}</span>}
                    </div>
                    <p className="text-amber-600 font-extrabold">${car.price_per_day}<span className="text-slate-400 font-normal text-xs">{t('featured.perDay')}</span></p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button onClick={() => remove(car.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
                    <FiHeart size={12} fill="currentColor" /> {t('bookings.removeFromSaved')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedCars;
