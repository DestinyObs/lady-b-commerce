import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

export default function CheckoutSuccessPage() {
  useEffect(() => { document.title = 'Order Confirmed | Lady B Designs'; }, []);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-success', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((r) => r.data.data),
    enabled: !!orderId,
    staleTime: Infinity,
  });

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-2xl">

        {/* Animated checkmark */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="w-20 h-20 bg-emerald-luxury/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-emerald-luxury" />
          </div>
        </motion.div>

        <motion.div variants={FADE_UP} initial="hidden" animate="visible" className="text-center mb-10">
          <span className="section-label mb-3 block">Order Confirmed</span>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-4">
            Thank you for your order
          </h1>
          <p className="text-charcoal-500 font-body leading-relaxed">
            Your handcrafted piece is now being prepared with care. We'll notify you when it ships.
          </p>
        </motion.div>

        {/* Order details card */}
        {isLoading ? (
          <Skeleton className="h-48 w-full mb-8" />
        ) : order ? (
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={1}
            className="bg-charcoal-50 p-6 md:p-8 mb-8"
          >
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <p className="text-2xs tracking-widest uppercase text-charcoal-400 font-body mb-1">Order Number</p>
                <p className="font-body font-semibold text-charcoal-900 text-lg">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-2xs tracking-widest uppercase text-charcoal-400 font-body mb-1">Order Date</p>
                <p className="font-body text-charcoal-600">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 border-t border-charcoal-200 pt-4 mb-4">
              {order.items?.map((item: {
                id: string;
                quantity: number;
                price: number;
                product: { name: string };
                variant?: { name: string } | null;
              }) => (
                <div key={item.id} className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-700">
                    {item.quantity}× {item.product.name}
                    {item.variant && ` · ${item.variant.name}`}
                  </span>
                  <span className="text-charcoal-900 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-200 pt-4 space-y-1.5">
              <div className="flex justify-between text-sm font-body text-charcoal-500">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-body text-charcoal-500">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-body font-semibold text-charcoal-900 pt-1">
                <span>Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Fallback when no orderId in URL */
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={1}
            className="bg-charcoal-50 p-6 md:p-8 mb-8 text-center"
          >
            <Package className="h-8 w-8 text-charcoal-300 mx-auto mb-3" />
            <p className="text-sm text-charcoal-500 font-body">Order details will appear in your email shortly.</p>
          </motion.div>
        )}

        {/* Email confirmation note */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={2}
          className="flex items-start gap-3 bg-ivory border border-charcoal-100 p-4 mb-10"
        >
          <Mail className="h-4 w-4 text-gold-champagne flex-shrink-0 mt-0.5" />
          <p className="text-xs text-charcoal-500 font-body leading-relaxed">
            A confirmation email has been sent to your address. Check your spam folder if you don't see it within 5 minutes.
          </p>
        </motion.div>

        {/* What's next */}
        <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={3} className="mb-10">
          <h2 className="font-serif font-light text-xl text-charcoal-900 mb-5">What happens next?</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Crafting begins', desc: 'Your piece enters our artisan queue and is crafted with full attention to detail.' },
              { step: '02', title: 'Quality inspection', desc: 'Every piece is inspected against our luxury standards before packaging.' },
              { step: '03', title: 'Dispatch', desc: 'Your order ships with tracking information sent directly to your email.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="font-serif font-light text-3xl text-charcoal-100 leading-none w-12 flex-shrink-0 pt-0.5">{step}</span>
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900 mb-0.5">{title}</p>
                  <p className="text-sm text-charcoal-400 font-body">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-col sm:flex-row gap-3"
        >
          {orderId && (
            <Link to={`/account/orders/${orderId}`} className="flex-1">
              <Button variant="primary" className="w-full">
                Track Your Order
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link to="/shop" className="flex-1">
            <Button variant="secondary" className="w-full">Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
