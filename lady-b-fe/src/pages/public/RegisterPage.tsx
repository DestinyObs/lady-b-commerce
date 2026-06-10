import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Include an uppercase letter').regex(/[0-9]/, 'Include a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => { document.title = 'Create Account | Lady B Designs'; }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: FormData) =>
      api.post('/auth/register', data).then((r) => r.data),
    onSuccess: (data) => {
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Welcome to Lady B Designs');
      navigate('/account', { replace: true });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  return (
    <div>
      <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2">Create account</h1>
      <p className="text-sm text-charcoal-500 font-body mb-8">
        Already have an account?{' '}
        <Link to="/login" className="text-charcoal-900 underline underline-offset-2">Sign in</Link>
      </p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} autoComplete="given-name" />
          <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} autoComplete="family-name" />
        </div>
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} autoComplete="new-password" />
        <Input label="Confirm Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} autoComplete="new-password" />

        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={mutation.isPending}>
          Create Account
        </Button>

        <p className="text-xs text-charcoal-400 font-body text-center mt-4">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2">Terms</Link> and{' '}
          <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
