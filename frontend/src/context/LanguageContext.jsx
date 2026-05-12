import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en';
import fr from '../i18n/fr';

const translations = { en, fr };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key) => {
    const parts = key.split('.');
    let result = translations[lang];
    for (const part of parts) {
      if (result == null) return key;
      result = result[part];
    }
    return result ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
