import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

const FADE = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function ForgotPasswordPage() {
  useEffect(() => { document.title = 'Reset Password | Lady B Designs'; }, []);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/forgot-password', data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
    },
    onError: (_err, variables) => {
      // Never reveal whether email exists
      setSubmittedEmail(variables.email);
      setSubmitted(true);
    },
  });

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        /* ── Success state ── */
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-emerald-luxury/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-luxury" />
            </div>
          </motion.div>

          <div className="w-6 h-px bg-gold-champagne mx-auto mb-5" />
          <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Check your inbox</h1>

          <p className="text-sm text-charcoal-500 font-body mb-2 leading-relaxed">
            If an account is linked to
          </p>
          <p className="text-sm font-body font-semibold text-charcoal-900 mb-4 break-all">
            {submittedEmail}
          </p>
          <p className="text-sm text-charcoal-500 font-body mb-8 leading-relaxed">
            you will receive a reset link shortly. The link expires in <strong className="text-charcoal-700">1 hour</strong>.
          </p>

          <p className="text-xs text-charcoal-400 font-body mb-6">
            Didn't receive it? Check your spam folder, or{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-charcoal-900 border-b border-charcoal-300 hover:border-charcoal-900 transition-colors"
            >
              try again
            </button>.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors font-body"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </motion.div>
      ) : (
        /* ── Request form ── */
        <motion.div key="form" initial="hidden" animate="visible">
          <motion.div variants={FADE} className="mb-8">
            <div className="w-6 h-px bg-gold-champagne mb-5" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-ivory" />
              </div>
              <h1 className="font-serif font-light text-3xl text-charcoal-900">Reset password</h1>
            </div>
            <p className="text-sm text-charcoal-500 font-body leading-relaxed">
              Enter the email linked to your account and we'll send you a reset link.
            </p>
          </motion.div>

          <motion.form
            variants={FADE} custom={1}
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            noValidate
            className="space-y-5"
          >
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Button type="submit" variant="primary" className="w-full h-12" isLoading={mutation.isPending}>
              <Send className="h-4 w-4" /> Send Reset Link
            </Button>
          </motion.form>

          <motion.div variants={FADE} custom={2}>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 mt-6 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors font-body"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
