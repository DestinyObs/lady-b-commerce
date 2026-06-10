import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Palette, Sparkles, Package, ChevronRight, Shield, Clock, Heart } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] },
  }),
};

const PROCESS_STEPS = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Tell Us Your Vision',
    description: 'Share your ideas, inspiration images, and preferences through our commission form. The more detail you give us, the better.',
  },
  {
    icon: Palette,
    number: '02',
    title: 'Receive Your Quote',
    description: 'Our artisans review your request and craft a detailed quote including timeline, materials, and pricing — usually within 48 hours.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Approve & Begin',
    description: 'Once you approve the quote and place a deposit, we begin the meticulous handcrafting process with regular progress updates.',
  },
  {
    icon: Package,
    number: '04',
    title: 'Receive Your Piece',
    description: 'Your finished creation is photographed, carefully packaged, and delivered with a certificate of authenticity.',
  },
];

const CAPABILITIES = [
  'Custom beadwork patterns and colour palettes',
  'Personalised monograms and initials',
  'Bespoke hardware and fastening choices',
  'Multiple size variations',
  'Bridal and occasion collections',
  'Corporate gifting and bulk commissions',
];

const FAQS = [
  {
    q: 'How long does a bespoke piece take?',
    a: 'Most commissions take 4–8 weeks depending on complexity and current demand. We always confirm timelines before you approve.',
  },
  {
    q: 'How much does a custom order cost?',
    a: 'Pricing varies by complexity, size, and materials. Commissions typically start from £350. We provide a full quote before any payment.',
  },
  {
    q: 'What deposit is required?',
    a: 'We require a 50% deposit to begin production. The remaining balance is due when your piece is ready for shipment.',
  },
  {
    q: 'Can I see progress during production?',
    a: 'Yes — we send progress photos at key stages and you can track your commission status in your account dashboard.',
  },
  {
    q: 'What if I want changes?',
    a: "Minor adjustments are free before production begins. Changes during production may incur additional costs, which we'll discuss with you first.",
  },
];

export default function CustomOrdersPage() {
  useEffect(() => { document.title = 'Bespoke Commissions | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-20 md:pb-28 bg-charcoal-900 text-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-champagne rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-champagne rounded-full blur-3xl" />
        </div>
        <div className="container-luxury relative">
          <div className="max-w-2xl">
            <motion.p
              className="section-label text-gold-champagne mb-4"
              variants={FADE_UP} initial="hidden" animate="visible" custom={0}
            >
              Bespoke Commissions
            </motion.p>
            <motion.h1
              className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-ivory mb-6 leading-tight"
              variants={FADE_UP} initial="hidden" animate="visible" custom={1}
            >
              Crafted for you,
              <br />and only you.
            </motion.h1>
            <motion.p
              className="text-base md:text-lg font-body font-light text-charcoal-300 mb-8 leading-relaxed"
              variants={FADE_UP} initial="hidden" animate="visible" custom={2}
            >
              Every Lady B bespoke piece begins as a conversation. Share your vision and our artisans will transform it into a heirloom-quality beaded creation.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={FADE_UP} initial="hidden" animate="visible" custom={3}
            >
              <Link to="/custom-orders/start" className="btn-primary bg-ivory text-charcoal-900 hover:bg-charcoal-100 inline-flex items-center gap-2">
                Start a Commission <ChevronRight className="h-4 w-4" />
              </Link>
              <a href="#process" className="btn-secondary border-ivory/30 text-ivory hover:border-ivory inline-flex items-center gap-2">
                How it works
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container-luxury py-6">
        <Breadcrumbs items={[{ label: 'Bespoke Commissions', href: '/custom-orders' }]} showHome />
      </div>

      {/* Trust badges */}
      <section className="border-y border-charcoal-100 py-8">
        <div className="container-luxury">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: Shield, title: 'No obligation quote', body: 'Receive a full quote before committing to any payment.' },
              { icon: Clock, title: 'Regular updates', body: 'Photo updates at every major production milestone.' },
              { icon: Heart, title: 'Satisfaction guarantee', body: 'We work with you until your piece exceeds expectations.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-charcoal-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-gold-champagne" />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{title}</p>
                  <p className="text-xs text-charcoal-400 font-body mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 md:py-28">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The Process</p>
            <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900">How bespoke works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative"
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-4xl text-charcoal-100 font-light leading-none">{step.number}</span>
                  <div className="w-9 h-9 bg-charcoal-50 flex items-center justify-center">
                    <step.icon className="h-4 w-4 text-charcoal-700" />
                  </div>
                </div>
                <h3 className="font-body font-semibold text-charcoal-900 mb-2">{step.title}</h3>
                <p className="text-sm text-charcoal-500 font-body leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 md:py-24 bg-charcoal-50">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">What we create</p>
              <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-6">
                Every detail, your way
              </h2>
              <p className="text-charcoal-500 font-body leading-relaxed mb-8">
                From a single beaded clutch to a complete bridal collection, our studio handles commissions of every scale with the same devotion to craft.
              </p>
              <ul className="space-y-3">
                {CAPABILITIES.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-body text-charcoal-700">
                    <span className="w-1.5 h-1.5 bg-gold-champagne rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={`bg-charcoal-100 ${i === 1 ? 'aspect-[3/4]' : i === 4 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container-luxury max-w-2xl">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Questions</p>
            <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900">Common questions</h2>
          </div>
          <div className="space-y-0 divide-y divide-charcoal-100">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-5 cursor-pointer list-none">
                <summary className="flex items-center justify-between gap-4 font-body font-medium text-charcoal-900 text-sm md:text-base select-none list-none">
                  {q}
                  <ChevronRight className="h-4 w-4 text-charcoal-400 flex-shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-charcoal-500 font-body leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-charcoal-900 text-ivory">
        <div className="container-luxury text-center">
          <p className="section-label text-gold-champagne mb-3">Begin your commission</p>
          <h2 className="font-serif font-light text-3xl md:text-4xl text-ivory mb-5">
            Ready to create something extraordinary?
          </h2>
          <p className="text-charcoal-300 font-body max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Fill in your brief — it takes less than five minutes. We'll be in touch within 48 hours with a no-obligation quote.
          </p>
          <Link to="/custom-orders/start" className="btn-primary bg-ivory text-charcoal-900 hover:bg-charcoal-100 inline-flex items-center gap-2">
            Start My Commission <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
