import React from 'react';
import { FiThumbsUp, FiHeadphones, FiClock, FiShield, FiRefreshCw } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const icons = [FiThumbsUp, FiHeadphones, FaCar, FiClock, FiShield, FiRefreshCw];
const iconStyles = [
  { bg: 'bg-amber-100', color: 'text-amber-600' },
  { bg: 'bg-blue-100',  color: 'text-blue-600'  },
  { bg: 'bg-green-100', color: 'text-green-600' },
  { bg: 'bg-purple-100',color: 'text-purple-600'},
  { bg: 'bg-red-100',   color: 'text-red-600'   },
  { bg: 'bg-teal-100',  color: 'text-teal-600'  },
];

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const features = t('why.features');

  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">{t('why.tag')}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">{t('why.title')}</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">{t('why.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, desc }, i) => {
            const Icon = icons[i];
            const { bg, color } = iconStyles[i];
            return (
              <div key={i}
                className="group p-8 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`text-2xl ${color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
