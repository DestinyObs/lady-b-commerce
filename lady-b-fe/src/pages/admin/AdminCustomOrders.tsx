import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate, customOrderStatusLabel } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';

const PAGE_SIZE = 25;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'SUBMITTED', label: 'New' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'IN_PRODUCTION', label: 'In Production' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const STATUS_BADGE: Record<string, 'default' | 'success' | 'error' | 'luxury'> = {
  SUBMITTED: 'default',
  REVIEWING: 'default',
  QUOTED: 'luxury',
  APPROVED_BY_CUSTOMER: 'luxury',
  DEPOSIT_PAID: 'luxury',
  IN_PRODUCTION: 'luxury',
  READY_FOR_FINAL_PAYMENT: 'luxury',
  FINAL_PAYMENT_PAID: 'luxury',
  SHIPPED: 'luxury',
  COMPLETED: 'success',
  CANCELLED: 'error',
  REJECTED: 'error',
};

interface CustomOrder {
  id: string;
  referenceNumber: string;
  status: string;
  category: string;
  budget: string;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string };
  estimatedPrice?: number;
}

export default function AdminCustomOrders() {
  useEffect(() => { document.title = 'Custom Orders | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-custom-orders', page, search, statusFilter],
    queryFn: () =>
      api.get(`/admin/custom-orders?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}&status=${statusFilter}`)
        .then((r) => r.data.data),
  });

  const orders: CustomOrder[] = data?.orders || [];
  const total: number = data?.total || 0;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Commissions</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Reference # or customer…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
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

      <div className="bg-white border border-charcoal-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-400 font-body text-sm">No commissions found.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Reference', 'Customer', 'Category', 'Budget', 'Status', 'Submitted', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {orders.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-body font-medium text-charcoal-900">{order.referenceNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-body text-charcoal-700">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-xs text-charcoal-400 font-body">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-600">{order.category}</td>
                  <td className="px-4 py-3 text-xs font-body text-charcoal-500">{order.budget?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[order.status] || 'default'} size="sm">{customOrderStatusLabel(order.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/custom-orders/${order.id}`} className="flex items-center gap-1 text-xs text-charcoal-400 hover:text-charcoal-900 font-body transition-colors">
                      Manage <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
    </div>
  );
}
