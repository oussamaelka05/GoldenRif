import React from 'react';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-extrabold text-slate-900 mb-3">{title}</h2>
    <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const Privacy = () => {
  const { t } = useLanguage();
  const headings = t('privacy.headings');
  const b = t('privacy.body');
  return (
    <PageLayout title={t('privacy.title')} subtitle={t('privacy.subtitle')}>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-xs text-amber-700 mb-6 flex items-center gap-2">
        <span className="font-bold">{t('privacy.lastUpdated')}</span>
        <span>January 2026</span>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

        <Section title={headings[0]}>
          <p>{b.s1p1}</p>
        </Section>

        <Section title={headings[1]}>
          <p><strong className="text-slate-700">{b.s2p1label}</strong>{b.s2p1text}</p>
          <p><strong className="text-slate-700">{b.s2p2label}</strong>{b.s2p2text}</p>
          <p><strong className="text-slate-700">{b.s2p3label}</strong>{b.s2p3text}</p>
          <p><strong className="text-slate-700">{b.s2p4label}</strong>{b.s2p4text}</p>
          <p><strong className="text-slate-700">{b.s2p5label}</strong>{b.s2p5text}</p>
        </Section>

        <Section title={headings[2]}>
          <p>{b.s3p1}</p>
          <p>{b.s3p2}</p>
          <p>{b.s3p3}</p>
        </Section>

        <Section title={headings[3]}>
          <p>{b.s4p1}</p>
        </Section>

        <Section title={headings[4]}>
          <p>{b.s5p1pre}<a href="/cookies" className="text-amber-500 hover:underline">{b.s5p1link}</a>{b.s5p1post}</p>
        </Section>

        <Section title={headings[5]}>
          <p>{b.s6p1pre}<a href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">Elka.team@goldenrif.com</a></p>
        </Section>

        <Section title={headings[6]}>
          <p>{b.s7p1}</p>
        </Section>

        <Section title={headings[7]}>
          <p>{b.s8p1}</p>
        </Section>

        <Section title={headings[8]}>
          <p>{b.s9p1pre}<a href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">Elka.team@goldenrif.com</a></p>
        </Section>

      </div>
    </PageLayout>
  );
};

export default Privacy;
