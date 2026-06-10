import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  useEffect(() => { document.title = 'Forgot Password | Lady B Designs'; }, []);
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
    onError: () => {
      // Don't reveal whether email exists — always show success state
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-emerald-luxury/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-emerald-luxury" />
          </div>
        </div>
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2 text-center">Check your email</h1>
        <p className="text-sm text-charcoal-500 font-body text-center mb-2">
          If an account exists for
        </p>
        <p className="text-sm text-charcoal-900 font-body font-medium text-center mb-6 break-all">
          {submittedEmail}
        </p>
        <p className="text-sm text-charcoal-500 font-body text-center mb-8 leading-relaxed">
          you will receive a password reset link shortly. The link expires in 1 hour.
        </p>
        <p className="text-xs text-charcoal-400 font-body text-center mb-6">
          Didn't receive it? Check your spam folder, or{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="text-charcoal-900 underline underline-offset-2"
          >
            try again
          </button>.
        </p>
        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors font-body">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-charcoal-50 flex items-center justify-center">
          <Mail className="h-5 w-5 text-charcoal-600" />
        </div>
      </div>
      <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-2 text-center">Forgot your password?</h1>
      <p className="text-sm text-charcoal-500 font-body text-center mb-8 leading-relaxed">
        Enter the email address linked to your account and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate className="space-y-5">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={mutation.isPending}
        >
          Send Reset Link
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
