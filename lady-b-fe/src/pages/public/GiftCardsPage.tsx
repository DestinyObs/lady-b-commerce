import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

const AMOUNTS = [50, 100, 150, 200, 250, 300];

export default function GiftCardsPage() {
  useEffect(() => { document.title = 'Gift Cards | Lady B Designs & Handcraft'; }, []);

  const [selected, setSelected] = useState<number | null>(100);
  const [custom, setCustom] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);

  const amount = custom ? parseInt(custom, 10) : selected;

  const mutation = useMutation({
    mutationFn: () =>
      api.post('/gift-cards', {
        amount,
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim(),
        message: message.trim() || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      setDone(true);
      toast.success('Gift card sent successfully!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Could not process gift card. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 25) { toast.error('Minimum gift card amount is $25'); return; }
    if (!recipientName.trim()) { toast.error('Please enter the recipient\'s name'); return; }
    if (!recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      toast.error('Please enter a valid recipient email'); return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-14 md:pb-16 bg-charcoal-900">
        <div className="container-luxury">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4"
          >
            The Gift of Craft
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-4xl md:text-7xl text-ivory mb-5"
          >
            Gift Cards
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-base md:text-lg max-w-lg leading-relaxed"
          >
            Give someone the freedom to choose their own handcrafted treasure. Lady B gift cards are delivered by email and never expire.
          </motion.p>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {done ? (
          /* ── Success ── */
          <motion.section
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-24 md:py-32"
          >
            <div className="container-luxury max-w-md mx-auto text-center">
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
              >
                <div className="w-20 h-20 bg-emerald-luxury/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-luxury" />
                </div>
              </motion.div>
              <div className="w-6 h-px bg-gold-champagne mx-auto mb-5" />
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Gift card sent!</h2>
              <p className="text-sm text-charcoal-500 font-body mb-2 leading-relaxed">
                A <strong className="text-charcoal-900">${amount}</strong> Lady B gift card is on its way to
              </p>
              <p className="text-sm font-semibold text-charcoal-900 mb-6">{recipientEmail}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-charcoal-400 font-body mb-8">
                <Mail className="h-3.5 w-3.5" />
                Delivered instantly · Never expires · No restrictions
              </div>
              <button
                onClick={() => { setDone(false); setRecipientName(''); setRecipientEmail(''); setMessage(''); setCustom(''); setSelected(100); }}
                className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors font-body border-b border-charcoal-200"
              >
                Send another gift card <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.section>
        ) : (
          /* ── Form ── */
          <motion.section key="form" className="py-16 md:py-24">
            <div className="container-luxury">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                {/* Visual card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                >
                  <div className="aspect-[16/10] bg-charcoal-900 relative overflow-hidden flex flex-col justify-between p-8 md:p-10">
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <div className="absolute top-8 right-8 w-40 h-40 border border-ivory rounded-full" />
                      <div className="absolute top-16 right-16 w-24 h-24 border border-ivory rounded-full" />
                    </div>
                    <div>
                      <p className="font-serif font-light text-2xl md:text-3xl text-ivory">Lady B</p>
                      <p className="text-charcoal-400 text-xs tracking-widest uppercase font-body mt-1">Designs &amp; Handcraft</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-1">Gift Card</p>
                        <p className="font-serif font-light text-3xl md:text-4xl text-gold-champagne">
                          {amount && amount >= 25 ? `$${amount.toLocaleString()}` : '—'}
                        </p>
                      </div>
                      <Gift className="h-7 w-7 md:h-8 md:w-8 text-charcoal-600" />
                    </div>
                  </div>
                  <p className="text-charcoal-400 font-body text-sm mt-4 text-center">
                    Delivered by email · Never expires · Redeemable online
                  </p>
                </motion.div>

                {/* Configuration form */}
                <motion.form
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-5">Select Amount</p>

                  <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                    {AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
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

                  <div className="mb-7">
                    <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Custom Amount</label>
                    <div className="flex items-center border border-charcoal-200 focus-within:border-charcoal-600 transition-colors">
                      <span className="px-4 text-charcoal-400 font-body">$</span>
                      <input
                        type="number"
                        min="25"
                        max="1000"
                        value={custom}
                        onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                        placeholder="Custom amount (min $25)"
                        className="flex-1 bg-transparent py-3 pr-4 font-body text-charcoal-900 text-sm focus:outline-none placeholder:text-charcoal-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mb-7">
                    <div>
                      <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Recipient's Name *</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Name of the lucky recipient"
                        className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Recipient's Email *</label>
                      <input
                        type="email"
                        required
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="Gift card will be sent here"
                        className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Personal Message <span className="normal-case text-charcoal-300">(optional)</span></label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal note..."
                        className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors resize-none placeholder:text-charcoal-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending || !amount || amount < 25}
                    className="w-full flex items-center justify-center gap-3 bg-charcoal-900 text-ivory py-4 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border border-ivory/40 border-t-ivory rounded-full animate-spin" /> Processing…</span>
                    ) : (
                      <><Gift className="h-3.5 w-3.5" /> Purchase Gift Card{amount && amount >= 25 ? ` · $${amount}` : ''}</>
                    )}
                  </button>
                </motion.form>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* How it works */}
      <section className="py-14 md:py-16 bg-charcoal-50 border-t border-charcoal-100">
        <div className="container-luxury">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { n: '01', t: 'Choose & Purchase', d: 'Select your amount, add a personal note, and complete payment securely.' },
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
