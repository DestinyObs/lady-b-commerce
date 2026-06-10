import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Checkbox } from '../../components/ui/Checkbox';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0.01),
  compareAtPrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stockQuantity: z.coerce.number().min(0),
  weight: z.coerce.number().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
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

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showDelete, setShowDelete] = React.useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => api.get(`/admin/products/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  const { data: collections } = useQuery({
    queryKey: ['admin-collections-select'],
    queryFn: () => api.get('/admin/collections?limit=100').then((r) => r.data.data?.collections || []),
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: () => api.get('/admin/categories?limit=100').then((r) => r.data.data?.categories || []),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    document.title = product ? `Edit ${product.name} | Lady B Admin` : 'Edit Product | Lady B Admin';
    if (product) reset({ ...product, collectionId: product.collection?.id || '', categoryId: product.category?.id || '' });
  }, [product, reset]);

  const update = useMutation({
    mutationFn: (data: ProductFormData) => api.patch(`/admin/products/${id}`, data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-product', id] }); toast.success('Product saved'); },
    onError: () => toast.error('Failed to save product'),
  });

  const deleteProduct = useMutation({
    mutationFn: () => api.delete(`/admin/products/${id}`),
    onSuccess: () => { toast.success('Product deleted'); navigate('/admin/products'); },
    onError: () => toast.error('Failed to delete product'),
  });

  const collectionOptions = [
    { value: '', label: '— None —' },
    ...((collections as Array<{ id: string; name: string }>) || []).map((c) => ({ value: c.id, label: c.name })),
  ];
  const categoryOptions = [
    { value: '', label: '— None —' },
    ...((categories as Array<{ id: string; name: string }>) || []).map((c) => ({ value: c.id, label: c.name })),
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-4 max-w-4xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link to="/admin/products" className="flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-900 font-body mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Products
          </Link>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">{product?.name || 'Edit Product'}</h1>
        </div>
        {product?.slug && (
          <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-700 font-body transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> View live
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit((d) => update.mutate(d))} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('shortDescription')} />
              </div>
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Product Images</h2>
              {product?.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.images.map((img: { id: string; url: string; altText?: string }, i: number) => (
                    <div key={img.id || i} className="relative group">
                      <img src={img.url} alt={img.altText || ''} className="w-16 h-16 object-cover bg-charcoal-50" />
                      <button
                        type="button"
                        onClick={() => api.delete(`/admin/products/${id}/images/${img.id}`).then(() => qc.invalidateQueries({ queryKey: ['admin-product', id] })).then(() => toast.success('Image removed'))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              <FileUpload accept="image/*" maxFiles={8} maxSizeMB={20} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (USD) *" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
                <Input label="Compare At Price" type="number" step="0.01" {...register('compareAtPrice')} />
              </div>
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="SKU" {...register('sku')} />
                <Input label="Barcode" {...register('barcode')} />
              </div>
              <Input label="Stock Quantity *" type="number" min={0} {...register('stockQuantity')} />
              <Input label="Weight (grams)" type="number" {...register('weight')} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">Craft Details</h2>
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Materials</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('materials')} />
              </div>
              <Input label="Dimensions" {...register('dimensions')} />
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Care Instructions</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('careInstructions')} />
              </div>
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-5">
              <h2 className="label-luxury">SEO</h2>
              <Input label="Meta Title" {...register('metaTitle')} />
              <div>
                <label className="block text-xs tracking-wide uppercase font-body text-charcoal-500 mb-2">Meta Description</label>
                <textarea rows={2} className="input-luxury resize-none w-full" {...register('metaDescription')} maxLength={160} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-charcoal-100 p-5 space-y-4">
              <h2 className="label-luxury">Status</h2>
              <Select label="Product Status" options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]} {...register('status')} />
              <Checkbox label="Featured on homepage" {...register('isFeatured')} />
            </div>

            <div className="bg-white border border-charcoal-100 p-5 space-y-4">
              <h2 className="label-luxury">Organisation</h2>
              <Select label="Collection" options={collectionOptions} {...register('collectionId')} />
              <Select label="Category" options={categoryOptions} {...register('categoryId')} />
            </div>

            <div className="space-y-2">
              <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={update.isPending}>Save Changes</Button>
              <Button type="button" variant="danger" size="sm" className="w-full" onClick={() => setShowDelete(true)}>Delete Product</Button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteProduct.mutate()}
        title={`Delete "${product?.name}"?`}
        description="This permanently removes the product. It cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
