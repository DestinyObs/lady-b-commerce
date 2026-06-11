import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

const RULES = [
  { label: '8+ characters', test: (v: string) => v.length >= 8 },
  { label: 'Uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Number', test: (v: string) => /[0-9]/.test(v) },
];

const FADE = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function ResetPasswordPage() {
  useEffect(() => { document.title = 'Set New Password | Lady B Designs'; }, []);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const pw = watch('password', '');

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post('/auth/reset-password', { token, password: data.password }).then((r) => r.data),
    onSuccess: () => setDone(true),
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Reset link is invalid or has expired.');
    },
  });

  /* ── No token ── */
  if (!token) {
    return (
      <div className="text-center">
        <div className="w-6 h-px bg-gold-champagne mx-auto mb-5" />
        <motion.div
          className="flex justify-center mb-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <div className="w-12 h-12 bg-charcoal-100 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-charcoal-500" />
          </div>
        </motion.div>
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Invalid Link</h1>
        <p className="text-sm text-charcoal-500 font-body mb-6 leading-relaxed max-w-xs mx-auto">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <Link to="/forgot-password">
          <Button variant="primary" className="w-full">Request New Link</Button>
        </Link>
        <Link to="/login" className="flex items-center justify-center gap-2 mt-5 text-sm text-charcoal-400 hover:text-charcoal-900 transition-colors font-body">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  /* ── Success ── */
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <div className="w-6 h-px bg-gold-champagne mx-auto mb-5" />
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
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Password updated</h1>
        <p className="text-sm text-charcoal-500 font-body mb-8 leading-relaxed">
          Your password has been reset. Sign in with your new credentials.
        </p>
        <Link to="/login">
          <Button variant="primary" className="w-full">Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  /* ── Form ── */
  return (
    <div>
      <motion.div variants={FADE} initial="hidden" animate="visible" className="mb-8">
        <div className="w-6 h-px bg-gold-champagne mb-5" />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
            <Lock className="h-4 w-4 text-ivory" />
          </div>
          <h1 className="font-serif font-light text-3xl text-charcoal-900">New password</h1>
        </div>
        <p className="text-sm text-charcoal-500 font-body leading-relaxed">
          Choose a strong password to secure your account.
        </p>
      </motion.div>

      <motion.form
        variants={FADE} initial="hidden" animate="visible" custom={1}
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        noValidate
        className="space-y-5"
      >
        <div>
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-9 text-charcoal-400 hover:text-charcoal-700 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {pw.length > 0 && (
            <div className="mt-2 flex gap-3">
              {RULES.map(({ label, test }) => (
                <div key={label} className={`flex items-center gap-1 text-2xs font-body transition-colors ${test(pw) ? 'text-emerald-luxury' : 'text-charcoal-300'}`}>
                  <span>{test(pw) ? '✓' : '○'}</span>
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" variant="primary" className="w-full h-12 mt-1" isLoading={mutation.isPending}>
          Update Password
        </Button>
      </motion.form>

      <motion.div variants={FADE} initial="hidden" animate="visible" custom={2}>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors font-body"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
