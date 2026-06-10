import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ChevronRight, Info } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Tooltip } from '../../components/ui/Tooltip';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const CATEGORIES = [
  'Evening Bag',
  'Clutch',
  'Shoulder Bag',
  'Tote',
  'Belt Bag',
  'Crossbody',
  'Wristlet',
  'Coin Purse',
  'Other',
];

const TIMELINES = [
  { value: 'FLEXIBLE', label: "Flexible — whenever it's ready" },
  { value: '12_WEEKS', label: 'Within 12 weeks' },
  { value: '8_WEEKS', label: 'Within 8 weeks' },
  { value: '4_WEEKS', label: 'Within 4 weeks (rush — fees may apply)' },
];

const BUDGETS = [
  { value: 'UNDER_500', label: 'Under $500' },
  { value: '500_1000', label: '$500 – $1,000' },
  { value: '1000_2500', label: '$1,000 – $2,500' },
  { value: '2500_5000', label: '$2,500 – $5,000' },
  { value: 'OVER_5000', label: 'Over $5,000' },
];

const commissionSchema = z.object({
  category: z.string().min(1, 'Please select a bag category'),
  description: z.string().min(30, 'Please describe your vision in at least 30 characters'),
  colors: z.string().min(3, 'Please describe your preferred colours or palette'),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  timeline: z.string().min(1, 'Please select a timeline'),
  budget: z.string().min(1, 'Please select a budget range'),
  occasion: z.string().optional(),
  name: z.string().min(1, 'Your name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
});

type CommissionFormData = z.infer<typeof commissionSchema>;

export default function CustomOrderStartPage() {
  useEffect(() => { document.title = 'Start Your Commission | Lady B Designs'; }, []);
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
  });

  const submit = useMutation({
    mutationFn: async (data: CommissionFormData & { imageUrls?: string[] }) => {
      return api.post('/custom-orders', data).then((r) => r.data.data);
    },
    onSuccess: (data) => {
      toast.success("Commission submitted! We'll be in touch within 48 hours.");
      navigate(`/custom-orders/${data.id}`);
    },
    onError: () => toast.error('Failed to submit. Please try again.'),
  });

  const onSubmit = (data: CommissionFormData) => {
    submit.mutate(data);
  };

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-2xl">
        <Breadcrumbs
          items={[
            { label: 'Bespoke Commissions', href: '/custom-orders' },
            { label: 'Start a Commission', href: '/custom-orders/start' },
          ]}
          showHome
        />

        <div className="mt-6 mb-10">
          <p className="section-label mb-2">Commission Request</p>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mb-3">
            Tell us your vision
          </h1>
          <p className="text-sm text-charcoal-500 font-body leading-relaxed">
            The more detail you share, the more accurately we can bring your piece to life. All fields marked * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

          {/* Bag details */}
          <fieldset className="space-y-5">
            <legend className="label-luxury mb-4">Bag Details</legend>

            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">
                Category *
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const id = `cat-${cat}`;
                  return (
                    <label key={cat} htmlFor={id} className="cursor-pointer">
                      <input id={id} type="radio" value={cat} className="sr-only peer" {...register('category')} />
                      <span className="inline-block px-3.5 py-2 text-xs font-body border border-charcoal-200 text-charcoal-600 peer-checked:border-charcoal-900 peer-checked:bg-charcoal-900 peer-checked:text-ivory transition-all">
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.category && <p className="text-xs text-red-500 mt-1.5">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">
                Describe your vision *
              </label>
              <textarea
                rows={5}
                placeholder="Describe the design, style, occasion, and any specific features you want. Be as detailed as possible — tell us what inspired you, how you'll use it, and what feeling you want it to evoke."
                className="input-luxury resize-none"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2 flex items-center gap-1.5">
                Colour Palette *
                <Tooltip content="E.g. 'ivory and gold with cobalt blue accents' or 'all black with silver hardware'">
                  <Info className="h-3 w-3 text-charcoal-300" />
                </Tooltip>
              </label>
              <input
                type="text"
                placeholder="e.g. Champagne and ivory with gold hardware"
                className="input-luxury"
                {...register('colors')}
              />
              {errors.colors && <p className="text-xs text-red-500 mt-1.5">{errors.colors.message}</p>}
            </div>

            <Input
              label="Preferred Materials (optional)"
              placeholder="e.g. Seed beads, glass beads, velvet lining…"
              {...register('materials')}
            />

            <Input
              label="Desired Dimensions (optional)"
              placeholder="e.g. 28cm wide × 18cm tall × 8cm deep"
              {...register('dimensions')}
            />

            <Input
              label="Occasion (optional)"
              placeholder="e.g. Wedding, evening gala, birthday gift…"
              {...register('occasion')}
            />
          </fieldset>

          {/* Reference images */}
          <fieldset>
            <legend className="label-luxury mb-4">
              Reference Images{' '}
              <span className="text-charcoal-300 font-body font-normal normal-case text-2xs">(optional)</span>
            </legend>
            <p className="text-xs text-charcoal-400 font-body mb-3">
              Upload up to 5 images — sketches, inspiration photos, colour swatches, or existing items you'd like to complement.
            </p>
            <Controller
              name="description"
              control={control}
              render={() => (
                <FileUpload
                  maxFiles={5}
                  accept="image/*"
                  maxSizeMB={10}
                />
              )}
            />
          </fieldset>

          {/* Timeline & Budget */}
          <fieldset className="space-y-5">
            <legend className="label-luxury mb-4">Timeline & Budget</legend>

            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Timeline *</label>
              <div className="space-y-2">
                {TIMELINES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" value={value} className="appearance-none w-4 h-4 border border-charcoal-300 rounded-full checked:border-charcoal-900 checked:bg-charcoal-900 relative transition-all" {...register('timeline')} />
                    <span className="text-sm font-body text-charcoal-700 group-hover:text-charcoal-900 transition-colors">{label}</span>
                  </label>
                ))}
              </div>
              {errors.timeline && <p className="text-xs text-red-500 mt-1.5">{errors.timeline.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Budget Range *</label>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map(({ value, label }) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" value={value} className="sr-only peer" {...register('budget')} />
                    <span className="inline-block px-3.5 py-2 text-xs font-body border border-charcoal-200 text-charcoal-600 peer-checked:border-charcoal-900 peer-checked:bg-charcoal-900 peer-checked:text-ivory transition-all">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.budget && <p className="text-xs text-red-500 mt-1.5">{errors.budget.message}</p>}
            </div>
          </fieldset>

          {/* Contact details */}
          <fieldset className="space-y-5">
            <legend className="label-luxury mb-4">Your Contact Details</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Full Name *" {...register('name')} error={errors.name?.message} />
              <Input label="Email Address *" type="email" {...register('email')} error={errors.email?.message} />
            </div>
            <Input label="Phone (optional)" type="tel" {...register('phone')} />
          </fieldset>

          {/* Terms note */}
          <p className="text-2xs text-charcoal-400 font-body leading-relaxed">
            By submitting this form you agree to our{' '}
            <a href="/terms" className="border-b border-charcoal-300 hover:text-charcoal-700">Terms &amp; Conditions</a>.
            Submitting a commission request does not create a binding contract; a contract is only formed upon your acceptance of our quote.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={submit.isPending}
            className="w-full sm:w-auto"
          >
            Submit Commission Request <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
