import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';

const STORAGE_KEY = 'lb_nl_popup';
const DELAY_MS = 30_000; // 30 seconds

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const mutation = useMutation({
    mutationFn: (address: string) =>
      api.post('/newsletter/subscribe', { email: address, source: 'popup' }).then((r) => r.data),
    onSuccess: () => {
      setDone(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
      setTimeout(dismiss, 3000);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Could not subscribe. Try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutation.mutate(email.trim());
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 bg-charcoal-900/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="bg-ivory w-full sm:max-w-md relative">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-charcoal-300 hover:text-charcoal-900 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left accent strip */}
              <div className="flex">
                <div className="hidden sm:block w-3 bg-charcoal-900 flex-shrink-0" />
                <div className="flex-1 p-8 sm:p-10">
                  {done ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-emerald-luxury/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-6 w-6 text-emerald-luxury" />
                      </div>
                      <h3 className="font-serif font-light text-2xl text-charcoal-900 mb-2">You're in.</h3>
                      <p className="text-sm text-charcoal-500 font-body">Welcome to the Lady B inner circle.</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-5 h-px bg-gold-champagne mb-5" />
                      <h3 className="font-serif font-light text-2xl md:text-3xl text-charcoal-900 mb-3">
                        Join the inner circle
                      </h3>
                      <p className="text-charcoal-500 font-body text-sm leading-relaxed mb-6">
                        New collections, bespoke availability, and stories from the atelier — delivered first to you.
                      </p>
                      <form onSubmit={handleSubmit} noValidate className="space-y-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          required
                          className="w-full border border-charcoal-200 px-4 py-3 text-sm font-body text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-charcoal-600 transition-colors bg-transparent"
                          disabled={mutation.isPending}
                        />
                        <button
                          type="submit"
                          disabled={mutation.isPending || !email.trim()}
                          className="w-full bg-charcoal-900 text-ivory py-3 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors disabled:opacity-50"
                        >
                          {mutation.isPending ? '…' : 'Subscribe'}
                        </button>
                      </form>
                      <button onClick={dismiss} className="block mt-3 text-xs text-charcoal-300 hover:text-charcoal-600 transition-colors font-body mx-auto">
                        No thanks
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
