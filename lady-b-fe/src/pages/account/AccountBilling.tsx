import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CreditCard, Plus, Trash2, Star, FileText, Download, ExternalLink } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate, formatCurrency } from '../../lib/utils';
import { AccountShell } from '../../components/account/AccountShell';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';

const CARD_BRAND_ICONS: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
};

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'open' | 'void';
  createdAt: string;
  pdfUrl?: string;
}

export default function AccountBilling() {
  useEffect(() => { document.title = 'Billing | Lady B Designs'; }, []);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: methods, isLoading: loadingMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['account-payment-methods'],
    queryFn: () => api.get('/account/payment-methods').then((r) => r.data.data),
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['account-invoices'],
    queryFn: () => api.get('/account/invoices').then((r) => r.data.data),
  });

  const deleteMethod = useMutation({
    mutationFn: (id: string) => api.delete(`/account/payment-methods/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-payment-methods'] });
      setDeleteTarget(null);
      toast.success('Payment method removed');
    },
    onError: () => toast.error('Failed to remove payment method'),
  });

  const setDefaultMethod = useMutation({
    mutationFn: (id: string) => api.patch(`/account/payment-methods/${id}/default`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-payment-methods'] });
      toast.success('Default payment method updated');
    },
    onError: () => toast.error('Failed to update default method'),
  });

  const handleAddCard = () => {
    toast('Redirecting to secure payment setup…');
    // Stripe's SetupIntent flow would open here
    api.post('/account/payment-methods/setup-intent')
      .then((r) => r.data.data?.clientSecret)
      .catch(() => toast.error('Failed to start card setup'));
  };

  const paymentMethods: PaymentMethod[] = methods || [];
  const invoiceList: Invoice[] = invoices || [];

  return (
    <AccountShell title="Billing" breadcrumb="Billing">
      <div className="space-y-10">

        {/* Payment methods */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="label-luxury mb-0.5">Payment Methods</h2>
              <p className="text-xs text-charcoal-400 font-body">Saved cards for faster checkout.</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleAddCard}>
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>

          {loadingMethods ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-12 bg-charcoal-50 border border-dashed border-charcoal-200">
              <CreditCard className="h-8 w-8 text-charcoal-200 mx-auto mb-3" />
              <p className="text-sm text-charcoal-500 font-body mb-4">No saved payment methods</p>
              <Button variant="secondary" size="sm" onClick={handleAddCard}>
                <Plus className="h-4 w-4" /> Add your first card
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className={`flex items-center gap-4 p-4 border ${method.isDefault ? 'border-charcoal-900' : 'border-charcoal-200'}`}
                  >
                    <div className="w-10 h-10 bg-charcoal-50 flex items-center justify-center flex-shrink-0 text-lg">
                      {CARD_BRAND_ICONS[method.brand] || <CreditCard className="h-5 w-5 text-charcoal-300" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-body font-medium text-charcoal-900 capitalize">
                          {method.brand} ···· {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="default" size="sm">
                            <Star className="h-2.5 w-2.5 fill-current mr-0.5" /> Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-400 font-body">
                        Expires {String(method.expMonth).padStart(2, '0')}/{String(method.expYear).slice(-2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!method.isDefault && (
                        <button
                          onClick={() => setDefaultMethod.mutate(method.id)}
                          className="text-xs text-charcoal-400 hover:text-charcoal-900 font-body transition-colors"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(method.id)}
                        className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors"
                        aria-label="Remove card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Order Invoices */}
        <div className="border-t border-charcoal-100 pt-8">
          <div className="mb-5">
            <h2 className="label-luxury mb-0.5">Invoices & Receipts</h2>
            <p className="text-xs text-charcoal-400 font-body">Download receipts for your orders.</p>
          </div>

          {loadingInvoices ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : invoiceList.length === 0 ? (
            <div className="text-center py-10 bg-charcoal-50">
              <FileText className="h-8 w-8 text-charcoal-200 mx-auto mb-3" />
              <p className="text-sm text-charcoal-500 font-body">No invoices yet</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal-100 border border-charcoal-100">
              {invoiceList.map((inv) => (
                <div key={inv.id} className="flex items-center gap-4 p-4">
                  <FileText className="h-4 w-4 text-charcoal-300 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-body font-medium text-charcoal-900">{inv.invoiceNumber}</p>
                    <p className="text-xs text-charcoal-400 font-body">{formatDate(inv.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-sm font-body text-charcoal-700">{formatCurrency(inv.amount)}</p>
                    <Badge
                      variant={inv.status === 'paid' ? 'success' : inv.status === 'void' ? 'error' : 'default'}
                      size="sm"
                    >
                      {inv.status}
                    </Badge>
                    {inv.pdfUrl && (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-charcoal-400 hover:text-charcoal-900 transition-colors"
                        aria-label="Download invoice"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing info note */}
        <div className="border-t border-charcoal-100 pt-6 text-xs text-charcoal-400 font-body space-y-1">
          <p>All payments are processed securely through Stripe. Lady B Designs never stores full card details.</p>
          <p>
            Questions about a charge?{' '}
            <a href="/contact" className="text-charcoal-600 hover:text-charcoal-900 transition-colors border-b border-charcoal-300">
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMethod.mutate(deleteTarget)}
        title="Remove payment method?"
        description="This card will be removed from your account. This cannot be undone."
        confirmLabel="Remove"
        isLoading={deleteMethod.isPending}
      />
    </AccountShell>
  );
}
