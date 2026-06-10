import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate, orderStatusLabel } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';

const PAGE_SIZE = 25;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string };
}

export default function AdminOrders() {
  useEffect(() => { document.title = 'Orders | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, search, statusFilter],
    queryFn: () =>
      api.get(`/admin/orders?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}&status=${statusFilter}`)
        .then((r) => r.data.data),
  });

  const orders: Order[] = data?.orders || [];
  const total: number = data?.total || 0;

  const badgeVariant = (status: string) =>
    status === 'DELIVERED' ? 'success' : status === 'CANCELLED' ? 'error' : status === 'SHIPPED' ? 'luxury' : 'default';

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Orders</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Order # or customer email…"
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
            <p className="text-charcoal-400 font-body text-sm">No orders found.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Order', 'Customer', 'Status', 'Items', 'Total', 'Date', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {orders.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-body font-medium text-charcoal-900">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-body text-charcoal-700">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-xs text-charcoal-400 font-body">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={badgeVariant(order.status)} size="sm">{orderStatusLabel(order.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-500">{order.itemCount}</td>
                  <td className="px-4 py-3 text-sm font-body font-medium text-charcoal-900">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-1 text-xs text-charcoal-400 hover:text-charcoal-900 font-body transition-colors">
                      View <ChevronRight className="h-3.5 w-3.5" />
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
