import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('search', location.trim());
    if (pickupDate)       params.set('start', pickupDate);
    if (returnDate)       params.set('end', returnDate);
    navigate(`/cars?${params.toString()}`);
  };

  const stats = [
    { value: '500+', label: t('hero.stats.vehicles') },
    { value: '10K+', label: t('hero.stats.clients') },
    { value: '50+',  label: t('hero.stats.cities') },
    { value: '4.9★', label: t('hero.stats.rating') },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)' }}
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div className="text-center max-w-4xl mx-auto">

          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            {t('hero.badge')}
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            {t('hero.title1')}
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Search Card */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-2xl max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {t('hero.location')}
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <input type="text" placeholder={t('hero.locationPlaceholder')} value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition" />
                </div>
              </div>
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {t('hero.pickupDate')}
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <input type="date" min={today} value={pickupDate}
                    onChange={(e) => { setPickupDate(e.target.value); if (returnDate && e.target.value > returnDate) setReturnDate(''); }}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition" />
                </div>
              </div>
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {t('hero.returnDate')}
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <input type="date" min={pickupDate || today} value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition" />
                </div>
              </div>
              <button onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95 text-sm">
                <FiSearch size={16} /> {t('hero.search')}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-amber-400">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
