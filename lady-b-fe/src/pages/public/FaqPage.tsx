import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sortOrder?: number;
}

const STATIC_FAQS: FaqItem[] = [
  { category: 'Orders & Shopping', question: 'How do I place an order?', answer: "Browse our collections, select your piece, choose any available options, and add to your bag. Checkout accepts credit/debit cards and bank transfer. You'll receive an order confirmation email immediately." },
  { category: 'Orders & Shopping', question: 'Can I modify or cancel my order?', answer: "Orders can be modified or cancelled within 24 hours of placement. Please contact us at Adebiyiblessing55@gmail.com or +1 (317) 507-4966 as soon as possible." },
  { category: 'Orders & Shopping', question: 'Do you offer gift packaging?', answer: "All Lady B pieces arrive in our signature keepsake box with a dust bag and tissue. We can add a handwritten gift note at no additional charge." },
  { category: 'Shipping & Delivery', question: 'How long does shipping take?', answer: "Ready-to-ship pieces are dispatched within 3–5 business days. US domestic shipping takes 3–7 business days. International orders typically arrive in 7–14 business days." },
  { category: 'Shipping & Delivery', question: 'Do you offer free shipping?', answer: "Yes — complimentary standard shipping on all US orders over $250. International orders qualify for free shipping on purchases over $400." },
  { category: 'Shipping & Delivery', question: 'Do you ship internationally?', answer: "We ship worldwide. All international orders are dispatched via tracked courier. Import duties and taxes are the responsibility of the recipient." },
  { category: 'Shipping & Delivery', question: 'Can I track my order?', answer: "Yes. Once dispatched, you'll receive a tracking number by email. You can also track through your account dashboard." },
  { category: 'Returns & Refunds', question: 'What is your returns policy?', answer: "We accept returns on standard (non-bespoke) items within 7 days of delivery, provided they are unused and in original condition." },
  { category: 'Returns & Refunds', question: 'Can I return a bespoke piece?', answer: "Bespoke and custom-made pieces cannot be returned, as they are made specifically for you. If there is a fault, we will remake or repair at no charge." },
  { category: 'Returns & Refunds', question: 'How long do refunds take?', answer: "Refunds are processed within 5–7 business days of receiving the returned item." },
  { category: 'Bespoke & Custom Orders', question: 'How do I start a bespoke commission?', answer: "Contact us through the bespoke page or send us a message describing your vision, timeline, and budget. We'll arrange a consultation to discuss your commission." },
  { category: 'Bespoke & Custom Orders', question: 'How long does a custom piece take?', answer: "Most commissions take 3–6 weeks from design approval to delivery. Rush commissions may be possible — please enquire." },
  { category: 'Bespoke & Custom Orders', question: 'What is the minimum spend for a custom order?', answer: "Our minimum commission is $120 for necklaces and $280 for bags. Pricing depends on complexity, materials, and size." },
  { category: 'Product Care', question: 'How do I care for my beaded piece?', answer: "Store in the provided dust bag away from direct sunlight and moisture. Clean gently with a dry, soft cloth. Avoid contact with perfume, water, and chemicals." },
  { category: 'Product Care', question: 'Can a piece be repaired if damaged?', answer: "Yes. We offer repair services for Lady B pieces. Contact us with photos of the damage and we'll assess the repair." },
];

function FaqAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-charcoal-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
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

function groupByCategory(items: FaqItem[]): { category: string; items: FaqItem[] }[] {
  const map = new Map<string, FaqItem[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
}

export default function FaqPage() {
  useEffect(() => { document.title = 'FAQ | Lady B Designs & Handcraft'; }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['faqs-public'],
    queryFn: () => api.get('/faq').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const apiFaqs: FaqItem[] = data?.data ?? [];
  const faqs = apiFaqs.length > 0 ? apiFaqs : STATIC_FAQS;
  const sections = useMemo(() => groupByCategory(faqs), [faqs]);

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
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-36" />
                    ))}
                  </div>
                ) : (
                  <nav className="space-y-3">
                    {sections.map((section) => (
                      <a
                        key={section.category}
                        href={`#${section.category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-charcoal-500 font-body text-sm hover:text-charcoal-900 transition-colors"
                      >
                        {section.category}
                      </a>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            {/* FAQ sections */}
            <div className="lg:col-span-3 space-y-16">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, si) => (
                  <div key={si}>
                    <Skeleton className="h-7 w-48 mb-6" />
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border-b border-charcoal-100 pb-4">
                          <Skeleton className="h-5 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                sections.map((section, i) => (
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
                        <FaqAccordion key={item.id ?? item.question} q={item.question} a={item.answer} />
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
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
