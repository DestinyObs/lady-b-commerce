import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, UserX, UserCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatDate, formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Avatar } from '../../components/ui/Avatar';

const PAGE_SIZE = 30;

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomers() {
  useEffect(() => { document.title = 'Customers | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [banTarget, setBanTarget] = useState<Customer | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: () =>
      api.get(`/admin/customers?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const toggleBan = useMutation({
    mutationFn: ({ id, ban }: { id: string; ban: boolean }) =>
      api.patch(`/admin/customers/${id}`, { isActive: !ban }),
    onSuccess: (_, { ban }) => {
      qc.invalidateQueries({ queryKey: ['admin-customers'] });
      setBanTarget(null);
      toast.success(ban ? 'Customer suspended' : 'Customer reactivated');
    },
    onError: () => toast.error('Failed to update customer'),
  });

  const customers: Customer[] = data?.customers || [];
  const total: number = data?.total || 0;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Customers</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} registered</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-charcoal-400 font-body text-sm">No customers found.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Customer', 'Email', 'Status', 'Orders', 'Spent', 'Joined', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {customers.map((customer) => (
                <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${customer.firstName} ${customer.lastName}`} size="sm" />
                      <span className="text-sm font-body font-medium text-charcoal-900">{customer.firstName} {customer.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-600">
                    <div className="flex items-center gap-1.5">
                      {customer.email}
                      {!customer.isEmailVerified && <span className="text-2xs text-amber-500 font-body">(unverified)</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={customer.isActive ? 'success' : 'error'} size="sm">
                      {customer.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-700">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-sm font-body font-medium text-charcoal-900">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${customer.email}`} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors" aria-label="Email">
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => setBanTarget(customer)}
                        className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors"
                        aria-label={customer.isActive ? 'Suspend' : 'Reactivate'}
                      >
                        {customer.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      </button>
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

      <ConfirmDialog
        isOpen={!!banTarget}
        onClose={() => setBanTarget(null)}
        onConfirm={() => banTarget && toggleBan.mutate({ id: banTarget.id, ban: banTarget.isActive })}
        title={banTarget?.isActive ? `Suspend ${banTarget?.firstName}?` : `Reactivate ${banTarget?.firstName}?`}
        description={banTarget?.isActive
          ? 'They will no longer be able to sign in or place orders.'
          : 'They will regain full access to their account.'}
        confirmLabel={banTarget?.isActive ? 'Suspend' : 'Reactivate'}
        variant={banTarget?.isActive ? 'danger' : 'default'}
        isLoading={toggleBan.isPending}
      />
    </div>
  );
}
