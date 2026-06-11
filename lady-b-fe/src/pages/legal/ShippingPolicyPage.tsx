import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, Globe, Clock, MapPin, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 1, 0.5, 1] } }),
};

const CONTACT = {
  address: '731 Westbury West Dr, Indianapolis, IN 46224',
  phone: '+1 (317) 507-4966',
  email: 'Adebiyiblessing55@gmail.com',
};

const USA_RATES = [
  { method: 'Standard Shipping', time: '5–7 business days', cost: 'Calculated at checkout' },
  { method: 'Expedited Shipping', time: '2–3 business days', cost: 'Calculated at checkout' },
  { method: 'Free Standard Shipping', time: '5–7 business days', cost: 'Free on orders over $250' },
];

export default function ShippingPolicyPage() {
  useEffect(() => { document.title = 'Shipping Policy | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Breadcrumbs items={[{ label: 'Shipping Policy', href: '/shipping' }]} showHome />

        <div className="mt-6 mb-12">
          <motion.p className="section-label mb-3" variants={FADE_UP} initial="hidden" animate="visible">Legal</motion.p>
          <motion.h1 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-4" variants={FADE_UP} initial="hidden" animate="visible" custom={1}>
            Shipping Policy
          </motion.h1>
          <motion.p className="text-charcoal-400 font-body text-sm" variants={FADE_UP} initial="hidden" animate="visible" custom={2}>
            Effective Date: June 10, 2026
          </motion.p>
          <motion.p className="text-charcoal-600 font-body leading-relaxed mt-5 text-base" variants={FADE_UP} initial="hidden" animate="visible" custom={3}>
            Every Lady B piece is made by hand with care. Please review our shipping timelines before placing your order, especially for custom and bespoke commissions.
          </motion.p>
        </div>

        <div className="space-y-12">

          {/* Processing time */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Processing Time</h2>
            </div>
            <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-charcoal-50 p-5 border border-charcoal-100">
                <p className="text-xs tracking-luxury uppercase font-body text-charcoal-400 mb-2">Ready-Made Items</p>
                <p className="font-serif font-light text-2xl text-charcoal-900 mb-1">3–5</p>
                <p className="text-sm text-charcoal-600 font-body">business days after payment confirmation</p>
              </div>
              <div className="bg-charcoal-900 p-5">
                <p className="text-xs tracking-luxury uppercase font-body text-charcoal-400 mb-2">Custom &amp; Bespoke Orders</p>
                <p className="font-serif font-light text-2xl text-ivory mb-1">6–8</p>
                <p className="text-sm text-charcoal-300 font-body">weeks of crafting time before shipping</p>
              </div>
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Destinations */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Globe className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Destinations</h2>
            </div>
            <p className="pl-11 text-charcoal-600 font-body leading-relaxed">
              We ship domestically within the United States and internationally to most countries worldwide.
            </p>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Domestic shipping */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Domestic Shipping (USA)</h2>
            </div>
            <div className="pl-11">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-charcoal-200">
                      <th className="text-left py-3 text-xs tracking-luxury uppercase text-charcoal-400 font-normal">Method</th>
                      <th className="text-left py-3 text-xs tracking-luxury uppercase text-charcoal-400 font-normal">Delivery Time</th>
                      <th className="text-right py-3 text-xs tracking-luxury uppercase text-charcoal-400 font-normal">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-100">
                    {USA_RATES.map(row => (
                      <tr key={row.method}>
                        <td className="py-4 text-charcoal-900 font-medium">{row.method}</td>
                        <td className="py-4 text-charcoal-600">{row.time}</td>
                        <td className="py-4 text-charcoal-600 text-right">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* International */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">International Shipping</h2>
            </div>
            <div className="pl-11 space-y-3">
              {[
                'International orders typically arrive within 10–21 business days depending on destination.',
                'The customer is responsible for any customs duties, taxes, or import fees levied by their country.',
                'We are not responsible for delays caused by customs processing.',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                  <p className="text-charcoal-600 font-body leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Tracking */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Order Tracking</h2>
            </div>
            <p className="pl-11 text-charcoal-600 font-body leading-relaxed">
              Once your order ships, you will receive a confirmation email with a tracking number. You can track your order directly through your account dashboard under <Link to="/account/orders" className="text-charcoal-900 border-b border-charcoal-300">My Orders</Link>.
            </p>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Lost/Damaged */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Lost, Stolen, or Damaged</h2>
            </div>
            <div className="pl-11 space-y-3">
              {[
                'Lady B Designs and Handcraft is not responsible for lost or stolen packages once confirmed as delivered by the carrier.',
                'Please ensure your shipping address is accurate before placing your order.',
                'If your item arrives damaged, contact us within 7 days of delivery with photos. We will resolve the issue promptly.',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                  <p className="text-charcoal-600 font-body leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Contact */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6}>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-5">Questions?</h2>
            <div className="border-l-2 border-gold-champagne pl-6 space-y-1.5 font-body text-sm">
              <p className="text-charcoal-700 font-medium">Lady B Designs and Handcraft</p>
              <p className="text-charcoal-600">{CONTACT.address}</p>
              <p className="text-charcoal-600">
                Email: <a href={`mailto:${CONTACT.email}`} className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">{CONTACT.email}</a>
              </p>
              <p className="text-charcoal-600">
                Phone: <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">{CONTACT.phone}</a>
              </p>
            </div>
          </motion.section>

        </div>

        {/* Legal nav */}
        <div className="mt-16 pt-8 border-t border-charcoal-100">
          <p className="text-xs text-charcoal-400 font-body tracking-luxury uppercase mb-4">Related Policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Return & Refund Policy', href: '/returns' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms & Conditions', href: '/terms' },
            ].map(link => (
              <Link key={link.label} to={link.href} className="inline-flex items-center gap-1 text-xs font-body text-charcoal-500 hover:text-charcoal-900 transition-colors border-b border-charcoal-200 pb-0.5">
                {link.label} <ChevronRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
