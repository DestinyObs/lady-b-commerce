import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/axios';
import { formatDate, formatCurrency } from '../../lib/utils';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { Checkbox } from '../../components/ui/Checkbox';

const couponSchema = z.object({
  code: z.string().min(3, 'Code required').toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().min(0.01),
  minOrderAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  usedCount: number;
  maxUses?: number;
  minOrderAmount?: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCoupons() {
  useEffect(() => { document.title = 'Coupons | Lady B Admin'; }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.get('/admin/coupons?limit=100').then((r) => r.data.data),
  });

  const coupons: Coupon[] = data?.coupons || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { type: 'PERCENTAGE', isActive: true },
  });

  const create = useMutation({
    mutationFn: (d: CouponFormData) => api.post('/admin/coupons', d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); setModalOpen(false); reset(); toast.success('Coupon created'); },
    onError: () => toast.error('Failed to create coupon'),
  });

  const update = useMutation({
    mutationFn: (d: CouponFormData) => api.patch(`/admin/coupons/${editTarget!.id}`, d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); setModalOpen(false); setEditTarget(null); toast.success('Coupon updated'); },
    onError: () => toast.error('Failed to update coupon'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/coupons/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); setDeleteTarget(null); toast.success('Coupon deleted'); },
    onError: () => toast.error('Failed to delete coupon'),
  });

  const handleEdit = (c: Coupon) => {
    setEditTarget(c);
    reset({ ...c, expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '' });
    setModalOpen(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-light text-2xl text-charcoal-900">Coupons</h1>
        <Button variant="primary" size="sm" onClick={() => { setEditTarget(null); reset({ type: 'PERCENTAGE', isActive: true }); setModalOpen(true); }}>
          <Plus className="h-4 w-4" /> New Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <div className="bg-white border border-charcoal-100 overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Code', 'Type', 'Value', 'Min Order', 'Used / Max', 'Expires', 'Status', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              <AnimatePresence>
                {coupons.map((c) => (
                  <motion.tr key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => copyCode(c.code)} className="flex items-center gap-1.5 font-body font-medium text-sm text-charcoal-900 hover:text-charcoal-600 transition-colors">
                        {c.code} <Copy className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-500">{c.type}</td>
                    <td className="px-4 py-3 text-sm font-body text-charcoal-900">
                      {c.type === 'PERCENTAGE' ? `${c.value}%` : formatCurrency(c.value)}
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-500">{c.minOrderAmount ? formatCurrency(c.minOrderAmount) : '—'}</td>
                    <td className="px-4 py-3 text-sm font-body text-charcoal-700">{c.usedCount} / {c.maxUses || '∞'}</td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-300">{c.expiresAt ? formatDate(c.expiresAt) : '—'}</td>
                    <td className="px-4 py-3"><Badge variant={c.isActive ? 'success' : 'error'} size="sm">{c.isActive ? 'Active' : 'Disabled'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(c)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? 'Edit Coupon' : 'New Coupon'} size="sm">
        <form onSubmit={handleSubmit((d) => editTarget ? update.mutate(d) : create.mutate(d))} noValidate className="p-6 space-y-4">
          <Input label="Code *" {...register('code')} error={errors.code?.message} placeholder="SUMMER20" />
          <Select label="Type *" options={[{ value: 'PERCENTAGE', label: 'Percentage (%)' }, { value: 'FIXED', label: 'Fixed Amount ($)' }]} {...register('type')} />
          <Input label="Value *" type="number" step="0.01" {...register('value')} error={errors.value?.message} />
          <Input label="Minimum Order Amount" type="number" step="0.01" {...register('minOrderAmount')} />
          <Input label="Max Uses (blank = unlimited)" type="number" {...register('maxUses')} />
          <Input label="Expiry Date" type="date" {...register('expiresAt')} />
          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Description (internal)</label>
            <textarea rows={2} className="input-luxury resize-none w-full text-sm" {...register('description')} />
          </div>
          <Checkbox label="Active" {...register('isActive')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={create.isPending || update.isPending}>Save</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => { setModalOpen(false); setEditTarget(null); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
        title={`Delete coupon "${deleteTarget?.code}"?`}
        description="This coupon will stop working immediately."
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
