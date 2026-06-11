import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Check, ChevronRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  readTimeMinutes?: number;
  publishedAt: string;
  author?: { name: string; role?: string; avatar?: string };
  relatedPosts?: Array<{ id: string; slug: string; title: string; coverImage?: string; category: string; publishedAt: string }>;
}

function PostSkeleton() {
  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Skeleton className="h-4 w-24 mb-8" />
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="aspect-[16/9] w-full mb-10" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />)}
        </div>
      </div>
    </div>
  );
}

export default function JournalPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const { data: post, isLoading, error } = useQuery<JournalPost>({
    queryKey: ['journal-post', slug],
    queryFn: () => api.get(`/journal/${slug}`).then(r => r.data.data),
    enabled: !!slug,
  });

  useEffect(() => {
    if (post) document.title = `${post.title} | Lady B Journal`;
  }, [post]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  if (isLoading) return <PostSkeleton />;

  if (error || !post) return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif font-light text-3xl text-charcoal-900 mb-4">Post not found</p>
        <Link to="/journal" className="text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors border-b border-charcoal-300">
          ← Back to Journal
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <div className="pt-36 md:pt-44 pb-12 bg-charcoal-50">
        <div className="container-luxury max-w-3xl">
          <motion.div variants={FADE_UP} initial="hidden" animate="visible" className="mb-6">
            <Link to="/journal" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-400 hover:text-charcoal-900 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Journal
            </Link>
          </motion.div>

          <motion.p variants={FADE_UP} initial="hidden" animate="visible" custom={1} className="section-label mb-3">
            {post.category}
          </motion.p>
          <motion.h1
            variants={FADE_UP} initial="hidden" animate="visible" custom={2}
            className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 leading-tight mb-6"
          >
            {post.title}
          </motion.h1>

          <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={3} className="flex flex-wrap items-center gap-4 text-xs font-body text-charcoal-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
            </span>
            {post.readTimeMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {post.readTimeMinutes} min read
              </span>
            )}
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 text-charcoal-400 hover:text-charcoal-900 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-luxury" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={4} className="container-luxury max-w-3xl -mt-1">
          <div className="aspect-[16/9] overflow-hidden bg-charcoal-100">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}

      {/* Article body */}
      <article className="py-12 md:py-16">
        <div className="container-luxury max-w-3xl">
          {post.excerpt && (
            <motion.p
              variants={FADE_UP} initial="hidden" animate="visible" custom={5}
              className="text-lg md:text-xl font-body font-light text-charcoal-600 leading-relaxed mb-10 border-l-2 border-gold-champagne pl-6"
            >
              {post.excerpt}
            </motion.p>
          )}

          <motion.div
            variants={FADE_UP} initial="hidden" animate="visible" custom={6}
            className="prose prose-lg max-w-none font-body text-charcoal-700 leading-relaxed
              prose-headings:font-serif prose-headings:font-light prose-headings:text-charcoal-900
              prose-p:leading-relaxed prose-p:text-charcoal-600
              prose-a:text-charcoal-900 prose-a:border-b prose-a:border-charcoal-300 prose-a:no-underline
              prose-strong:text-charcoal-900 prose-strong:font-semibold
              prose-blockquote:border-l-gold-champagne prose-blockquote:text-charcoal-500"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={7} className="mt-12 pt-8 border-t border-charcoal-100 flex flex-wrap items-center gap-3">
              <Tag className="h-4 w-4 text-charcoal-300" />
              {post.tags.map(tag => (
                <span key={tag} className="text-xs tracking-luxury uppercase font-body text-charcoal-500 border border-charcoal-200 px-3 py-1">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Author card */}
          {post.author && (
            <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={8} className="mt-10 bg-charcoal-50 p-6 flex items-start gap-5">
              <div className="w-14 h-14 bg-charcoal-200 overflow-hidden flex-shrink-0">
                {post.author.avatar
                  ? <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-charcoal-400 font-serif text-xl">{post.author.name[0]}</div>
                }
              </div>
              <div>
                <p className="font-body font-semibold text-charcoal-900 mb-0.5">{post.author.name}</p>
                {post.author.role && <p className="text-xs text-charcoal-400 font-body tracking-luxury uppercase">{post.author.role}</p>}
                <p className="text-sm text-charcoal-500 font-body mt-2 leading-relaxed">
                  Lady B Designs and Handcraft — artisan bead bag designer and handcraft specialist based in Indianapolis, Indiana.
                </p>
              </div>
            </motion.div>
          )}

          {/* Share again */}
          <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={9} className="mt-10 pt-8 border-t border-charcoal-100 flex items-center justify-between">
            <Link to="/journal" className="flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 transition-colors border-b border-charcoal-300 pb-0.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-luxury" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Link copied' : 'Share this post'}
            </button>
          </motion.div>
        </div>
      </article>

      {/* Related posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="py-16 bg-charcoal-50 border-t border-charcoal-100">
          <div className="container-luxury">
            <p className="section-label mb-3">Keep Reading</p>
            <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-10">Related Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.relatedPosts.map((rp) => (
                <Link key={rp.id} to={`/journal/${rp.slug}`} className="group">
                  <div className="aspect-[16/10] bg-charcoal-100 overflow-hidden mb-4">
                    {rp.coverImage
                      ? <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                    }
                  </div>
                  <p className="text-xs text-charcoal-400 tracking-luxury uppercase font-body mb-1">{rp.category}</p>
                  <h3 className="font-serif font-light text-xl text-charcoal-900 group-hover:text-charcoal-600 transition-colors mb-1 leading-snug">{rp.title}</h3>
                  <p className="text-xs text-charcoal-400 font-body">{formatDate(rp.publishedAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-charcoal-900">
        <div className="container-luxury text-center max-w-xl">
          <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-3">Handcrafted with love</p>
          <h2 className="font-serif font-light text-3xl text-ivory mb-4">Explore our collection</h2>
          <p className="text-charcoal-300 font-body text-sm mb-6">Each piece tells a story. Find yours.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-ivory text-charcoal-900 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors">
            Shop Now <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
