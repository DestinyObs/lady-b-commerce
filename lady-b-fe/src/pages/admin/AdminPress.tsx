import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Mail, Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

const PAGE_SIZE = 25;

interface PressInquiry {
  id: string;
  name: string;
  publication: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'CONTACTED' | 'COMPLETED' | 'DECLINED';
  createdAt: string;
}

export default function AdminPress() {
  useEffect(() => { document.title = 'Press Inquiries | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewTarget, setViewTarget] = useState<PressInquiry | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-press', page, search],
    queryFn: () =>
      api.get(`/admin/press?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const inquiries: PressInquiry[] = data?.inquiries || [];
  const total: number = data?.total || 0;

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/admin/press/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-press'] }); setViewTarget(null); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update'),
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Press Inquiries</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} total</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Publication or journalist…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-8 w-8 text-charcoal-200 mx-auto mb-3" />
            <p className="text-charcoal-400 font-body text-sm">No press inquiries yet.</p>
          </div>
        ) : (
          <table className="w-full min-w-[520px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Journalist', 'Publication', 'Subject', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {inquiries.map((inq) => (
                <motion.tr key={inq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors cursor-pointer" onClick={() => setViewTarget(inq)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-body font-medium text-charcoal-900">{inq.name}</p>
                    <p className="text-xs text-charcoal-400 font-body">{inq.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-600">{inq.publication}</td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-500 max-w-[200px] truncate">{inq.subject}</td>
                  <td className="px-4 py-3">
                    <Badge variant={inq.status === 'COMPLETED' ? 'success' : inq.status === 'DECLINED' ? 'error' : inq.status === 'CONTACTED' ? 'luxury' : 'default'} size="sm">
                      {inq.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(inq.createdAt)}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${inq.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors inline-block">
                      <Mail className="h-4 w-4" />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}

      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Press Inquiry" size="md">
        {viewTarget && (
          <div className="p-6 space-y-5">
            <div className="bg-charcoal-50 p-4 text-sm font-body space-y-2">
              {[
                { label: 'Name', value: viewTarget.name },
                { label: 'Publication', value: viewTarget.publication },
                { label: 'Email', value: viewTarget.email },
                { label: 'Subject', value: viewTarget.subject },
                { label: 'Date', value: formatDate(viewTarget.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-charcoal-400 min-w-[80px]">{label}:</span>
                  <span className="text-charcoal-700">{value}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="label-luxury mb-2">Message</p>
              <p className="text-sm font-body text-charcoal-700 leading-relaxed">{viewTarget.message}</p>
            </div>
            <div className="flex gap-2">
              {['CONTACTED', 'COMPLETED', 'DECLINED'].map((s) => (
                <Button
                  key={s}
                  variant={s === 'COMPLETED' ? 'primary' : s === 'DECLINED' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => updateStatus.mutate({ id: viewTarget.id, status: s })}
                  disabled={viewTarget.status === s}
                  isLoading={updateStatus.isPending}
                >
                  {s === 'CONTACTED' ? 'Mark Contacted' : s === 'COMPLETED' ? 'Mark Completed' : 'Decline'}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
