import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';

const E = {
  a: import.meta.env.VITE_PEYOTE_A as string,
  b: import.meta.env.VITE_PEYOTE_B as string,
  c: import.meta.env.VITE_HERRINGBONE_A as string,
  d: import.meta.env.VITE_HERRINGBONE_B as string,
};

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const { login, logout, isAuthenticated } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      api.post('/auth/login', creds).then((r) => r.data),
    onSuccess: (data, vars) => {
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      const dest = data.data.user.role === 'SUPER_ADMIN' || data.data.user.role === 'ADMIN'
        ? '/admin'
        : '/account';
      toast.success(`Signed in as ${vars.email}`);
      window.location.assign(dest);
      setOpen(false);
    },
    onError: () => toast.error('Dev login failed — run seed first'),
  });

  if (!E.a || !E.b) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-mono text-xs">
      {open ? (
        <div className="bg-charcoal-900 border border-gold-champagne/30 text-ivory p-4 w-56 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gold-champagne text-2xs tracking-widest uppercase">Dev Access</span>
            <button onClick={() => setOpen(false)} className="text-ivory/40 hover:text-ivory">✕</button>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); toast('Signed out'); setOpen(false); }}
              className="w-full border border-ivory/20 py-2 text-ivory/70 hover:text-ivory hover:border-ivory/50 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => mutation.mutate({ email: E.a, password: E.b })}
                disabled={mutation.isPending}
                className="w-full border border-gold-champagne/40 py-2 text-gold-champagne hover:bg-gold-champagne/10 transition-colors disabled:opacity-40"
              >
                Admin
              </button>
              <button
                onClick={() => mutation.mutate({ email: E.c, password: E.d })}
                disabled={mutation.isPending}
                className="w-full border border-ivory/20 py-2 text-ivory/70 hover:border-ivory/50 hover:text-ivory transition-colors disabled:opacity-40"
              >
                Customer
              </button>
            </div>
          )}
          <p className="text-ivory/20 text-2xs mt-3 text-center">dev only · hidden in prod</p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-8 h-8 bg-charcoal-900/80 border border-gold-champagne/20 text-gold-champagne/60 hover:text-gold-champagne hover:border-gold-champagne/50 transition-all flex items-center justify-center text-xs"
          title="Dev panel"
        >
          ⬡
        </button>
      )}
    </div>
  );
}
