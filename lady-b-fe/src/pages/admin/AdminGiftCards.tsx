import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate, formatCurrency } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface GiftCardRedemption {
  amount: number;
  redeemedAt: string;
}

interface GiftCard {
  id: string;
  code: string;
  initialAmount: number;
  balance: number;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  message?: string;
  isActive: boolean;
  expiresAt?: string;
  purchasedByEmail?: string;
  redemptions: GiftCardRedemption[];
  createdAt: string;
}

function statusOf(gc: GiftCard): { label: string; variant: 'success' | 'error' | 'warning' | 'default' } {
  if (!gc.isActive) return { label: 'Disabled', variant: 'error' };
  if (gc.expiresAt && new Date(gc.expiresAt) < new Date()) return { label: 'Expired', variant: 'warning' };
  if (gc.balance <= 0) return { label: 'Depleted', variant: 'default' };
  return { label: 'Active', variant: 'success' };
}

export default function AdminGiftCards() {
  useEffect(() => { document.title = 'Gift Cards | Lady B Admin'; }, []);

  const [detail, setDetail] = useState<GiftCard | null>(null);
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gift-cards', page],
    queryFn: () => api.get(`/admin/gift-cards?page=${page}&limit=20`).then((r) => r.data),
  });

  const giftCards: GiftCard[] = data?.data ?? [];
  const meta = data?.meta;

  const toggle = useMutation({
    mutationFn: (gc: GiftCard) =>
      api.patch(`/admin/gift-cards/${gc.id}`, { isActive: !gc.isActive }).then((r) => r.data),
    onSuccess: (_d, gc) => {
      qc.invalidateQueries({ queryKey: ['admin-gift-cards'] });
      if (detail?.id === gc.id) setDetail((d) => d ? { ...d, isActive: !d.isActive } : null);
      toast.success(gc.isActive ? 'Gift card disabled' : 'Gift card enabled');
    },
    onError: () => toast.error('Failed to update gift card'),
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Gift Cards</h1>
          {meta && <p className="text-charcoal-400 text-xs font-body mt-1">{meta.total} total</p>}
        </div>
        <div className="flex items-center gap-2 text-charcoal-400">
          <Gift className="h-5 w-5" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : giftCards.length === 0 ? (
        <div className="text-center py-16">
          <Gift className="h-10 w-10 text-charcoal-200 mx-auto mb-3" />
          <p className="font-serif font-light text-xl text-charcoal-300">No gift cards yet</p>
          <p className="text-charcoal-400 font-body text-sm mt-1">Issued gift cards will appear here.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-charcoal-100 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-charcoal-100 bg-charcoal-50">
                <tr>
                  {['Code', 'Recipient', 'Initial', 'Balance', 'Status', 'Issued', ''].map((h) => (
                    <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50">
                <AnimatePresence>
                  {giftCards.map((gc) => {
                    const { label, variant } = statusOf(gc);
                    return (
                      <motion.tr key={gc.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-charcoal-900 tracking-wide">{gc.code}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-body text-charcoal-900">{gc.recipientName || '—'}</p>
                          {gc.recipientEmail && <p className="text-xs text-charcoal-400 font-body">{gc.recipientEmail}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm font-body text-charcoal-700">{formatCurrency(gc.initialAmount / 100)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-body font-medium ${gc.balance > 0 ? 'text-green-700' : 'text-charcoal-400'}`}>
                            {formatCurrency(gc.balance / 100)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={variant} size="sm">{label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs font-body text-charcoal-400 whitespace-nowrap">
                          {formatDate(gc.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => setDetail(gc)}
                              className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggle.mutate(gc)}
                              className={`p-1.5 transition-colors ${gc.isActive ? 'text-green-500 hover:text-red-500' : 'text-charcoal-300 hover:text-green-500'}`}
                              title={gc.isActive ? 'Disable' : 'Enable'}
                            >
                              {gc.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs font-body text-charcoal-400">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Gift Card Details" size="md">
        {detail && (
          <div className="p-6 space-y-4">
            <div className="bg-charcoal-50 rounded p-4 text-center">
              <p className="font-mono text-xl tracking-widest text-charcoal-900 font-medium">{detail.code}</p>
              <p className="text-xs text-charcoal-400 font-body mt-1 tracking-luxury uppercase">Gift Card Code</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1">Initial Value</p>
                <p className="text-charcoal-900 font-medium">{formatCurrency(detail.initialAmount / 100)}</p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1">Remaining Balance</p>
                <p className={`font-medium ${detail.balance > 0 ? 'text-green-700' : 'text-charcoal-400'}`}>
                  {formatCurrency(detail.balance / 100)}
                </p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1">Recipient</p>
                <p className="text-charcoal-900">{detail.recipientName || '—'}</p>
                {detail.recipientEmail && <p className="text-charcoal-500 text-xs">{detail.recipientEmail}</p>}
              </div>
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1">From</p>
                <p className="text-charcoal-900">{detail.senderName || '—'}</p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1">Issued</p>
                <p className="text-charcoal-900">{formatDate(detail.createdAt)}</p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1">Expires</p>
                <p className="text-charcoal-900">{detail.expiresAt ? formatDate(detail.expiresAt) : 'Never'}</p>
              </div>
            </div>

            {detail.message && (
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-1 font-body">Message</p>
                <p className="text-charcoal-600 font-body text-sm italic border-l-2 border-charcoal-200 pl-3">"{detail.message}"</p>
              </div>
            )}

            {detail.redemptions.length > 0 && (
              <div>
                <p className="text-charcoal-400 text-xs uppercase tracking-wide mb-2 font-body">Redemption History</p>
                <div className="space-y-2">
                  {detail.redemptions.map((r, i) => (
                    <div key={i} className="flex justify-between text-sm font-body border-b border-charcoal-50 pb-2">
                      <span className="text-charcoal-500">{formatDate(r.redeemedAt)}</span>
                      <span className="text-charcoal-900 font-medium">−{formatCurrency(r.amount / 100)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant={detail.isActive ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggle.mutate(detail)}
                isLoading={toggle.isPending}
              >
                {detail.isActive ? 'Disable Card' : 'Enable Card'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setDetail(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
