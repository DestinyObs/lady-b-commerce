import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const STATIC_POSTS = [
  {
    slug: 'art-of-beading',
    category: 'Craft',
    title: 'The Ancient Art of Beading',
    excerpt: 'From Egyptian pharaohs to Yoruba royalty — exploring 6,000 years of beadwork as cultural language, status symbol, and spiritual practice.',
    coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85&auto=format&fit=crop',
    publishedAt: '2026-05-01T00:00:00Z',
    readTimeMinutes: 6,
    featured: true,
  },
  {
    slug: 'caring-for-beaded-bags',
    category: 'Care Guide',
    title: 'How to Care For Your Beaded Bag',
    excerpt: 'A beaded bag is an investment. With the right care, it will outlast trends, seasons, and decades.',
    coverImage: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=85&auto=format&fit=crop',
    publishedAt: '2026-04-01T00:00:00Z',
    readTimeMinutes: 4,
    featured: false,
  },
  {
    slug: 'colour-meaning-west-africa',
    category: 'Heritage',
    title: 'The Language of Colour in West African Beadwork',
    excerpt: 'Every colour in traditional Yoruba and Ghanaian beadwork carries deep meaning. Red for courage, white for purity, gold for royalty.',
    coverImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85&auto=format&fit=crop',
    publishedAt: '2026-03-01T00:00:00Z',
    readTimeMinutes: 5,
    featured: false,
  },
  {
    slug: 'bespoke-process',
    category: 'Behind the Scenes',
    title: 'Inside a Lady B Bespoke Commission',
    excerpt: 'From first conversation to final piece — we document the full journey of a bespoke wedding bag.',
    coverImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=85&auto=format&fit=crop',
    publishedAt: '2026-02-01T00:00:00Z',
    readTimeMinutes: 8,
    featured: false,
  },
  {
    slug: 'styling-beaded-necklaces',
    category: 'Style',
    title: 'Three Ways to Style a Statement Necklace',
    excerpt: 'Bold beaded necklaces deserve to be the centre of attention. Three looks — from editorial minimalism to full maximalist.',
    coverImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85&auto=format&fit=crop',
    publishedAt: '2026-01-01T00:00:00Z',
    readTimeMinutes: 3,
    featured: false,
  },
];

interface Post {
  id?: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  featured?: boolean;
}

function formatPostDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function PostCardLarge({ post }: { post: Post }) {
  return (
    <Link to={`/journal/${post.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85&auto=format&fit=crop'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div>
        <div className="flex items-center gap-4 mb-5">
          <span className="bg-charcoal-900 text-ivory text-2xs tracking-luxury uppercase font-body px-2.5 py-1">Featured</span>
          <span className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{post.category}</span>
        </div>
        <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-4 leading-tight group-hover:text-charcoal-600 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && <p className="text-charcoal-500 font-body leading-relaxed mb-5">{post.excerpt}</p>}
        <div className="flex items-center justify-between">
          <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">
            {formatPostDate(post.publishedAt)}{post.readTimeMinutes ? ` · ${post.readTimeMinutes} min read` : ''}
          </p>
          <ArrowRight className="h-4 w-4 text-charcoal-400 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

function PostCardSmall({ post, i }: { post: Post; i: number }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08} variants={FADE_UP}
    >
      <Link to={`/journal/${post.slug}`} className="group block">
        <div className="aspect-[4/3] overflow-hidden mb-5">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85&auto=format&fit=crop'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-2">{post.category}</p>
        <h3 className="font-serif font-light text-xl text-charcoal-900 mb-2 leading-tight group-hover:text-charcoal-600 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-charcoal-500 font-body text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
        )}
        <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">
          {formatPostDate(post.publishedAt)}{post.readTimeMinutes ? ` · ${post.readTimeMinutes} min read` : ''}
        </p>
      </Link>
    </motion.div>
  );
}

function PostCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] bg-charcoal-100 animate-pulse mb-5" />
      <div className="h-3 bg-charcoal-100 animate-pulse w-16 mb-2" />
      <div className="h-5 bg-charcoal-100 animate-pulse w-full mb-2" />
      <div className="h-5 bg-charcoal-100 animate-pulse w-3/4 mb-3" />
      <div className="h-3 bg-charcoal-100 animate-pulse w-24" />
    </div>
  );
}

export default function JournalPage() {
  useEffect(() => { document.title = 'Journal | Lady B Designs & Handcraft'; }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['journal-posts'],
    queryFn: () => api.get('/journal?limit=12').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const apiPosts: Post[] = data?.data ?? [];
  const posts: Post[] = apiPosts.length > 0 ? apiPosts : STATIC_POSTS;
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-ivory">

      {/* Header */}
      <section className="pt-36 md:pt-44 pb-12 border-b border-charcoal-100">
        <div className="container-luxury">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4"
          >
            Lady B Designs
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-7xl text-charcoal-900"
          >
            Journal
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-500 font-body text-lg mt-4 max-w-xl"
          >
            Stories on craft, heritage, and the art of making.
          </motion.p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-16 md:py-20">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="aspect-[4/3] bg-charcoal-100 animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 bg-charcoal-100 animate-pulse w-32" />
                <div className="h-8 bg-charcoal-100 animate-pulse w-full" />
                <div className="h-8 bg-charcoal-100 animate-pulse w-4/5" />
                <div className="h-4 bg-charcoal-100 animate-pulse w-full" />
                <div className="h-4 bg-charcoal-100 animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
              <PostCardLarge post={featured} />
            </motion.div>
          )}
        </div>
      </section>

      {/* More posts grid */}
      {rest.length > 0 && (
        <section className="py-8 pb-24">
          <div className="container-luxury">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <PostCardSkeleton key={i} />)
                : rest.slice(0, 8).map((post, i) => (
                    <PostCardSmall key={post.slug} post={post} i={i} />
                  ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
