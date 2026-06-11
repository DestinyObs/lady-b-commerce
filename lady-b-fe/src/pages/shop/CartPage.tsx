import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, Tag, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../lib/utils';
import { api } from '../../lib/axios';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

const FREE_SHIPPING_THRESHOLD = 250;

export default function CartPage() {
  useEffect(() => { document.title = 'Your Bag | Lady B Designs & Handcraft'; }, []);

  const { items, removeItem, updateQuantity, couponCode, couponDiscount, setCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');

  const handleRemove = (id: string) => {
    removeItem(id); // optimistic
    api.delete(`/cart/items/${id}`).catch(() => {});
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty < 1) { handleRemove(id); return; }
    updateQuantity(id, qty); // optimistic
    api.patch(`/cart/items/${id}`, { quantity: qty }).catch(() => {});
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const total = Math.max(0, subtotal - couponDiscount);

  const couponMutation = useMutation({
    mutationFn: (code: string) =>
      api.post('/coupons/validate', { code, subtotal }).then((r) => r.data.data),
    onSuccess: (data: { code: string; discountAmount: number }) => {
      setCoupon(data.code, data.discountAmount);
      toast.success(`Coupon applied — ${data.code}`);
      setCouponInput('');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Invalid or expired coupon code');
    },
  });

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="pt-32 md:pt-40 pb-12 border-b border-charcoal-100">
        <div className="container-luxury">
          <div className="flex items-end justify-between">
            <div>
              <motion.p initial="hidden" animate="visible" variants={FADE_UP} className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-2">
                Lady B Designs
              </motion.p>
              <motion.h1 initial="hidden" animate="visible" custom={1} variants={FADE_UP} className="font-serif font-light text-5xl md:text-6xl text-charcoal-900">
                Your Bag
              </motion.h1>
            </div>
            {items.length > 0 && (
              <motion.p initial="hidden" animate="visible" custom={2} variants={FADE_UP} className="text-charcoal-400 font-body text-sm mb-1">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </motion.p>
            )}
          </div>

          {/* Free shipping bar */}
          {items.length > 0 && (
            <motion.div initial="hidden" animate="visible" custom={3} variants={FADE_UP} className="mt-8 max-w-lg">
              <div className="flex justify-between text-xs font-body text-charcoal-500 mb-2">
                {remaining > 0
                  ? <span>Add <strong className="text-charcoal-900">{formatCurrency(remaining)}</strong> more for free shipping</span>
                  : <span className="text-emerald-luxury font-medium">You qualify for free shipping!</span>
                }
                <span>{formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>
              </div>
              <div className="h-1 bg-charcoal-100 w-full">
                <div className="h-full bg-charcoal-900 transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxury">
          {items.length === 0 ? (
            <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag className="h-12 w-12 text-charcoal-200 mb-6" />
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Your bag is empty</h2>
              <p className="text-charcoal-400 font-body mb-8 max-w-sm">Discover our handcrafted bead bags and accessories.</p>
              <Link to="/shop" className="inline-flex items-center gap-3 bg-charcoal-900 text-ivory px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors">
                Explore the Shop <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Items */}
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-5 py-7 border-b border-charcoal-100"
                    >
                      <Link to={`/product/${item.product.slug}`} className="w-24 h-24 md:w-28 md:h-28 bg-charcoal-50 overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity">
                        {item.product.images?.[0]?.url
                          ? <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                        }
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link to={`/product/${item.product.slug}`} className="font-serif font-light text-lg text-charcoal-900 hover:text-charcoal-600 transition-colors leading-tight">
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-charcoal-300 hover:text-red-500 transition-colors flex-shrink-0 p-1 -mt-1"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {item.variant && (
                          <p className="text-xs text-charcoal-400 font-body mb-3">{item.variant.name}</p>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="inline-flex items-center border border-charcoal-200">
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-body font-medium text-charcoal-900">{formatCurrency(item.price * item.quantity)}</p>
                        </div>

                        {item.quantity > 1 && (
                          <p className="text-xs text-charcoal-400 font-body mt-1">{formatCurrency(item.price)} each</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between">
                  <Link to="/shop" className="text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 transition-colors flex items-center gap-1.5">
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <motion.div initial="hidden" animate="visible" custom={2} variants={FADE_UP} className="lg:col-span-1">
                <div className="bg-charcoal-50 p-7 sticky top-28 space-y-6">
                  <h2 className="font-serif font-light text-2xl text-charcoal-900">Order Summary</h2>

                  {/* Coupon */}
                  <div>
                    {couponCode ? (
                      <div className="flex items-center justify-between bg-emerald-luxury/10 border border-emerald-luxury/20 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-emerald-luxury" />
                          <span className="text-sm font-body font-medium text-charcoal-900">{couponCode}</span>
                          <span className="text-xs text-emerald-luxury font-body">−{formatCurrency(couponDiscount)}</span>
                        </div>
                        <button onClick={removeCoupon} className="text-charcoal-400 hover:text-charcoal-900 transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && couponInput.trim() && couponMutation.mutate(couponInput.trim())}
                          placeholder="Coupon code"
                          className="input-luxury flex-1 text-sm py-2.5"
                        />
                        <button
                          onClick={() => couponInput.trim() && couponMutation.mutate(couponInput.trim())}
                          disabled={couponMutation.isPending || !couponInput.trim()}
                          className="px-4 bg-charcoal-900 text-ivory text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors disabled:opacity-50"
                        >
                          {couponMutation.isPending ? '…' : 'Apply'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Line items */}
                  <div className="space-y-3">
                    <div className="flex justify-between font-body text-charcoal-600 text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between font-body text-emerald-luxury text-sm">
                        <span>Discount ({couponCode})</span>
                        <span>−{formatCurrency(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-body text-charcoal-500 text-sm">
                      <span>Shipping</span>
                      <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : 'Calculated at checkout'}</span>
                    </div>
                  </div>

                  <div className="border-t border-charcoal-200 pt-4">
                    <div className="flex justify-between font-body font-semibold text-charcoal-900 text-base">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <p className="text-xs text-charcoal-400 font-body mt-1">Tax calculated at checkout</p>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-3 bg-charcoal-900 text-ivory py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors"
                  >
                    Proceed to Checkout <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <div className="flex flex-col gap-2 text-center">
                    {['Stripe', 'PayPal', 'Visa / Mastercard'].map(m => (
                      <span key={m} className="text-2xs text-charcoal-400 font-body">{m}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* You might love */}
      <section className="py-16 bg-charcoal-50 border-t border-charcoal-100">
        <div className="container-luxury">
          <p className="section-label mb-3 text-center">Discover More</p>
          <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-8 text-center">You might also love</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Bead Bags', 'Statement Necklaces', 'Bespoke Commissions', 'Bracelets', 'Gift Sets'].map(cat => (
              <Link
                key={cat}
                to="/shop"
                className="border border-charcoal-200 bg-ivory px-6 py-3 text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:border-charcoal-900 hover:text-charcoal-900 transition-colors inline-flex items-center gap-2"
              >
                {cat} <ChevronRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
