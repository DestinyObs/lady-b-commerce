import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const TIMELINE = [
  {
    era: 'The Beginning',
    title: "A grandmother's hands",
    body: 'In a small workshop filled with colourful glass beads, young Blessing watched her grandmother transform thread and stone into wearable art. Each pattern told a story. Each colour carried meaning. This is where Lady B was born — not yet by name, but by spirit.',
  },
  {
    era: 'The Journey',
    title: 'Craft across continents',
    body: 'Carrying her grandmother\'s knowledge and a suitcase of seed beads, Blessing moved to Indianapolis, Indiana. She found that the world craved exactly what her hands knew how to make — pieces with soul, identity, and irreplaceable human touch.',
  },
  {
    era: 'The Atelier',
    title: 'Lady B is born',
    body: 'From her Indianapolis studio, Blessing founded Lady B Designs & Handcraft. What started as custom orders for friends became a recognized name in artisan luxury accessories. Her bead bags and necklaces found homes across the United States and beyond.',
  },
  {
    era: 'Today',
    title: 'A living tradition',
    body: 'Lady B continues to create every piece by hand, with the same patience and intentionality as that first workshop. Each collection is a new chapter in an ongoing story — where heritage and modern luxury coexist beautifully.',
  },
];

export default function OurStoryPage() {
  useEffect(() => { document.title = 'Our Story | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-0 bg-charcoal-900 overflow-hidden">
        <div className="container-luxury pb-16">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-5"
          >
            The Lady B Story
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-6xl md:text-8xl text-ivory leading-none mb-8 max-w-3xl"
          >
            Born from<br />tradition.
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg leading-relaxed max-w-lg"
          >
            A story of craft passed down through generations, carried across continents, and made into luxury for the modern world.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="w-full h-[50vh] md:h-[65vh] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1800&q=85&auto=format&fit=crop"
            alt="Artisan bead crafting"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32">
        <div className="container-luxury max-w-4xl">
          <div className="space-y-0">
            {TIMELINE.map((chapter, i) => (
              <motion.div
                key={chapter.era}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1} variants={FADE_UP}
                className="grid grid-cols-12 gap-6 md:gap-12 py-16 border-b border-charcoal-100 last:border-0"
              >
                <div className="col-span-12 sm:col-span-3">
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body pt-1">{chapter.era}</p>
                </div>
                <div className="col-span-12 sm:col-span-9">
                  <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-5">{chapter.title}</h2>
                  <p className="text-charcoal-600 font-body leading-relaxed text-lg">{chapter.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-luxury text-center max-w-3xl">
          <motion.blockquote
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
          >
            <p className="font-serif font-light text-3xl md:text-5xl text-ivory leading-relaxed mb-8">
              "I make things the way my grandmother taught me — with patience, love, and absolute attention to the details no one else will notice."
            </p>
            <cite className="text-charcoal-400 text-xs tracking-luxury uppercase font-body not-italic">
              — Blessing Adebiy, Founder &amp; Lead Artisan
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/craftsmanship"
              className="group relative overflow-hidden bg-charcoal-900 p-12 flex flex-col justify-end min-h-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop"
                alt="Craftsmanship"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="relative z-20">
                <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-2">Explore</p>
                <h3 className="font-serif font-light text-3xl text-ivory mb-3">Our Craft</h3>
                <p className="text-charcoal-300 font-body text-sm">How every piece comes to life</p>
              </div>
            </Link>
            <Link
              to="/bespoke"
              className="group relative overflow-hidden bg-charcoal-900 p-12 flex flex-col justify-end min-h-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85&auto=format&fit=crop"
                alt="Bespoke orders"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="relative z-20">
                <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-2">Commissions</p>
                <h3 className="font-serif font-light text-3xl text-ivory mb-3">Bespoke Service</h3>
                <p className="text-charcoal-300 font-body text-sm">Your vision, crafted by hand</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
