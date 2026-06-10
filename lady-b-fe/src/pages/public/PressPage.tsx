import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const MENTIONS = [
  {
    pub: 'Vogue Business',
    headline: '"The Indianapolis artisan redefining what luxury accessories can be"',
    date: 'March 2026',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=85&auto=format&fit=crop',
  },
  {
    pub: 'Black Enterprise',
    headline: '"From grandmother\'s workshop to global acclaim: Lady B\'s handcraft revolution"',
    date: 'January 2026',
    img: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=85&auto=format&fit=crop',
  },
  {
    pub: 'Forbes Africa',
    headline: '"The beadwork entrepreneur bringing West African tradition to American luxury"',
    date: 'November 2025',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85&auto=format&fit=crop',
  },
];

export default function PressPage() {
  useEffect(() => { document.title = 'Press | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-16 bg-charcoal-900">
        <div className="container-luxury">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4"
          >
            Media & Press
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-7xl text-ivory mb-5"
          >
            Press
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg max-w-xl leading-relaxed"
          >
            Lady B Designs & Handcraft has been recognised by leading publications across fashion, business, and culture.
          </motion.p>
        </div>
      </section>

      {/* Press mentions */}
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-12"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">As Seen In</p>
            <h2 className="font-serif font-light text-4xl text-charcoal-900">Press Features</h2>
          </motion.div>

          <div className="space-y-px bg-charcoal-100">
            {MENTIONS.map((m, i) => (
              <motion.div
                key={m.pub}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08} variants={FADE_UP}
                className="bg-ivory grid grid-cols-12 gap-6 p-8 md:p-10"
              >
                <div className="col-span-12 md:col-span-2">
                  <p className="font-serif font-light text-lg text-charcoal-900">{m.pub}</p>
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mt-1">{m.date}</p>
                </div>
                <div className="col-span-12 md:col-span-7 md:col-start-4 flex items-center">
                  <p className="font-serif font-light text-xl md:text-2xl text-charcoal-700 italic leading-relaxed">{m.headline}</p>
                </div>
                <div className="col-span-12 md:col-span-2 md:col-start-11">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={m.img} alt={m.pub} className="w-full h-full object-cover" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media kit + contact */}
      <section className="py-20 bg-charcoal-50">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            >
              <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Resources</p>
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-5">Media Kit</h2>
              <p className="text-charcoal-500 font-body leading-relaxed mb-8">
                Our media kit includes high-resolution imagery, brand guidelines, founder bio, and product photography. Available on request for approved editorial use.
              </p>
              <button className="flex items-center gap-3 border border-charcoal-900 text-charcoal-900 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-900 hover:text-ivory transition-colors duration-300">
                <Download className="h-3.5 w-3.5" />
                Request Media Kit
              </button>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={FADE_UP}
            >
              <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Enquiries</p>
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-5">Press Contact</h2>
              <p className="text-charcoal-500 font-body leading-relaxed mb-6">
                For press enquiries, interview requests, product loans, or editorial collaborations, please reach out directly.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:Adebiyiblessing55@gmail.com"
                  className="flex items-center gap-3 text-charcoal-700 font-body hover:text-charcoal-900 transition-colors"
                >
                  <Mail className="h-4 w-4 text-charcoal-400" />
                  Adebiyiblessing55@gmail.com
                </a>
                <p className="text-charcoal-400 font-body text-sm">We aim to respond to all press enquiries within 48 hours.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
