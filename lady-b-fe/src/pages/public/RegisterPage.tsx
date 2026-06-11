import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Check } from 'lucide-react';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[0-9]/, 'Include a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const RULES = [
  { label: '8+ characters', test: (v: string) => v.length >= 8 },
  { label: 'Uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Number', test: (v: string) => /[0-9]/.test(v) },
];

const FADE = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { document.title = 'Create Account | Lady B Designs'; }, []);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const pw = watch('password', '');

  const mutation = useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: FormData) =>
      api.post('/auth/register', data).then((r) => r.data),
    onSuccess: (data) => {
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Welcome to Lady B Designs');
      navigate('/account', { replace: true });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  return (
    <div>
      {/* Heading */}
      <motion.div variants={FADE} initial="hidden" animate="visible" className="mb-8">
        <div className="w-6 h-px bg-gold-champagne mb-5" />
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2">Join Lady B</h1>
        <p className="text-sm text-charcoal-500 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-charcoal-900 border-b border-charcoal-400 hover:border-charcoal-900 transition-colors pb-0.5">
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.form
        variants={FADE} initial="hidden" animate="visible" custom={1}
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        noValidate
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            autoComplete="given-name"
            placeholder="Ada"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            autoComplete="family-name"
            placeholder="Grace"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div>
          <div className="relative">
            <Input
              label="Password"
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

          {/* Strength indicators */}
          {pw.length > 0 && (
            <div className="mt-2 flex gap-3">
              {RULES.map(({ label, test }) => (
                <div key={label} className={`flex items-center gap-1 text-2xs font-body transition-colors ${test(pw) ? 'text-emerald-luxury' : 'text-charcoal-300'}`}>
                  <Check className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" variant="primary" className="w-full h-12 mt-1" isLoading={mutation.isPending}>
          Create Account
        </Button>
      </motion.form>

      <motion.p
        variants={FADE} initial="hidden" animate="visible" custom={2}
        className="text-xs text-charcoal-400 font-body text-center mt-5 leading-relaxed"
      >
        By creating an account you agree to our{' '}
        <Link to="/terms" className="text-charcoal-600 hover:text-charcoal-900 transition-colors border-b border-charcoal-200">Terms</Link>
        {' and '}
        <Link to="/privacy" className="text-charcoal-600 hover:text-charcoal-900 transition-colors border-b border-charcoal-200">Privacy Policy</Link>.
      </motion.p>
    </div>
  );
}
