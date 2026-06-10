import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Search } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate, orderStatusLabel } from '../../lib/utils';
import { AccountShell } from '../../components/account/AccountShell';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const PAGE_SIZE = 10;

export default function AccountOrders() {
  useEffect(() => { document.title = 'My Orders | Lady B Designs'; }, []);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['account-orders', page, statusFilter, search],
    queryFn: () =>
      api.get(`/account/orders?page=${page}&limit=${PAGE_SIZE}&status=${statusFilter}&q=${encodeURIComponent(search)}`)
        .then((r) => r.data.data),
  });

  const orders = data?.orders || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  return (
    <AccountShell title="My Orders" breadcrumb="Orders">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-3.5 py-2 text-xs tracking-wide uppercase font-body border transition-colors ${
                statusFilter === f.value
                  ? 'bg-charcoal-900 border-charcoal-900 text-ivory'
                  : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-charcoal-50">
          <Package className="h-10 w-10 text-charcoal-200 mx-auto mb-4" />
          <p className="font-serif font-light text-2xl text-charcoal-700 mb-2">
            {search || statusFilter ? 'No matching orders' : 'No orders yet'}
          </p>
          <p className="text-sm text-charcoal-400 font-body mb-6">
            {search || statusFilter
              ? 'Try adjusting your filters.'
              : 'Your order history will appear here.'}
          </p>
          {!search && !statusFilter && (
            <Link to="/shop" className="inline-flex items-center gap-2 btn-primary text-xs">
              Shop Now
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {orders.map((order: {
            id: string;
            orderNumber: string;
            status: string;
            total: number;
            createdAt: string;
            itemCount: number;
            items?: Array<{ product: { images?: Array<{ url: string }> } }>;
          }, i: number) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link
                to={`/account/orders/${order.id}`}
                className="flex items-center gap-4 p-5 border border-charcoal-100 hover:border-charcoal-300 transition-all group"
              >
                <div className="flex -space-x-2 flex-shrink-0">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-12 h-12 bg-charcoal-50 border-2 border-ivory overflow-hidden">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                  ))}
                  {!order.items && <div className="w-12 h-12 bg-charcoal-50 flex items-center justify-center"><Package className="h-5 w-5 text-charcoal-200" /></div>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-body font-medium text-charcoal-900 text-sm">{order.orderNumber}</p>
                    <Badge
                      variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : order.status === 'SHIPPED' ? 'luxury' : 'default'}
                      size="sm"
                    >
                      {orderStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-400 font-body mt-0.5">
                    {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} · {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="font-body font-medium text-sm text-charcoal-900 hidden sm:block">{formatCurrency(order.total)}</p>
                  <ArrowRight className="h-4 w-4 text-charcoal-300 group-hover:text-charcoal-700 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </AccountShell>
  );
}
