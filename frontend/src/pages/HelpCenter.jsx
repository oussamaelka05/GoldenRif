import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiShield, FiMapPin, FiPhone, FiMail, FiChevronRight, FiTag, FiUser } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';

const categoryIcons = [FaCar, FiUser, FiTag, FiShield, FiBook, FiMapPin];
const categoryLinks = ['/faq', '/faq#for-car-owners', '/faq', '/cancellation', '/faq', '/locations'];

const HelpCenter = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const categories = t('help.categories').map((c, i) => ({
    ...c,
    icon: categoryIcons[i],
    link: categoryLinks[i],
  }));

  const filtered = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout title={t('help.title')} subtitle={t('help.subtitle')}>
      <div className="mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('help.searchPlaceholder')}
          className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 px-5 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {filtered.map(({ icon: Icon, title, desc, link }) => (
          <Link
            key={title}
            to={link}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
              <Icon className="text-amber-500 group-hover:text-white transition-colors" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-sm mb-0.5">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
            <FiChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors shrink-0 mt-1" size={16} />
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-400 text-sm py-8">{t('help.noMatch')}</p>
      )}

      <div className="bg-slate-900 rounded-2xl p-8">
        <h2 className="text-xl font-extrabold text-white mb-2 text-center">{t('help.stillHelp')}</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          {t('help.supportHours')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://wa.me/212612345678"
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <FiPhone size={15} /> {t('help.callUs')}
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com"
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <FiMail size={15} /> {t('help.emailUs')}
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpCenter;
