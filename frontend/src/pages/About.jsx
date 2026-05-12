import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiShield, FiStar, FiMail, FiPhone } from 'react-icons/fi';
import { FaCar, FaUsers, FaHandshake } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const featureIcons = [FaHandshake, FiShield, FiStar, FiMapPin];
const featureColors = [
  'bg-amber-50 text-amber-500',
  'bg-green-50 text-green-500',
  'bg-blue-50 text-blue-500',
  'bg-purple-50 text-purple-500',
];
const valueIcons  = [FiCheckCircle, FiShield, FiStar];
const valueColors = ['text-green-500', 'text-blue-500', 'text-amber-500'];
const valueBgs    = ['bg-green-50',   'bg-blue-50',    'bg-amber-50'];

const About = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ cars: '...', locations: '...' });

  useEffect(() => {
    api.get('/cars').then(({ data }) => {
      const locs = new Set(data.map((c) => c.location?.trim()).filter(Boolean));
      setStats({ cars: data.length, locations: locs.size });
    }).catch(() => setStats({ cars: 0, locations: 0 }));
  }, []);

  const features    = t('about.features');
  const renterSteps = t('about.renterSteps');
  const ownerSteps  = t('about.ownerSteps');
  const values      = t('about.values');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-slate-900 pt-28 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            {t('about.tag')}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {t('about.hero1')} <span className="text-amber-400">{t('about.hero2')}</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {t('about.heroDesc')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-extrabold text-white">{stats.cars}</p>
            <p className="text-amber-100 text-sm font-medium mt-0.5">{t('about.statCars')}</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{stats.locations}</p>
            <p className="text-amber-100 text-sm font-medium mt-0.5">{t('about.statCities')}</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-amber-100 text-sm font-medium mt-0.5">{t('about.statOwner')}</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">24/7</p>
            <p className="text-amber-100 text-sm font-medium mt-0.5">{t('about.statSupport')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{t('about.missionTitle')}</h2>
            <p className="text-slate-500 leading-relaxed mb-4">{t('about.missionP1')}</p>
            <p className="text-slate-500 leading-relaxed">{t('about.missionP2')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ label }, i) => {
              const Icon = featureIcons[i];
              const color = featureColors[i];
              return (
                <div key={label} className={`${color} rounded-2xl p-5 flex flex-col items-center text-center gap-3`}>
                  <Icon size={28} />
                  <span className="text-slate-700 text-sm font-semibold">{label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">{t('about.howTitle')}</h2>
          <p className="text-slate-400 text-center mb-10">{t('about.howSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Renters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-2.5 rounded-xl">
                  <FaUsers className="text-amber-600" size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{t('about.forRenters')}</h3>
              </div>
              <ol className="space-y-4">
                {renterSteps.map(({ title, desc }, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{title}</p>
                      <p className="text-slate-500 text-sm">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                to="/cars"
                className="mt-6 block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                {t('about.browseCars')}
              </Link>
            </div>

            {/* Owners */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 p-2.5 rounded-xl">
                  <FaCar className="text-slate-600" size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{t('about.forOwners')}</h3>
              </div>
              <ol className="space-y-4">
                {ownerSteps.map(({ title, desc }, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{title}</p>
                      <p className="text-slate-500 text-sm">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                to="/register"
                className="mt-6 block w-full text-center bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                {t('about.listCar')}
              </Link>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-10 text-center">{t('about.valuesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map(({ title, desc }, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                  <div className={`w-12 h-12 ${valueBgs[i]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={valueColors[i]} size={22} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-slate-900 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-white mb-2 text-center">{t('about.contactTitle')}</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">
            {t('about.contactSubtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a
              href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-4 transition-colors"
            >
              <FiMail className="text-amber-400 shrink-0" size={20} />
              <div>
                <p className="text-white text-sm font-semibold">{t('about.emailUs')}</p>
                <p className="text-slate-400 text-xs">Elka.team@goldenrif.com</p>
              </div>
            </a>
            <a
              href="https://wa.me/212612345678"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-4 transition-colors"
            >
              <FiPhone className="text-amber-400 shrink-0" size={20} />
              <div>
                <p className="text-white text-sm font-semibold">{t('about.callUs')}</p>
                <p className="text-slate-400 text-xs">+212 612-345-678</p>
              </div>
            </a>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default About;
