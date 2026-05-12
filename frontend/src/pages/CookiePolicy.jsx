import React from 'react';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-extrabold text-slate-900 mb-3">{title}</h2>
    <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const typeColors = {
  Essential:   'bg-green-100 text-green-700',
  Functional:  'bg-blue-100 text-blue-700',
  Analytics:   'bg-purple-100 text-purple-700',
  Essentiel:   'bg-green-100 text-green-700',
  Fonctionnel: 'bg-blue-100 text-blue-700',
  Analytique:  'bg-purple-100 text-purple-700',
};

const CookiePolicy = () => {
  const { t } = useLanguage();
  const headings   = t('cookies.headings');
  const headers    = t('cookies.tableHeaders');
  const cookieRows = t('cookies.cookieRows');
  const b          = t('cookies.body');
  return (
    <PageLayout title={t('cookies.title')} subtitle={t('cookies.subtitle')}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

        <Section title={headings[0]}>
          <p>{b.s1p1}</p>
        </Section>

        <Section title={headings[1]}>
          <p>{b.s2p1}</p>
          <p><strong className="text-slate-700">{b.s2p2essential}</strong>{b.s2p2post}</p>
          <p><strong className="text-slate-700">{b.s2p3functional}</strong>{b.s2p3post}</p>
        </Section>

        <Section title={headings[2]}>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs border-collapse" aria-label="Cookies used on this site">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2.5 border border-slate-200 font-bold text-slate-700">{headers.name}</th>
                  <th className="text-left px-4 py-2.5 border border-slate-200 font-bold text-slate-700">{headers.type}</th>
                  <th className="text-left px-4 py-2.5 border border-slate-200 font-bold text-slate-700">{headers.purpose}</th>
                  <th className="text-left px-4 py-2.5 border border-slate-200 font-bold text-slate-700">{headers.duration}</th>
                </tr>
              </thead>
              <tbody>
                {cookieRows.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 border border-slate-200 font-mono text-slate-700">{c.name}</td>
                    <td className="px-4 py-2.5 border border-slate-200">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${typeColors[c.type] || 'bg-slate-100 text-slate-600'}`}>{c.type}</span>
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200 text-slate-600">{c.purpose}</td>
                    <td className="px-4 py-2.5 border border-slate-200 text-slate-500">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={headings[3]}>
          <p>{b.s4p1}</p>
        </Section>

        <Section title={headings[4]}>
          <p>{b.s5p1}</p>
          <p>{b.s5p2pre}<strong className="text-slate-700">Chrome</strong> — {b.s5p2chromepath}. <strong className="text-slate-700">Firefox</strong> — {b.s5p2firefoxpath}. <strong className="text-slate-700">Safari</strong> — {b.s5p2safaripath}.</p>
        </Section>

        <Section title={headings[5]}>
          <p>{b.s6p1pre}<a href="https://mail.google.com/mail/?view=cm&to=Elka.team@goldenrif.com" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">Elka.team@goldenrif.com</a></p>
        </Section>

      </div>
    </PageLayout>
  );
};

export default CookiePolicy;
