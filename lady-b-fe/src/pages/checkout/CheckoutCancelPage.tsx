import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function CheckoutCancelPage() {
  useEffect(() => { document.title = 'Order Cancelled | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-md w-full text-center">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 180, damping: 18 }}
        >
          <div className="w-20 h-20 bg-charcoal-50 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-charcoal-300" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="section-label mb-3 block">Payment Cancelled</span>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-4">
            No worries — your bag is safe
          </h1>
          <p className="text-charcoal-500 font-body leading-relaxed mb-10">
            Your order was not processed and you have not been charged. Everything in your bag is still waiting for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-3 mb-10"
        >
          <Link to="/checkout">
            <Button variant="primary" className="w-full">
              <ArrowLeft className="h-4 w-4" />
              Return to Checkout
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="secondary" className="w-full">
              <ShoppingBag className="h-4 w-4" />
              Review Your Bag
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <p className="text-sm text-charcoal-400 font-body mb-3">Need assistance with your order?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:text-charcoal-900 transition-colors border-b border-charcoal-300 pb-0.5"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Contact our team
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
