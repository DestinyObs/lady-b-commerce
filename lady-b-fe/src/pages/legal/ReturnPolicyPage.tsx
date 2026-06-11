import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCcw, AlertCircle, CheckCircle, XCircle, Package, ChevronRight } from 'lucide-react';
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

export default function ReturnPolicyPage() {
  useEffect(() => { document.title = 'Return & Refund Policy | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Breadcrumbs items={[{ label: 'Return & Refund Policy', href: '/returns' }]} showHome />

        <div className="mt-6 mb-12">
          <motion.p className="section-label mb-3" variants={FADE_UP} initial="hidden" animate="visible">Legal</motion.p>
          <motion.h1 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-4" variants={FADE_UP} initial="hidden" animate="visible" custom={1}>
            Return &amp; Refund Policy
          </motion.h1>
          <motion.p className="text-charcoal-400 font-body text-sm" variants={FADE_UP} initial="hidden" animate="visible" custom={2}>
            Effective Date: June 10, 2026
          </motion.p>
          <motion.p className="text-charcoal-600 font-body leading-relaxed mt-5 text-base" variants={FADE_UP} initial="hidden" animate="visible" custom={3}>
            At Lady B Designs and Handcraft, we take great pride in the quality of our handmade products. If you are not entirely satisfied with your purchase, we are here to help.
          </motion.p>
        </div>

        <div className="space-y-12">

          {/* Returns */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Returns</h2>
            </div>
            <div className="pl-11 space-y-3">
              {[
                'Due to the handcrafted nature of our items, returns are accepted only for damaged or defective products.',
                'You must contact us within 7 days of receiving your item to be eligible for a return.',
                'Items must be returned in their original condition and packaging.',
                'Custom or personalized orders cannot be returned unless they arrive damaged or defective.',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                  <p className="text-charcoal-600 font-body leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Refunds */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Refunds</h2>
            </div>
            <div className="pl-11 space-y-3">
              {[
                'Once we receive and inspect your returned item, we will notify you of the status of your refund.',
                'Approved refunds are processed to your original method of payment within 5–7 business days.',
                'Shipping costs are non-refundable, unless the return is due to our error (e.g., wrong or defective item).',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                  <p className="text-charcoal-600 font-body leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Exchanges */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Exchanges</h2>
            </div>
            <div className="pl-11 space-y-3">
              {[
                'We only replace items if they are defective or damaged.',
                'Contact us with a photo and description of the issue to initiate an exchange.',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                  <p className="text-charcoal-600 font-body leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Non-returnable */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Non-Returnable Items</h2>
            </div>
            <div className="pl-11 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Custom-made products', 'Personalized items', 'Sale or clearance items'].map(item => (
                <div key={item} className="bg-charcoal-50 px-4 py-3 text-sm font-body text-charcoal-700 text-center border border-charcoal-100">
                  {item}
                </div>
              ))}
            </div>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* How to initiate */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">How to Initiate a Return</h2>
            </div>
            <div className="pl-11">
              <p className="text-charcoal-600 font-body leading-relaxed mb-4">
                Contact us with your order number, a photo of the item, and a description of the issue. Once approved, mail the item to:
              </p>
              <div className="border border-charcoal-200 p-6 bg-charcoal-50 space-y-1.5">
                <p className="font-serif font-light text-lg text-charcoal-900">Lady B Designs and Handcraft</p>
                <p className="text-charcoal-600 font-body text-sm">{CONTACT.address}</p>
                <p className="text-charcoal-600 font-body text-sm">
                  Email: <a href={`mailto:${CONTACT.email}`} className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">{CONTACT.email}</a>
                </p>
                <p className="text-charcoal-600 font-body text-sm">
                  Phone: <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">{CONTACT.phone}</a>
                </p>
              </div>
              <p className="text-xs text-charcoal-400 font-body mt-4">
                We recommend using a trackable shipping service or purchasing shipping insurance. We cannot guarantee receipt of your returned item.
              </p>
            </div>
          </motion.section>

        </div>

        {/* Legal nav */}
        <div className="mt-16 pt-8 border-t border-charcoal-100">
          <p className="text-xs text-charcoal-400 font-body tracking-luxury uppercase mb-4">Related Policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Shipping Policy', href: '/shipping' },
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
