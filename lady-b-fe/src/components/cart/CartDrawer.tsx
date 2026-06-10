import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { Button } from '../ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

            {/* Items */}
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
                <div className="flex-1 overflow-y-auto py-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 px-6 py-4 border-b border-charcoal-50">
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
                    </div>
                  ))}
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
