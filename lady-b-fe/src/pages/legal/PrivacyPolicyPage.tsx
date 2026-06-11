import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Database, Share2, Cookie, Lock, UserCheck, ChevronRight } from 'lucide-react';
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

const SECTIONS = [
  {
    icon: Database,
    title: 'Information We Collect',
    items: [
      'Contact Information: Name, email address, phone number, shipping and billing address',
      'Order Information: Products purchased, payment details (processed securely via third-party services)',
      'Usage Information: Pages viewed, time spent on site, and browser type (via cookies and analytics tools)',
    ],
  },
  {
    icon: Shield,
    title: 'How We Use Your Information',
    items: [
      'To process and fulfill your orders',
      'To communicate with you about your order or customer service inquiries',
      'To send updates, promotions, or newsletters — you can opt out at any time',
      'To improve our website and customer experience',
      'To comply with legal obligations',
    ],
  },
  {
    icon: Share2,
    title: 'Who We Share It With',
    items: [
      'Payment processors: PayPal, Stripe',
      'Shipping providers: USPS, FedEx',
      'Analytics tools: Google Analytics',
      'Legal authorities if required by law',
    ],
    note: 'We do not sell or rent your personal information to third parties.',
  },
];

export default function PrivacyPolicyPage() {
  useEffect(() => { document.title = 'Privacy Policy | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Breadcrumbs items={[{ label: 'Privacy Policy', href: '/privacy' }]} showHome />

        <div className="mt-6 mb-12">
          <motion.p className="section-label mb-3" variants={FADE_UP} initial="hidden" animate="visible">Legal</motion.p>
          <motion.h1 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-4" variants={FADE_UP} initial="hidden" animate="visible" custom={1}>
            Privacy Policy
          </motion.h1>
          <motion.p className="text-charcoal-400 font-body text-sm" variants={FADE_UP} initial="hidden" animate="visible" custom={2}>
            Effective Date: June 10, 2026
          </motion.p>
          <motion.p className="text-charcoal-600 font-body leading-relaxed mt-5 text-base" variants={FADE_UP} initial="hidden" animate="visible" custom={3}>
            At Lady B Designs and Handcraft, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or interact with our services.
          </motion.p>
        </div>

        <div className="space-y-12">

          {SECTIONS.map(({ icon: Icon, title, items, note }, idx) => (
            <React.Fragment key={title}>
              <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-ivory" />
                  </div>
                  <h2 className="font-serif font-light text-2xl text-charcoal-900">{title}</h2>
                </div>
                <div className="pl-11 space-y-3">
                  {note && (
                    <div className="bg-emerald-luxury/10 border-l-2 border-emerald-luxury px-4 py-3 mb-4">
                      <p className="text-sm text-charcoal-700 font-body font-medium">{note}</p>
                    </div>
                  )}
                  {items.map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />
                      <p className="text-charcoal-600 font-body leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
              <div className="border-t border-charcoal-100" />
            </React.Fragment>
          ))}

          {/* Cookies */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Cookie className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Cookies</h2>
            </div>
            <p className="pl-11 text-charcoal-600 font-body leading-relaxed">
              Our website uses cookies to enhance your browsing experience. Cookies help us understand user behaviour and improve our services. You can disable cookies through your browser settings if you prefer, though some features may not function correctly without them.
            </p>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Security */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Lock className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Security</h2>
            </div>
            <p className="pl-11 text-charcoal-600 font-body leading-relaxed">
              We take reasonable technical and organisational measures to protect your personal information from unauthorised access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure. We encourage you to take precautions when sharing sensitive data online.
            </p>
          </motion.section>

          <div className="border-t border-charcoal-100" />

          {/* Your rights */}
          <motion.section variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <UserCheck className="h-4 w-4 text-ivory" />
              </div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900">Your Rights</h2>
            </div>
            <div className="pl-11 space-y-3">
              {[
                'Access, update, or delete your personal information',
                'Withdraw consent for marketing communications at any time',
                'Request details about how your data is used and stored',
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
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-5">Contact Us</h2>
            <p className="text-charcoal-600 font-body leading-relaxed mb-5">
              If you have questions or concerns about this Privacy Policy or how we handle your data, please contact us:
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
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
            </p>
          </motion.section>

        </div>

        {/* Legal nav */}
        <div className="mt-16 pt-8 border-t border-charcoal-100">
          <p className="text-xs text-charcoal-400 font-body tracking-luxury uppercase mb-4">Related Policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Return & Refund Policy', href: '/returns' },
              { label: 'Shipping Policy', href: '/shipping' },
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
