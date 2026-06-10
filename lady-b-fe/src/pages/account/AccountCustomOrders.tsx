import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Palette, ArrowRight, ChevronRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate, customOrderStatusLabel } from '../../lib/utils';
import { AccountShell } from '../../components/account/AccountShell';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';

const PAGE_SIZE = 8;

const STATUS_COLORS: Record<string, 'default' | 'success' | 'error' | 'luxury'> = {
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

export default function AccountCustomOrders() {
  useEffect(() => { document.title = 'My Commissions | Lady B Designs'; }, []);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['account-custom-orders', page],
    queryFn: () =>
      api.get(`/account/custom-orders?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data.data),
  });

  const orders = data?.orders || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  return (
    <AccountShell title="My Commissions" breadcrumb="Custom Orders">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <p className="text-sm text-charcoal-500 font-body">
          Track and manage your bespoke commissions.
        </p>
        <Link to="/custom-orders/start">
          <button className="btn-primary text-xs flex items-center gap-2">
            <Palette className="h-4 w-4" />
            New Commission
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-charcoal-50">
          <Palette className="h-10 w-10 text-charcoal-200 mx-auto mb-4" />
          <p className="font-serif font-light text-2xl text-charcoal-700 mb-2">No commissions yet</p>
          <p className="text-sm text-charcoal-400 font-body mb-6">
            Start a bespoke commission and we'll craft something extraordinary just for you.
          </p>
          <Link to="/custom-orders/start" className="btn-primary inline-flex text-xs">
            <Palette className="h-4 w-4" />
            Start a Commission
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: {
            id: string;
            referenceNumber: string;
            status: string;
            category: string;
            description: string;
            createdAt: string;
            estimatedPrice?: number | null;
            images?: Array<{ url: string }>;
          }, i: number) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                to={`/custom-orders/${order.id}`}
                className="flex items-start gap-4 p-5 border border-charcoal-100 hover:border-charcoal-300 transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                  {order.images?.[0] ? (
                    <img src={order.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="h-5 w-5 text-charcoal-200" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <p className="font-body font-medium text-charcoal-900 text-sm">{order.referenceNumber}</p>
                    <Badge variant={STATUS_COLORS[order.status] || 'default'} size="sm">
                      {customOrderStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-400 font-body mb-1 uppercase tracking-wide">{order.category}</p>
                  <p className="text-xs text-charcoal-500 font-body truncate">{order.description}</p>
                  <p className="text-xs text-charcoal-300 font-body mt-1">{formatDate(order.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {order.estimatedPrice && (
                    <p className="text-sm font-body font-medium text-charcoal-900 hidden sm:block">
                      From ${Number(order.estimatedPrice).toLocaleString()}
                    </p>
                  )}
                  <ChevronRight className="h-4 w-4 text-charcoal-300 group-hover:text-charcoal-700 transition-colors" />
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
