import React from 'react';
import { FiCheck, FiX, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';

const colorMap = {
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-500', text: 'text-green-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', text: 'text-amber-700' },
  red:   { bg: 'bg-red-50',   border: 'border-red-200',   icon: 'text-red-500',   text: 'text-red-700'   },
};

const tierColors  = ['green', 'amber', 'amber', 'red'];
const tierIcons   = [FiCheck, FiAlertCircle, FiAlertCircle, FiX];

const Cancellation = () => {
  const { t } = useLanguage();
  const tiers            = t('cancellation.tiers');
  const howSteps         = t('cancellation.howSteps');
  const ownerCancelsNotes = t('cancellation.ownerCancelsNotes');

  return (
    <PageLayout title={t('cancellation.title')} subtitle={t('cancellation.subtitle')}>

      {/* Context note */}
      <div className="bg-slate-900 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <FiMessageSquare className="text-amber-400 mt-0.5 shrink-0" size={20} />
        <p className="text-slate-300 text-sm leading-relaxed">
          {t('cancellation.note')}
        </p>
      </div>

      {/* Tiers */}
      <div className="space-y-4 mb-10">
        {tiers.map(({ time, refund, detail }, i) => {
          const color = tierColors[i];
          const Icon  = tierIcons[i];
          const c = colorMap[color];
          return (
            <div key={i} className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
              <div className="flex items-start gap-3">
                <Icon className={`${c.icon} mt-0.5 shrink-0`} size={20} />
                <div>
                  <p className="text-slate-700 font-semibold text-sm">{time}</p>
                  <p className={`${c.text} font-extrabold text-base mt-0.5 mb-1`}>{refund}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to cancel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">{t('cancellation.howTitle')}</h2>
        <ol className="space-y-3">
          {howSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Owner cancels */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">{t('cancellation.ownerCancelsTitle')}</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          {ownerCancelsNotes.map((note, i) => (
            <li key={i} className="flex items-start gap-2">
              <FiCheck className="text-green-500 mt-0.5 shrink-0" size={14} />
              {note}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm mb-3">{t('cancellation.helpText')}</p>
        <Link to="/help" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
          {t('cancellation.contactSupport')}
        </Link>
      </div>
    </PageLayout>
  );
};

export default Cancellation;
