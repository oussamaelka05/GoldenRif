import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const categoryColors = {
  sedan: 'bg-blue-100 text-blue-700', suv: 'bg-green-100 text-green-700',
  sports: 'bg-red-100 text-red-700',  luxury: 'bg-purple-100 text-purple-700',
  van: 'bg-orange-100 text-orange-700', convertible: 'bg-pink-100 text-pink-700',
};

const MyCars = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCars = () => {
    setLoading(true);
    api.get('/my-cars').then(({ data }) => setCars(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCars(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('owner.myCars.deleteConfirm'))) return;
    setDeletingId(id);
    try {
      await api.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert(t('owner.myCars.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailable = async (car) => {
    try {
      const { data } = await api.put(`/cars/${car.id}`, { available: !car.available });
      setCars((prev) => prev.map((c) => (c.id === car.id ? data : c)));
    } catch {
      alert(t('owner.myCars.toggleFailed'));
    }
  };

  const available  = cars.filter((c) => c.available).length;
  const countLabel = `${cars.length} ${cars.length !== 1 ? t('owner.myCars.cars') : t('owner.myCars.car')} ${t('owner.myCars.listed')} · ${available} ${t('owner.myCars.available')}`;

  return (
    <OwnerLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('owner.myCars.title')}</h1>
          <p className="text-slate-500 mt-1">{countLabel}</p>
        </div>
        <Link to="/owner/cars/add"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30">
          <FiPlus size={14} /> {t('owner.myCars.addCar')}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse h-64" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCar className="text-amber-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('owner.myCars.noCars')}</h3>
          <p className="text-slate-500 mb-6">{t('owner.myCars.noCarsText')}</p>
          <Link to="/owner/cars/add"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all">
            <FiPlus size={16} /> {t('owner.myCars.listFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="relative h-48 bg-slate-100">
                {car.image_url ? (
                  <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCar className="text-slate-300 text-5xl" />
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[car.category] || 'bg-slate-100 text-slate-600'}`}>
                  {car.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-slate-900">{car.brand} {car.model}</h3>
                  <span className="text-amber-600 font-extrabold text-sm">${car.price_per_day}<span className="text-slate-400 font-normal">{t('owner.myCars.perDay')}</span></span>
                </div>
                <p className="text-slate-500 text-xs mb-3">{car.year} · {car.transmission} · {car.seats} {t('owner.myCars.seats')}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleAvailable(car)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      car.available ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {car.available ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                    {car.available ? t('owner.myCars.available') : t('owner.myCars.hidden')}
                  </button>
                  <div className="flex gap-1">
                    <Link to={`/owner/cars/${car.id}/edit`}
                      className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                      <FiEdit2 size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(car.id)}
                      disabled={deletingId === car.id}
                      className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </OwnerLayout>
  );
};

export default MyCars;
