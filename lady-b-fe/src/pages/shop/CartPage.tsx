import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

export default function CartPage() {
  useEffect(() => { document.title = 'Your Bag | Lady B Designs & Handcraft'; }, []);

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-ivory">
      <section className="pt-32 md:pt-40 pb-12 border-b border-charcoal-100">
        <div className="container-luxury">
          <motion.h1
            initial="hidden" animate="visible" variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-6xl text-charcoal-900"
          >
            Your Bag
          </motion.h1>
          {items.length > 0 && (
            <p className="text-charcoal-400 font-body mt-2">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxury">
          {items.length === 0 ? (
            <motion.div
              initial="hidden" animate="visible" variants={FADE_UP}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <ShoppingBag className="h-12 w-12 text-charcoal-200 mb-6" />
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Your bag is empty</h2>
              <p className="text-charcoal-400 font-body mb-8 max-w-sm">Discover our handcrafted bead bags and accessories.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-charcoal-900 text-ivory px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors"
              >
                Explore the Shop
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Items list */}
              <div className="lg:col-span-2 space-y-px">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial="hidden" animate="visible" custom={i} variants={FADE_UP}
                    className="flex gap-6 py-6 border-b border-charcoal-100"
                  >
                    <div className="w-24 h-24 bg-charcoal-50 overflow-hidden flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-light text-xl text-charcoal-900 mb-1">{item.name}</h3>
                      <p className="text-charcoal-500 font-body text-sm mb-2">Qty: {item.quantity}</p>
                      <p className="text-charcoal-700 font-body">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-charcoal-300 hover:text-charcoal-700 transition-colors flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <motion.div
                initial="hidden" animate="visible" custom={2} variants={FADE_UP}
                className="lg:col-span-1"
              >
                <div className="bg-charcoal-50 p-8 sticky top-28">
                  <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between font-body text-charcoal-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-body text-charcoal-500 text-sm">
                      <span>Shipping</span>
                      <span>{subtotal >= 250 ? 'Free' : 'Calculated at checkout'}</span>
                    </div>
                    {subtotal < 250 && (
                      <p className="text-charcoal-400 text-xs font-body">Add ${(250 - subtotal).toLocaleString()} more for free shipping</p>
                    )}
                  </div>
                  <div className="border-t border-charcoal-200 pt-4 mb-6">
                    <div className="flex justify-between font-body text-charcoal-900 font-medium">
                      <span>Total</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-3 bg-charcoal-900 text-ivory py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/shop"
                    className="block text-center text-charcoal-500 text-xs tracking-luxury uppercase font-body mt-4 hover:text-charcoal-900 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
