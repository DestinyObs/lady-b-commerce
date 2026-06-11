import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'lb_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const decision = localStorage.getItem(STORAGE_KEY);
    if (!decision) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => { localStorage.setItem(STORAGE_KEY, 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem(STORAGE_KEY, 'declined'); setVisible(false); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-900 border-t border-ivory/10 px-4 md:px-8 py-4 md:py-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="h-5 w-5 text-gold-champagne flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-ivory/70 text-xs font-body leading-relaxed flex-1">
              We use cookies to personalise your experience and improve our services. By continuing you agree to our{' '}
              <a href="/privacy" className="text-ivory underline underline-offset-2 hover:text-gold-champagne transition-colors">Privacy Policy</a>.
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={decline}
                className="text-ivory/50 text-xs font-body hover:text-ivory transition-colors py-1"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="bg-ivory text-charcoal-900 px-6 py-2 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
