import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Users, Palette, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';

export default function AdminDashboard() {
  useEffect(() => { document.title = 'Dashboard | Lady B Admin'; }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data.data),
  });

  if (isLoading) return <DashboardSkeleton />;

  const stats = [
    { label: 'Revenue this month', value: formatCurrency(data?.revenue?.thisMonth || 0), sub: `${data?.revenue?.growth || 0}% vs last month`, icon: TrendingUp, href: '/admin/analytics/sales', color: 'text-emerald-luxury' },
    { label: 'Orders pending', value: data?.orders?.pending || 0, sub: `${data?.orders?.total || 0} total orders`, icon: ShoppingBag, href: '/admin/orders', color: 'text-gold-champagne' },
    { label: 'New customers', value: data?.customers?.newThisMonth || 0, sub: `${data?.customers?.total || 0} total`, icon: Users, href: '/admin/customers', color: 'text-charcoal-600' },
    { label: 'Custom orders', value: data?.customOrders?.pending || 0, sub: 'Pending review', icon: Palette, href: '/admin/custom-orders', color: 'text-blush' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-light text-3xl text-charcoal-900">Dashboard</h1>
        <p className="text-sm text-charcoal-400 font-body mt-1">{formatDate(new Date())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-white border border-charcoal-100 p-6 hover:border-charcoal-300 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <ArrowUpRight className="h-4 w-4 text-charcoal-300 group-hover:text-charcoal-600 transition-colors" />
            </div>
            <p className="font-serif font-light text-3xl text-charcoal-900 mb-1">{stat.value}</p>
            <p className="text-xs text-charcoal-400 font-body tracking-wide uppercase">{stat.label}</p>
            <p className="text-xs text-charcoal-400 font-body mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {data?.inventory?.lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-body">
            {data.inventory.lowStockCount} product variants are running low on stock.{' '}
            <Link to="/admin/inventory" className="underline">Review inventory</Link>
          </p>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white border border-charcoal-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-50">
          <h2 className="font-serif font-light text-lg text-charcoal-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase">View all</Link>
        </div>
        <div className="divide-y divide-charcoal-50">
          {data?.recentOrders?.slice(0, 8).map((order: {
            id: string;
            orderNumber: string;
            status: string;
            total: number;
            createdAt: string;
            user: { firstName: string; lastName: string };
          }) => (
            <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-charcoal-50 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal-400 font-body">{order.user.firstName} {order.user.lastName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'default'} size="sm">
                  {order.status}
                </Badge>
                <span className="text-sm font-body font-medium text-charcoal-900">{formatCurrency(order.total)}</span>
                <span className="text-xs text-charcoal-400 font-body hidden md:block">{formatDate(order.createdAt)}</span>
              </div>
            </Link>
          ))}
          {(!data?.recentOrders || data.recentOrders.length === 0) && (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-charcoal-400 font-body">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-36" />)}
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
