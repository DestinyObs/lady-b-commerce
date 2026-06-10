import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.07, ease: [0.25, 1, 0.5, 1] } }),
};

const SORT_MAP: Record<string, string> = {
  'Featured': 'featured',
  'Newest': 'newest',
  'Price: Low to High': 'price_asc',
  'Price: High to Low': 'price_desc',
  'Name A–Z': 'name_asc',
};

const SORT_OPTIONS = Object.keys(SORT_MAP);
const PAGE_SIZE = 12;

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  category?: { name: string };
  images?: Array<{ url: string; altText?: string }>;
  isFeatured?: boolean;
  badge?: string;
}

function ProductCard({ product, index }: { product: ProductItem; index: number }) {
  const [wished, setWished] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `local-${product.id}`,
      productId: product.id,
      quantity: 1,
      price: product.price,
      product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
    });
  };

  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index * 0.06} variants={FADE_UP}
      className="group"
    >
      <div className="relative overflow-hidden bg-charcoal-50 aspect-[3/4]">
        {product.images?.[0] ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-charcoal-900 text-ivory text-2xs tracking-luxury uppercase font-body px-2.5 py-1">
            {product.badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => setWished(w => !w)}
            className={`p-2.5 transition-colors ${wished ? 'bg-charcoal-900 text-ivory' : 'bg-ivory text-charcoal-700 hover:bg-charcoal-900 hover:text-ivory'}`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToBag}
            className="flex-1 flex items-center justify-center gap-2 bg-charcoal-900 text-ivory text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors py-2.5 px-4"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Bag
          </button>
        </div>
      </div>
      <div className="pt-4">
        {product.category && (
          <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-1">{product.category.name}</p>
        )}
        <Link to={`/product/${product.slug}`} className="font-serif font-light text-xl text-charcoal-900 hover:text-charcoal-600 transition-colors block mb-1">
          {product.name}
        </Link>
        <p className="text-charcoal-700 font-body">{formatCurrency(product.price)}</p>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="pt-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  useEffect(() => { document.title = 'Shop | Lady B Designs & Handcraft'; }, []);

  const [activeCategory, setActiveCategory] = useState('');
  const [activeSort, setActiveSort] = useState('Featured');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['shop-products', page, activeCategory, activeSort],
    queryFn: () =>
      api.get(`/products?page=${page}&limit=${PAGE_SIZE}&status=ACTIVE&categorySlug=${encodeURIComponent(activeCategory)}&sort=${SORT_MAP[activeSort] || 'featured'}`)
        .then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.get('/categories?isActive=true&limit=20').then((r) => r.data.data?.categories || []),
    staleTime: 5 * 60 * 1000,
  });

  const products: ProductItem[] = data?.products || [];
  const total: number = data?.total || 0;
  const categories: Array<{ id: string; name: string; slug: string }> = categoriesData || [];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  };

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
              {isLoading ? '…' : `${total} piece${total !== 1 ? 's' : ''}`}
            </motion.p>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-3 mt-8 overflow-x-auto pb-1">
            <button
              onClick={() => handleCategoryChange('')}
              className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-luxury uppercase font-body border transition-colors duration-200 ${
                activeCategory === '' ? 'bg-charcoal-900 border-charcoal-900 text-ivory' : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-500'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-luxury uppercase font-body border transition-colors duration-200 ${
                  activeCategory === cat.slug ? 'bg-charcoal-900 border-charcoal-900 text-ivory' : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="border-b border-charcoal-100">
        <div className="container-luxury py-4 flex items-center justify-between">
          {activeCategory && (
            <button
              onClick={() => handleCategoryChange('')}
              className="flex items-center gap-1.5 text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Clear filter
            </button>
          )}
          <div className="ml-auto">
            <select
              value={activeSort}
              onChange={(e) => { setActiveSort(e.target.value); setPage(1); }}
              className="bg-transparent text-xs tracking-luxury uppercase font-body text-charcoal-600 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="py-16 md:py-20">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif font-light text-3xl text-charcoal-400 mb-4">No pieces found</p>
              <button
                onClick={() => handleCategoryChange('')}
                className="text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 border-b border-charcoal-300 transition-colors"
              >
                View all pieces
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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
