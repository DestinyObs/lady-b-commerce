import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const FADE = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();
  const from = (location.state as { from?: string })?.from || '/account';
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Sign In | Lady B Designs';
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/login', data).then((r) => r.data),
    onSuccess: (data) => {
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success(`Welcome back, ${data.data.user.firstName}`);
      navigate(from, { replace: true });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    },
  });

  return (
    <div>
      {/* Heading */}
      <motion.div variants={FADE} initial="hidden" animate="visible" className="mb-8">
        <div className="w-6 h-px bg-gold-champagne mb-5" />
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2">Welcome back</h1>
        <p className="text-sm text-charcoal-500 font-body">
          New to Lady B?{' '}
          <Link to="/register" className="text-charcoal-900 border-b border-charcoal-400 hover:border-charcoal-900 transition-colors pb-0.5">
            Create an account
          </Link>
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        variants={FADE} initial="hidden" animate="visible" custom={1}
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

        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full h-12 mt-2" isLoading={mutation.isPending}>
          Sign In
        </Button>
      </motion.form>

      {/* Divider */}
      <motion.div variants={FADE} initial="hidden" animate="visible" custom={2} className="my-7 flex items-center gap-4">
        <div className="flex-1 h-px bg-charcoal-100" />
        <span className="text-xs text-charcoal-300 font-body tracking-wide">or continue with</span>
        <div className="flex-1 h-px bg-charcoal-100" />
      </motion.div>

      {/* Social login placeholders */}
      <motion.div variants={FADE} initial="hidden" animate="visible" custom={3} className="grid grid-cols-2 gap-3">
        {[
          { label: 'Google', src: 'https://www.svgrepo.com/show/475656/google-color.svg' },
          { label: 'Apple', src: 'https://www.svgrepo.com/show/452231/apple.svg' },
        ].map(({ label, src }) => (
          <button
            key={label}
            type="button"
            onClick={() => toast('Social login coming soon', { icon: '🔒' })}
            className="flex items-center justify-center gap-2.5 border border-charcoal-200 py-3 text-sm font-body text-charcoal-700 hover:border-charcoal-400 hover:bg-charcoal-50 transition-all"
          >
            <img src={src} alt={label} className="h-4 w-4" />
            {label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
