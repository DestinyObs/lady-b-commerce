import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Trash2, Download, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const PAGE_SIZE = 40;

interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  isActive: boolean;
  source: string;
  createdAt: string;
}

export default function AdminNewsletter() {
  useEffect(() => { document.title = 'Newsletter | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-newsletter', page, search],
    queryFn: () =>
      api.get(`/admin/newsletter?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const subscribers: Subscriber[] = data?.subscribers || [];
  const total: number = data?.total || 0;
  const activeCount: number = data?.activeCount || 0;

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/newsletter/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-newsletter'] }); setDeleteTarget(null); toast.success('Subscriber removed'); },
    onError: () => toast.error('Failed to remove subscriber'),
  });

  const broadcast = useMutation({
    mutationFn: ({ subject, body }: { subject: string; body: string }) =>
      api.post('/admin/newsletter/broadcast', { subject, body }),
    onSuccess: () => {
      setBroadcastOpen(false);
      setBroadcastSubject('');
      setBroadcastBody('');
      toast.success('Broadcast queued for delivery');
    },
    onError: () => toast.error('Failed to send broadcast'),
  });

  const exportCSV = () => {
    api.get('/admin/newsletter/export', { responseType: 'blob' })
      .then((r) => {
        const url = URL.createObjectURL(r.data as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter-subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Export failed'));
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Newsletter</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{activeCount} active subscribers of {total} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => setBroadcastOpen(true)}>
            <Send className="h-4 w-4" /> Send Broadcast
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Subscribers', value: total, icon: Users },
          { label: 'Active', value: activeCount, icon: Users },
          { label: 'Unsubscribed', value: total - activeCount, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-charcoal-100 p-4">
            <p className="text-xs text-charcoal-400 font-body mb-1">{label}</p>
            <p className="font-serif font-light text-2xl text-charcoal-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Search email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12"><p className="text-charcoal-400 font-body text-sm">No subscribers found.</p></div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Email', 'Name', 'Source', 'Status', 'Joined', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {subscribers.map((sub) => (
                <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-body text-charcoal-700">{sub.email}</td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-600">{sub.firstName || '—'}</td>
                  <td className="px-4 py-3 text-xs font-body text-charcoal-400">{sub.source}</td>
                  <td className="px-4 py-3"><Badge variant={sub.isActive ? 'success' : 'error'} size="sm">{sub.isActive ? 'Subscribed' : 'Unsubscribed'}</Badge></td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(sub.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteTarget(sub.id)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
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

      {/* Broadcast modal */}
      <Modal isOpen={broadcastOpen} onClose={() => setBroadcastOpen(false)} title="Send Newsletter Broadcast" size="md">
        <div className="p-6 space-y-4">
          <p className="text-sm text-charcoal-500 font-body">This will send to all <strong>{activeCount}</strong> active subscribers.</p>
          <Input label="Subject *" value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} />
          <div>
            <label className="block label-luxury mb-2">Message Body *</label>
            <textarea
              rows={8}
              className="input-luxury resize-none w-full text-sm"
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              placeholder="Write your newsletter content here…"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => broadcast.mutate({ subject: broadcastSubject, body: broadcastBody })}
              isLoading={broadcast.isPending}
              disabled={!broadcastSubject.trim() || !broadcastBody.trim()}
            >
              <Send className="h-4 w-4" /> Send to {activeCount} subscribers
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setBroadcastOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget)}
        title="Remove subscriber?"
        description="They will no longer receive newsletter emails."
        confirmLabel="Remove"
        isLoading={remove.isPending}
      />
    </div>
  );
}
