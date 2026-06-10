import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

export default function WishlistPage() {
  useEffect(() => { document.title = 'Wishlist | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <section className="pt-36 md:pt-44 pb-12 border-b border-charcoal-100">
        <div className="container-luxury">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="flex items-center gap-3 mb-2">
            <Heart className="h-5 w-5 text-charcoal-400" />
            <span className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">Saved</span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-6xl text-charcoal-900"
          >
            Wishlist
          </motion.h1>
        </div>
      </section>

      <section className="py-24">
        <div className="container-luxury">
          <motion.div
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto"
          >
            <div className="w-16 h-16 border border-charcoal-200 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-6 w-6 text-charcoal-300" />
            </div>
            <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Nothing saved yet</h2>
            <p className="text-charcoal-400 font-body mb-8 leading-relaxed">
              Browse our collections and save pieces you love. They'll appear here for easy access.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-charcoal-900 text-ivory px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Explore the Shop
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Suggestions */}
      <section className="py-16 bg-charcoal-50 border-t border-charcoal-100">
        <div className="container-luxury text-center">
          <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Discover</p>
          <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-6">You might love</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {['Bead Bags', 'Necklaces', 'Bracelets', 'Earrings'].map((cat) => (
              <Link
                key={cat}
                to={`/shop`}
                className="border border-charcoal-200 px-6 py-2.5 text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:border-charcoal-900 hover:text-charcoal-900 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
