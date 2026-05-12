import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import posts from '../data/blogPosts';

const categoryColors = {
  'Travel Tips':   'bg-blue-100 text-blue-700',
  'Car Guide':     'bg-amber-100 text-amber-700',
  'Driving Guide': 'bg-green-100 text-green-700',
  'Company News':  'bg-purple-100 text-purple-700',
};

const BlogPost = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const p = post[lang] || post.en;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero image */}
      <div className="relative h-72 md:h-96 bg-slate-900 overflow-hidden">
        <img
          src={post.image}
          alt={p.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-8">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'} mb-3 inline-block`}>
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {p.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-200">
          <span className="flex items-center gap-1.5"><FiUser size={13} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><FiCalendar size={13} /> {p.date}</span>
          <span className="flex items-center gap-1.5"><FiClock size={13} /> {p.readTime}</span>
        </div>

        {/* Article body */}
        <article className="prose-custom space-y-5">
          {p.content.map((block, i) => {
            if (block.type === 'p') {
              return (
                <p key={i} className="text-slate-600 leading-relaxed text-base">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'h2') {
              return (
                <h2 key={i} className="text-xl font-extrabold text-slate-900 mt-8 mb-2">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'list') {
              return (
                <ul key={i} className="space-y-2 pl-1">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-600 text-base">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </article>

        {/* Back + other posts */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors mb-8"
          >
            <FiArrowLeft size={15} /> {t('blog.backToAll')}
          </Link>

          <h3 className="font-extrabold text-slate-900 mb-4">{t('blog.moreArticles')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts
              .filter((other) => other.slug !== post.slug)
              .slice(0, 3)
              .map((other) => {
                const op = other[lang] || other.en;
                return (
                  <Link
                    key={other.slug}
                    to={`/blog/${other.slug}`}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 overflow-hidden bg-slate-100">
                      <img
                        src={other.image}
                        alt={op.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[other.category] || 'bg-slate-100 text-slate-600'}`}>
                        {other.category}
                      </span>
                      <p className="font-bold text-slate-900 text-sm mt-2 leading-snug line-clamp-2">
                        {op.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
