import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
import { DEMO } from '../../lib/demo';

// Env vars override the hardcoded demo creds (for local dev with real accounts).
// Falls back to DEMO so the panel works on Netlify preview without any env config.
const CREDS = {
  admin: {
    email: (import.meta.env.VITE_PEYOTE_A as string) || DEMO.admin.email,
    password: (import.meta.env.VITE_PEYOTE_B as string) || DEMO.admin.password,
  },
  customer: {
    email: (import.meta.env.VITE_HERRINGBONE_A as string) || DEMO.customer.email,
    password: (import.meta.env.VITE_HERRINGBONE_B as string) || DEMO.customer.password,
  },
};

const IS_DEV = import.meta.env.DEV;

// When the API is unreachable (no backend running, e.g. Netlify preview),
// bypass the network call and set a fake user directly in the auth store so
// the client can still browse all authenticated pages in demo mode.
function useDemoFallbackLogin() {
  const { login } = useAuthStore();

  return (role: 'admin' | 'customer') => {
    const isAdmin = role === 'admin';
    const user = isAdmin
      ? {
          id: 'demo-admin-001',
          email: CREDS.admin.email,
          firstName: 'Lady B',
          lastName: 'Admin',
          role: 'ADMIN' as const,
          avatarUrl: null,
        }
      : {
          id: 'demo-customer-001',
          email: CREDS.customer.email,
          firstName: 'Demo',
          lastName: 'Customer',
          role: 'CUSTOMER' as const,
          avatarUrl: null,
        };

    login(user, 'demo-access-token', 'demo-refresh-token');
    toast.success(`Preview mode — signed in as ${user.firstName}`);
    window.location.assign(isAdmin ? '/admin' : '/account');
  };
}

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const { login, logout, isAuthenticated } = useAuthStore();
  const demoLogin = useDemoFallbackLogin();

  const mutation = useMutation({
    mutationFn: (creds: { email: string; password: string; role: 'admin' | 'customer' }) =>
      api.post('/auth/login', { email: creds.email, password: creds.password }).then((r) => r.data),

    onSuccess: (data, vars) => {
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      const dest =
        data.data.user.role === 'SUPER_ADMIN' || data.data.user.role === 'ADMIN'
          ? '/admin'
          : '/account';
      toast.success(`Signed in as ${vars.email}`);
      window.location.assign(dest);
      setOpen(false);
    },

    onError: (err, vars) => {
      // Network error = API unreachable (Netlify preview, no backend deployed).
      // Fall back to demo mode so the UI is still browseable.
      if (isAxiosError(err) && !err.response) {
        demoLogin(vars.role);
        setOpen(false);
        return;
      }
      toast.error('Login failed — check credentials or run seed');
    },
  });

  const handleLogin = (role: 'admin' | 'customer') => {
    mutation.mutate({ ...CREDS[role], role });
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-mono text-xs">
      {open ? (
        <div className="bg-charcoal-900 border border-gold-champagne/30 text-ivory p-4 w-56 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gold-champagne text-2xs tracking-widest uppercase">
              {IS_DEV ? 'Dev Access' : 'Demo Access'}
            </span>
            <button onClick={() => setOpen(false)} className="text-ivory/40 hover:text-ivory">
              ✕
            </button>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                toast('Signed out');
                setOpen(false);
              }}
              className="w-full border border-ivory/20 py-2 text-ivory/70 hover:text-ivory hover:border-ivory/50 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleLogin('admin')}
                disabled={mutation.isPending}
                className="w-full border border-gold-champagne/40 py-2 text-gold-champagne hover:bg-gold-champagne/10 transition-colors disabled:opacity-40"
              >
                {mutation.isPending ? '…' : 'Admin'}
              </button>
              <button
                onClick={() => handleLogin('customer')}
                disabled={mutation.isPending}
                className="w-full border border-ivory/20 py-2 text-ivory/70 hover:border-ivory/50 hover:text-ivory transition-colors disabled:opacity-40"
              >
                {mutation.isPending ? '…' : 'Customer'}
              </button>
            </div>
          )}

          <p className="text-ivory/20 text-2xs mt-3 text-center">preview only</p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-8 h-8 bg-charcoal-900/80 border border-gold-champagne/20 text-gold-champagne/60 hover:text-gold-champagne hover:border-gold-champagne/50 transition-all flex items-center justify-center text-xs"
          title={IS_DEV ? 'Dev panel' : 'Demo login'}
        >
          ⬡
        </button>
      )}
    </div>
  );
}
