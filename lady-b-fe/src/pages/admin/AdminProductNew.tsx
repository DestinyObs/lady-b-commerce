import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { FileUpload, UploadedFile } from '../../components/ui/FileUpload';
import { Checkbox } from '../../components/ui/Checkbox';

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  description: z.string().min(10, 'Description required'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price required'),
  compareAtPrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stockQuantity: z.coerce.number().min(0).default(0),
  weight: z.coerce.number().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  collectionId: z.string().optional(),
  categoryId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  careInstructions: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProductNew() {
  useEffect(() => { document.title = 'New Product | Lady B Admin'; }, []);
  const navigate = useNavigate();

  const { data: collections } = useQuery({
    queryKey: ['admin-collections-select'],
    queryFn: () => api.get('/admin/collections?limit=100').then((r) => r.data.data?.collections || []),
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: () => api.get('/admin/categories?limit=100').then((r) => r.data.data?.categories || []),
  });

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: 'DRAFT', stockQuantity: 0 },
  });

  const name = watch('name');
  useEffect(() => {
    if (name) setValue('slug', generateSlug(name));
  }, [name, setValue]);

  const create = useMutation({
    mutationFn: (data: ProductFormData) => api.post('/admin/products', data).then((r) => r.data.data),
    onSuccess: (data) => {
      toast.success('Product created');
      navigate(`/admin/products/${data.id}/edit`);
    },
    onError: () => toast.error('Failed to create product'),
  });

  const collectionOptions = [
    { value: '', label: '— None —' },
    ...((collections as Array<{ id: string; name: string }>) || []).map((c) => ({ value: c.id, label: c.name })),
  ];

  const categoryOptions = [
    { value: '', label: '— None —' },
    ...((categories as Array<{ id: string; name: string }>) || []).map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/products" className="flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-900 font-body mb-2 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Products
        </Link>
        <h1 className="font-serif font-light text-2xl text-charcoal-900">New Product</h1>
      </div>

      <form onSubmit={handleSubmit((d) => create.mutate(d))} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Basic Information</h2>
              <Input label="Product Name *" {...register('name')} error={errors.name?.message} />
              <Input label="Slug *" {...register('slug')} error={errors.slug?.message} hint="Used in the URL: /product/your-slug" />
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Description *</label>
                <textarea rows={6} className="input-luxury resize-none w-full" {...register('description')} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Short Description</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('shortDescription')} placeholder="Shown in product cards and search results" />
              </div>
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Product Images</h2>
              <FileUpload accept="image/*" maxFiles={8} maxSizeMB={20} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (USD) *" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
                <Input label="Compare At Price" type="number" step="0.01" {...register('compareAtPrice')} hint="Original price shown as strikethrough" />
              </div>
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="SKU" {...register('sku')} />
                <Input label="Barcode" {...register('barcode')} />
              </div>
              <Input label="Stock Quantity *" type="number" min={0} {...register('stockQuantity')} error={errors.stockQuantity?.message} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Shipping</h2>
              <Input label="Weight (grams)" type="number" {...register('weight')} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Craft Details</h2>
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Materials</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('materials')} placeholder="e.g. Hand-stitched seed beads, silk lining…" />
              </div>
              <Input label="Dimensions" {...register('dimensions')} placeholder="e.g. 28cm × 18cm × 8cm" />
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Care Instructions</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('careInstructions')} placeholder="e.g. Wipe gently with a soft dry cloth…" />
              </div>
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">SEO</h2>
              <Input label="Meta Title" {...register('metaTitle')} hint="Defaults to product name if empty" />
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Meta Description</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('metaDescription')} maxLength={160} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-charcoal-100 p-5 space-y-4">
              <h2 className="label-luxury">Status</h2>
              <Select
                label="Product Status"
                options={[
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'ARCHIVED', label: 'Archived' },
                ]}
                {...register('status')}
              />
              <Checkbox label="Featured on homepage" {...register('isFeatured')} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-4">
              <h2 className="label-luxury">Organisation</h2>
              <Select label="Collection" options={collectionOptions} {...register('collectionId')} />
              <Select label="Category" options={categoryOptions} {...register('categoryId')} />
            </div>

            <div className="sticky bottom-6 space-y-2">
              <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={create.isPending}>
                Create Product
              </Button>
              <Link to="/admin/products" className="block text-center text-xs text-charcoal-400 hover:text-charcoal-700 font-body transition-colors py-1">
                Discard
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
