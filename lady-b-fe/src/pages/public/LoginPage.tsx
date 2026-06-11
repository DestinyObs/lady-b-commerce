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
        <button
          type="button"
          onClick={() => toast('Social login coming soon', { icon: '🔒' })}
          className="flex items-center justify-center gap-2.5 border border-charcoal-200 py-3 text-sm font-body text-charcoal-700 hover:border-charcoal-400 hover:bg-charcoal-50 transition-all"
        >
          {/* Google G */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => toast('Social login coming soon', { icon: '🔒' })}
          className="flex items-center justify-center gap-2.5 border border-charcoal-200 py-3 text-sm font-body text-charcoal-700 hover:border-charcoal-400 hover:bg-charcoal-50 transition-all"
        >
          {/* Apple logo */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Apple
        </button>
      </motion.div>
    </div>
  );
}
