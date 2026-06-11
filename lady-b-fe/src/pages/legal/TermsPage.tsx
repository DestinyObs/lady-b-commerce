import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
    num: '01', title: 'General Information',
    body: 'Lady B Designs and Handcraft offers unique, handmade products including bead bags, necklaces, and bespoke clothing alterations. Due to the handmade nature of our items, slight variations in colour, size, or design may occur — this is part of the charm of artisan goods.',
  },
  {
    num: '02', title: 'Orders',
    body: 'All orders are subject to availability and confirmation of payment. Once your order is placed, you will receive an email confirmation. Custom orders may require additional processing time, which will be clearly communicated before payment is made.',
  },
  {
    num: '03', title: 'Pricing and Payment',
    body: 'All prices are listed in USD and are subject to change without notice. We accept secure payments via Credit/Debit Cards, PayPal, Stripe, and Bank Transfer. Full payment must be received before items are shipped or production begins.',
  },
  {
    num: '04', title: 'Shipping and Delivery',
    body: 'We ship domestically within the United States and internationally to most countries. Estimated delivery times are provided during checkout but may vary due to postal delays or customs processing. Lady B Designs and Handcraft is not responsible for lost or stolen packages once confirmed as delivered.',
  },
  {
    num: '05', title: 'Returns and Refunds',
    body: null, // rendered differently with link
    bodyEl: (
      <p className="text-charcoal-600 font-body leading-relaxed">
        Please review our{' '}
        <Link to="/returns" className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">
          Return and Refund Policy
        </Link>{' '}
        for full details on eligibility, procedures, and conditions.
      </p>
    ),
  },
  {
    num: '06', title: 'Custom Orders',
    body: 'Custom or personalized items are made to order and are non-refundable unless defective. Please ensure all details are correct when placing a custom order. We will confirm all specifications with you before production begins.',
  },
  {
    num: '07', title: 'Intellectual Property',
    body: 'All content, designs, images, and products are the intellectual property of Lady B Designs and Handcraft and are protected under applicable copyright and intellectual property laws. Unauthorized use, reproduction, or distribution is strictly prohibited.',
  },
  {
    num: '08', title: 'Limitation of Liability',
    body: 'Lady B Designs and Handcraft shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website, including but not limited to loss of profits, data, or goodwill.',
  },
  {
    num: '09', title: 'Governing Law',
    body: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of Indiana, United States. Any disputes arising under these terms shall be resolved in the courts of Marion County, Indiana.',
  },
  {
    num: '10', title: 'Changes to Terms',
    body: 'We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with a revised effective date. Continued use of our website after changes constitutes your acceptance of the new terms.',
  },
];

export default function TermsPage() {
  useEffect(() => { document.title = 'Terms & Conditions | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Breadcrumbs items={[{ label: 'Terms & Conditions', href: '/terms' }]} showHome />

        <div className="mt-6 mb-12">
          <motion.p className="section-label mb-3" variants={FADE_UP} initial="hidden" animate="visible">Legal</motion.p>
          <motion.h1 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-4" variants={FADE_UP} initial="hidden" animate="visible" custom={1}>
            Terms &amp; Conditions
          </motion.h1>
          <motion.p className="text-charcoal-400 font-body text-sm" variants={FADE_UP} initial="hidden" animate="visible" custom={2}>
            Effective Date: June 10, 2026
          </motion.p>
          <motion.p className="text-charcoal-600 font-body leading-relaxed mt-5 text-base" variants={FADE_UP} initial="hidden" animate="visible" custom={3}>
            Welcome to Lady B Designs and Handcraft. By accessing or using our website and purchasing our handmade products, you agree to be bound by the following terms and conditions. Please read them carefully before placing an order.
          </motion.p>
        </div>

        {/* Sections */}
        <div>
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.num}
              variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="border-t border-charcoal-100 py-8 grid grid-cols-[3.5rem_1fr] gap-6"
            >
              <span className="font-serif text-3xl font-light text-charcoal-200 leading-none pt-1">{s.num}</span>
              <div>
                <h2 className="font-serif font-light text-xl text-charcoal-900 mb-3">{s.title}</h2>
                {s.bodyEl || <p className="text-charcoal-600 font-body leading-relaxed">{s.body}</p>}
              </div>
            </motion.div>
          ))}
          <div className="border-t border-charcoal-100" />
        </div>

        {/* Contact block */}
        <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 border border-charcoal-200 p-6 bg-charcoal-50 space-y-1.5">
          <p className="font-serif font-light text-lg text-charcoal-900">Lady B Designs and Handcraft</p>
          <p className="text-charcoal-600 font-body text-sm">{CONTACT.address}</p>
          <p className="text-charcoal-600 font-body text-sm">
            Email: <a href={`mailto:${CONTACT.email}`} className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">{CONTACT.email}</a>
          </p>
          <p className="text-charcoal-600 font-body text-sm">
            Phone: <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors">{CONTACT.phone}</a>
          </p>
        </motion.div>

        {/* Legal nav */}
        <div className="mt-12 pt-8 border-t border-charcoal-100">
          <p className="text-xs text-charcoal-400 font-body tracking-luxury uppercase mb-4">Related Policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Return & Refund Policy', href: '/returns' },
              { label: 'Shipping Policy', href: '/shipping' },
              { label: 'Privacy Policy', href: '/privacy' },
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
