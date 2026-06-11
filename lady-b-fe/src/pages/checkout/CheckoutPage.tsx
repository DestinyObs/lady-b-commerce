import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, ChevronRight, Lock, Package, Truck, Zap, ShoppingBag, ArrowLeft } from 'lucide-react';
import { api } from '../../lib/axios';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Radio } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { config } from '../../app/config';

const stripePromise = loadStripe(config.stripePublicKey);

// ─── Schemas ─────────────────────────────────────────────────────────────────

const addressSchema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  phone: z.string().min(7, 'Valid phone required'),
  address1: z.string().min(3, 'Address required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State / province required'),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
  saveAddress: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

type ShippingMethodId = string;

// Raw shape returned by GET /api/checkout/shipping-methods
interface ShippingMethodApi {
  id: string;
  name: string;
  description: string;
  price: number;         // cents from API
  freeThreshold: number | null; // cents from API
  estimatedDays: string;
}

// Normalized shape used internally (all prices in dollars)
interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  days: string;
  priceDollars: number; // dollars
  isFree: boolean;
  icon: React.ElementType;
}

const SHIPPING_ICON_MAP: Record<string, React.ElementType> = {
  standard: Package,
  express: Truck,
  overnight: Zap,
};

function normalizeShippingMethods(apiMethods: ShippingMethodApi[], subtotalDollars: number): ShippingMethod[] {
  return apiMethods.map((m) => {
    const freeAt = m.freeThreshold !== null ? m.freeThreshold / 100 : null;
    const isFree = freeAt !== null && subtotalDollars >= freeAt;
    return {
      id: m.id,
      name: m.name,
      description: m.description,
      days: m.estimatedDays + ' business day' + (m.estimatedDays === '1' ? '' : 's'),
      priceDollars: isFree ? 0 : m.price / 100,
      isFree,
      icon: SHIPPING_ICON_MAP[m.id] ?? Package,
    };
  });
}

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'JP', label: 'Japan' },
  { value: 'OTHER', label: 'Other' },
];

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <nav aria-label="Checkout progress" className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div
                className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-body font-medium transition-all duration-300 ${
                  done
                    ? 'bg-charcoal-900 text-ivory'
                    : active
                    ? 'border-2 border-charcoal-900 text-charcoal-900'
                    : 'border border-charcoal-200 text-charcoal-300'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : idx}
              </div>
              <span
                className={`hidden sm:block text-xs tracking-wide font-body uppercase ${
                  active ? 'text-charcoal-900 font-medium' : done ? 'text-charcoal-600' : 'text-charcoal-300'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 h-px bg-charcoal-100" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ─── Order Summary sidebar ────────────────────────────────────────────────────

function OrderSummary({
  shippingCost,
  shippingLabel,
}: {
  shippingCost: number;
  shippingLabel: string;
}) {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const couponCode = useCartStore((s) => s.couponCode);
  const subtotal = getSubtotal();
  const total = Math.max(0, subtotal - couponDiscount + shippingCost);

  return (
    <div className="bg-charcoal-50 p-6 md:p-8">
      <h2 className="font-serif font-light text-xl text-charcoal-900 mb-6">Order Summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative flex-shrink-0 w-14 h-14 bg-white overflow-hidden">
              {item.product.images?.[0] && (
                <img
                  src={getImageUrl(item.product.images[0].url, 120)}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              )}
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-charcoal-900 text-ivory text-2xs flex items-center justify-center rounded-full font-body">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body text-charcoal-900 leading-snug truncate">{item.product.name}</p>
              {item.variant && <p className="text-xs text-charcoal-400 font-body mt-0.5">{item.variant.name}</p>}
            </div>
            <p className="text-sm font-body font-medium text-charcoal-900 flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-charcoal-200 pt-4 space-y-2.5">
        <div className="flex justify-between text-sm font-body text-charcoal-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {couponCode && couponDiscount > 0 && (
          <div className="flex justify-between text-sm font-body text-emerald-luxury">
            <span>Discount ({couponCode})</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-body text-charcoal-600">
          <span>Shipping</span>
          <span className="text-charcoal-900">{shippingLabel}</span>
        </div>
        <div className="border-t border-charcoal-200 pt-3 flex justify-between font-body font-semibold text-charcoal-900">
          <span>Total</span>
          <span className="text-lg">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-2 mt-5 text-charcoal-400">
        <Lock className="h-3.5 w-3.5 flex-shrink-0" />
        <p className="text-xs font-body">Secured by Stripe · 256-bit SSL</p>
      </div>
    </div>
  );
}

// ─── Step 1: Address form ─────────────────────────────────────────────────────

function AddressStep({
  onNext,
  defaultValues,
}: {
  onNext: (data: AddressFormData) => void;
  defaultValues?: Partial<AddressFormData>;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div>
        <h3 className="text-xs tracking-editorial uppercase font-body text-charcoal-400 mb-4">Contact</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
          <Input label="Phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" {...register('phone')} error={errors.phone?.message} />
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-editorial uppercase font-body text-charcoal-400 mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" autoComplete="given-name" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last Name" autoComplete="family-name" {...register('lastName')} error={errors.lastName?.message} />
          <div className="sm:col-span-2">
            <Input label="Address Line 1" autoComplete="address-line1" placeholder="Street address, P.O. box" {...register('address1')} error={errors.address1?.message} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Address Line 2 (optional)" autoComplete="address-line2" placeholder="Apartment, suite, unit, building" {...register('address2')} error={errors.address2?.message} />
          </div>
          <Input label="City" autoComplete="address-level2" {...register('city')} error={errors.city?.message} />
          <Input label="State / Province" autoComplete="address-level1" {...register('state')} error={errors.state?.message} />
          <Input label="Postal Code" autoComplete="postal-code" {...register('postalCode')} error={errors.postalCode?.message} />
          <Select
            label="Country"
            options={COUNTRIES}
            {...register('country')}
            error={errors.country?.message}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2">
        Continue to Shipping
        <ChevronRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

// ─── Step 2: Shipping method ──────────────────────────────────────────────────

function ShippingStep({
  methods,
  selectedMethod,
  onSelect,
  onBack,
  onNext,
}: {
  methods: ShippingMethod[];
  selectedMethod: ShippingMethodId | null;
  onSelect: (id: ShippingMethodId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const hasFreeMethod = methods.some((m) => m.isFree);

  return (
    <div>
      <div className="space-y-3 mb-8">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-charcoal-900 bg-charcoal-50'
                : 'border-charcoal-200 hover:border-charcoal-400'
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onSelect(method.id)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                selectedMethod === method.id ? 'border-charcoal-900' : 'border-charcoal-300'
              }`}
            >
              {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-charcoal-900" />}
            </div>
            <method.icon className="h-5 w-5 text-charcoal-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-charcoal-900">{method.name}</p>
              <p className="text-xs text-charcoal-400 font-body">{method.description} · {method.days}</p>
            </div>
            <p className="text-sm font-body font-medium text-charcoal-900 flex-shrink-0">
              {method.isFree ? (
                <span className="text-emerald-luxury">Free</span>
              ) : (
                formatCurrency(method.priceDollars)
              )}
            </p>
          </label>
        ))}
      </div>

      {hasFreeMethod && (
        <p className="text-xs text-emerald-luxury font-body mb-6 flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          Standard delivery is complimentary on your order
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1 sm:flex-none">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!selectedMethod}
          className="flex-1"
        >
          Continue to Payment
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Payment (Stripe) ─────────────────────────────────────────────────

function PaymentStep({
  address,
  shippingMethodId,
  shippingCostDollars,
  onBack,
}: {
  address: AddressFormData;
  shippingMethodId: ShippingMethodId;
  shippingCostDollars: number; // dollars, pre-computed by CheckoutContent
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, getSubtotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true);
  const [cardError, setCardError] = useState<string | null>(null);

  const shippingCost = shippingCostDollars; // dollars
  const subtotal = getSubtotal(); // dollars
  const total = Math.max(0, subtotal - couponDiscount + shippingCost); // dollars

  const createPaymentIntent = useMutation({
    mutationFn: () =>
      api.post('/checkout/create-payment-intent', {
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        shippingAddress: address,
        shippingMethodId,
        couponCode: couponCode || undefined,
      }).then((r) => r.data.data),
  });

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setCardError(null);

    try {
      // 1. Create payment intent on backend
      const { clientSecret, orderId } = await createPaymentIntent.mutateAsync();

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            phone: address.phone,
            address: {
              line1: address.address1,
              line2: address.address2 || undefined,
              city: address.city,
              state: address.state,
              postal_code: address.postalCode,
              country: address.country,
            },
          },
        },
      });

      if (result.error) {
        setCardError(result.error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        clearCart();
        navigate(`/checkout/success?order_id=${orderId}`);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Card input */}
      <div className="mb-6">
        <label className="label-luxury mb-2 block">Card Details</label>
        <div className="border border-charcoal-200 px-4 py-4 focus-within:border-charcoal-900 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1C1917',
                  fontFamily: 'DM Sans, sans-serif',
                  '::placeholder': { color: '#A8A29E' },
                },
                invalid: { color: '#DC2626' },
              },
            }}
            onChange={(e) => setCardError(e.error?.message || null)}
          />
        </div>
        {cardError && (
          <p className="mt-1.5 text-xs text-red-600 font-body">{cardError}</p>
        )}
      </div>

      {/* Billing address */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={billingMatchesShipping}
            onChange={(e) => setBillingMatchesShipping(e.target.checked)}
            className="h-4 w-4 border border-charcoal-300 checked:bg-charcoal-900 checked:border-charcoal-900 appearance-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-charcoal-900"
          />
          <span className="text-sm text-charcoal-700 font-body">Billing address same as shipping</span>
        </label>
      </div>

      {/* Order summary recap */}
      <div className="bg-charcoal-50 p-4 mb-8 space-y-2">
        <div className="flex justify-between text-xs font-body text-charcoal-500">
          <span>Shipping to</span>
          <span className="text-charcoal-700">{address.city}, {address.country}</span>
        </div>
        <div className="flex justify-between text-xs font-body text-charcoal-500">
          <span>Items ({items.length})</span>
          <span className="text-charcoal-700">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs font-body text-charcoal-500">
          <span>Shipping</span>
          <span className="text-charcoal-700">{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-sm font-body font-medium text-charcoal-900 pt-2 border-t border-charcoal-200">
          <span>Total charged</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1 sm:flex-none" disabled={isProcessing}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handlePlaceOrder}
          isLoading={isProcessing}
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          <Lock className="h-4 w-4" />
          {isProcessing ? 'Processing...' : `Place Order · ${formatCurrency(total)}`}
        </Button>
      </div>

      <p className="text-xs text-charcoal-400 font-body mt-4 text-center flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3" />
        Your payment is encrypted and secure
      </p>
    </div>
  );
}

// ─── Main Checkout ─────────────────────────────────────────────────────────────

function CheckoutContent() {
  const { items, getSubtotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId | null>(null);

  const subtotal = getSubtotal(); // dollars

  // Fetch shipping methods from API (prices in cents), then normalize to dollars
  const { data: apiShippingData } = useQuery<{ methods: ShippingMethodApi[] }>({
    queryKey: ['shipping-methods'],
    queryFn: () => api.get('/checkout/shipping-methods').then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  const shippingMethods = normalizeShippingMethods(
    apiShippingData?.methods ?? [],
    subtotal,
  );

  // Auto-select first method once methods load and nothing is selected
  useEffect(() => {
    if (shippingMethods.length > 0 && !shippingMethod) {
      setShippingMethod(shippingMethods[0].id);
    }
  }, [shippingMethods.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedShippingObj = shippingMethods.find((m) => m.id === shippingMethod) ?? null;
  const shippingCostDollars = selectedShippingObj?.priceDollars ?? 0; // dollars

  const shippingLabel = selectedShippingObj
    ? selectedShippingObj.isFree
      ? 'Free'
      : formatCurrency(selectedShippingObj.priceDollars)
    : 'Calculated next';

  useEffect(() => { document.title = 'Checkout | Lady B Designs'; }, []);

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 pt-36">
        <ShoppingBag className="h-12 w-12 text-charcoal-200 mb-6" />
        <h1 className="font-serif font-light text-3xl text-charcoal-900 mb-3">Your bag is empty</h1>
        <p className="text-charcoal-400 font-body mb-8">Add something beautiful to continue.</p>
        <Link to="/shop">
          <Button variant="primary">Explore the Shop</Button>
        </Link>
      </div>
    );
  }

  const defaultAddressValues: Partial<AddressFormData> = {
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  };

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/cart" className="flex items-center gap-2 text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors font-body tracking-wide uppercase">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Bag
          </Link>
          <div className="text-center">
            <p className="font-serif font-light text-sm uppercase tracking-luxury text-charcoal-900">Lady B</p>
            <p className="text-2xs tracking-widest uppercase text-charcoal-400">Secure Checkout</p>
          </div>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <StepIndicator
              current={step}
              steps={['Shipping', 'Delivery', 'Payment']}
            />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6">Shipping Information</h2>
                  <AddressStep
                    defaultValues={defaultAddressValues}
                    onNext={(data) => {
                      setAddress(data);
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6">Delivery Method</h2>
                  <ShippingStep
                    methods={shippingMethods}
                    selectedMethod={shippingMethod}
                    onSelect={setShippingMethod}
                    onBack={() => setStep(1)}
                    onNext={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              )}

              {step === 3 && address && shippingMethod && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6">Payment</h2>
                  <PaymentStep
                    address={address}
                    shippingMethodId={shippingMethod}
                    shippingCostDollars={shippingCostDollars}
                    onBack={() => setStep(2)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-36">
              <OrderSummary shippingCost={shippingCostDollars} shippingLabel={shippingLabel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}
