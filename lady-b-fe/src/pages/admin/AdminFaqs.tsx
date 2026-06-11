import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { Checkbox } from '../../components/ui/Checkbox';

const FAQ_CATEGORIES = [
  'General',
  'Orders & Shopping',
  'Shipping & Delivery',
  'Returns & Refunds',
  'Bespoke & Custom Orders',
  'Product Care',
  'Payment',
];

const faqSchema = z.object({
  question: z.string().min(5, 'Question is required'),
  answer: z.string().min(10, 'Answer is required'),
  category: z.string().min(1).default('General'),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type FaqFormData = z.infer<typeof faqSchema>;

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

const CATEGORY_ORDER = FAQ_CATEGORIES;

function groupByCategory(faqs: Faq[]): Map<string, Faq[]> {
  const map = new Map<string, Faq[]>();
  for (const faq of faqs) {
    const list = map.get(faq.category) ?? [];
    list.push(faq);
    map.set(faq.category, list);
  }
  return map;
}

export default function AdminFaqs() {
  useEffect(() => { document.title = 'FAQs | Lady B Admin'; }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => api.get('/admin/faq').then((r) => r.data.data as Faq[]),
  });

  const faqs: Faq[] = data ?? [];
  const grouped = groupByCategory(faqs);
  const categories = ['all', ...Array.from(grouped.keys()).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  })];

  const visible = activeCategory === 'all' ? faqs : (grouped.get(activeCategory) ?? []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: { category: 'General', sortOrder: 0, isActive: true },
  });

  const create = useMutation({
    mutationFn: (d: FaqFormData) => api.post('/admin/faq', d).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-faqs'] });
      setModalOpen(false);
      reset();
      toast.success('FAQ created');
    },
    onError: () => toast.error('Failed to create FAQ'),
  });

  const update = useMutation({
    mutationFn: (d: FaqFormData) => api.patch(`/admin/faq/${editTarget!.id}`, d).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-faqs'] });
      setModalOpen(false);
      setEditTarget(null);
      toast.success('FAQ updated');
    },
    onError: () => toast.error('Failed to update FAQ'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/faq/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-faqs'] });
      setDeleteTarget(null);
      toast.success('FAQ deleted');
    },
    onError: () => toast.error('Failed to delete FAQ'),
  });

  const toggleActive = useMutation({
    mutationFn: (faq: Faq) => api.patch(`/admin/faq/${faq.id}`, { isActive: !faq.isActive }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); },
    onError: () => toast.error('Update failed'),
  });

  const openCreate = () => {
    setEditTarget(null);
    reset({ category: activeCategory !== 'all' ? activeCategory : 'General', sortOrder: visible.length, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (f: Faq) => {
    setEditTarget(f);
    reset({ question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder, isActive: f.isActive });
    setModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">FAQs</h1>
          <p className="text-charcoal-400 text-xs font-body mt-1">{faqs.length} question{faqs.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> New FAQ
        </Button>
      </div>

      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-body tracking-wide transition-colors border ${
                activeCategory === cat
                  ? 'bg-charcoal-900 text-ivory border-charcoal-900'
                  : 'bg-white text-charcoal-500 border-charcoal-200 hover:border-charcoal-400'
              }`}
            >
              {cat === 'all' ? `All (${faqs.length})` : `${cat} (${grouped.get(cat)?.length ?? 0})`}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif font-light text-xl text-charcoal-300">No FAQs yet</p>
          <p className="text-charcoal-400 font-body text-sm mt-1">Add your first FAQ to help customers find answers.</p>
        </div>
      ) : (
        <div className="bg-white border border-charcoal-100 overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['', 'Question', 'Category', 'Order', 'Status', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              <AnimatePresence>
                {visible.map((f) => (
                  <motion.tr key={f.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                    <td className="pl-4 py-3 text-charcoal-200">
                      <GripVertical className="h-4 w-4" />
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <p className="font-body text-sm font-medium text-charcoal-900">{f.question}</p>
                      <p className="text-xs text-charcoal-400 mt-0.5 line-clamp-1 font-body">{f.answer}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-500 whitespace-nowrap">{f.category}</td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-400">{f.sortOrder}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive.mutate(f)}>
                        <Badge variant={f.isActive ? 'success' : 'error'} size="sm">
                          {f.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => openEdit(f)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(f)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? 'Edit FAQ' : 'New FAQ'}
        size="lg"
      >
        <form onSubmit={handleSubmit((d) => editTarget ? update.mutate(d) : create.mutate(d))} noValidate className="p-6 space-y-4">
          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Question *</label>
            <textarea rows={2} className="input-luxury resize-none w-full text-sm font-body" placeholder="How do I place an order?" {...register('question')} />
            {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
          </div>

          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Answer *</label>
            <textarea rows={5} className="input-luxury resize-y w-full text-sm font-body leading-relaxed" placeholder="Provide a clear, helpful answer…" {...register('answer')} />
            {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Category</label>
              <select className="input-luxury w-full text-sm font-body" {...register('category')}>
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Input label="Sort Order" type="number" min={0} {...register('sortOrder')} />
          </div>

          <Checkbox label="Active (visible on the FAQ page)" {...register('isActive')} />

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={create.isPending || update.isPending}>
              {editTarget ? 'Update FAQ' : 'Create FAQ'}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => { setModalOpen(false); setEditTarget(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
        title="Delete this FAQ?"
        description={`"${deleteTarget?.question}" will be permanently removed.`}
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
