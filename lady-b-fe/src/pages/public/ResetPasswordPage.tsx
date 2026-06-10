import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  useEffect(() => { document.title = 'Reset Password | Lady B Designs'; }, []);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post('/auth/reset-password', { token, password: data.password }).then((r) => r.data),
    onSuccess: () => {
      setDone(true);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Reset link is invalid or has expired.');
    },
  });

  // No token
  if (!token) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-red-50 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Invalid Reset Link</h1>
        <p className="text-sm text-charcoal-500 font-body mb-6 leading-relaxed">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <Link to="/forgot-password">
          <Button variant="primary" className="w-full">Request New Link</Button>
        </Link>
      </div>
    );
  }

  // Success state
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-emerald-luxury/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-emerald-luxury" />
          </div>
        </div>
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Password updated</h1>
        <p className="text-sm text-charcoal-500 font-body mb-8 leading-relaxed">
          Your password has been reset successfully. Sign in with your new password.
        </p>
        <Link to="/login">
          <Button variant="primary" className="w-full">Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  const passwordStrength = (() => {
    if (!password) return null;
    if (password.length < 8) return { label: 'Too short', color: 'bg-red-400', width: 'w-1/4' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Weak', color: 'bg-amber-400', width: 'w-2/4' };
    if (password.length < 12) return { label: 'Good', color: 'bg-emerald-luxury', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-luxury', width: 'w-full' };
  })();

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-charcoal-50 flex items-center justify-center">
          <Lock className="h-5 w-5 text-charcoal-600" />
        </div>
      </div>
      <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2 text-center">Set new password</h1>
      <p className="text-sm text-charcoal-500 font-body text-center mb-8">
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate className="space-y-5">
        <div>
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
          {passwordStrength && (
            <div className="mt-2">
              <div className="h-0.5 bg-charcoal-100 rounded-full overflow-hidden">
                <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
              </div>
              <p className="text-xs text-charcoal-400 font-body mt-1">{passwordStrength.label}</p>
            </div>
          )}
          <ul className="mt-2 space-y-1">
            {[
              { rule: password.length >= 8, text: 'At least 8 characters' },
              { rule: /[A-Z]/.test(password), text: 'One uppercase letter' },
              { rule: /[0-9]/.test(password), text: 'One number' },
            ].map(({ rule, text }) => (
              <li key={text} className={`text-2xs font-body flex items-center gap-1.5 transition-colors ${rule ? 'text-emerald-luxury' : 'text-charcoal-300'}`}>
                <span>{rule ? '✓' : '○'}</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <Input
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={mutation.isPending}
        >
          Update Password
        </Button>
      </form>

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 mt-6 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors font-body"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}
