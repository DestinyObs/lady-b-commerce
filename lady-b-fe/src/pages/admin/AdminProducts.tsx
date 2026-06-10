import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Eye, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 20;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  price: number;
  stockQuantity: number;
  sku?: string;
  images?: Array<{ url: string }>;
  collection?: { name: string };
  createdAt: string;
}

export default function AdminProducts() {
  useEffect(() => { document.title = 'Products | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search, statusFilter],
    queryFn: () =>
      api.get(`/admin/products?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}&status=${statusFilter}`)
        .then((r) => r.data.data),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteTarget(null); toast.success('Product deleted'); },
    onError: () => toast.error('Failed to delete product'),
  });

  const products: Product[] = data?.products || [];
  const total: number = data?.total || 0;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-2xl text-charcoal-900">Products</h1>
          <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} total</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary text-xs flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-3 py-2 text-xs uppercase tracking-wide font-body border transition-colors ${statusFilter === f.value ? 'bg-charcoal-900 border-charcoal-900 text-ivory' : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-600'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-charcoal-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-400 font-body text-sm">No products found.</p>
            <Link to="/admin/products/new" className="inline-flex items-center gap-2 btn-primary text-xs mt-4">
              <Plus className="h-4 w-4" /> Add first product
            </Link>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Product', 'SKU', 'Status', 'Price', 'Stock', 'Collection', 'Added'].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-charcoal-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                        {product.images?.[0] && <img src={product.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                      </div>
                      <span className="text-sm font-body font-medium text-charcoal-900 max-w-[200px] truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-400 font-body">{product.sku || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.status === 'ACTIVE' ? 'success' : product.status === 'DRAFT' ? 'default' : 'error'} size="sm">
                      {product.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-700">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-body ${product.stockQuantity < 5 ? 'text-red-500 font-medium' : 'text-charcoal-700'}`}>
                      {product.stockQuantity}
                      {product.stockQuantity < 5 && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-400 font-body">{product.collection?.name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-300 font-body">{formatDate(product.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </a>
                      <button onClick={() => navigate(`/admin/products/${product.id}/edit`)} className="p-1.5 text-charcoal-300 hover:text-charcoal-700 transition-colors" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(product)} className="p-1.5 text-charcoal-300 hover:text-red-500 transition-colors" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteProduct.mutate(deleteTarget.id)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This permanently removes the product and cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
