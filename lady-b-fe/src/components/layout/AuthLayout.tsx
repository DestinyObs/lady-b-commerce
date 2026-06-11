import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Truck, Star } from 'lucide-react';

const PERKS = [
  { icon: Star, text: 'Early access to new collections' },
  { icon: Truck, text: 'Free shipping on orders over $250' },
  { icon: Shield, text: 'Secure checkout & order tracking' },
];

const FADE = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* ── Brand panel (desktop left) ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-charcoal-900 flex-col relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-champagne/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-charcoal-700/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-ivory/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-ivory/5 rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link to="/" className="inline-block group">
            <span className="font-serif font-light tracking-luxury text-lg uppercase text-ivory group-hover:text-gold-champagne transition-colors">Lady B</span>
            <span className="block text-2xs tracking-widest uppercase text-ivory/40 mt-0.5">Designs &amp; Handcraft</span>
          </Link>
        </div>

        {/* Centre quote */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-10 xl:px-14">
          <div className="w-8 h-px bg-gold-champagne mb-8" />
          <blockquote className="font-serif font-light text-3xl xl:text-4xl text-ivory leading-tight mb-6">
            "Every bead tells<br />a story. Yours<br />is next."
          </blockquote>
          <p className="text-ivory/40 text-xs tracking-luxury uppercase font-body">
            Handcrafted in Indianapolis
          </p>
        </div>

        {/* Perks */}
        <div className="relative z-10 px-10 xl:px-14 pb-10 space-y-4">
          <div className="w-full h-px bg-ivory/10 mb-6" />
          {PERKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-gold-champagne flex-shrink-0" />
              <span className="text-sm text-ivory/50 font-body">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel (right / full on mobile) ─────────────────────── */}
      <div className="flex-1 flex flex-col bg-ivory">
        {/* Mobile logo — only shows below lg */}
        <header className="lg:hidden py-7 px-6 border-b border-charcoal-100 text-center">
          <Link to="/" className="inline-block">
            <span className="font-serif font-light tracking-luxury text-base uppercase text-charcoal-900">Lady B</span>
            <span className="block text-2xs tracking-widest uppercase text-charcoal-400 mt-0.5">Designs &amp; Handcraft</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
          <motion.div
            className="w-full max-w-sm"
            initial="hidden"
            animate="visible"
            variants={FADE}
          >
            <Outlet />
          </motion.div>
        </main>

        <footer className="py-5 px-6 border-t border-charcoal-100 text-center lg:text-left">
          <p className="text-xs text-charcoal-400 font-body">
            © {new Date().getFullYear()} Lady B Designs and Handcraft ·{' '}
            <Link to="/privacy" className="hover:text-charcoal-900 transition-colors">Privacy</Link>
            {' · '}
            <Link to="/terms" className="hover:text-charcoal-900 transition-colors">Terms</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
