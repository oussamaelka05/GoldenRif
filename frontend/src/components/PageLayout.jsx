import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PageLayout = ({ title, subtitle, children, maxWidth = 'max-w-4xl' }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="bg-slate-900 pt-24 pb-12 px-4">
      <div className={`${maxWidth} mx-auto`}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-slate-400 text-lg mt-1">{subtitle}</p>}
      </div>
    </div>
    <div className={`${maxWidth} mx-auto px-4 py-12`}>
      {children}
    </div>
    <Footer />
  </div>
);

export default PageLayout;
