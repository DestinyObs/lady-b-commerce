import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Product photography — real bead bag images
const IMG = {
  heroRight:  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1800&q=90&auto=format&fit=crop',
  colBags:    'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=900&q=85&auto=format&fit=crop',
  colNeck:    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85&auto=format&fit=crop',
  colCustom:  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&q=85&auto=format&fit=crop',
  colNew:     'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=85&auto=format&fit=crop',
  feature:    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=85&auto=format&fit=crop',
  craft1:     'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
  craft2:     'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&q=80&auto=format&fit=crop',
};

const MARQUEE_TEXT = Array(6).fill(
  'Handmade in Indianapolis  ·  Premium Japanese Seed Beads  ·  Bespoke Commissions  ·  Ships Worldwide  ·  Wearable Art  ·  '
).join('');

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  useEffect(() => { document.title = 'Lady B Designs and Handcraft | Luxury Artisan Fashion'; }, []);

  return (
    <div className="bg-ivory overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex" aria-labelledby="hero-heading">
        {/* Left panel — ivory, editorial text */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[48%] bg-ivory px-8 sm:px-12 xl:px-20 pt-32 pb-16 lg:pt-36 lg:pb-20 min-h-screen">
          <motion.span
            className="text-2xs tracking-widest uppercase text-gold-champagne font-body font-medium mb-6 block"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            New Collection Available
          </motion.span>

          <motion.h1
            id="hero-heading"
            className="font-serif font-light text-charcoal-900 leading-[1.02] tracking-tight mb-7"
            style={{ fontSize: 'clamp(3.2rem, 5.5vw, 6rem)' }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            Wearable Art,<br />
            <em className="italic text-charcoal-600">Crafted by Hand</em>
          </motion.h1>

          <motion.p
            className="text-charcoal-500 font-body font-light text-base leading-relaxed max-w-sm mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            Luxury handcrafted bead bags, statement necklaces, and bespoke accessories for women who choose rare.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-charcoal-900 text-ivory px-8 py-4 text-xs tracking-luxury uppercase font-body font-medium hover:bg-charcoal-800 transition-colors duration-300"
            >
              Shop the Collection
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/custom-orders/start"
              className="inline-flex items-center gap-3 border border-charcoal-900/30 text-charcoal-900 px-8 py-4 text-xs tracking-luxury uppercase font-body font-medium hover:border-charcoal-900 transition-colors duration-300"
            >
              Request Bespoke
            </Link>
          </motion.div>

          {/* Brand atelier note */}
          <div className="mt-10 flex items-center gap-3">
            <div className="w-8 h-px bg-charcoal-300" />
            <span className="text-2xs tracking-widest uppercase text-charcoal-400 font-body">Indianapolis Atelier</span>
          </div>
        </div>

        {/* Right panel — full editorial image */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[54%] overflow-hidden">
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <img
              src={IMG.heroRight}
              alt="Lady B editorial — luxury artisan fashion"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
            <div className="absolute inset-0 bg-charcoal-900/10" />
          </motion.div>
        </div>

        {/* Mobile full-bleed hero bg */}
        <div className="absolute inset-0 lg:hidden">
          <img src={IMG.heroRight} alt="" className="w-full h-full object-cover object-top" loading="eager" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/95 via-ivory/80 to-ivory/60" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ────────────────────────────────────────────────── */}
      <div className="bg-gold-champagne/15 border-y border-gold-champagne/25 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <span className="animate-marquee shrink-0 text-2xs tracking-widest uppercase text-charcoal-700 font-body font-medium">
            {MARQUEE_TEXT}
          </span>
          <span className="animate-marquee shrink-0 text-2xs tracking-widest uppercase text-charcoal-700 font-body font-medium" aria-hidden="true">
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      {/* ── EDITORIAL INTRO ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 container-luxury max-w-4xl mx-auto text-center">
        <FadeUp>
          <span className="section-label mb-5 block">The House</span>
          <p className="font-serif font-light text-charcoal-800 leading-[1.4]" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}>
            Lady B Designs is an artisan house from Indianapolis, crafting bead bags, necklaces, and bespoke accessories by hand — piece by piece, bead by bead — for women who refuse to be ordinary.
          </p>
        </FadeUp>
      </section>

      {/* ── COLLECTIONS EDITORIAL GRID ───────────────────────────────────── */}
      <section className="pb-24 md:pb-32 container-luxury" aria-labelledby="collections-heading">
        <FadeUp className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label mb-2 block">Curated Selections</span>
            <h2 id="collections-heading" className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">
              The Collections
            </h2>
          </div>
          <Link
            to="/collections"
            className="hidden md:inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-charcoal-500 hover:text-charcoal-900 transition-colors font-body group"
          >
            View All <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </FadeUp>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
          {/* Bead Bags — tall, 5 cols */}
          <FadeUp delay={0.05} className="col-span-2 lg:col-span-5 row-span-2">
            <Link to="/collections/bead-bags" className="group block relative overflow-hidden bg-charcoal-100" style={{ aspectRatio: '4/5' }}>
              <img
                src={IMG.colBags}
                alt="Bead Bags Collection"
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/75 via-charcoal-900/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="text-2xs tracking-widest uppercase text-gold-champagne font-body block mb-1.5">Architectural luxury</span>
                <h3 className="font-serif font-light text-2xl md:text-3xl text-ivory leading-tight">Bead Bags</h3>
                <div className="flex items-center gap-2 mt-3 text-ivory/50 text-2xs tracking-widest uppercase font-body group-hover:text-ivory/90 transition-colors duration-300">
                  Explore <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </FadeUp>

          {/* Necklaces — top right, 7 cols */}
          <FadeUp delay={0.1} className="col-span-1 lg:col-span-7">
            <Link to="/collections/necklaces" className="group block relative overflow-hidden bg-charcoal-100" style={{ aspectRatio: '16/9' }}>
              <img
                src={IMG.colNeck}
                alt="Statement Necklaces Collection"
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <span className="text-2xs tracking-widest uppercase text-gold-champagne font-body block mb-1">Wearable sculpture</span>
                <h3 className="font-serif font-light text-xl md:text-2xl text-ivory">Statement Necklaces</h3>
              </div>
            </Link>
          </FadeUp>

          {/* Custom Orders — mid right, 3 cols */}
          <FadeUp delay={0.15} className="col-span-1 lg:col-span-3">
            <Link to="/custom-orders" className="group block relative overflow-hidden bg-charcoal-100" style={{ aspectRatio: '1/1' }}>
              <img
                src={IMG.colCustom}
                alt="Custom Orders"
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/75 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-2xs tracking-widest uppercase text-gold-champagne font-body block mb-1">Your vision</span>
                <h3 className="font-serif font-light text-lg text-ivory">Custom Orders</h3>
              </div>
            </Link>
          </FadeUp>

          {/* New Arrivals — mid right wide, 4 cols */}
          <FadeUp delay={0.2} className="col-span-2 lg:col-span-4">
            <Link to="/shop?filter=new-arrivals" className="group block relative overflow-hidden bg-charcoal-100" style={{ aspectRatio: '5/4' }}>
              <img
                src={IMG.colNew}
                alt="New Arrivals"
                className="w-full h-full object-cover object-top transition-transform duration-[800ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <span className="text-2xs tracking-widest uppercase text-gold-champagne font-body block mb-1">Just crafted</span>
                <h3 className="font-serif font-light text-xl md:text-2xl text-ivory">New Arrivals</h3>
              </div>
            </Link>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="text-center mt-8 md:hidden">
          <Link to="/collections" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-charcoal-600 hover:text-charcoal-900 transition-colors font-body">
            View All Collections <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </FadeUp>
      </section>

      {/* ── SIGNATURE FEATURE ────────────────────────────────────────────── */}
      <section className="bg-charcoal-900" aria-labelledby="signature-heading">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Image */}
          <div className="relative overflow-hidden min-h-[380px] lg:min-h-0">
            <FadeUp className="w-full h-full">
              <img
                src={IMG.feature}
                alt="The Ivory Arch Bead Bag — Lady B signature piece"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal-900/20" />
            </FadeUp>
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center px-8 sm:px-12 xl:px-20 py-20 md:py-28">
            <FadeUp delay={0.1}>
              <span className="section-label text-gold-champagne mb-5 block">Signature Piece</span>
              <h2 id="signature-heading" className="font-serif font-light text-ivory leading-tight mb-7" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
                The Ivory<br />Arch Bead Bag
              </h2>
              <p className="text-ivory/55 font-body font-light text-base leading-relaxed mb-3 max-w-md">
                Over 40 hours of hand-strung Japanese seed beads, set in a custom brass frame. Each pearl-white bead placed with intention.
              </p>
              <p className="text-ivory/55 font-body font-light text-base leading-relaxed mb-10 max-w-md">
                This is not mass production. This is craft elevated to art.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-12 pt-8 border-t border-ivory/10 max-w-sm">
                {[['40+', 'Hours crafted'], ['300+', 'Beads per piece'], ['1', 'Of a kind']].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-serif text-3xl font-light text-ivory">{num}</p>
                    <p className="text-2xs tracking-widest uppercase text-ivory/35 font-body mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/product/ivory-arch-bead-bag"
                className="group inline-flex items-center gap-3 border border-ivory/30 text-ivory px-8 py-4 text-xs tracking-luxury uppercase font-body font-medium hover:bg-ivory hover:text-charcoal-900 transition-all duration-300 self-start"
              >
                View the Piece
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CRAFT PROCESS ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-pearl" aria-labelledby="craft-heading">
        <div className="container-luxury">
          <FadeUp className="text-center mb-16 md:mb-20">
            <span className="section-label mb-3 block">The Process</span>
            <h2 id="craft-heading" className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">
              Made by Hand.<br className="hidden md:block" /> Not by Machine.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-charcoal-200">
            {[
              { step: '01', label: 'Design', desc: 'Patterns drawn by hand, color palettes selected by eye — before a single bead is touched.' },
              { step: '02', label: 'Source', desc: 'Premium Japanese seed beads and Czech glass, chosen for luster, weight, and consistency.' },
              { step: '03', label: 'Craft', desc: 'Hand-strung, bead by bead, over dozens of hours. No shortcuts. No machinery.' },
              { step: '04', label: 'Finish', desc: 'Each piece inspected and signed. Packaged in luxury boxes, ready to be gifted.' },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.1} className="px-0 md:px-8 lg:px-10 py-10 md:py-0 first:pl-0 last:pr-0">
                <span className="font-serif text-5xl font-light text-charcoal-200 block mb-5">{item.step}</span>
                <h3 className="font-serif font-light text-xl text-charcoal-900 mb-3">{item.label}</h3>
                <p className="text-sm text-charcoal-500 font-body font-light leading-relaxed">{item.desc}</p>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2} className="text-center mt-16">
            <Link
              to="/craftsmanship"
              className="group inline-flex items-center gap-3 border border-charcoal-900/30 text-charcoal-900 px-8 py-4 text-xs tracking-luxury uppercase font-body font-medium hover:border-charcoal-900 transition-colors duration-300"
            >
              Explore Our Process
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── BESPOKE CALL ─────────────────────────────────────────────────── */}
      <section
        className="relative py-28 md:py-40 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332 0%, #14532D 60%, #0f3d25 100%)' }}
        aria-labelledby="bespoke-heading"
      >
        {/* Subtle geometric accent */}
        <div className="absolute top-0 right-0 w-96 h-96 border border-ivory/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-ivory/5 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="container-luxury max-w-3xl mx-auto text-center relative z-10">
          <FadeUp>
            <span className="section-label text-gold-champagne mb-5 block">Commission Your Piece</span>
            <h2 id="bespoke-heading" className="font-serif font-light text-ivory leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)' }}>
              Something Made<br />Only For You
            </h2>
            <p className="text-ivory/60 font-body font-light text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              A piece that reflects your vision, your occasion, your identity. From bead bag to matching set to clothing alteration — we create what doesn't exist yet.
            </p>
            <Link
              to="/custom-orders/start"
              className="group inline-flex items-center gap-3 border border-ivory/35 text-ivory px-10 py-5 text-xs tracking-luxury uppercase font-body font-medium hover:bg-ivory hover:text-charcoal-900 transition-all duration-300"
            >
              Begin Your Commission
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── WHY LADY B ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 container-luxury" aria-labelledby="why-heading">
        <FadeUp className="text-center mb-14">
          <span className="section-label mb-3 block">Our Promise</span>
          <h2 id="why-heading" className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">
            Why Lady B Designs
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 max-w-5xl mx-auto divide-y divide-charcoal-100">
          {[
            { title: 'Handmade Every Piece', desc: 'No machinery, no mass production. Every item is created by hand in our Indianapolis atelier.' },
            { title: 'Unique Designs', desc: 'Our patterns and color combinations are original. No two pieces are ever identical.' },
            { title: 'Premium Materials', desc: 'We source only the finest Japanese seed beads, Czech glass, and quality hardware.' },
            { title: 'Fully Customizable', desc: 'Commission a bespoke piece tailored exactly to your colors, dimensions, and occasion.' },
            { title: 'Global Shipping', desc: 'Your piece, wherever you are. Carefully packaged and insured for safe worldwide delivery.' },
            { title: 'Secure Checkout', desc: 'Stripe and PayPal protected payments. Your data and your order, always protected.' },
          ].map((item, i) => (
            <FadeUp key={item.title} delay={i * 0.06}>
              <div className="py-7 flex gap-5 items-start">
                <div className="w-5 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-light text-lg text-charcoal-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-charcoal-500 font-body font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-charcoal-900 py-24 md:py-32" aria-labelledby="reviews-heading">
        <div className="container-luxury">
          <FadeUp className="text-center mb-14">
            <span className="section-label text-gold-champagne mb-3 block">Words of Distinction</span>
            <h2 id="reviews-heading" className="font-serif font-light text-4xl md:text-5xl text-ivory">
              What Our Clients Say
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {[
              {
                name: 'Amara N.',
                location: 'London, UK',
                quote: 'I commissioned a custom bead bag for my sister\'s wedding. Lady B created something so extraordinary that people couldn\'t stop asking about it. The craftsmanship is unbelievable.',
              },
              {
                name: 'Chinwe O.',
                location: 'Lagos, Nigeria',
                quote: 'The Emerald Cascade necklace arrived in the most beautiful packaging. When I wore it to the gala, I felt like artwork. This is genuine luxury — not a brand name, an experience.',
              },
              {
                name: 'Victoria M.',
                location: 'New York, USA',
                quote: 'I own pieces from designer houses and nothing compares to the feeling of wearing something truly made by hand. Lady B is in a category entirely of her own.',
              },
            ].map((r, i) => (
              <FadeUp key={r.name} delay={i * 0.12} className="h-full">
                <div className="border border-ivory/8 p-8 md:p-10 hover:border-gold-champagne/30 transition-colors duration-500 flex flex-col h-full">
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-gold-champagne text-sm">★</span>
                    ))}
                  </div>
                  <blockquote className="font-serif font-light text-lg text-ivory/85 leading-relaxed flex-1 mb-8">
                    "{r.quote}"
                  </blockquote>
                  <footer>
                    <p className="text-sm font-body font-medium text-ivory">{r.name}</p>
                    <p className="text-xs text-ivory/35 font-body mt-0.5">{r.location}</p>
                  </footer>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / SHIPPING STRIP ───────────────────────────────────────── */}
      <section className="bg-ivory border-t border-charcoal-100 py-10">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-charcoal-200 text-center">
            {[
              { icon: '✦', title: 'Free Shipping', sub: 'On orders over $250' },
              { icon: '◈', title: 'Secure Payment', sub: 'Stripe & PayPal protected' },
              { icon: '◯', title: 'Bespoke Service', sub: '6–8 week lead time' },
              { icon: '◻', title: 'Quality Guarantee', sub: 'Every piece inspected' },
            ].map((t) => (
              <div key={t.title} className="md:px-8 py-4 md:py-0">
                <span className="text-gold-champagne text-lg block mb-2">{t.icon}</span>
                <p className="text-xs tracking-luxury uppercase font-body font-medium text-charcoal-900">{t.title}</p>
                <p className="text-xs text-charcoal-400 font-body mt-1">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
