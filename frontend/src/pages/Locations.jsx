import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Locations = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars').then(({ data }) => {
      const map = {};
      data.forEach((car) => {
        const city = car.location?.trim() || 'Other';
        if (!map[city]) map[city] = [];
        map[city].push(car);
      });
      const sorted = Object.entries(map)
        .map(([city, cars]) => ({ city, cars }))
        .sort((a, b) => b.cars.length - a.cars.length);
      setGroups(sorted);
    }).finally(() => setLoading(false));
  }, []);

  const goToCity = (city) =>
    navigate(`/cars?search=${encodeURIComponent(city)}`);

  return (
    <PageLayout
      title={t('locations.title')}
      subtitle={t('locations.subtitle')}
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20">
          <FiMapPin className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-600 mb-2">{t('locations.noLocations')}</h3>
          <p className="text-slate-400 text-sm">{t('locations.noLocationsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map(({ city, cars }) => {
            const previews = cars.slice(0, 3).filter((c) => c.image_url);
            return (
              <button
                key={city}
                onClick={() => goToCity(city)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden text-left w-full"
              >
                <div className="relative h-36 bg-slate-100 flex">
                  {previews.length > 0 ? (
                    previews.map((car, i) => (
                      <div
                        key={car.id}
                        className="flex-1 overflow-hidden"
                        style={{ opacity: 1 - i * 0.15 }}
                      >
                        <img
                          src={car.image_url}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <FaCar className="text-slate-300 text-4xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white">
                    <FiMapPin size={13} />
                    <span className="font-extrabold text-base drop-shadow">{city}</span>
                  </div>
                </div>

                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    <span className="font-bold text-slate-900">{cars.length}</span>{' '}
                    {cars.length !== 1 ? t('locations.cars') : t('locations.car')} {t('locations.available')}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 text-xs font-bold group-hover:gap-2 transition-all">
                    {t('locations.view')} <FiArrowRight size={13} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default Locations;
