import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTag, FiClock, FiMapPin, FiPercent, FiDollarSign } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const discountLabel = (offer) =>
  offer.discount_type === 'percentage'
    ? `${offer.discount_value}% OFF`
    : `$${offer.discount_value} OFF/day`;

const discountedPrice = (price, offer) => {
  if (offer.discount_type === 'percentage') {
    return price * (1 - offer.discount_value / 100);
  }
  return Math.max(0, price - offer.discount_value);
};

const SpecialOffers = () => {
  const { t, lang } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/offers')
      .then(({ data }) => setOffers(data))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  return (
    <PageLayout
      title={t('specialOffers.title')}
      subtitle={t('specialOffers.subtitle')}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 h-48 animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20">
          <FiTag className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-600 mb-2">{t('specialOffers.noOffers')}</h3>
          <p className="text-slate-400 text-sm mb-6">
            {t('specialOffers.noOffersText')}
          </p>
          <Link
            to="/cars"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            {t('specialOffers.browseAll')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {offers.map((offer) => {
              const car = offer.car;
              const newPrice = car ? discountedPrice(car.price_per_day, offer) : null;
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {car?.image_url && (
                    <div className="relative h-40 bg-slate-100">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                        {discountLabel(offer)}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {!car?.image_url && (
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                          {discountLabel(offer)}
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">{offer.title}</h3>

                    {car && (
                      <p className="text-slate-500 text-xs flex items-center gap-1 mb-2">
                        <FaCar size={11} /> {car.brand} {car.model}
                        {car.location && <><FiMapPin size={11} className="ml-2" /> {car.location}</>}
                      </p>
                    )}

                    {offer.description && (
                      <p className="text-slate-500 text-sm leading-relaxed mb-3">{offer.description}</p>
                    )}

                    {car && newPrice !== null && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-slate-400 text-sm line-through">${car.price_per_day}/day</span>
                        <span className="text-amber-600 font-extrabold text-lg">${newPrice.toFixed(2)}/day</span>
                        {offer.discount_type === 'percentage' ? (
                          <FiPercent size={14} className="text-amber-500" />
                        ) : (
                          <FiDollarSign size={14} className="text-amber-500" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FiClock size={12} />
                        {offer.valid_until ? `${t('specialOffers.until')} ${fmt(offer.valid_until)}` : t('specialOffers.noExpiry')}
                      </span>
                      {car && (
                        <Link
                          to={`/cars/${car.id}`}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          {t('specialOffers.bookNow')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm mb-4">
              {t('specialOffers.wantMore')}
            </p>
            <Link
              to="/cars"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              {t('specialOffers.browseAll')}
            </Link>
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default SpecialOffers;
