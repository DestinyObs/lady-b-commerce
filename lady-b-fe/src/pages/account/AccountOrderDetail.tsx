import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, MapPin, Check, MessageCircle } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate, orderStatusLabel } from '../../lib/utils';
import { AccountShell } from '../../components/account/AccountShell';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

const ORDER_STEPS = [
  { status: 'PENDING', label: 'Order Placed' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'PROCESSING', label: 'In Production' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'DELIVERED', label: 'Delivered' },
];

function OrderTimeline({ status }: { status: string }) {
  if (['CANCELLED', 'REFUNDED'].includes(status)) {
    return (
      <div className="flex items-center gap-3 py-4 px-5 bg-red-50 border border-red-100">
        <Badge variant="error">{orderStatusLabel(status)}</Badge>
        <p className="text-sm text-red-700 font-body">This order has been {status.toLowerCase()}.</p>
      </div>
    );
  }

  const activeIdx = ORDER_STEPS.findIndex((s) => s.status === status);
  const idx = activeIdx === -1 ? 0 : activeIdx;

  return (
    <div className="flex items-start overflow-x-auto pb-2">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= idx;
        const active = i === idx;
        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 flex items-center justify-center text-xs font-body font-medium ${done ? 'bg-charcoal-900 text-ivory' : 'border border-charcoal-200 text-charcoal-300'}`}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <p className={`text-xs font-body mt-2 text-center w-20 leading-tight ${active ? 'text-charcoal-900 font-medium' : done ? 'text-charcoal-600' : 'text-charcoal-300'}`}>
                {step.label}
              </p>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`flex-1 h-px mt-3.5 mx-2 min-w-6 ${i < idx ? 'bg-charcoal-900' : 'bg-charcoal-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function AccountOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['account-order', orderId],
    queryFn: () => api.get(`/account/orders/${orderId}`).then((r) => r.data.data),
    enabled: !!orderId,
  });

  useEffect(() => {
    document.title = order ? `Order ${order.orderNumber} | Lady B` : 'Order | Lady B Designs';
  }, [order]);

  if (isLoading) {
    return (
      <AccountShell title="Order Detail" breadcrumb="Orders">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AccountShell>
    );
  }

  if (!order) {
    return (
      <AccountShell title="Order Not Found" breadcrumb="Orders">
        <p className="text-charcoal-500 font-body mb-4">This order doesn't exist or is not accessible.</p>
        <Link to="/account/orders" className="inline-flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 font-body transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </AccountShell>
    );
  }

  return (
    <AccountShell title={`Order ${order.orderNumber}`} breadcrumb="Orders">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-charcoal-400 font-body mb-1">Placed {formatDate(order.createdAt)}</p>
            <Badge
              variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : order.status === 'SHIPPED' ? 'luxury' : 'default'}
            >
              {orderStatusLabel(order.status)}
            </Badge>
          </div>
          <Link to="/account/orders" className="flex items-center gap-1.5 text-xs tracking-wide uppercase font-body text-charcoal-400 hover:text-charcoal-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All Orders
          </Link>
        </div>

        {/* Progress */}
        <div>
          <h2 className="label-luxury mb-4">Order Progress</h2>
          <OrderTimeline status={order.status} />
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-emerald-luxury/5 border border-emerald-luxury/20 p-4"
          >
            <Truck className="h-5 w-5 text-emerald-luxury flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-body font-medium text-charcoal-900">Tracking: {order.trackingNumber}</p>
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-luxury hover:underline font-body">
                  Track with carrier →
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Items */}
        <div>
          <h2 className="label-luxury mb-4">Items Ordered</h2>
          <div className="divide-y divide-charcoal-100 border border-charcoal-100">
            {order.items?.map((item: {
              id: string;
              quantity: number;
              price: number;
              product: { name: string; slug: string; images?: Array<{ url: string; altText?: string | null }> };
              variant?: { name: string } | null;
            }) => (
              <div key={item.id} className="flex gap-4 p-4">
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <div className="w-16 h-16 bg-charcoal-50 overflow-hidden">
                    {item.product.images?.[0] && (
                      <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.slug}`} className="font-body font-medium text-sm text-charcoal-900 hover:text-charcoal-600 transition-colors">
                    {item.product.name}
                  </Link>
                  {item.variant && <p className="text-xs text-charcoal-400 font-body mt-0.5">{item.variant.name}</p>}
                  <p className="text-xs text-charcoal-400 font-body mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-body font-medium text-sm text-charcoal-900 flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="label-luxury mb-4">Order Summary</h2>
            <div className="bg-charcoal-50 p-5 space-y-2.5">
              {[
                { label: 'Subtotal', value: formatCurrency(order.subtotal) },
                { label: 'Shipping', value: order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost) },
                ...(order.discount > 0 ? [{ label: 'Discount', value: `-${formatCurrency(order.discount)}` }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm font-body text-charcoal-600">
                  <span>{row.label}</span><span>{row.value}</span>
                </div>
              ))}
              <div className="border-t border-charcoal-200 pt-2.5 flex justify-between font-body font-semibold text-charcoal-900">
                <span>Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div>
              <h2 className="label-luxury mb-4 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />Shipping To
              </h2>
              <div className="bg-charcoal-50 p-5 text-sm font-body text-charcoal-700 space-y-0.5">
                <p className="font-medium text-charcoal-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="flex items-center gap-3 border border-charcoal-100 p-4">
          <MessageCircle className="h-5 w-5 text-gold-champagne flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-charcoal-900">Need help?</p>
            <p className="text-xs text-charcoal-400 font-body">Our team is ready to assist you with this order.</p>
          </div>
          <Link to="/contact" className="text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:text-charcoal-900 transition-colors border-b border-charcoal-300 flex-shrink-0">
            Contact us
          </Link>
        </div>
      </div>
    </AccountShell>
  );
}
