import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const COLLECTIONS = [
  {
    slug: 'bead-bags',
    name: 'Bead Bags',
    desc: 'Clutches, minaudières, and crossbodies — each a hand-beaded masterpiece. The signature Lady B collection.',
    count: '14 pieces',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop',
    aspect: 'aspect-[3/4]',
  },
  {
    slug: 'necklaces',
    name: 'Necklaces',
    desc: 'Statement beaded necklaces rooted in West African tradition, crafted for the contemporary wardrobe.',
    count: '8 pieces',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85&auto=format&fit=crop',
    aspect: 'aspect-[16/9]',
  },
  {
    slug: 'bracelets-earrings',
    name: 'Bracelets & Earrings',
    desc: 'Delicate and bold. Every wrist and earlobe deserves a little Lady B.',
    count: '11 pieces',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&q=85&auto=format&fit=crop',
    aspect: 'aspect-[3/4]',
  },
  {
    slug: 'new-arrivals',
    name: 'New Arrivals',
    desc: 'The latest additions to the atelier — just completed, ready to own.',
    count: '5 pieces',
    img: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=900&q=85&auto=format&fit=crop',
    aspect: 'aspect-[16/9]',
  },
  {
    slug: 'bridal',
    name: 'Bridal',
    desc: 'Bespoke bridal sets and wedding accessories made to complement your most important day.',
    count: 'By commission',
    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&q=85&auto=format&fit=crop',
    aspect: 'aspect-[3/4]',
  },
  {
    slug: 'gift-sets',
    name: 'Gift Sets',
    desc: 'Curated duos and trios. The perfect gift for anyone who appreciates true craftsmanship.',
    count: '6 sets',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop&sat=-20',
    aspect: 'aspect-[16/9]',
  },
];

export default function CollectionsPage() {
  useEffect(() => { document.title = 'Collections | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Header */}
      <section className="pt-32 md:pt-40 pb-16 border-b border-charcoal-100">
        <div className="container-luxury">
          <div className="max-w-2xl">
            <motion.p
              initial="hidden" animate="visible" variants={FADE_UP}
              className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4"
            >
              Lady B Designs
            </motion.p>
            <motion.h1
              initial="hidden" animate="visible" custom={1} variants={FADE_UP}
              className="font-serif font-light text-5xl md:text-7xl text-charcoal-900 mb-5"
            >
              Collections
            </motion.h1>
            <motion.p
              initial="hidden" animate="visible" custom={2} variants={FADE_UP}
              className="text-charcoal-500 font-body text-lg leading-relaxed"
            >
              Each collection is a world of its own — a distinct expression of what handcraft can achieve.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Collections grid */}
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COLLECTIONS.map((col, i) => (
              <motion.div
                key={col.slug}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08} variants={FADE_UP}
              >
                <Link to={`/collections/${col.slug}`} className="group block">
                  <div className={`relative overflow-hidden ${col.aspect} mb-5`}>
                    <img
                      src={col.img}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-1.5">{col.name}</h2>
                      <p className="text-charcoal-500 font-body text-sm leading-relaxed max-w-xs">{col.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-2">{col.count}</p>
                      <ArrowRight className="h-4 w-4 text-charcoal-400 group-hover:text-charcoal-900 group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke callout */}
      <section className="py-20 bg-charcoal-900">
        <div className="container-luxury text-center">
          <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4">One of a Kind</p>
          <h2 className="font-serif font-light text-4xl text-ivory mb-5">Don't see your vision?</h2>
          <p className="text-charcoal-300 font-body mb-8 max-w-md mx-auto leading-relaxed">
            All of our pieces can be commissioned in custom colours, sizes, and patterns. Start a bespoke conversation.
          </p>
          <Link
            to="/bespoke"
            className="inline-flex items-center gap-3 bg-ivory text-charcoal-900 px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors"
          >
            Bespoke Commissions
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
