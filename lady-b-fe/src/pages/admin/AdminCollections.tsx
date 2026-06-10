import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { FileUpload } from '../../components/ui/FileUpload';
import { Checkbox } from '../../components/ui/Checkbox';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  coverImage?: { url: string };
}

export default function AdminCollections() {
  useEffect(() => { document.title = 'Collections | Lady B Admin'; }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: () => api.get('/admin/collections?limit=100').then((r) => r.data.data),
  });

  const collections: Collection[] = data?.collections || [];

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const name = watch('name');
  useEffect(() => {
    if (!editTarget) setValue('slug', generateSlug(name || ''));
  }, [name, editTarget, setValue]);

  const create = useMutation({
    mutationFn: (d: FormData) => api.post('/admin/collections', d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-collections'] }); setModalOpen(false); reset(); toast.success('Collection created'); },
    onError: () => toast.error('Failed to create collection'),
  });

  const update = useMutation({
    mutationFn: (d: FormData) => api.patch(`/admin/collections/${editTarget!.id}`, d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-collections'] }); setModalOpen(false); setEditTarget(null); reset(); toast.success('Collection updated'); },
    onError: () => toast.error('Failed to update collection'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/collections/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-collections'] }); setDeleteTarget(null); toast.success('Collection deleted'); },
    onError: () => toast.error('Failed to delete collection'),
  });

  const handleEdit = (c: Collection) => {
    setEditTarget(c);
    reset({ name: c.name, slug: c.slug, description: c.description, isActive: c.isActive });
    setModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-light text-2xl text-charcoal-900">Collections</h1>
        <Button variant="primary" size="sm" onClick={() => { setEditTarget(null); reset(); setModalOpen(true); }}>
          <Plus className="h-4 w-4" /> New Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <div className="bg-white border border-charcoal-100 overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Collection', 'Slug', 'Products', 'Status', 'Created', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              <AnimatePresence>
                {collections.map((col) => (
                  <motion.tr key={col.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-charcoal-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                          {col.coverImage && <img src={col.coverImage.url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                        </div>
                        <span className="text-sm font-body font-medium text-charcoal-900">{col.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal-400 font-body">{col.slug}</td>
                    <td className="px-4 py-3 text-sm font-body text-charcoal-700">{col.productCount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-body ${col.isActive ? 'text-emerald-luxury' : 'text-charcoal-300'}`}>
                        {col.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(col.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <a href={`/collections/${col.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors">
                          <Eye className="h-4 w-4" />
                        </a>
                        <button onClick={() => handleEdit(col)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(col)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors">
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? 'Edit Collection' : 'New Collection'} size="md">
        <form onSubmit={handleSubmit((d) => editTarget ? update.mutate(d) : create.mutate(d))} noValidate className="p-6 space-y-4">
          <Input label="Name *" {...register('name')} error={errors.name?.message} />
          <Input label="Slug *" {...register('slug')} error={errors.slug?.message} />
          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Description</label>
            <textarea rows={3} className="input-luxury resize-none w-full" {...register('description')} />
          </div>
          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Cover Image</label>
            <FileUpload accept="image/*" maxFiles={1} maxSizeMB={10} />
          </div>
          <Checkbox label="Active (visible on site)" {...register('isActive')} />
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
        title={`Delete "${deleteTarget?.name}"?`}
        description="Products in this collection will not be deleted, but will be uncollected."
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
