import React from 'react';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-extrabold text-slate-900 mb-3">{title}</h2>
    <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const Terms = () => {
  const { t } = useLanguage();
  const headings = t('terms.headings');
  const b = t('terms.body');
  return (
    <PageLayout title={t('terms.title')} subtitle={t('terms.subtitle')}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

        <Section title={headings[0]}>
          <p>{b.s1p1}</p>
          <p>{b.s1p2}</p>
        </Section>

        <Section title={headings[1]}>
          <p>{b.s2p1pre}<strong className="text-slate-700">{b.s2p1owner}</strong>{b.s2p1mid}<strong className="text-slate-700">{b.s2p1renter}</strong>{b.s2p1post}</p>
          <p>{b.s2p2}</p>
        </Section>

        <Section title={headings[2]}>
          <p>{b.s3p1pre}<strong className="text-slate-700">{b.s3p1pending}</strong>{b.s3p1mid}<strong className="text-slate-700">{b.s3p1confirmed}</strong>{b.s3p1post}</p>
          <p>{b.s3p2}</p>
        </Section>

        <Section title={headings[3]}>
          <p>{b.s4p1}</p>
          <p>{b.s4p2}</p>
        </Section>

        <Section title={headings[4]}>
          <p>{b.s5p1}</p>
        </Section>

        <Section title={headings[5]}>
          <p>{b.s6p1}</p>
          <p>{b.s6p2pre}<a href="/cancellation" className="text-amber-500 hover:underline">{b.s6p2link}</a>{b.s6p2post}</p>
        </Section>

        <Section title={headings[6]}>
          <p>{b.s7p1}</p>
          <p>{b.s7p2}</p>
        </Section>

        <Section title={headings[7]}>
          <p>{b.s8p1}</p>
          <p>{b.s8p2}</p>
        </Section>

        <Section title={headings[8]}>
          <p>{b.s9p1}</p>
        </Section>

        <Section title={headings[9]}>
          <p>{b.s10p1}</p>
        </Section>

        <Section title={headings[10]}>
          <p>{b.s11p1}</p>
        </Section>

        <Section title={headings[11]}>
          <p>{b.s12p1pre}<a href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">Elka.team@goldenrif.com</a></p>
        </Section>

      </div>
    </PageLayout>
  );
};

export default Terms;
