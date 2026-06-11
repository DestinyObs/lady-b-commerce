import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Minus, Plus, Trash2, Truck, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { Button } from '../ui/Button';
import { api } from '../../lib/axios';

const FREE_SHIPPING_THRESHOLD = 250;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining === 0;

  return (
    <div className={`px-6 py-3 ${unlocked ? 'bg-emerald-luxury/8' : 'bg-charcoal-50'} border-b border-charcoal-100`}>
      <div className="flex items-center gap-2 mb-2">
        <Truck className={`h-3.5 w-3.5 flex-shrink-0 ${unlocked ? 'text-emerald-luxury' : 'text-charcoal-400'}`} />
        <p className={`text-xs font-body ${unlocked ? 'text-emerald-luxury font-medium' : 'text-charcoal-500'}`}>
          {unlocked
            ? 'Free shipping unlocked on your order'
            : `Add ${formatCurrency(remaining)} more for free shipping`}
        </p>
      </div>
      <div className="h-1 bg-charcoal-200 overflow-hidden">
        <motion.div
          className={`h-full ${unlocked ? 'bg-emerald-luxury' : 'bg-gold-champagne'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </div>
  );
}

function UpsellNudge({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['cart-upsell'],
    queryFn: () => api.get('/products?status=ACTIVE&limit=2&sort=newest').then((r) => r.data?.data?.products || []),
    staleTime: 5 * 60 * 1000,
  });

  const products: Array<{ id: string; name: string; slug: string; price: number; images?: Array<{ url: string; altText?: string }> }> = data || [];

  if (isLoading || products.length === 0) {
    return (
      <div className="px-6 py-5 border-t border-charcoal-100 bg-charcoal-50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-gold-champagne" />
          <p className="text-2xs tracking-luxury uppercase text-charcoal-400 font-body">Crafted for You</p>
        </div>
        <Link
          to="/bespoke"
          onClick={onClose}
          className="flex items-center justify-between group"
        >
          <div>
            <p className="text-sm font-serif text-charcoal-900 mb-0.5">Commission a bespoke piece</p>
            <p className="text-xs text-charcoal-400 font-body">Handcrafted to your exact vision</p>
          </div>
          <ArrowRight className="h-4 w-4 text-charcoal-300 group-hover:text-charcoal-900 transition-colors flex-shrink-0" />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 border-t border-charcoal-100 bg-charcoal-50">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-3.5 w-3.5 text-gold-champagne" />
        <p className="text-2xs tracking-luxury uppercase text-charcoal-400 font-body">You may also love</p>
      </div>
      <div className="space-y-3">
        {products.slice(0, 2).map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="w-14 h-16 bg-charcoal-100 overflow-hidden flex-shrink-0">
              {p.images?.[0] && (
                <img
                  src={getImageUrl(p.images[0].url, 100)}
                  alt={p.images[0].altText || p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-serif text-charcoal-900 line-clamp-1 group-hover:text-charcoal-600 transition-colors">{p.name}</p>
              <p className="text-xs text-charcoal-500 font-body mt-0.5">{formatCurrency(p.price)}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-charcoal-300 group-hover:text-charcoal-700 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getItemCount, getSubtotal, updateQuantity, removeItem } = useCartStore();
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-charcoal-900/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md bg-ivory shadow-cart-drawer z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            aria-label="Shopping cart"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-charcoal-600" />
                <h2 className="font-serif font-light text-xl text-charcoal-900">
                  Your Bag {itemCount > 0 && <span className="text-charcoal-400 text-base">({itemCount})</span>}
                </h2>
              </div>
              <button onClick={onClose} className="btn-ghost p-1.5 -mr-1.5" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping bar — always visible when items present */}
            {items.length > 0 && <FreeShippingBar subtotal={subtotal} />}

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-charcoal-200 mb-4" />
                <h3 className="font-serif font-light text-xl text-charcoal-900 mb-2">Your bag is empty</h3>
                <p className="text-sm text-charcoal-400 font-body mb-8">Explore our handcrafted collection</p>
                <Button variant="primary" onClick={onClose}>
                  <Link to="/shop">Explore Collection</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 px-6 py-4 border-b border-charcoal-50"
                      >
                        <Link to={`/product/${item.product.slug}`} onClick={onClose} className="flex-shrink-0">
                          <div className="w-20 h-24 bg-charcoal-50 overflow-hidden">
                            {item.product.images?.[0] && (
                              <img
                                src={getImageUrl(item.product.images[0].url, 200)}
                                alt={item.product.images[0].altText || item.product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={onClose}
                            className="font-serif font-light text-sm text-charcoal-900 hover:text-charcoal-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-charcoal-400 font-body mt-0.5">
                              {item.variant.name}
                              {item.variant.color && ` · ${item.variant.color}`}
                            </p>
                          )}
                          <p className="text-sm font-body font-medium text-charcoal-900 mt-1">
                            {formatCurrency(item.price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-charcoal-200">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-charcoal-300 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Upsell nudge */}
                  <UpsellNudge onClose={onClose} />
                </div>

                {/* Footer */}
                <div className="border-t border-charcoal-100 px-6 py-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-charcoal-600 font-body">Subtotal</span>
                    <span className="text-sm font-body font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <p className="text-xs text-charcoal-400 font-body">Shipping and taxes calculated at checkout</p>
                  <Link to="/checkout" onClick={onClose} className="block">
                    <Button variant="primary" className="w-full">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/cart" onClick={onClose} className="block text-center text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase">
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
