import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();
  const from = (location.state as { from?: string })?.from || '/account';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
    document.title = 'Sign In | Lady B Designs';
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
      toast.error(error.response?.data?.message || 'Invalid credentials');
    },
  });

  return (
    <div>
      <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2">Welcome back</h1>
      <p className="text-sm text-charcoal-500 font-body mb-8">
        New to Lady B?{' '}
        <Link to="/register" className="text-charcoal-900 underline underline-offset-2">Create account</Link>
      </p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={mutation.isPending}>
          Sign In
        </Button>
      </form>
    </div>
  );
}
