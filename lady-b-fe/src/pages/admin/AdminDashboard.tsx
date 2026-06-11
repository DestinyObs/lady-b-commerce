import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Users, Palette, AlertTriangle, ArrowUpRight,
  Package, MessageSquare, Star, Zap, BarChart2, Clock,
} from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';

const FADE = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

const STATUS_COLOR: Record<string, 'default' | 'success' | 'error' | 'luxury'> = {
  DELIVERED: 'success', CANCELLED: 'error', PENDING: 'default',
  CONFIRMED: 'luxury', PROCESSING: 'luxury', SHIPPED: 'luxury',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function SparkBar({ value, max, color = 'bg-charcoal-900' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 4;
  return <div className={`${color} rounded-sm transition-all duration-500`} style={{ height: `${pct}%`, width: '100%' }} />;
}

export default function AdminDashboard() {
  useEffect(() => { document.title = 'Dashboard | Lady B Admin'; }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data.data),
    refetchInterval: 60_000,
  });

  const stats = [
    {
      label: 'Revenue this month', value: formatCurrency(data?.revenue?.thisMonth || 0),
      sub: `${data?.revenue?.growth >= 0 ? '+' : ''}${data?.revenue?.growth || 0}% vs last month`,
      icon: TrendingUp, href: '/admin/orders', color: 'text-emerald-luxury', positive: (data?.revenue?.growth || 0) >= 0,
    },
    {
      label: 'Orders pending', value: data?.orders?.pending ?? '—',
      sub: `${data?.orders?.total || 0} total orders`,
      icon: ShoppingBag, href: '/admin/orders', color: 'text-gold-champagne', positive: true,
    },
    {
      label: 'New customers', value: data?.customers?.newThisMonth ?? '—',
      sub: `${data?.customers?.total || 0} total customers`,
      icon: Users, href: '/admin/customers', color: 'text-charcoal-600', positive: true,
    },
    {
      label: 'Custom orders pending', value: data?.customOrders?.pending ?? '—',
      sub: `${data?.customOrders?.total || 0} total commissions`,
      icon: Palette, href: '/admin/custom-orders', color: 'text-blush', positive: true,
    },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/admin/products/new', icon: Package },
    { label: 'View Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'View Messages', href: '/admin/contact-messages', icon: MessageSquare },
    { label: 'Review Queue', href: '/admin/reviews', icon: Star },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: Clock },
    { label: 'Inventory', href: '/admin/inventory', icon: BarChart2 },
  ];

  const weeklyRevenue: number[] = data?.revenue?.weekly || [0, 0, 0, 0, 0, 0, 0];
  const weekMax = Math.max(...weeklyRevenue, 1);
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.p variants={FADE} initial="hidden" animate="visible" className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-1">
            Lady B Admin
          </motion.p>
          <motion.h1 variants={FADE} initial="hidden" animate="visible" custom={1} className="font-serif font-light text-3xl text-charcoal-900">
            {greeting()}, Lady B
          </motion.h1>
          <motion.p variants={FADE} initial="hidden" animate="visible" custom={2} className="text-sm text-charcoal-400 font-body mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={3}>
          <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-charcoal-900 text-ivory px-4 py-2.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors">
            <Zap className="h-3.5 w-3.5" /> New Product
          </Link>
        </motion.div>
      </div>

      {/* Low stock alert */}
      {(data?.inventory?.lowStockCount || 0) > 0 && (
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={3} className="bg-amber-50 border border-amber-200 px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-body">
            <strong>{data.inventory.lowStockCount} products</strong> are running low on stock.{' '}
            <Link to="/admin/inventory" className="underline font-medium">Review inventory →</Link>
          </p>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={FADE} initial="hidden" animate="visible" custom={i + 4}>
            <Link to={stat.href} className="bg-white border border-charcoal-100 p-6 hover:border-charcoal-300 transition-colors group block h-full">
              <div className="flex items-start justify-between mb-4">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <ArrowUpRight className="h-4 w-4 text-charcoal-200 group-hover:text-charcoal-600 transition-colors" />
              </div>
              <p className="font-serif font-light text-3xl text-charcoal-900 mb-1">{stat.value}</p>
              <p className="text-xs text-charcoal-400 font-body tracking-wide uppercase mb-1">{stat.label}</p>
              <p className={`text-xs font-body ${stat.positive ? 'text-emerald-luxury' : 'text-red-500'}`}>{stat.sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly revenue bar chart */}
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={8} className="lg:col-span-2 bg-white border border-charcoal-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif font-light text-lg text-charcoal-900">Revenue — This Week</h2>
            <span className="text-xs text-charcoal-400 font-body">{formatCurrency(weeklyRevenue.reduce((a, b) => a + b, 0))} total</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {weeklyRevenue.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                <div className="w-full flex-1 flex items-end">
                  <SparkBar value={val} max={weekMax} color={i === new Date().getDay() - 1 ? 'bg-charcoal-900' : 'bg-charcoal-200'} />
                </div>
                <span className="text-2xs font-body text-charcoal-400">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={9} className="bg-white border border-charcoal-100 p-6">
          <h2 className="font-serif font-light text-lg text-charcoal-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                to={href}
                className="flex flex-col items-center gap-2 p-3 border border-charcoal-100 hover:border-charcoal-900 hover:bg-charcoal-50 transition-all text-center group"
              >
                <Icon className="h-4 w-4 text-charcoal-400 group-hover:text-charcoal-900 transition-colors" />
                <span className="text-2xs tracking-wide uppercase font-body text-charcoal-500 group-hover:text-charcoal-900 transition-colors leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent orders + Recent custom orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent orders */}
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={10} className="bg-white border border-charcoal-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-50">
            <h2 className="font-serif font-light text-lg text-charcoal-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase">View all</Link>
          </div>
          <div className="divide-y divide-charcoal-50">
            {(data?.recentOrders || []).slice(0, 6).map((order: {
              id: string; orderNumber: string; status: string;
              total: number; createdAt: string;
              user: { firstName: string; lastName: string };
            }) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-charcoal-50/50 transition-colors">
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal-400 font-body">{order.user.firstName} {order.user.lastName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_COLOR[order.status] || 'default'} size="sm">{order.status}</Badge>
                  <span className="text-sm font-body font-medium text-charcoal-900 tabular-nums">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            ))}
            {!data?.recentOrders?.length && (
              <div className="px-6 py-10 text-center"><p className="text-sm text-charcoal-400 font-body">No orders yet</p></div>
            )}
          </div>
        </motion.div>

        {/* Recent custom orders */}
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={11} className="bg-white border border-charcoal-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-50">
            <h2 className="font-serif font-light text-lg text-charcoal-900">Custom Orders</h2>
            <Link to="/admin/custom-orders" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase">View all</Link>
          </div>
          <div className="divide-y divide-charcoal-50">
            {(data?.recentCustomOrders || []).slice(0, 6).map((co: {
              id: string; referenceNumber: string; status: string;
              category: string; createdAt: string;
              user: { firstName: string; lastName: string };
            }) => (
              <Link key={co.id} to={`/admin/custom-orders/${co.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-charcoal-50/50 transition-colors">
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{co.referenceNumber}</p>
                  <p className="text-xs text-charcoal-400 font-body">{co.user.firstName} {co.user.lastName} · {co.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={co.status === 'SUBMITTED' ? 'default' : co.status === 'COMPLETED' ? 'success' : 'luxury'} size="sm">
                    {co.status}
                  </Badge>
                  <span className="text-xs text-charcoal-300 font-body hidden md:block">{formatDate(co.createdAt)}</span>
                </div>
              </Link>
            ))}
            {!data?.recentCustomOrders?.length && (
              <div className="px-6 py-10 text-center"><p className="text-sm text-charcoal-400 font-body">No custom orders yet</p></div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top products */}
      {(data?.topProducts || []).length > 0 && (
        <motion.div variants={FADE} initial="hidden" animate="visible" custom={12} className="bg-white border border-charcoal-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-50">
            <h2 className="font-serif font-light text-lg text-charcoal-900">Top Products This Month</h2>
            <Link to="/admin/products" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase">All products</Link>
          </div>
          <div className="divide-y divide-charcoal-50">
            {(data.topProducts as Array<{ id: string; name: string; sales: number; revenue: number; images?: Array<{ url: string }> }>).slice(0, 5).map((p, i) => (
              <Link key={p.id} to={`/admin/products/${p.id}/edit`} className="flex items-center gap-4 px-6 py-4 hover:bg-charcoal-50/50 transition-colors">
                <span className="text-charcoal-200 font-serif text-xl font-light w-6 text-center">{i + 1}</span>
                <div className="w-10 h-10 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                  {p.images?.[0] && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-charcoal-900 truncate">{p.name}</p>
                  <p className="text-xs text-charcoal-400 font-body">{p.sales} sold</p>
                </div>
                <span className="text-sm font-body font-medium text-charcoal-900 tabular-nums">{formatCurrency(p.revenue)}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <Skeleton className="h-16 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-36" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-52" />
        <Skeleton className="h-52" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
