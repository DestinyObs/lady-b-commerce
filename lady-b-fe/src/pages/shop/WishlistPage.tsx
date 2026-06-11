import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

interface WishlistItem {
  id: string;
  product: {
    id: string; name: string; slug: string; price: number;
    compareAtPrice?: number;
    category?: { name: string };
    images?: Array<{ url: string; altText?: string }>;
    isAvailable?: boolean;
  };
}

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full mb-4" />
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-5 w-full mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  useEffect(() => { document.title = 'Wishlist | Lady B Designs & Handcraft'; }, []);

  const user = useAuthStore(s => s.user);
  const { addItem, openCart } = useCartStore();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ items: WishlistItem[]; total: number }>({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/account/wishlist').then(r => r.data.data),
    enabled: !!user,
  });

  const removeFromWishlist = useMutation({
    mutationFn: (itemId: string) => api.delete(`/account/wishlist/${itemId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wishlist'] }); toast.success('Removed from wishlist'); },
    onError: () => toast.error('Could not remove item'),
  });

  const handleAddToBag = (item: WishlistItem) => {
    addItem({
      id: `wish-${item.product.id}-${Date.now()}`,
      productId: item.product.id,
      quantity: 1,
      price: item.product.price,
      product: { id: item.product.id, name: item.product.name, slug: item.product.slug, images: item.product.images },
    });
    toast.success('Added to your bag');
    openCart();
  };

  const items: WishlistItem[] = data?.items || [];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="pt-36 md:pt-44 pb-12 border-b border-charcoal-100">
        <div className="container-luxury">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="flex items-center gap-3 mb-2">
            <Heart className="h-5 w-5 text-charcoal-400" />
            <span className="text-charcoal-400 text-xs tracking-luxury uppercase font-body">Saved</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" custom={1} variants={FADE_UP} className="font-serif font-light text-5xl md:text-6xl text-charcoal-900">
            Wishlist
          </motion.h1>
          {items.length > 0 && (
            <motion.p initial="hidden" animate="visible" custom={2} variants={FADE_UP} className="text-charcoal-400 font-body mt-2">
              {items.length} saved {items.length === 1 ? 'piece' : 'pieces'}
            </motion.p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-luxury">
          {/* Not logged in */}
          {!user && (
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 border border-charcoal-200 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-charcoal-300" />
              </div>
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Sign in to view your wishlist</h2>
              <p className="text-charcoal-400 font-body mb-8 leading-relaxed">
                Create an account or sign in to save pieces and access them from any device.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link to="/login" className="flex-1 flex items-center justify-center gap-2 bg-charcoal-900 text-ivory py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="flex-1 flex items-center justify-center gap-2 border border-charcoal-900 text-charcoal-900 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-50 transition-colors">
                  Create Account
                </Link>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {user && isLoading && <WishlistSkeleton />}

          {/* Empty */}
          {user && !isLoading && items.length === 0 && (
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 border border-charcoal-200 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-charcoal-300" />
              </div>
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Nothing saved yet</h2>
              <p className="text-charcoal-400 font-body mb-8 leading-relaxed">
                Browse our collections and tap the heart on any piece to save it here.
              </p>
              <Link to="/shop" className="inline-flex items-center gap-3 bg-charcoal-900 text-ivory px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors">
                <ShoppingBag className="h-3.5 w-3.5" /> Explore the Shop
              </Link>
            </motion.div>
          )}

          {/* Items grid */}
          {user && !isLoading && items.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={FADE_UP}
                  className="group"
                >
                  <div className="relative overflow-hidden bg-charcoal-50 aspect-[3/4]">
                    <Link to={`/product/${item.product.slug}`}>
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.images[0].altText || item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                      )}
                    </Link>

                    {!item.product.isAvailable && (
                      <div className="absolute inset-0 bg-ivory/60 flex items-center justify-center">
                        <span className="text-xs tracking-luxury uppercase font-body text-charcoal-500 bg-ivory px-3 py-1">Sold Out</span>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => handleAddToBag(item)}
                        disabled={!item.product.isAvailable}
                        className="flex-1 flex items-center justify-center gap-2 bg-charcoal-900 text-ivory text-xs tracking-luxury uppercase font-body py-2.5 hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
                      </button>
                      <button
                        onClick={() => removeFromWishlist.mutate(item.id)}
                        className="p-2.5 bg-ivory text-charcoal-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    {item.product.category && (
                      <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-1">{item.product.category.name}</p>
                    )}
                    <Link to={`/product/${item.product.slug}`} className="font-serif font-light text-xl text-charcoal-900 hover:text-charcoal-600 transition-colors block mb-1 leading-snug">
                      {item.product.name}
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <p className="text-charcoal-700 font-body">{formatCurrency(item.product.price)}</p>
                      {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                        <p className="text-charcoal-400 font-body text-sm line-through">{formatCurrency(item.product.compareAtPrice)}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse more */}
      <section className="py-16 bg-charcoal-50 border-t border-charcoal-100">
        <div className="container-luxury text-center">
          <p className="section-label mb-3">Discover</p>
          <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-6">Continue exploring</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Bead Bags', 'Necklaces', 'Bracelets', 'Earrings', 'Gift Ideas'].map(cat => (
              <Link
                key={cat}
                to="/shop"
                className="border border-charcoal-200 bg-ivory px-6 py-2.5 text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:border-charcoal-900 hover:text-charcoal-900 transition-colors inline-flex items-center gap-2"
              >
                {cat} <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
