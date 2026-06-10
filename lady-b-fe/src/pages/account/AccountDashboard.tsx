import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Heart, Palette, ArrowRight } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate, orderStatusLabel } from '../../lib/utils';
import { useAuthStore } from '../../store/auth.store';
import { AccountShell } from '../../components/account/AccountShell';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

export default function AccountDashboard() {
  useEffect(() => { document.title = 'My Account | Lady B Designs'; }, []);
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['account-dashboard'],
    queryFn: () => api.get('/account/dashboard').then((r) => r.data.data),
  });

  const stats = [
    { label: 'Orders', value: data?.totalOrders ?? 0, icon: Package, href: '/account/orders' },
    { label: 'Wishlisted', value: data?.wishlistCount ?? 0, icon: Heart, href: '/wishlist' },
    { label: 'Commissions', value: data?.customOrdersCount ?? 0, icon: Palette, href: '/account/custom-orders' },
  ];

  return (
    <AccountShell>
      {/* Welcome */}
      <motion.div variants={FADE_UP} initial="hidden" animate="visible" className="mb-10">
        <p className="text-xs text-charcoal-400 font-body tracking-wide uppercase mb-1">Welcome back</p>
        <h1 className="font-serif font-light text-4xl text-charcoal-900">
          {user?.firstName} {user?.lastName}
        </h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={FADE_UP} initial="hidden" animate="visible" custom={i + 1}>
            <Link
              to={stat.href}
              className="group block bg-charcoal-50 p-5 hover:bg-charcoal-100 transition-colors"
            >
              <stat.icon className="h-5 w-5 text-gold-champagne mb-3" />
              {isLoading ? (
                <Skeleton className="h-7 w-10 mb-1" />
              ) : (
                <p className="font-serif font-light text-3xl text-charcoal-900 mb-0.5">{stat.value}</p>
              )}
              <p className="text-xs text-charcoal-400 font-body uppercase tracking-wide">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={4}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif font-light text-2xl text-charcoal-900">Recent Orders</h2>
          <Link to="/account/orders" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase flex items-center gap-1.5">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : !data?.recentOrders?.length ? (
          <div className="bg-charcoal-50 p-8 text-center">
            <Package className="h-8 w-8 text-charcoal-200 mx-auto mb-3" />
            <p className="font-serif font-light text-xl text-charcoal-700 mb-2">No orders yet</p>
            <p className="text-sm text-charcoal-400 font-body mb-5">Your order history will appear here.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-900 border-b border-charcoal-400 pb-0.5">
              Explore the shop
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-100 border border-charcoal-100">
            {data.recentOrders.slice(0, 5).map((order: {
              id: string;
              orderNumber: string;
              status: string;
              total: number;
              createdAt: string;
              itemCount: number;
            }) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-charcoal-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal-400 font-body mt-0.5">
                    {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      order.status === 'DELIVERED' ? 'success'
                      : order.status === 'CANCELLED' ? 'error'
                      : order.status === 'SHIPPED' ? 'luxury'
                      : 'default'
                    }
                    size="sm"
                  >
                    {orderStatusLabel(order.status)}
                  </Badge>
                  <span className="text-sm font-body font-medium text-charcoal-900 hidden sm:block">
                    {formatCurrency(order.total)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-charcoal-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick links */}
      <motion.div variants={FADE_UP} initial="hidden" animate="visible" custom={5} className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: 'Bespoke Commission',
            desc: 'Start a custom order crafted exclusively for you.',
            href: '/custom-orders/start',
            color: 'bg-charcoal-900',
            textColor: 'text-ivory',
          },
          {
            title: 'Explore Collections',
            desc: 'Discover our latest handcrafted pieces.',
            href: '/collections',
            color: 'bg-ivory border border-charcoal-100',
            textColor: 'text-charcoal-900',
          },
        ].map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className={`${card.color} ${card.textColor} p-6 flex flex-col justify-between group hover:opacity-90 transition-opacity`}
          >
            <div>
              <p className="font-serif font-light text-xl mb-2">{card.title}</p>
              <p className={`text-xs font-body leading-relaxed ${card.textColor === 'text-ivory' ? 'text-ivory/60' : 'text-charcoal-500'}`}>
                {card.desc}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 mt-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </motion.div>
    </AccountShell>
  );
}
