import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const initialForm = {
  brand: '', model: '', year: new Date().getFullYear(),
  category: 'sedan', price_per_day: '', seats: 5,
  transmission: 'automatic', fuel_type: 'petrol',
  location: '', whatsapp: '', description: '', available: true,
};

const AddCar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles]       = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;
    const combined = [...imageFiles, ...newFiles].slice(0, 5);
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
  };

  const removePreview = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      imageFiles.forEach((f) => fd.append('images[]', f));
      if (imageFiles[0]) fd.append('image', imageFiles[0]);
      await api.post('/cars', fd);
      navigate('/owner/cars');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const cats   = t('owner.addCar.categories');
  const trans  = t('owner.addCar.transmissions');
  const fuels  = t('owner.addCar.fuels');

  const field = (label, name, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
        className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm" />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>}
    </div>
  );

  const select = (label, name, options) => (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
      <select name={name} value={form[name]} onChange={handleChange}
        className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm">
        {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
      </select>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>}
    </div>
  );

  return (
    <OwnerLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('owner.addCar.title')}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{t('owner.addCar.subtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo upload */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">{t('owner.addCar.photos')}</h2>
            <p className="text-xs text-slate-400 mb-4">{t('owner.addCar.photosHint')}</p>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" multiple onChange={handleImageChange} className="hidden" />
            {imagePreviews.length > 0 ? (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden h-24">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">{t('owner.addCar.cover')}</span>}
                      <button type="button" onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 bg-white/90 text-slate-700 p-1 rounded-full shadow">
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <button type="button" onClick={() => fileRef.current.click()}
                      className="h-24 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-amber-500 transition-all">
                      <FiUpload size={18} /><span className="text-xs mt-1">{t('owner.addCar.addMore')}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current.click()}
                className="w-full border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl p-10 text-center transition-all">
                <FiUpload className="mx-auto text-slate-400 mb-2" size={28} />
                <p className="text-sm font-medium text-slate-600">{t('owner.addCar.uploadClick')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('owner.addCar.uploadHint')}</p>
              </button>
            )}
            {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image[0]}</p>}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">{t('owner.addCar.basicInfo')}</h2>
            <div className="grid grid-cols-2 gap-4">
              {field(t('owner.addCar.brand'), 'brand', 'text', t('owner.addCar.brandPlaceholder'))}
              {field(t('owner.addCar.model'), 'model', 'text', t('owner.addCar.modelPlaceholder'))}
              {field(t('owner.addCar.year'),  'year',  'number', '2024')}
              {field(t('owner.addCar.priceDay'), 'price_per_day', 'number', '89')}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">{t('owner.addCar.specs')}</h2>
            <div className="grid grid-cols-2 gap-4">
              {select(t('owner.addCar.category'), 'category', [
                ['sedan', cats.sedan], ['suv', cats.suv], ['sports', cats.sports],
                ['luxury', cats.luxury], ['van', cats.van], ['convertible', cats.convertible],
              ])}
              {select(t('owner.addCar.transmission'), 'transmission', [['automatic', trans.automatic], ['manual', trans.manual]])}
              {select(t('owner.addCar.fuelType'), 'fuel_type', [
                ['petrol', fuels.petrol], ['diesel', fuels.diesel], ['electric', fuels.electric], ['hybrid', fuels.hybrid],
              ])}
              {field(t('owner.addCar.seats'), 'seats', 'number', '5')}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">{t('owner.addCar.details')}</h2>
            <div className="space-y-4">
              {field(t('owner.addCar.location'), 'location', 'text', t('owner.addCar.locationPlaceholder'))}
              {field(t('owner.addCar.whatsapp'), 'whatsapp', 'text', t('owner.addCar.whatsappPlaceholder'))}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t('owner.addCar.description')}</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder={t('owner.addCar.descPlaceholder')}
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm resize-none" />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 text-sm">
            <FiSave size={16} />
            {loading ? t('owner.addCar.submitting') : t('owner.addCar.submit')}
          </button>
        </form>
      </div>
    </OwnerLayout>
  );
};

export default AddCar;
