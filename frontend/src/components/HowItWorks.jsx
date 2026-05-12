import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiKey } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const stepIcons = [FiSearch, FiCalendar, FiKey];

const HowItWorks = () => {
  const { t } = useLanguage();
  const steps = t('how.steps');

  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">{t('how.tag')}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2">{t('how.title')}</h2>
          <p className="text-slate-400 mt-4 text-lg max-w-xl mx-auto">{t('how.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="text-xs font-bold text-amber-500 tracking-widest mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-amber-500 flex items-center justify-center mb-6 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-amber-500/20 relative z-10">
                  <Icon className="text-2xl text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
                {i < steps.length - 1 && <div className="md:hidden text-amber-500/40 text-2xl mt-6">↓</div>}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link to="/cars"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 text-base">
            {t('how.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
