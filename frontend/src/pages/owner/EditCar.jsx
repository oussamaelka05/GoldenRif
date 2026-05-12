import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiPlus } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileRef = useRef(null);
  const [form, setForm] = useState(null);

  // existing images loaded from server: [{ id, image_url }]
  const [existingImages, setExistingImages] = useState([]);
  const [deletedIds, setDeletedIds]         = useState([]);
  // new images picked by the user (max 5 total)
  const [newFiles, setNewFiles]             = useState([]);
  const [newPreviews, setNewPreviews]       = useState([]);

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(({ data }) => {
        setForm({
          brand: data.brand ?? '', model: data.model ?? '',
          year: data.year ?? new Date().getFullYear(),
          category: data.category ?? 'sedan',
          price_per_day: data.price_per_day ?? '',
          seats: data.seats ?? 5,
          transmission: data.transmission ?? 'automatic',
          fuel_type: data.fuel_type ?? 'petrol',
          location: data.location ?? '', whatsapp: data.whatsapp ?? '',
          description: data.description ?? '',
          available: data.available ?? true,
        });
        // Populate image grid: prefer car_images array, fallback to image_url
        if (data.images?.length > 0) {
          setExistingImages(data.images.map((img) => ({ id: img.id, image_url: img.image_url })));
        } else if (data.image_url) {
          setExistingImages([{ id: null, image_url: data.image_url }]);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404 || err.response?.status === 403) setNotFound(true);
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const totalImages = existingImages.length + newFiles.length;

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const slots = 5 - totalImages;
    const toAdd = files.slice(0, slots);
    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeExisting = (img) => {
    if (img.id) setDeletedIds((prev) => [...prev, img.id]);
    setExistingImages((prev) => prev.filter((i) => i.image_url !== img.image_url));
  };

  const removeNew = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined)
          fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v);
      });
      deletedIds.forEach((did) => fd.append('deleted_image_ids[]', did));
      newFiles.forEach((f) => fd.append('images[]', f));
      if (newFiles[0]) fd.append('image', newFiles[0]);
      await api.post(`/cars/${id}/update`, fd);
      navigate('/owner/cars');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const cats  = form ? t('owner.addCar.categories')  : {};
  const trans = form ? t('owner.addCar.transmissions') : {};
  const fuels = form ? t('owner.addCar.fuels')         : {};

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

  if (fetching) {
    return (
      <OwnerLayout>
        <div className="max-w-2xl space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
          <div className="bg-white rounded-2xl h-48" />
          <div className="bg-white rounded-2xl h-48" />
        </div>
      </OwnerLayout>
    );
  }

  if (notFound) {
    return (
      <OwnerLayout>
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg mb-4">{t('owner.editCar.notFound')}</p>
          <button onClick={() => navigate('/owner/cars')} className="text-amber-500 font-semibold hover:underline">
            {t('owner.editCar.backToCars')}
          </button>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('owner.editCar.title')}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{form.brand} {form.model} · {form.year}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t('owner.editCar.photoSection')}</h2>
              <span className="text-xs text-slate-400">{totalImages}/5</span>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" multiple onChange={handleAddImages} className="hidden" />

            {totalImages === 0 ? (
              <button type="button" onClick={() => fileRef.current.click()}
                className="w-full border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl p-10 text-center transition-all">
                <FiUpload className="mx-auto text-slate-400 mb-2" size={28} />
                <p className="text-sm font-medium text-slate-600">{t('owner.editCar.uploadClick')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('owner.editCar.uploadHint')}</p>
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((img) => (
                  <div key={img.image_url} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExisting(img)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
                {newPreviews.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                    <button type="button" onClick={() => removeNew(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
                {totalImages < 5 && (
                  <button type="button" onClick={() => fileRef.current.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1 transition-all text-slate-400 hover:text-amber-500">
                    <FiPlus size={22} />
                    <span className="text-xs font-medium">{t('owner.addCar.addMore')}</span>
                  </button>
                )}
              </div>
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
                  placeholder={t('owner.editCar.descPlaceholder')}
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm resize-none" />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input type="checkbox" id="available" name="available" checked={form.available} onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 cursor-pointer" />
                <label htmlFor="available" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  {t('owner.editCar.availableRental')}
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3.5 rounded-xl transition-all text-sm">
              {t('owner.editCar.cancel')}
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 text-sm">
              <FiSave size={16} />
              {loading ? t('owner.editCar.saving') : t('owner.editCar.save')}
            </button>
          </div>
        </form>
      </div>
    </OwnerLayout>
  );
};

export default EditCar;
