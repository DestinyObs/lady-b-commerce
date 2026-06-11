import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';

const postSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  excerpt: z.string().optional(),
  body: z.string().min(10, 'Body content is required'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().min(1).default('Journal'),
  tags: z.string().optional(),
  readTimeMinutes: z.coerce.number().min(1).default(5),
  authorName: z.string().min(1).default('Lady B'),
  authorRole: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  status: 'DRAFT' | 'PUBLISHED';
  authorName: string;
  authorRole: string;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminJournal() {
  useEffect(() => { document.title = 'Journal CMS | Lady B Admin'; }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JournalPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JournalPost | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-journal'],
    queryFn: () => api.get('/admin/journal?limit=100').then((r) => r.data),
  });

  const posts: JournalPost[] = data?.data ?? [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { category: 'Journal', readTimeMinutes: 5, authorName: 'Lady B', authorRole: 'Designer & Founder' },
  });

  const create = useMutation({
    mutationFn: (d: PostFormData) => {
      const { tags, coverImage, ...rest } = d;
      return api.post('/admin/journal', {
        ...rest,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        ...(coverImage && { coverImage }),
      }).then((r) => r.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-journal'] });
      setModalOpen(false);
      reset();
      toast.success('Post created');
    },
    onError: (err: { response?: { data?: { message?: string } } }) =>
      toast.error(err.response?.data?.message || 'Failed to create post'),
  });

  const update = useMutation({
    mutationFn: (d: PostFormData) => {
      const { tags, coverImage, ...rest } = d;
      return api.patch(`/admin/journal/${editTarget!.id}`, {
        ...rest,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        ...(coverImage ? { coverImage } : { coverImage: null }),
      }).then((r) => r.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-journal'] });
      setModalOpen(false);
      setEditTarget(null);
      toast.success('Post updated');
    },
    onError: () => toast.error('Failed to update post'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/journal/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-journal'] });
      setDeleteTarget(null);
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const publish = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/journal/${id}/publish`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-journal'] }); toast.success('Post published'); },
    onError: () => toast.error('Failed to publish'),
  });

  const unpublish = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/journal/${id}/unpublish`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-journal'] }); toast.success('Reverted to draft'); },
    onError: () => toast.error('Failed to unpublish'),
  });

  const openCreate = () => {
    setEditTarget(null);
    reset({ category: 'Journal', readTimeMinutes: 5, authorName: 'Lady B', authorRole: 'Designer & Founder' });
    setModalOpen(true);
  };

  const openEdit = (p: JournalPost) => {
    setEditTarget(p);
    reset({
      title: p.title,
      excerpt: p.excerpt ?? '',
      body: p.body,
      coverImage: p.coverImage ?? '',
      category: p.category,
      tags: p.tags?.join(', ') ?? '',
      readTimeMinutes: p.readTimeMinutes,
      authorName: p.authorName,
      authorRole: p.authorRole,
    });
    setModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Journal CMS</h1>
          <p className="text-charcoal-400 text-xs font-body mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif font-light text-2xl text-charcoal-300 mb-2">No posts yet</p>
          <p className="text-charcoal-400 font-body text-sm">Create your first journal post to share with your audience.</p>
        </div>
      ) : (
        <div className="bg-white border border-charcoal-100 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Title', 'Category', 'Status', 'Published', 'Read', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              <AnimatePresence>
                {posts.map((p) => (
                  <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-body text-sm font-medium text-charcoal-900 truncate">{p.title}</p>
                      {p.excerpt && <p className="text-xs text-charcoal-400 mt-0.5 line-clamp-1 font-body">{p.excerpt}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-500 whitespace-nowrap">{p.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'PUBLISHED' ? 'success' : 'warning'} size="sm">{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-400 whitespace-nowrap">
                      {p.publishedAt ? formatDate(p.publishedAt) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-charcoal-500 whitespace-nowrap">{p.readTimeMinutes} min</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {p.status === 'DRAFT' ? (
                          <button
                            onClick={() => publish.mutate(p.id)}
                            title="Publish"
                            className="p-1.5 text-charcoal-300 hover:text-green-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => unpublish.mutate(p.id)}
                            title="Revert to draft"
                            className="p-1.5 text-charcoal-300 hover:text-amber-500 transition-colors"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => openEdit(p)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors">
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
        title={editTarget ? 'Edit Post' : 'New Journal Post'}
        size="xl"
      >
        <form onSubmit={handleSubmit((d) => editTarget ? update.mutate(d) : create.mutate(d))} noValidate className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          <Input label="Title *" {...register('title')} error={errors.title?.message} placeholder="The Art of Beading" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Category" {...register('category')} placeholder="Craft, Heritage, Style…" />
            <Input label="Read Time (min)" type="number" min={1} {...register('readTimeMinutes')} />
            <Input label="Cover Image URL" {...register('coverImage')} error={errors.coverImage?.message} placeholder="https://…" />
          </div>

          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Excerpt</label>
            <textarea rows={2} className="input-luxury resize-none w-full text-sm font-body" placeholder="A short summary shown in listings…" {...register('excerpt')} />
          </div>

          <div>
            <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Body *</label>
            <textarea rows={12} className="input-luxury resize-y w-full text-sm font-body leading-relaxed" placeholder="Write your post content here…" {...register('body')} />
            {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
          </div>

          <Input label="Tags (comma-separated)" {...register('tags')} placeholder="craft, heritage, style" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Author Name" {...register('authorName')} />
            <Input label="Author Role" {...register('authorRole')} placeholder="Designer & Founder" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={create.isPending || update.isPending}>
              {editTarget ? 'Update Post' : 'Create Post'}
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
        title={`Delete "${deleteTarget?.title}"?`}
        description="This post will be permanently deleted and removed from the journal."
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
