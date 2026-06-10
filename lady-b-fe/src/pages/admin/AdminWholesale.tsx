import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Mail, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

const PAGE_SIZE = 25;

interface WholesaleInquiry {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONTACTED';
  createdAt: string;
}

export default function AdminWholesale() {
  useEffect(() => { document.title = 'Wholesale Inquiries | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewTarget, setViewTarget] = useState<WholesaleInquiry | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-wholesale', page, search],
    queryFn: () =>
      api.get(`/admin/wholesale?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const inquiries: WholesaleInquiry[] = data?.inquiries || [];
  const total: number = data?.total || 0;

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/wholesale/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-wholesale'] });
      setViewTarget(null);
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const badgeVariant = (status: string) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'error';
    if (status === 'CONTACTED') return 'luxury';
    return 'default';
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Wholesale Inquiries</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} total</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Business or email…"
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
          <div className="text-center py-12"><p className="text-charcoal-400 font-body text-sm">No wholesale inquiries yet.</p></div>
        ) : (
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Business', 'Contact', 'Country', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {inquiries.map((inq) => (
                <motion.tr key={inq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors cursor-pointer" onClick={() => setViewTarget(inq)}>
                  <td className="px-4 py-3 text-sm font-body font-medium text-charcoal-900">{inq.businessName}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-body text-charcoal-700">{inq.contactName}</p>
                    <p className="text-xs text-charcoal-400 font-body">{inq.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-500">{inq.country}</td>
                  <td className="px-4 py-3"><Badge variant={badgeVariant(inq.status)} size="sm">{inq.status.toLowerCase()}</Badge></td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(inq.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <a href={`mailto:${inq.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
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

      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Wholesale Inquiry" size="md">
        {viewTarget && (
          <div className="p-6 space-y-5">
            <div className="bg-charcoal-50 p-4 text-sm font-body space-y-2">
              {[
                { label: 'Business', value: viewTarget.businessName },
                { label: 'Contact', value: viewTarget.contactName },
                { label: 'Email', value: viewTarget.email },
                ...(viewTarget.phone ? [{ label: 'Phone', value: viewTarget.phone }] : []),
                { label: 'Country', value: viewTarget.country },
                { label: 'Submitted', value: formatDate(viewTarget.createdAt) },
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
            <div className="flex flex-wrap gap-2">
              {['CONTACTED', 'APPROVED', 'REJECTED'].map((s) => (
                <Button
                  key={s}
                  variant={s === 'APPROVED' ? 'primary' : s === 'REJECTED' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => updateStatus.mutate({ id: viewTarget.id, status: s })}
                  isLoading={updateStatus.isPending}
                  disabled={viewTarget.status === s}
                >
                  {s === 'CONTACTED' ? 'Mark Contacted' : s === 'APPROVED' ? 'Approve' : 'Reject'}
                </Button>
              ))}
              <a href={`mailto:${viewTarget.email}`} className="btn-secondary text-xs flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> Reply by Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
