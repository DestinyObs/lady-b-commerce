import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const AMOUNTS = [50, 100, 150, 200, 250, 300];

export default function GiftCardsPage() {
  useEffect(() => { document.title = 'Gift Cards | Lady B Designs & Handcraft'; }, []);
  const [selected, setSelected] = useState<number | null>(100);
  const [custom, setCustom] = useState('');

  const amount = custom ? parseInt(custom) : selected;

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-16 bg-charcoal-900">
        <div className="container-luxury">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4"
          >
            The Gift of Craft
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-7xl text-ivory mb-5"
          >
            Gift Cards
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg max-w-lg leading-relaxed"
          >
            Give someone the freedom to choose their own handcrafted treasure. Lady B gift cards are delivered by email and never expire.
          </motion.p>
        </div>
      </section>

      {/* Card visual + selection */}
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="aspect-[16/10] bg-charcoal-900 relative overflow-hidden flex flex-col justify-between p-10">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-8 right-8 w-40 h-40 border border-ivory rounded-full" />
                  <div className="absolute top-16 right-16 w-24 h-24 border border-ivory rounded-full" />
                </div>
                <div>
                  <p className="font-serif font-light text-3xl text-ivory">Lady B</p>
                  <p className="text-charcoal-400 text-xs tracking-widest uppercase font-body mt-1">Designs & Handcraft</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-1">Gift Card</p>
                    <p className="font-serif font-light text-4xl text-gold-champagne">
                      {amount ? `$${amount.toLocaleString()}` : '—'}
                    </p>
                  </div>
                  <Gift className="h-8 w-8 text-charcoal-600" />
                </div>
              </div>
              <p className="text-charcoal-400 font-body text-sm mt-4 text-center">
                Delivered by email · Never expires · Redeemable online
              </p>
            </motion.div>

            {/* Configuration */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            >
              <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-6">Select Amount</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setSelected(amt); setCustom(''); }}
                    className={`py-3 text-sm font-body border transition-colors duration-200 ${
                      selected === amt && !custom
                        ? 'bg-charcoal-900 border-charcoal-900 text-ivory'
                        : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-600'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Custom Amount</label>
                <div className="flex items-center border border-charcoal-200 focus-within:border-charcoal-600 transition-colors">
                  <span className="px-4 text-charcoal-400 font-body">$</span>
                  <input
                    type="number"
                    min="25"
                    max="1000"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                    placeholder="Enter amount (min $25)"
                    className="flex-1 bg-transparent py-3 pr-4 font-body text-charcoal-900 text-sm focus:outline-none placeholder:text-charcoal-300"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Recipient's Name</label>
                  <input
                    type="text"
                    placeholder="Name of the lucky recipient"
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Recipient's Email</label>
                  <input
                    type="email"
                    placeholder="Gift card will be sent here"
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Personal Message (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add a personal note..."
                    className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors resize-none placeholder:text-charcoal-300"
                  />
                </div>
              </div>

              <button
                disabled={!amount || amount < 25}
                className="w-full flex items-center justify-center gap-3 bg-charcoal-900 text-ivory py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Gift className="h-3.5 w-3.5" />
                Purchase Gift Card{amount ? ` · $${amount}` : ''}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-charcoal-50 border-t border-charcoal-100">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { n: '01', t: 'Choose & Purchase', d: 'Select your amount, add a personal note, and complete payment.' },
              { n: '02', t: 'Delivered by Email', d: 'The recipient receives a beautifully formatted gift card email instantly.' },
              { n: '03', t: 'Redeem at Checkout', d: 'The code works on any Lady B piece — no expiry, no restrictions.' },
            ].map(({ n, t, d }) => (
              <div key={n}>
                <span className="font-serif font-light text-4xl text-charcoal-200 block mb-4">{n}</span>
                <h3 className="font-body font-medium text-charcoal-900 mb-2">{t}</h3>
                <p className="text-charcoal-500 font-body text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
