import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail]       = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleJoin = () => {
    if (!email.trim()) return;
    setSubscribed(true);
  };
  const l = t('footer.links');

  const exploreLinks = [
    { label: l.home,      to: '/' },
    { label: l.fleet,     to: '/cars' },
    { label: l.offers,    to: '/special-offers' },
    { label: l.locations, to: '/locations' },
    { label: l.about,     to: '/about' },
    { label: l.blog,      to: '/blog' },
  ];

  const supportLinks = [
    { label: l.faq,          to: '/faq' },
    { label: l.help,         to: '/help' },
    { label: l.terms,        to: '/terms' },
    { label: l.privacy,      to: '/privacy' },
    { label: l.cookies,      to: '/cookies' },
    { label: l.cancellation, to: '/cancellation' },
  ];

  return (
    <footer id="contact" className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-amber-500 p-2 rounded-xl">
                <FaCar className="text-white text-lg" />
              </div>
              <span className="text-white text-xl font-bold">Golden<span className="text-amber-400">Rif</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">{t('footer.desc')}</p>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="/"
                  className="w-9 h-9 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all duration-200 group">
                  <Icon className="text-slate-400 group-hover:text-white text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{t('footer.explore')}</h4>
            <ul className="space-y-3">
              {exploreLinks.map(({ label, to }) => (
                <li key={to}><Link to={to} className="text-sm hover:text-amber-400 transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{t('footer.support')}</h4>
            <ul className="space-y-3">
              {supportLinks.map(({ label, to }) => (
                <li key={to}><Link to={to} className="text-sm hover:text-amber-400 transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{t('footer.contactTitle')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-amber-500 mt-0.5 shrink-0" size={16} />
                <span className="text-sm">123 Bario Rue, Al hoceima, Morocco</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-amber-500 shrink-0" size={16} />
                <a href="https://wa.me/212612345678" target="_blank" rel="noreferrer" className="text-sm hover:text-amber-400 transition-colors">+212 612-345-678</a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-amber-500 shrink-0" size={16} />
                <a href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com" target="_blank" rel="noreferrer" className="text-sm hover:text-amber-400 transition-colors">Elka.team@goldenrif.com</a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-300 mb-3">{t('footer.newsletter')}</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold py-2">
                  <FiCheck size={14} /> {t('footer.subscribed')}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.emailPlaceholder')}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 placeholder-slate-500"
                  />
                  <button
                    onClick={handleJoin}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
                  >
                    {t('footer.join')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} GoldenRif — Al Hoceima, Morocco. {t('footer.rights')}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link to="/terms"   className="hover:text-amber-400 transition-colors">{l.terms}</Link>
            <Link to="/privacy" className="hover:text-amber-400 transition-colors">{l.privacy}</Link>
            <Link to="/cookies" className="hover:text-amber-400 transition-colors">{l.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
