import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, CheckCircle, Trash2, Reply } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

const PAGE_SIZE = 25;

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export default function AdminContactMessages() {
  useEffect(() => { document.title = 'Contact Messages | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMsg, setViewMsg] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contact', page, search],
    queryFn: () =>
      api.get(`/admin/contact-messages?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const messages: ContactMessage[] = data?.messages || [];
  const total: number = data?.total || 0;

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/contact-messages/${id}`, { isRead: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-contact'] }),
  });

  const reply = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      api.post(`/admin/contact-messages/${id}/reply`, { body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-contact'] });
      setReplyBody('');
      setViewMsg(null);
      toast.success('Reply sent');
    },
    onError: () => toast.error('Failed to send reply'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/contact-messages/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-contact'] }); setDeleteTarget(null); toast.success('Deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const handleView = (msg: ContactMessage) => {
    setViewMsg(msg);
    if (!msg.isRead) markRead.mutate(msg.id);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Contact Messages</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} messages</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Name, email or subject…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white border border-charcoal-100">
          <Mail className="h-8 w-8 text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-400 font-body text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-charcoal-100 border border-charcoal-100 bg-white">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-start gap-3 p-4 hover:bg-charcoal-50/50 transition-colors ${!msg.isRead ? 'bg-blue-50/30' : ''}`}>
                <div className="flex-1 cursor-pointer" onClick={() => handleView(msg)}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <p className={`text-sm font-body ${!msg.isRead ? 'font-semibold text-charcoal-900' : 'font-medium text-charcoal-700'}`}>{msg.name}</p>
                    <p className="text-xs text-charcoal-400 font-body">{msg.email}</p>
                    <div className="flex gap-1.5 ml-auto">
                      {msg.isReplied && <Badge variant="success" size="sm">Replied</Badge>}
                      {!msg.isRead && <Badge variant="default" size="sm">New</Badge>}
                    </div>
                  </div>
                  <p className="text-sm font-body text-charcoal-600 truncate">{msg.subject}</p>
                  <p className="text-xs text-charcoal-300 font-body mt-0.5">{formatDate(msg.createdAt)}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => handleView(msg)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors" aria-label="View and reply">
                    <Reply className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(msg.id)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}

      {/* View / reply modal */}
      <Modal isOpen={!!viewMsg} onClose={() => { setViewMsg(null); setReplyBody(''); }} title="Message" size="md">
        {viewMsg && (
          <div className="p-6 space-y-5">
            <div className="bg-charcoal-50 p-4 text-sm font-body">
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div><span className="text-charcoal-400">From:</span> <span className="text-charcoal-700 font-medium">{viewMsg.name}</span></div>
                <div><span className="text-charcoal-400">Email:</span> <a href={`mailto:${viewMsg.email}`} className="text-charcoal-700">{viewMsg.email}</a></div>
                <div className="col-span-2"><span className="text-charcoal-400">Subject:</span> <span className="text-charcoal-900 font-medium">{viewMsg.subject}</span></div>
                <div><span className="text-charcoal-400">Received:</span> <span>{formatDate(viewMsg.createdAt)}</span></div>
              </div>
              <p className="text-charcoal-700 leading-relaxed whitespace-pre-wrap">{viewMsg.message}</p>
            </div>
            <div>
              <label className="block label-luxury mb-2">Reply</label>
              <textarea
                rows={5}
                className="input-luxury resize-none w-full text-sm"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder={`Reply to ${viewMsg.name}…`}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => reply.mutate({ id: viewMsg.id, body: replyBody })}
                isLoading={reply.isPending}
                disabled={!replyBody.trim()}
              >
                <Reply className="h-4 w-4" /> Send Reply
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setViewMsg(null); setReplyBody(''); }}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget)}
        title="Delete message?"
        description="This is permanent and cannot be undone."
        confirmLabel="Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
}
