import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const FAQS = [
  {
    category: 'Orders & Shopping',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our collections, select your piece, choose any available options, and add to your bag. Checkout accepts credit/debit cards, PayPal, and bank transfer. You\'ll receive an order confirmation email immediately.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 24 hours of placement. After that, we may have already begun preparation. Please contact us at Adebiyiblessing55@gmail.com or +1 (317) 507-4966 as soon as possible.',
      },
      {
        q: 'Do you offer gift packaging?',
        a: 'All Lady B pieces arrive in our signature keepsake box with a dust bag and tissue — this is our standard packaging. We can add a handwritten gift note at no additional charge.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Ready-to-ship pieces are dispatched within 3–5 business days. US domestic shipping takes 3–7 business days. International orders typically arrive in 7–14 business days, depending on destination.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes — we offer complimentary standard shipping on all US orders over $250. International orders qualify for free shipping on purchases over $400.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We ship worldwide. International shipping rates and times vary by destination. All international orders are dispatched via tracked courier. Import duties and taxes are the responsibility of the recipient.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. Once your order is dispatched, you\'ll receive a tracking number by email. You can also track your order through your account dashboard.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'We accept returns on standard (non-bespoke) items within 7 days of delivery, provided they are unused and in original condition. Please contact us to initiate a return.',
      },
      {
        q: 'Can I return a bespoke piece?',
        a: 'Bespoke and custom-made pieces cannot be returned, as they are made specifically for you. However, if there is a fault or defect, we will remake or repair the piece at no charge.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Refunds are processed within 5–7 business days of receiving the returned item. You\'ll receive an email confirmation once your refund has been issued.',
      },
    ],
  },
  {
    category: 'Bespoke & Custom Orders',
    items: [
      {
        q: 'How do I start a bespoke commission?',
        a: 'Contact us through the bespoke page or send us a message describing your vision, timeline, and budget. We\'ll arrange a consultation to discuss your commission in detail.',
      },
      {
        q: 'How long does a custom piece take?',
        a: 'Most commissions take 3–6 weeks from design approval to delivery. We\'ll confirm your exact timeline during the consultation. Rush commissions may be possible — please enquire.',
      },
      {
        q: 'What is the minimum spend for a custom order?',
        a: 'Our minimum commission is $120 for necklaces and $280 for bags. Pricing depends on complexity, materials, and size. A full quote is provided after consultation.',
      },
    ],
  },
  {
    category: 'Product Care',
    items: [
      {
        q: 'How do I care for my beaded piece?',
        a: 'Store in the provided dust bag away from direct sunlight and moisture. Clean gently with a dry, soft cloth. Avoid contact with perfume, water, and chemicals. With proper care, your piece will last a lifetime.',
      },
      {
        q: 'Can a piece be repaired if damaged?',
        a: 'Yes. We offer repair services for Lady B pieces. Contact us with photos of the damage and we\'ll assess the repair. Charges vary based on the extent of work required.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-charcoal-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left"
        aria-expanded={open}
      >
        <span className="font-serif font-light text-xl text-charcoal-900">{q}</span>
        {open
          ? <Minus className="h-4 w-4 text-charcoal-400 flex-shrink-0 mt-1" />
          : <Plus className="h-4 w-4 text-charcoal-400 flex-shrink-0 mt-1" />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <p className="text-charcoal-600 font-body leading-relaxed pb-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  useEffect(() => { document.title = 'FAQ | Lady B Designs & Handcraft'; }, []);

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-charcoal-50 border-b border-charcoal-100">
        <div className="container-luxury">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4"
          >
            Help Centre
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-7xl text-charcoal-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-500 font-body text-lg max-w-xl"
          >
            Answers to the questions we hear most. Can't find what you need? We're here to help.
          </motion.p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">

            {/* Sidebar nav */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-28">
                <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-5">Jump to</p>
                <nav className="space-y-3">
                  {FAQS.map((section) => (
                    <a
                      key={section.category}
                      href={`#${section.category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block text-charcoal-500 font-body text-sm hover:text-charcoal-900 transition-colors"
                    >
                      {section.category}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ sections */}
            <div className="lg:col-span-3 space-y-16">
              {FAQS.map((section, i) => (
                <motion.div
                  key={section.category}
                  id={section.category.toLowerCase().replace(/\s+/g, '-')}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05} variants={FADE_UP}
                >
                  <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6 pb-4 border-b border-charcoal-200">
                    {section.category}
                  </h2>
                  <div>
                    {section.items.map((item) => (
                      <FaqItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="py-16 bg-charcoal-900">
        <div className="container-luxury text-center">
          <h2 className="font-serif font-light text-3xl text-ivory mb-4">Still have a question?</h2>
          <p className="text-charcoal-300 font-body mb-8 max-w-md mx-auto">Our team is available Monday–Friday, 9am–6pm EST. We typically respond within a few hours.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block bg-ivory text-charcoal-900 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors duration-300"
            >
              Contact Us
            </Link>
            <a
              href="mailto:Adebiyiblessing55@gmail.com"
              className="inline-block border border-ivory/30 text-ivory px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:border-ivory/60 transition-colors duration-300"
            >
              Email Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
