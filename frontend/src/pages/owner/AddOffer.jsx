import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const AddOffer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    car_id: '',
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    valid_from: '',
    valid_until: '',
  });

  useEffect(() => {
    api.get('/my-cars').then(({ data }) => {
      setCars(data);
      if (data.length > 0) setForm((f) => ({ ...f, car_id: data[0].id }));
    });
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.car_id) { setError(t('owner.addOffer.errCar')); return; }
    if (!form.title.trim()) { setError(t('owner.addOffer.errTitle')); return; }
    if (!form.discount_value || Number(form.discount_value) <= 0) {
      setError(t('owner.addOffer.errValue')); return;
    }
    if (form.discount_type === 'percentage' && Number(form.discount_value) > 99) {
      setError(t('owner.addOffer.errPct')); return;
    }

    setLoading(true);
    try {
      await api.post('/offers', {
        car_id:         Number(form.car_id),
        title:          form.title.trim(),
        description:    form.description.trim() || null,
        discount_type:  form.discount_type,
        discount_value: Number(form.discount_value),
        valid_from:     form.valid_from || null,
        valid_until:    form.valid_until || null,
      });
      navigate('/owner/offers');
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) {
        setError(Object.values(errs).flat().join(' '));
      } else {
        setError(err.response?.data?.message || t('owner.addOffer.errFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/owner/offers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors"
        >
          <FiArrowLeft size={15} /> {t('owner.addOffer.back')}
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{t('owner.addOffer.title')}</h1>
          <p className="text-slate-500 text-sm mb-6">{t('owner.addOffer.subtitle')}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Car selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {t('owner.addOffer.car')} *
              </label>
              {cars.length === 0 ? (
                <p className="text-sm text-slate-400">{t('owner.addOffer.noCars')}</p>
              ) : (
                <select
                  value={form.car_id}
                  onChange={set('car_id')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-amber-500 bg-white"
                >
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.year}) — ${car.price_per_day}/day
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {t('owner.addOffer.offerTitle')} *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                placeholder={t('owner.addOffer.titlePlaceholder')}
                maxLength={150}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {t('owner.addOffer.description')} <span className="text-slate-300 font-normal normal-case">{t('owner.addOffer.descOptional')}</span>
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder={t('owner.addOffer.descPlaceholder')}
                maxLength={500}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Discount type + value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('owner.addOffer.discountType')} *
                </label>
                <select
                  value={form.discount_type}
                  onChange={set('discount_type')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="percentage">{t('owner.addOffer.pctType')}</option>
                  <option value="fixed">{t('owner.addOffer.fixedType')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {form.discount_type === 'percentage' ? t('owner.addOffer.discountPct') : t('owner.addOffer.discountFixed')} *
                </label>
                <input
                  type="number"
                  value={form.discount_value}
                  onChange={set('discount_value')}
                  min={1}
                  max={form.discount_type === 'percentage' ? 99 : undefined}
                  step="0.01"
                  placeholder={form.discount_type === 'percentage' ? 'e.g. 20' : 'e.g. 15'}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Validity dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('owner.addOffer.validFrom')} <span className="text-slate-300 font-normal normal-case">{t('owner.addOffer.optional')}</span>
                </label>
                <input
                  type="date"
                  value={form.valid_from}
                  min={today}
                  onChange={set('valid_from')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('owner.addOffer.validUntil')} <span className="text-slate-300 font-normal normal-case">{t('owner.addOffer.optional')}</span>
                </label>
                <input
                  type="date"
                  value={form.valid_until}
                  min={form.valid_from || today}
                  onChange={set('valid_until')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {form.discount_value && form.car_id && (() => {
              const car = cars.find((c) => String(c.id) === String(form.car_id));
              if (!car || !form.discount_value) return null;
              const d = Number(form.discount_value);
              const newPrice = form.discount_type === 'percentage'
                ? car.price_per_day * (1 - d / 100)
                : Math.max(0, car.price_per_day - d);
              return (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                  <p className="text-slate-600">
                    {t('owner.addOffer.original')} <span className="line-through text-slate-400">${car.price_per_day}/day</span>
                    {' → '}
                    <span className="font-extrabold text-amber-600">${newPrice.toFixed(2)}/day</span>
                  </p>
                </div>
              );
            })()}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/owner/offers')}
                className="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-sm hover:bg-slate-50 transition-all"
              >
                {t('owner.addOffer.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || cars.length === 0}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30"
              >
                {loading ? t('owner.addOffer.creating') : t('owner.addOffer.create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default AddOffer;
