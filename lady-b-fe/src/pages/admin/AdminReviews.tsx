import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Check, X, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 20;

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  author: { firstName: string; lastName: string; email: string };
  product: { name: string; slug: string };
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < n ? 'fill-gold-champagne text-gold-champagne' : 'text-charcoal-200'}`} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  useEffect(() => { document.title = 'Reviews | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page, search, statusFilter],
    queryFn: () =>
      api.get(`/admin/reviews?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}&status=${statusFilter}`)
        .then((r) => r.data.data),
  });

  const reviews: Review[] = data?.reviews || [];
  const total: number = data?.total || 0;

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/reviews/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review updated'); },
    onError: () => toast.error('Failed to update review'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/reviews/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); setDeleteTarget(null); toast.success('Review deleted'); },
    onError: () => toast.error('Failed to delete review'),
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Reviews</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Product or reviewer…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
        <div className="flex gap-1.5">
          {[{ value: '', label: 'All' }, { value: 'PENDING', label: 'Pending' }, { value: 'APPROVED', label: 'Approved' }, { value: 'REJECTED', label: 'Rejected' }].map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-3 py-2 text-xs uppercase tracking-wide font-body border transition-colors ${statusFilter === f.value ? 'bg-charcoal-900 border-charcoal-900 text-ivory' : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-600'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white border border-charcoal-100">
          <p className="text-charcoal-400 font-body text-sm">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-charcoal-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Stars n={review.rating} />
                    <span className="text-sm font-body font-medium text-charcoal-900">{review.title}</span>
                    <Badge variant={review.status === 'APPROVED' ? 'success' : review.status === 'REJECTED' ? 'error' : 'default'} size="sm">
                      {review.status.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-400 font-body">
                    {review.author.firstName} {review.author.lastName} · {review.product.name} · {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {review.status !== 'APPROVED' && (
                    <button onClick={() => moderate.mutate({ id: review.id, status: 'APPROVED' })} className="p-1.5 text-charcoal-300 hover:text-emerald-luxury transition-colors" aria-label="Approve">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {review.status !== 'REJECTED' && (
                    <button onClick={() => moderate.mutate({ id: review.id, status: 'REJECTED' })} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors" aria-label="Reject">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(review.id)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-body text-charcoal-600 leading-relaxed line-clamp-3">{review.body}</p>
            </motion.div>
          ))}
        </div>
      )}

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget)}
        title="Delete this review?"
        description="This is permanent and cannot be undone."
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
