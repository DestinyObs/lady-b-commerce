import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Truck, MapPin, Package } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate, orderStatusLabel } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [note, setNote] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => api.get(`/admin/orders/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  useEffect(() => {
    document.title = order ? `Order ${order.orderNumber} | Lady B Admin` : 'Order | Lady B Admin';
    if (order) {
      setStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
      setTrackingUrl(order.trackingUrl || '');
    }
  }, [order]);

  const updateOrder = useMutation({
    mutationFn: (payload: { status: string; trackingNumber?: string; trackingUrl?: string; note?: string }) =>
      api.patch(`/admin/orders/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-order', id] });
      toast.success('Order updated');
    },
    onError: () => toast.error('Failed to update order'),
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-charcoal-500 font-body">Order not found.</p>
        <Link to="/admin/orders" className="flex items-center gap-2 text-sm text-charcoal-400 hover:text-charcoal-900 mt-4">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/orders" className="flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-900 font-body mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Orders
          </Link>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">{order.orderNumber}</h1>
          <p className="text-xs text-charcoal-400 font-body">{formatDate(order.createdAt)} · {order.customer?.firstName} {order.customer?.lastName}</p>
        </div>
        <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'default'}>
          {orderStatusLabel(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: items + summary */}
        <div className="lg:col-span-2 space-y-6">

          {/* Items */}
          <div>
            <h2 className="label-luxury mb-3">Items</h2>
            <div className="border border-charcoal-100 divide-y divide-charcoal-50">
              {order.items?.map((item: {
                id: string;
                quantity: number;
                price: number;
                product: { name: string; slug: string; images?: Array<{ url: string }> };
                variant?: { name: string } | null;
              }) => (
                <div key={item.id} className="flex gap-3 p-3">
                  <div className="w-12 h-12 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] && <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-charcoal-900 truncate">{item.product.name}</p>
                    {item.variant && <p className="text-xs text-charcoal-400 font-body">{item.variant.name}</p>}
                    <p className="text-xs text-charcoal-400 font-body">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-body font-medium text-charcoal-900 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="label-luxury mb-3">Summary</h2>
            <div className="bg-charcoal-50 p-4 space-y-2 text-sm font-body">
              {[
                { label: 'Subtotal', value: formatCurrency(order.subtotal) },
                { label: 'Shipping', value: order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost) },
                ...(order.discount > 0 ? [{ label: 'Discount', value: `-${formatCurrency(order.discount)}` }] : []),
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-charcoal-600">
                  <span>{r.label}</span><span>{r.value}</span>
                </div>
              ))}
              <div className="border-t border-charcoal-200 pt-2 flex justify-between font-semibold text-charcoal-900">
                <span>Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div>
              <h2 className="label-luxury mb-3 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Ship To</h2>
              <div className="bg-charcoal-50 p-4 text-sm font-body text-charcoal-700 space-y-0.5">
                <p className="font-medium text-charcoal-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="space-y-6">
          <div className="bg-white border border-charcoal-100 p-5 space-y-4">
            <h2 className="label-luxury">Update Order</h2>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={ORDER_STATUSES}
            />
            <Input
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
            />
            <Input
              label="Tracking URL (optional)"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://..."
            />
            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Internal Note</label>
              <textarea
                rows={3}
                className="input-luxury resize-none text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note visible only to admin…"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => updateOrder.mutate({ status, trackingNumber, trackingUrl, note })}
              isLoading={updateOrder.isPending}
            >
              <Package className="h-4 w-4" /> Save Changes
            </Button>
          </div>

          {/* Customer */}
          {order.customer && (
            <div className="bg-white border border-charcoal-100 p-5">
              <h2 className="label-luxury mb-3">Customer</h2>
              <p className="text-sm font-body font-medium text-charcoal-900">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-xs text-charcoal-400 font-body">{order.customer.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
