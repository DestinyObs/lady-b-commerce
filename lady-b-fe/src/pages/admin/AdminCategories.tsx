import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
import { Checkbox } from '../../components/ui/Checkbox';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  productCount: number;
}

export default function AdminCategories() {
  useEffect(() => { document.title = 'Categories | Lady B Admin'; }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/admin/categories?limit=100').then((r) => r.data.data),
  });

  const categories: Category[] = data?.categories || [];

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const name = watch('name');
  useEffect(() => {
    if (!editTarget) setValue('slug', (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }, [name, editTarget, setValue]);

  const create = useMutation({
    mutationFn: (d: FormData) => api.post('/admin/categories', d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setModalOpen(false); reset(); toast.success('Category created'); },
    onError: () => toast.error('Failed to create category'),
  });

  const update = useMutation({
    mutationFn: (d: FormData) => api.patch(`/admin/categories/${editTarget!.id}`, d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setModalOpen(false); setEditTarget(null); toast.success('Category updated'); },
    onError: () => toast.error('Failed to update category'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setDeleteTarget(null); toast.success('Category deleted'); },
    onError: () => toast.error('Failed to delete category'),
  });

  const handleEdit = (c: Category) => {
    setEditTarget(c);
    reset({ name: c.name, slug: c.slug, description: c.description, isActive: c.isActive });
    setModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-light text-2xl text-charcoal-900">Categories</h1>
        <Button variant="primary" size="sm" onClick={() => { setEditTarget(null); reset({ isActive: true }); setModalOpen(true); }}>
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <div className="bg-white border border-charcoal-100">
          <table className="w-full">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Category', 'Slug', 'Products', 'Status', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.tr key={cat.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-body font-medium text-charcoal-900">{cat.name}</td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-400">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm font-body text-charcoal-700">{cat.productCount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-body ${cat.isActive ? 'text-emerald-luxury' : 'text-charcoal-300'}`}>
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(cat)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteTarget(cat)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {categories.length === 0 && <div className="text-center py-10"><p className="text-charcoal-400 font-body text-sm">No categories yet.</p></div>}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? 'Edit Category' : 'New Category'} size="sm">
        <form onSubmit={handleSubmit((d) => editTarget ? update.mutate(d) : create.mutate(d))} noValidate className="p-6 space-y-4">
          <Input label="Name *" {...register('name')} error={errors.name?.message} />
          <Input label="Slug *" {...register('slug')} error={errors.slug?.message} />
          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Description</label>
            <textarea rows={2} className="input-luxury resize-none w-full" {...register('description')} />
          </div>
          <Input label="Sort Order" type="number" {...register('sortOrder')} />
          <Checkbox label="Active (visible on site)" {...register('isActive')} />
          <div className="flex gap-3">
            <Button type="submit" variant="primary" size="sm" isLoading={create.isPending || update.isPending}>Save</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => { setModalOpen(false); setEditTarget(null); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="Products in this category will not be deleted."
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
