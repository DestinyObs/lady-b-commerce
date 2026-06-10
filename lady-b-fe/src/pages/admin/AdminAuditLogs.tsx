import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, ClipboardList } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Avatar } from '../../components/ui/Avatar';

const PAGE_SIZE = 40;

const ACTION_COLORS: Record<string, 'default' | 'success' | 'error' | 'luxury'> = {
  CREATE: 'success',
  UPDATE: 'luxury',
  DELETE: 'error',
  LOGIN: 'default',
  LOGOUT: 'default',
  EXPORT: 'default',
};

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
  admin: { firstName: string; lastName: string; email: string };
  metadata?: Record<string, unknown>;
}

export default function AdminAuditLogs() {
  useEffect(() => { document.title = 'Audit Logs | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page, search],
    queryFn: () =>
      api.get(`/admin/audit-logs?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const logs: AuditLog[] = data?.logs || [];
  const total: number = data?.total || 0;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Audit Logs</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} events recorded</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Search actions or entities…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-charcoal-100">
          <ClipboardList className="h-8 w-8 text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-400 font-body text-sm">No audit logs yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-charcoal-100 overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-charcoal-50/50 transition-colors"
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              >
                <Badge variant={ACTION_COLORS[log.action] || 'default'} size="sm" className="flex-shrink-0 min-w-[70px] text-center">
                  {log.action}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-charcoal-700 truncate">{log.description}</p>
                  <p className="text-xs text-charcoal-300 font-body mt-0.5">{log.entity}{log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ''}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2">
                    <Avatar name={`${log.admin.firstName} ${log.admin.lastName}`} size="xs" />
                    <p className="text-xs text-charcoal-400 font-body">{log.admin.firstName}</p>
                  </div>
                  <p className="text-xs text-charcoal-300 font-body">{formatDate(log.createdAt)}</p>
                </div>
              </button>
              {expanded === log.id && (
                <div className="px-4 pb-4 border-t border-charcoal-50">
                  <div className="mt-3 bg-charcoal-50 p-3 text-xs font-mono text-charcoal-600 overflow-x-auto">
                    <div className="grid grid-cols-2 gap-2 mb-2 font-body">
                      <div><span className="text-charcoal-400">Admin:</span> {log.admin.firstName} {log.admin.lastName} ({log.admin.email})</div>
                      <div><span className="text-charcoal-400">IP:</span> {log.ipAddress || 'unknown'}</div>
                      <div><span className="text-charcoal-400">Entity:</span> {log.entity}</div>
                      {log.entityId && <div><span className="text-charcoal-400">ID:</span> {log.entityId}</div>}
                    </div>
                    {log.metadata && (
                      <pre className="text-2xs overflow-x-auto">{JSON.stringify(log.metadata, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
