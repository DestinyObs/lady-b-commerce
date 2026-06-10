import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, MessageCircle, ArrowLeft, Clock, Palette, Sparkles, Truck, Package, DollarSign } from 'lucide-react';
import { api } from '../../lib/axios';
import { formatDate, formatCurrency, customOrderStatusLabel } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const COMMISSION_STAGES = [
  { status: 'SUBMITTED', label: 'Submitted', icon: MessageCircle },
  { status: 'REVIEWING', label: 'Under Review', icon: Clock },
  { status: 'QUOTED', label: 'Quote Sent', icon: DollarSign },
  { status: 'APPROVED_BY_CUSTOMER', label: 'Quote Approved', icon: Check },
  { status: 'DEPOSIT_PAID', label: 'Deposit Paid', icon: DollarSign },
  { status: 'IN_PRODUCTION', label: 'In Production', icon: Palette },
  { status: 'READY_FOR_FINAL_PAYMENT', label: 'Ready — Final Payment', icon: Sparkles },
  { status: 'FINAL_PAYMENT_PAID', label: 'Final Payment Received', icon: DollarSign },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck },
  { status: 'COMPLETED', label: 'Completed', icon: Package },
];

const TERMINAL_STATUSES = ['CANCELLED', 'REJECTED'];

const STATUS_BADGE_VARIANT: Record<string, 'default' | 'success' | 'error' | 'luxury'> = {
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

function CommissionTimeline({ status }: { status: string }) {
  if (TERMINAL_STATUSES.includes(status)) {
    return (
      <div className="flex items-center gap-3 py-4 px-5 bg-red-50 border border-red-100">
        <Badge variant="error">{customOrderStatusLabel(status)}</Badge>
        <p className="text-sm text-red-700 font-body">This commission was {status.toLowerCase()}.</p>
      </div>
    );
  }

  const activeIdx = COMMISSION_STAGES.findIndex((s) => s.status === status);
  const idx = activeIdx === -1 ? 0 : activeIdx;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-3.5 bottom-3.5 w-px bg-charcoal-100" />

      <div className="space-y-6 relative">
        {COMMISSION_STAGES.map((stage, i) => {
          const done = i <= idx;
          const active = i === idx;
          const Icon = stage.icon;
          return (
            <div key={stage.status} className="flex items-center gap-4">
              <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 relative z-10 ${done ? 'bg-charcoal-900' : 'bg-ivory border border-charcoal-200'}`}>
                {done ? <Check className="h-3.5 w-3.5 text-ivory" /> : <Icon className="h-3 w-3 text-charcoal-200" />}
              </div>
              <p className={`text-sm font-body ${active ? 'text-charcoal-900 font-semibold' : done ? 'text-charcoal-600' : 'text-charcoal-300'}`}>
                {stage.label}
                {active && <span className="ml-2 text-2xs text-charcoal-400 font-normal">(current)</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AdminMessage {
  id: string;
  content: string;
  createdAt: string;
  attachments?: Array<{ url: string; name: string }>;
}

interface CustomOrder {
  id: string;
  referenceNumber: string;
  status: string;
  category: string;
  description: string;
  colors: string;
  materials?: string;
  timeline: string;
  budget: string;
  createdAt: string;
  estimatedPrice?: number;
  depositAmount?: number;
  finalAmount?: number;
  adminMessages?: AdminMessage[];
  images?: Array<{ url: string }>;
  trackingNumber?: string;
  trackingUrl?: string;
}

export default function CustomOrderStatusPage() {
  const { requestId } = useParams<{ requestId: string }>();

  const { data: order, isLoading } = useQuery<CustomOrder>({
    queryKey: ['custom-order', requestId],
    queryFn: () => api.get(`/custom-orders/${requestId}`).then((r) => r.data.data),
    enabled: !!requestId,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    document.title = order
      ? `Commission ${order.referenceNumber} | Lady B Designs`
      : 'Commission Status | Lady B Designs';
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
        <div className="container-luxury max-w-3xl">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
        <div className="container-luxury max-w-3xl text-center py-20">
          <p className="font-serif text-2xl text-charcoal-700 mb-3">Commission not found</p>
          <p className="text-sm text-charcoal-400 font-body mb-6">This commission doesn't exist or you don't have access.</p>
          <Link to="/account/custom-orders" className="btn-primary inline-flex items-center gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" /> My Commissions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Breadcrumbs
          items={[
            { label: 'My Commissions', href: '/account/custom-orders' },
            { label: order.referenceNumber, href: `/custom-orders/${order.id}` },
          ]}
          showHome
        />

        <div className="mt-6 mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-charcoal-400 font-body mb-1">Submitted {formatDate(order.createdAt)}</p>
            <h1 className="font-serif font-light text-2xl md:text-3xl text-charcoal-900 mb-2">{order.referenceNumber}</h1>
            <Badge variant={STATUS_BADGE_VARIANT[order.status] || 'default'}>
              {customOrderStatusLabel(order.status)}
            </Badge>
          </div>
          <Link to="/account/custom-orders" className="flex items-center gap-1.5 text-xs tracking-wide uppercase font-body text-charcoal-400 hover:text-charcoal-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All Commissions
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Progress sidebar */}
          <div className="md:col-span-2">
            <h2 className="label-luxury mb-5">Progress</h2>
            <CommissionTimeline status={order.status} />
          </div>

          {/* Main content */}
          <div className="md:col-span-3 space-y-7">

            {/* Tracking if shipped */}
            {order.trackingNumber && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-emerald-luxury/5 border border-emerald-luxury/20 p-4"
              >
                <Truck className="h-5 w-5 text-emerald-luxury flex-shrink-0" />
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">Tracking: {order.trackingNumber}</p>
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-luxury hover:underline font-body">
                      Track with carrier →
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Commission details */}
            <div>
              <h2 className="label-luxury mb-3">Your Brief</h2>
              <div className="bg-charcoal-50 p-5 space-y-3 text-sm font-body">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: order.category },
                    { label: 'Timeline', value: order.timeline.replace(/_/g, ' ').toLowerCase() },
                    { label: 'Budget Range', value: order.budget.replace(/_/g, ' ').replace('OVER', 'Over').replace('UNDER', 'Under') },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-2xs tracking-wide uppercase text-charcoal-400 mb-0.5">{label}</p>
                      <p className="text-charcoal-700 capitalize">{value}</p>
                    </div>
                  ))}
                  {order.colors && (
                    <div>
                      <p className="text-2xs tracking-wide uppercase text-charcoal-400 mb-0.5">Colours</p>
                      <p className="text-charcoal-700">{order.colors}</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-charcoal-200 pt-3">
                  <p className="text-2xs tracking-wide uppercase text-charcoal-400 mb-1">Description</p>
                  <p className="text-charcoal-700 leading-relaxed">{order.description}</p>
                </div>
              </div>
            </div>

            {/* Reference images */}
            {order.images && order.images.length > 0 && (
              <div>
                <h2 className="label-luxury mb-3">Reference Images</h2>
                <div className="flex flex-wrap gap-2">
                  {order.images.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                      <img src={img.url} alt={`Reference ${i + 1}`} className="w-16 h-16 object-cover bg-charcoal-50" loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            {(order.estimatedPrice || order.depositAmount || order.finalAmount) && (
              <div>
                <h2 className="label-luxury mb-3">Pricing</h2>
                <div className="bg-charcoal-50 p-5 space-y-2.5 text-sm font-body">
                  {order.estimatedPrice && (
                    <div className="flex justify-between text-charcoal-700">
                      <span>Estimated Total</span>
                      <span className="font-medium text-charcoal-900">{formatCurrency(order.estimatedPrice)}</span>
                    </div>
                  )}
                  {order.depositAmount && (
                    <div className="flex justify-between text-charcoal-700">
                      <span>Deposit (50%)</span>
                      <span>{formatCurrency(order.depositAmount)}</span>
                    </div>
                  )}
                  {order.finalAmount && (
                    <div className="flex justify-between font-semibold text-charcoal-900 border-t border-charcoal-200 pt-2.5">
                      <span>Final Payment</span>
                      <span>{formatCurrency(order.finalAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages from Lady B team */}
            {order.adminMessages && order.adminMessages.length > 0 && (
              <div>
                <h2 className="label-luxury mb-3 flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" /> Updates from Lady B
                </h2>
                <div className="space-y-3">
                  {order.adminMessages.map((msg) => (
                    <div key={msg.id} className="bg-charcoal-50 border border-charcoal-100 p-4">
                      <p className="text-xs text-charcoal-400 font-body mb-2">{formatDate(msg.createdAt)}</p>
                      <p className="text-sm font-body text-charcoal-700 leading-relaxed">{msg.content}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.attachments.map((att, i) => (
                            <a key={i} href={att.url} target="_blank" rel="noopener noreferrer">
                              <img src={att.url} alt={att.name} className="w-14 h-14 object-cover bg-charcoal-100" loading="lazy" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help */}
            <div className="flex items-center gap-3 border border-charcoal-100 p-4">
              <MessageCircle className="h-5 w-5 text-gold-champagne flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-body font-medium text-charcoal-900">Have questions?</p>
                <p className="text-xs text-charcoal-400 font-body">Reference your commission number when contacting us.</p>
              </div>
              <Link to="/contact" className="text-xs tracking-luxury uppercase font-body text-charcoal-600 hover:text-charcoal-900 transition-colors border-b border-charcoal-300 flex-shrink-0">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
