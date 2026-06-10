import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Image } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate, formatCurrency, customOrderStatusLabel } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';

const COMMISSION_STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'APPROVED_BY_CUSTOMER', label: 'Approved by Customer' },
  { value: 'DEPOSIT_PAID', label: 'Deposit Paid' },
  { value: 'IN_PRODUCTION', label: 'In Production' },
  { value: 'READY_FOR_FINAL_PAYMENT', label: 'Ready — Final Payment' },
  { value: 'FINAL_PAYMENT_PAID', label: 'Final Payment Received' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STATUS_BADGE: Record<string, 'default' | 'success' | 'error' | 'luxury'> = {
  SUBMITTED: 'default', REVIEWING: 'default', QUOTED: 'luxury',
  IN_PRODUCTION: 'luxury', COMPLETED: 'success', CANCELLED: 'error', REJECTED: 'error',
};

export default function AdminCustomOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-custom-order', id],
    queryFn: () => api.get(`/admin/custom-orders/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  useEffect(() => {
    document.title = order ? `Commission ${order.referenceNumber} | Lady B Admin` : 'Commission | Lady B Admin';
    if (order) {
      setStatus(order.status);
      setEstimatedPrice(order.estimatedPrice ? String(order.estimatedPrice) : '');
      setTrackingNumber(order.trackingNumber || '');
      setTrackingUrl(order.trackingUrl || '');
    }
  }, [order]);

  const updateOrder = useMutation({
    mutationFn: (payload: object) => api.patch(`/admin/custom-orders/${id}`, payload).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-custom-order', id] }); toast.success('Commission updated'); },
    onError: () => toast.error('Failed to update commission'),
  });

  const sendMessage = useMutation({
    mutationFn: () => api.post(`/admin/custom-orders/${id}/messages`, { content: message }).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-custom-order', id] }); setMessage(''); toast.success('Message sent'); },
    onError: () => toast.error('Failed to send message'),
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-charcoal-500 font-body">Commission not found.</p>
        <Link to="/admin/custom-orders" className="flex items-center gap-2 text-sm text-charcoal-400 hover:text-charcoal-900 mt-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link to="/admin/custom-orders" className="flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-900 font-body mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Commissions
          </Link>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">{order.referenceNumber}</h1>
          <p className="text-xs text-charcoal-400 font-body">{formatDate(order.createdAt)} · {order.customer?.firstName} {order.customer?.lastName}</p>
        </div>
        <Badge variant={STATUS_BADGE[order.status] || 'default'}>{customOrderStatusLabel(order.status)}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: brief + messages */}
        <div className="lg:col-span-2 space-y-6">

          {/* Client brief */}
          <div>
            <h2 className="label-luxury mb-3">Client Brief</h2>
            <div className="bg-charcoal-50 p-5 text-sm font-body space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Category', value: order.category },
                  { label: 'Budget', value: order.budget?.replace(/_/g, ' ') },
                  { label: 'Timeline', value: order.timeline?.replace(/_/g, ' ') },
                  { label: 'Colours', value: order.colors },
                ].filter((i) => i.value).map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-2xs tracking-wide uppercase text-charcoal-400 mb-0.5">{label}</p>
                    <p className="text-charcoal-700">{value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-charcoal-200 pt-3">
                <p className="text-2xs tracking-wide uppercase text-charcoal-400 mb-1">Description</p>
                <p className="text-charcoal-700 leading-relaxed">{order.description}</p>
              </div>
              {order.materials && (
                <div>
                  <p className="text-2xs tracking-wide uppercase text-charcoal-400 mb-1">Materials</p>
                  <p className="text-charcoal-700">{order.materials}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reference images */}
          {order.images?.length > 0 && (
            <div>
              <h2 className="label-luxury mb-3 flex items-center gap-1.5"><Image className="h-3.5 w-3.5" />Reference Images</h2>
              <div className="flex flex-wrap gap-2">
                {order.images.map((img: { url: string }, i: number) => (
                  <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                    <img src={img.url} alt="" className="w-16 h-16 object-cover bg-charcoal-50" loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Messages thread */}
          <div>
            <h2 className="label-luxury mb-3">Message Thread</h2>
            {order.adminMessages?.length > 0 ? (
              <div className="space-y-3 mb-4">
                {order.adminMessages.map((msg: { id: string; content: string; createdAt: string }) => (
                  <div key={msg.id} className="bg-white border border-charcoal-100 p-4">
                    <p className="text-xs text-charcoal-400 font-body mb-1.5">{formatDate(msg.createdAt)} · Admin</p>
                    <p className="text-sm font-body text-charcoal-700">{msg.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-300 font-body mb-4">No messages yet.</p>
            )}
            <div className="space-y-3">
              <textarea
                rows={4}
                placeholder="Write a message to the customer… (will be visible in their account)"
                className="input-luxury resize-none text-sm w-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => message.trim() && sendMessage.mutate()}
                isLoading={sendMessage.isPending}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" /> Send Message
              </Button>
            </div>
          </div>

          {/* Progress images upload */}
          <div>
            <h2 className="label-luxury mb-3">Upload Progress Photos</h2>
            <p className="text-xs text-charcoal-400 font-body mb-3">Photos uploaded here are attached to the next message sent.</p>
            <FileUpload accept="image/*" maxFiles={10} maxSizeMB={20} />
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-6">
          <div className="bg-white border border-charcoal-100 p-5 space-y-4">
            <h2 className="label-luxury">Update Commission</h2>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={COMMISSION_STATUSES}
            />
            <Input
              label="Quoted Price (USD)"
              type="number"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
              placeholder="0.00"
            />
            <Input
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Input
              label="Tracking URL (optional)"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => updateOrder.mutate({
                status,
                estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined,
                trackingNumber,
                trackingUrl,
              })}
              isLoading={updateOrder.isPending}
            >
              Save Changes
            </Button>
          </div>

          {order.customer && (
            <div className="bg-white border border-charcoal-100 p-5">
              <h2 className="label-luxury mb-3">Customer</h2>
              <p className="text-sm font-body font-medium text-charcoal-900">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-xs text-charcoal-400 font-body">{order.customer.email}</p>
              {order.customer.phone && <p className="text-xs text-charcoal-400 font-body">{order.customer.phone}</p>}
            </div>
          )}

          {order.estimatedPrice && (
            <div className="bg-white border border-charcoal-100 p-5">
              <h2 className="label-luxury mb-3">Pricing</h2>
              <div className="text-sm font-body space-y-1.5">
                <div className="flex justify-between text-charcoal-700">
                  <span>Quoted</span><span className="font-medium text-charcoal-900">{formatCurrency(order.estimatedPrice)}</span>
                </div>
                {order.depositAmount && (
                  <div className="flex justify-between text-charcoal-700">
                    <span>Deposit</span><span>{formatCurrency(order.depositAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
