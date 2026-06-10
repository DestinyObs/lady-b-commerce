import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const TIERS = [
  { name: 'Boutique', min: '$1,500', disc: '15%', qty: '10 pieces minimum' },
  { name: 'Gallery', min: '$3,000', disc: '20%', qty: '20 pieces minimum' },
  { name: 'Retail Chain', min: '$6,000+', disc: '25%', qty: 'Volume by arrangement' },
];

export default function WholesalePage() {
  useEffect(() => { document.title = 'Wholesale | Lady B Designs & Handcraft'; }, []);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ business: '', name: '', email: '', phone: '', country: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-16 bg-charcoal-900">
        <div className="container-luxury">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4"
          >
            Trade Programme
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-7xl text-ivory mb-5 max-w-2xl"
          >
            Wholesale & Trade
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg max-w-xl leading-relaxed"
          >
            Partner with Lady B to bring handcrafted luxury to your boutique, gallery, or retail space. We work with carefully selected stockists worldwide.
          </motion.p>
        </div>
      </section>

      {/* Why wholesale */}
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
                <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-5">Why Partner With Us</p>
                <h2 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-8">The Lady B difference</h2>
                <div className="space-y-6">
                  {[
                    { t: 'Exclusive Designs', d: 'Each collection is produced in limited quantities — no mass production, no two pieces identical.' },
                    { t: 'Flexible MOQ', d: 'Starting from just 10 pieces, making it accessible to independent boutiques and galleries.' },
                    { t: 'Custom Colorways', d: 'Wholesale partners can request exclusive colorways not available in the main collection.' },
                    { t: 'White Label Option', d: 'Selected partners may commission pieces under their own branding. Enquire for details.' },
                  ].map(({ t, d }) => (
                    <div key={t} className="flex gap-4">
                      <span className="w-1 flex-shrink-0 bg-charcoal-900 mt-1.5 self-stretch max-h-5" />
                      <div>
                        <p className="font-body font-medium text-charcoal-900 mb-1">{t}</p>
                        <p className="text-charcoal-500 font-body text-sm leading-relaxed">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="aspect-[4/5] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85&auto=format&fit=crop"
                alt="Wholesale Lady B"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 bg-charcoal-50">
        <div className="container-luxury">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-12 text-center"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Pricing Structure</p>
            <h2 className="font-serif font-light text-4xl text-charcoal-900">Wholesale Tiers</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-charcoal-200">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1} variants={FADE_UP}
                className="bg-ivory p-10 text-center"
              >
                <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">{tier.name}</p>
                <p className="font-serif font-light text-5xl text-charcoal-900 mb-2">{tier.disc}</p>
                <p className="text-charcoal-500 font-body text-sm mb-4">Discount off RRP</p>
                <p className="text-charcoal-700 font-body text-sm border-t border-charcoal-100 pt-4">{tier.qty}</p>
                <p className="text-charcoal-400 font-body text-xs mt-1">Min. order: {tier.min}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-charcoal-400 font-body text-sm mt-6">All prices in USD. Payment net 30 for approved accounts.</p>
        </div>
      </section>

      {/* Application form */}
      <section className="py-20 md:py-28">
        <div className="container-luxury max-w-3xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="mb-12"
          >
            <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-4">Apply Now</p>
            <h2 className="font-serif font-light text-4xl text-charcoal-900">Wholesale Application</h2>
          </motion.div>

          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle className="h-10 w-10 text-charcoal-700 mx-auto mb-5" />
              <h3 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Application Received</h3>
              <p className="text-charcoal-500 font-body">We review applications within 3–5 business days and will be in touch by email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Business Name *</label>
                  <input name="business" required value={form.business} onChange={handleChange} type="text"
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors"
                    placeholder="Your store or gallery name"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Contact Name *</label>
                  <input name="name" required value={form.name} onChange={handleChange} type="text"
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Email *</label>
                  <input name="email" required value={form.email} onChange={handleChange} type="email"
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors"
                    placeholder="business@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Country *</label>
                  <input name="country" required value={form.country} onChange={handleChange} type="text"
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors"
                    placeholder="United States"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Tell us about your business *</label>
                <textarea name="message" required rows={5} value={form.message} onChange={handleChange}
                  className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors resize-none"
                  placeholder="Describe your store, your customer base, and why you're interested in carrying Lady B..."
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="flex items-center gap-3 bg-charcoal-900 text-ivory px-10 py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors disabled:opacity-60"
              >
                {loading ? <span className="w-4 h-4 border border-ivory/40 border-t-ivory rounded-full animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
