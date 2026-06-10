import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const POSTS = [
  {
    slug: 'art-of-beading',
    category: 'Craft',
    title: 'The Ancient Art of Beading',
    excerpt: 'From Egyptian pharaohs to Yoruba royalty — exploring 6,000 years of beadwork as cultural language, status symbol, and spiritual practice.',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85&auto=format&fit=crop',
    date: 'May 2026',
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'caring-for-beaded-bags',
    category: 'Care Guide',
    title: 'How to Care For Your Beaded Bag',
    excerpt: 'A beaded bag is an investment. With the right care, it will outlast trends, seasons, and decades. Here is everything you need to know.',
    img: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=85&auto=format&fit=crop',
    date: 'April 2026',
    readTime: '4 min read',
    featured: false,
  },
  {
    slug: 'colour-meaning-west-africa',
    category: 'Heritage',
    title: 'The Language of Colour in West African Beadwork',
    excerpt: 'Every colour in traditional Yoruba and Ghanaian beadwork carries deep meaning. Red for courage, white for purity, gold for royalty.',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85&auto=format&fit=crop',
    date: 'March 2026',
    readTime: '5 min read',
    featured: false,
  },
  {
    slug: 'bespoke-process',
    category: 'Behind the Scenes',
    title: 'Inside a Lady B Bespoke Commission',
    excerpt: 'From first conversation to final piece — we document the full journey of a bespoke wedding bag, created for a client in London.',
    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=85&auto=format&fit=crop',
    date: 'February 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    slug: 'styling-beaded-necklaces',
    category: 'Style',
    title: 'Three Ways to Style a Statement Necklace',
    excerpt: 'Bold beaded necklaces deserve to be the centre of attention. Here are three looks — from editorial minimalism to full maximalist.',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85&auto=format&fit=crop',
    date: 'January 2026',
    readTime: '3 min read',
    featured: false,
  },
];

export default function JournalPage() {
  useEffect(() => { document.title = 'Journal | Lady B Designs & Handcraft'; }, []);

  const [featured, ...rest] = POSTS;

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
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
          >
            <Link to={`/journal/${featured.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="bg-charcoal-900 text-ivory text-2xs tracking-luxury uppercase font-body px-2.5 py-1">Featured</span>
                  <span className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{featured.category}</span>
                </div>
                <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-4 leading-tight group-hover:text-charcoal-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-charcoal-500 font-body leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{featured.date} · {featured.readTime}</p>
                  <ArrowRight className="h-4 w-4 text-charcoal-400 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* More posts grid */}
      <section className="py-8 pb-24">
        <div className="container-luxury">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rest.map((post, i) => (
              <motion.div
                key={post.slug}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08} variants={FADE_UP}
              >
                <Link to={`/journal/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-5">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-2">{post.category}</p>
                  <h3 className="font-serif font-light text-xl text-charcoal-900 mb-2 leading-tight group-hover:text-charcoal-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-charcoal-500 font-body text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{post.date} · {post.readTime}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
