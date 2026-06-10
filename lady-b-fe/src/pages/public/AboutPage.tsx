import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const VALUES = [
  {
    number: '01',
    title: 'Handcrafted Excellence',
    body: 'Every piece is hand-beaded by our artisans, never mass-produced. The imperfections you notice are signatures of authenticity.',
  },
  {
    number: '02',
    title: 'Cultural Heritage',
    body: 'Rooted in West African beading traditions, our designs carry centuries of storytelling through pattern, colour, and form.',
  },
  {
    number: '03',
    title: 'Bespoke by Nature',
    body: 'We believe luxury is personal. Every commission begins with a conversation, and ends with a piece made exclusively for you.',
  },
  {
    number: '04',
    title: 'Sustainable Craft',
    body: 'We source materials responsibly and produce in small batches, ensuring zero unnecessary waste and lasting quality.',
  },
];

export default function AboutPage() {
  useEffect(() => { document.title = 'About Lady B | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="relative pt-32 pb-0 md:pt-40 overflow-hidden">
        <div className="container-luxury pb-20">
          <div className="max-w-3xl">
            <motion.p
              initial="hidden" animate="visible" variants={FADE_UP}
              className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-5"
            >
              Our Heritage
            </motion.p>
            <motion.h1
              initial="hidden" animate="visible" custom={1} variants={FADE_UP}
              className="font-serif font-light text-6xl md:text-8xl text-charcoal-900 leading-none mb-8"
            >
              About<br />Lady B
            </motion.h1>
            <motion.p
              initial="hidden" animate="visible" custom={2} variants={FADE_UP}
              className="text-charcoal-500 font-body text-lg leading-relaxed max-w-xl"
            >
              A luxury artisan house born in Indianapolis, rooted in West African craft, and dedicated to the enduring beauty of handcrafted accessories.
            </motion.p>
          </div>
        </div>

        {/* Full-width image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="w-full h-[55vh] md:h-[70vh] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=1800&q=85&auto=format&fit=crop"
            alt="Lady B artisan beadwork"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </section>

      {/* Intro editorial */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
            <div className="md:col-span-5">
              <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-6">The Atelier</p>
              <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 leading-tight">
                Where craft meets couture
              </h2>
            </div>
            <div className="md:col-span-7 md:pt-10">
              <p className="text-charcoal-600 font-body leading-relaxed text-lg mb-6">
                Lady B Designs & Handcraft was founded by Blessing Adebiy, a master artisan whose passion for beadwork began in her grandmother's workshop in West Africa. Carrying that tradition across continents, she established her atelier in Indianapolis, Indiana — where old-world craftsmanship meets contemporary luxury design.
              </p>
              <p className="text-charcoal-500 font-body leading-relaxed">
                Each Lady B piece is the product of countless hours of deliberate, patient work. From sourcing the finest seed beads to designing bespoke patterns for individual clients, every step is performed by hand. We do not rush the creative process — because true luxury cannot be manufactured in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-luxury">
          <div className="mb-16">
            <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4">What We Stand For</p>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-ivory">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-charcoal-700">
            {VALUES.map((v) => (
              <motion.div
                key={v.number}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
                className="bg-charcoal-900 p-8 lg:p-10"
              >
                <span className="block font-serif font-light text-5xl text-charcoal-700 mb-6">{v.number}</span>
                <h3 className="font-serif font-light text-xl text-ivory mb-4">{v.title}</h3>
                <p className="text-charcoal-400 font-body text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split feature */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="aspect-[4/5] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop"
                alt="Lady B handcrafted bead bag"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
              className="lg:pl-8"
            >
              <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-6">Indianapolis Atelier</p>
              <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 leading-tight mb-8">
                A studio in the heart of the Midwest
              </h2>
              <p className="text-charcoal-600 font-body leading-relaxed mb-6">
                Our Indianapolis atelier serves clients across the United States and internationally, with a focus on personalized service. We believe every customer deserves the experience of fine craftsmanship — not just ownership of it.
              </p>
              <p className="text-charcoal-500 font-body leading-relaxed mb-10">
                In-person consultations are available by appointment. Virtual bespoke sessions are available worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/our-story"
                  className="inline-block border border-charcoal-900 text-charcoal-900 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-900 hover:text-ivory transition-colors duration-300"
                >
                  Our Full Story
                </Link>
                <Link
                  to="/contact"
                  className="inline-block text-charcoal-500 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:text-charcoal-900 transition-colors duration-300 border-b border-charcoal-300"
                >
                  Visit the Atelier
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 bg-charcoal-50 border-t border-b border-charcoal-100">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '500+', label: 'Pieces Crafted' },
              { stat: '12+', label: 'Years of Craft' },
              { stat: '30+', label: 'Countries Reached' },
              { stat: '100%', label: 'Handmade Always' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-2">{stat}</p>
                <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
