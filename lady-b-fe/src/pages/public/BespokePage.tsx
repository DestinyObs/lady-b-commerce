import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Palette, Package, ArrowRight } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const STEPS = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Share Your Vision',
    desc: 'Begin with a simple message. Tell us about the occasion, your style, your colour preferences, and any specific design ideas. No vision is too ambitious — we love a challenge.',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Design Consultation',
    desc: 'We\'ll schedule a consultation (in person at our Indianapolis atelier, or virtually) to discuss your commission in detail. We\'ll present initial concepts and material samples for you to approve.',
  },
  {
    icon: Package,
    step: '03',
    title: 'Crafting & Delivery',
    desc: 'Once approved, our artisan begins work. You\'ll receive progress updates throughout. When complete, your one-of-a-kind piece is packaged and delivered with care.',
  },
];

const CATEGORIES = [
  {
    title: 'Bespoke Bead Bags',
    desc: 'Clutches, minaudières, evening bags, crossbodies — any silhouette, any pattern, any colour palette. Starting from $280.',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85&auto=format&fit=crop',
  },
  {
    title: 'Custom Necklaces',
    desc: 'Statement pieces, layering necklaces, cultural designs. Every bead chosen for you. Starting from $120.',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85&auto=format&fit=crop',
  },
  {
    title: 'Bridal Commissions',
    desc: 'Matching bridal accessories, complete bridal party sets, or a single centrepiece accessory for your special day. Starting from $350.',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85&auto=format&fit=crop',
  },
];

export default function BespokePage() {
  useEffect(() => { document.title = 'Bespoke Commissions | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-0 bg-charcoal-900 overflow-hidden">
        <div className="container-luxury pb-20">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-5"
          >
            Made For You
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-6xl md:text-8xl text-ivory leading-none mb-8 max-w-3xl"
          >
            Bespoke<br />Commissions
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg leading-relaxed max-w-lg mb-10"
          >
            A piece made exclusively for you — your colours, your design, your story. Every commission is a collaboration between your vision and our craft.
          </motion.p>
          <motion.div
            initial="hidden" animate="visible" custom={3} variants={FADE_UP}
          >
            <Link
              to="/contact?subject=bespoke"
              className="inline-flex items-center gap-3 bg-ivory text-charcoal-900 px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors duration-300"
            >
              Begin a Commission
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="w-full h-[45vh] md:h-[60vh] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=1800&q=85&auto=format&fit=crop"
            alt="Bespoke bead bag detail"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-16"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">How It Works</p>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">Three steps to yours</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-charcoal-100">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1} variants={FADE_UP}
                  className="bg-ivory p-10 md:p-12"
                >
                  <div className="flex items-start justify-between mb-8">
                    <Icon className="h-6 w-6 text-charcoal-600" />
                    <span className="font-serif font-light text-4xl text-charcoal-100">{s.step}</span>
                  </div>
                  <h3 className="font-serif font-light text-2xl text-charcoal-900 mb-4">{s.title}</h3>
                  <p className="text-charcoal-500 font-body leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commission categories */}
      <section className="py-24 bg-charcoal-50">
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-16"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">What We Create</p>
            <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">Commission Categories</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1} variants={FADE_UP}
                className="bg-ivory overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="font-serif font-light text-2xl text-charcoal-900 mb-3">{c.title}</h3>
                  <p className="text-charcoal-500 font-body leading-relaxed text-sm">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ-style notes */}
      <section className="py-24 md:py-32">
        <div className="container-luxury max-w-3xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-12"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Good to Know</p>
            <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900">Commission Details</h2>
          </motion.div>

          <div className="space-y-8">
            {[
              { q: 'How long does a commission take?', a: 'Most bespoke pieces take 3–6 weeks from design approval to delivery. Complex or large commissions may require additional time. We\'ll confirm your timeline during consultation.' },
              { q: 'What is the deposit structure?', a: 'We require a 50% deposit to begin work, with the remaining 50% due before dispatch. Deposits are non-refundable once beading has begun.' },
              { q: 'Can I specify exact colours?', a: 'Absolutely. We work with a wide palette of seed beads and can often match specific colour references. Bring a swatch, a photo, or a Pantone reference — we\'ll do our best to match it.' },
              { q: 'Do you ship internationally?', a: 'Yes. We ship bespoke commissions worldwide via fully tracked and insured carriers. International delivery times and fees will be quoted at checkout.' },
            ].map((item, i) => (
              <motion.div
                key={item.q}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05} variants={FADE_UP}
                className="border-b border-charcoal-100 pb-8"
              >
                <h3 className="font-serif font-light text-xl text-charcoal-900 mb-3">{item.q}</h3>
                <p className="text-charcoal-500 font-body leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-900">
        <div className="container-luxury text-center">
          <h2 className="font-serif font-light text-4xl text-ivory mb-6">Ready to begin?</h2>
          <p className="text-charcoal-300 font-body mb-8 max-w-md mx-auto leading-relaxed">
            Send us a message with your idea and we'll get back to you within 24 hours to discuss your commission.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-ivory text-charcoal-900 px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors duration-300"
          >
            Start a Conversation
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
