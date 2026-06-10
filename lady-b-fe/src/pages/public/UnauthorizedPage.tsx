import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';

export default function UnauthorizedPage() {
  useEffect(() => { document.title = 'Access Restricted | Lady B Designs'; }, []);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 grain pointer-events-none opacity-30" />

      <motion.div
        className="relative z-10 text-center max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.div
          className="w-16 h-16 bg-charcoal-50 flex items-center justify-center mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Lock className="h-7 w-7 text-charcoal-400" />
        </motion.div>

        <span className="section-label mb-4 block">Access Restricted</span>
        <h1 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-4">
          This area is private
        </h1>
        <p className="text-sm text-charcoal-500 font-body font-light leading-relaxed mb-10">
          {isAuthenticated
            ? "You don't have permission to access this page. If you believe this is an error, please contact us."
            : "Please sign in to access this area. Members enjoy exclusive access to order history, custom order tracking, and more."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
              <Link to="/"><Button variant="secondary">Return Home</Button></Link>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="primary">Sign In</Button></Link>
              <Link to="/register"><Button variant="secondary">Create Account</Button></Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
