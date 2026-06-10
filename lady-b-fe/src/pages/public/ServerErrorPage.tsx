import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export default function ServerErrorPage() {
  useEffect(() => { document.title = 'Something Went Wrong | Lady B Designs'; }, []);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4">
      {/* Decorative grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none opacity-30" />

      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Large decorative number */}
        <motion.p
          className="font-serif text-[9rem] md:text-[12rem] font-light text-charcoal-100 leading-none select-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          500
        </motion.p>

        <div className="-mt-6 md:-mt-10 relative z-10">
          <span className="section-label mb-4 block">Something went wrong</span>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-4">
            Our atelier is momentarily offline
          </h1>
          <p className="text-sm text-charcoal-500 font-body font-light leading-relaxed mb-10 max-w-md mx-auto">
            We encountered an unexpected issue. Our team has been notified and is working to restore service.
            Please try again in a few moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Link to="/">
              <Button variant="secondary">Return Home</Button>
            </Link>
          </div>

          <p className="text-xs text-charcoal-300 font-body mt-10">
            If this continues, reach us at{' '}
            <a href="mailto:Adebiyiblessing55@gmail.com" className="text-charcoal-500 hover:text-charcoal-900 transition-colors">
              Adebiyiblessing55@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
