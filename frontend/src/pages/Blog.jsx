import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiArrowRight } from 'react-icons/fi';
import PageLayout from '../components/PageLayout';
import { useLanguage } from '../context/LanguageContext';
import posts from '../data/blogPosts';

const categoryColors = {
  'Travel Tips':   'bg-blue-100 text-blue-700',
  'Car Guide':     'bg-amber-100 text-amber-700',
  'Driving Guide': 'bg-green-100 text-green-700',
  'Company News':  'bg-purple-100 text-purple-700',
};

const Blog = () => {
  const { t, lang } = useLanguage();
  return (
    <PageLayout
      title={t('blog.title')}
      subtitle={t('blog.subtitle')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => {
          const p = post[lang] || post.en;
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="h-44 overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                  {post.category}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-3 mb-2 leading-snug">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{p.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FiUser size={11} /> {post.author}</span>
                    <span>{p.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold group-hover:gap-2 transition-all">
                    {t('blog.readMore')} <FiArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default Blog;
