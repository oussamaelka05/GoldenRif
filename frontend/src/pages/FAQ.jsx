import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
        <FiChevronDown className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} size={16} />
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const sections = t('faq.sections');

  const filteredSections = sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <PageLayout title={t('faq.title')} subtitle={t('faq.subtitle')}>
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('faq.searchPlaceholder')}
          className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 px-5 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm shadow-sm"
        />
      </div>
      <div className="space-y-10 mb-12">
        {filteredSections.map((sec) => (
          <div key={sec.heading}>
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">{sec.heading}</h2>
            <div className="space-y-2">
              {sec.items.map((item) => <FAQItem key={item.q} {...item} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="text-slate-700 font-semibold mb-1">{t('faq.stillQuestions')}</p>
        <p className="text-slate-500 text-sm mb-4">{t('faq.supportText')}</p>
        <Link to="/help" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
          {t('faq.visitHelp')}
        </Link>
      </div>
    </PageLayout>
  );
};

export default FAQ;
