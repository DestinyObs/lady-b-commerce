import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X, Heart, ShoppingBag } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.07, ease: [0.25, 1, 0.5, 1] } }),
};

const CATEGORIES = ['All', 'Bead Bags', 'Necklaces', 'Bracelets', 'Earrings', 'Bespoke'];

const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];

const PRODUCTS = [
  {
    id: 'p1', slug: 'cobalt-eveninng-clutch', name: 'Cobalt Evening Clutch',
    price: 340, category: 'Bead Bags',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85&auto=format&fit=crop',
    badge: 'New',
  },
  {
    id: 'p2', slug: 'crimson-beaded-minaudiere', name: 'Crimson Minaudière',
    price: 285, category: 'Bead Bags',
    img: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=700&q=85&auto=format&fit=crop',
    badge: null,
  },
  {
    id: 'p3', slug: 'ivory-pearl-necklace', name: 'Ivory Pearl Statement',
    price: 175, category: 'Necklaces',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85&auto=format&fit=crop',
    badge: 'Bestseller',
  },
  {
    id: 'p4', slug: 'emerald-crossbody', name: 'Emerald Crossbody',
    price: 420, category: 'Bead Bags',
    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=700&q=85&auto=format&fit=crop',
    badge: null,
  },
  {
    id: 'p5', slug: 'gold-beaded-choker', name: 'Gold Beaded Choker',
    price: 145, category: 'Necklaces',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=700&q=85&auto=format&fit=crop',
    badge: null,
  },
  {
    id: 'p6', slug: 'midnight-clutch', name: 'Midnight Clutch',
    price: 310, category: 'Bead Bags',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85&auto=format&fit=crop&sat=-30',
    badge: 'Limited',
  },
  {
    id: 'p7', slug: 'amber-wrist-cuff', name: 'Amber Wrist Cuff',
    price: 95, category: 'Bracelets',
    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=700&q=85&auto=format&fit=crop&hue=30',
    badge: null,
  },
  {
    id: 'p8', slug: 'sapphire-drop-earrings', name: 'Sapphire Drop Earrings',
    price: 120, category: 'Earrings',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85&auto=format&fit=crop&sat=20',
    badge: 'New',
  },
];

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const [wished, setWished] = useState(false);

  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index * 0.06} variants={FADE_UP}
      className="group"
    >
      <div className="relative overflow-hidden bg-charcoal-50 aspect-[3/4]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-charcoal-900 text-ivory text-2xs tracking-luxury uppercase font-body px-2.5 py-1">
            {product.badge}
          </span>
        )}
        {/* Hover actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => setWished(w => !w)}
            className={`p-2.5 transition-colors ${wished ? 'bg-charcoal-900 text-ivory' : 'bg-ivory text-charcoal-700 hover:bg-charcoal-900 hover:text-ivory'}`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-charcoal-900 text-ivory text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors py-2.5 px-4"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Bag
          </button>
        </div>
      </div>
      <div className="pt-4">
        <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-1">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="font-serif font-light text-xl text-charcoal-900 hover:text-charcoal-600 transition-colors block mb-1">
          {product.name}
        </Link>
        <p className="text-charcoal-700 font-body">${product.price.toLocaleString()}</p>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  useEffect(() => { document.title = 'Shop | Lady B Designs & Handcraft'; }, []);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Header */}
      <section className="pt-32 md:pt-40 pb-12 border-b border-charcoal-100">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.p
                initial="hidden" animate="visible" variants={FADE_UP}
                className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-3"
              >
                Lady B Designs
              </motion.p>
              <motion.h1
                initial="hidden" animate="visible" custom={1} variants={FADE_UP}
                className="font-serif font-light text-5xl md:text-6xl text-charcoal-900"
              >
                Shop
              </motion.h1>
            </div>
            <motion.p
              initial="hidden" animate="visible" custom={2} variants={FADE_UP}
              className="text-charcoal-400 font-body text-sm"
            >
              {filtered.length} pieces
            </motion.p>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-3 mt-8 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-luxury uppercase font-body border transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-charcoal-900 border-charcoal-900 text-ivory'
                    : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="border-b border-charcoal-100">
        <div className="container-luxury py-4 flex items-center justify-between">
          <button
            onClick={() => setFiltersOpen(f => !f)}
            className="flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="bg-transparent text-xs tracking-luxury uppercase font-body text-charcoal-600 focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Product grid */}
      <section className="py-16 md:py-20">
        <div className="container-luxury">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif font-light text-3xl text-charcoal-400 mb-4">No pieces found</p>
              <button onClick={() => setActiveCategory('All')} className="text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 border-b border-charcoal-300 transition-colors">
                View all pieces
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bespoke nudge */}
      <section className="py-16 bg-charcoal-900 mx-6 md:mx-16 mb-16">
        <div className="text-center px-6">
          <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-3">Not finding what you need?</p>
          <h2 className="font-serif font-light text-3xl text-ivory mb-4">Commission a bespoke piece</h2>
          <p className="text-charcoal-300 font-body mb-6 max-w-md mx-auto text-sm">Your exact vision, made by hand exclusively for you.</p>
          <Link
            to="/bespoke"
            className="inline-block bg-ivory text-charcoal-900 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors"
          >
            Explore Bespoke
          </Link>
        </div>
      </section>
    </div>
  );
}
