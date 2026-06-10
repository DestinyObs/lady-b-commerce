import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const PROCESS = [
  {
    step: '01',
    title: 'Material Sourcing',
    desc: 'We begin by hand-selecting the finest seed beads, glass beads, and semi-precious stones. Every material is inspected for consistency in colour, size, and quality before it enters the workshop.',
    detail: '2–4 weeks of sourcing per collection',
  },
  {
    step: '02',
    title: 'Pattern Design',
    desc: 'Each design starts as a sketch — inspired by West African weaving patterns, geometric art, and the client\'s personality. No two designs are identical, and every pattern is drawn by hand before beading begins.',
    detail: '1–2 weeks per original design',
  },
  {
    step: '03',
    title: 'Hand-Beading',
    desc: 'Working needle by needle, bead by bead, our artisan threads each element into place. A single clutch bag can contain over 3,000 individual beads — each one placed with intention and precision.',
    detail: '10–40 hours per piece depending on complexity',
  },
  {
    step: '04',
    title: 'Structural Forming',
    desc: 'The beaded surface is carefully mounted onto an interior frame — either hand-stitched leather or structured fabric — ensuring the piece holds its shape and withstands years of use.',
    detail: 'Luxury grade hardware, custom hardware available',
  },
  {
    step: '05',
    title: 'Finishing & Inspection',
    desc: 'Every completed piece passes through a rigorous quality inspection. Loose beads are re-secured, edges refined, linings checked. Only when every detail meets our standard does a piece leave the atelier.',
    detail: 'Full quality check before dispatch',
  },
  {
    step: '06',
    title: 'Packaging & Dispatch',
    desc: 'Each Lady B piece is wrapped in tissue, placed in a keepsake dust bag, and boxed with care. Your order arrives as a gift — because receiving a handcrafted piece should feel like a ceremony.',
    detail: 'Signature box and dust bag included',
  },
];

const MATERIALS = [
  { name: 'Japanese Seed Beads', note: 'Toho & Miyuki — finest grade uniformity' },
  { name: 'Czech Glass Beads', note: 'Fire-polished, rich colour depth' },
  { name: 'Freshwater Pearls', note: 'Selected for lustre and size consistency' },
  { name: 'Semi-Precious Stones', note: 'Turquoise, onyx, garnet, and more' },
  { name: 'Swarovski Crystal', note: 'For statement and evening pieces' },
  { name: 'Italian Leather', note: 'Interior lining and hardware backing' },
];

export default function CraftsmanshipPage() {
  useEffect(() => { document.title = 'Craftsmanship | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-32 md:pt-40 bg-charcoal-900">
        <div className="container-luxury pb-20">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-5"
          >
            The Art of Making
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-6xl md:text-8xl text-ivory leading-none mb-8 max-w-2xl"
          >
            Craft &amp;<br />Process
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg leading-relaxed max-w-xl"
          >
            Every Lady B piece is the product of patience, precision, and passion. Here is how a handful of beads becomes an heirloom.
          </motion.p>
        </div>
      </section>

      {/* Full-width image */}
      <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=1800&q=85&auto=format&fit=crop"
          alt="Artisan beadwork close-up"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Process steps */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-16"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Six Stages</p>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">How a piece is made</h2>
          </motion.div>

          <div className="space-y-0">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05} variants={FADE_UP}
                className="grid grid-cols-12 gap-6 md:gap-16 py-12 border-b border-charcoal-100 last:border-0"
              >
                <div className="col-span-2 sm:col-span-1">
                  <span className="font-serif font-light text-3xl text-charcoal-200">{p.step}</span>
                </div>
                <div className="col-span-10 sm:col-span-4">
                  <h3 className="font-serif font-light text-2xl text-charcoal-900">{p.title}</h3>
                </div>
                <div className="col-span-12 sm:col-span-5 sm:col-start-6 -mt-2 sm:mt-0">
                  <p className="text-charcoal-600 font-body leading-relaxed mb-3">{p.desc}</p>
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{p.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
                <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-5">What We Use</p>
                <h2 className="font-serif font-light text-4xl md:text-5xl text-ivory mb-10">Our Materials</h2>
                <div className="space-y-px">
                  {MATERIALS.map((m) => (
                    <div key={m.name} className="flex justify-between items-start py-4 border-b border-charcoal-800">
                      <span className="text-ivory font-body">{m.name}</span>
                      <span className="text-charcoal-400 font-body text-sm text-right ml-4">{m.note}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="aspect-square overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop"
                alt="Bead materials"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Time investment */}
      <section className="py-24 md:py-32 bg-charcoal-50">
        <div className="container-luxury text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Time Invested</p>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-12">Every hour tells</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: '3,000+', label: 'Beads per clutch' },
              { stat: '40hrs', label: 'Max per complex piece' },
              { stat: '6', label: 'Stages of making' },
              { stat: '100%', label: 'Hand-finished always' },
            ].map(({ stat, label }) => (
              <motion.div
                key={label}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
              >
                <p className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-2">{stat}</p>
                <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-900">
        <div className="container-luxury text-center">
          <h2 className="font-serif font-light text-4xl text-ivory mb-6">Commission your own piece</h2>
          <p className="text-charcoal-300 font-body mb-8 max-w-md mx-auto">Start a bespoke conversation today and we'll craft something uniquely yours.</p>
          <Link
            to="/bespoke"
            className="inline-block bg-ivory text-charcoal-900 px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors duration-300"
          >
            Begin a Commission
          </Link>
        </div>
      </section>
    </div>
  );
}
