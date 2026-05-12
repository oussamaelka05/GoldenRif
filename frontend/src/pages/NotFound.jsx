import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FaCar className="text-amber-500 text-4xl" />
        </div>
        <h1 className="text-7xl font-extrabold text-slate-900 mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-3">{t('notFound.title')}</h2>
        <p className="text-slate-500 mb-8 max-w-sm">
          {t('notFound.subtitle')}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/30"
          >
            {t('notFound.backHome')}
          </Link>
          <Link
            to="/cars"
            className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            {t('notFound.browseCars')}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
