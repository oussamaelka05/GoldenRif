import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import testimonials from '../data/testimonials';
import { useLanguage } from '../context/LanguageContext';

const Testimonials = () => {
  const { t } = useLanguage();
  const badges = t('testimonials.badges');

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">{t('testimonials.tag')}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">{t('testimonials.title')}</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
            >
              <FaQuoteLeft className="text-amber-400 text-2xl mb-5" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < item.rating ? 'text-amber-400' : 'text-slate-200'} size={14} />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 italic">"{item.text}"</p>
              <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-slate-400 text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-14 pt-14 border-t border-slate-200">
          {badges.map((badge) => (
            <div key={badge.label} className="text-center">
              <div className="text-3xl font-extrabold text-slate-900">{badge.value}</div>
              <div className="text-sm text-slate-500 mt-1">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
