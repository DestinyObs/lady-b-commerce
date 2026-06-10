import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { api } from '../../lib/axios';
import { Skeleton } from '../../components/ui/Skeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';

const PAGE_SIZE = 30;
const LOW_STOCK_THRESHOLD = 5;

interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  stockQuantity: number;
  status: string;
  collection?: { name: string };
  images?: Array<{ url: string }>;
}

export default function AdminInventory() {
  useEffect(() => { document.title = 'Inventory | Lady B Admin'; }, []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory', page, search, lowStockOnly],
    queryFn: () =>
      api.get(`/admin/products?page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(search)}${lowStockOnly ? '&lowStock=true' : ''}`)
        .then((r) => r.data.data),
  });

  const updateStock = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      api.patch(`/admin/products/${id}/stock`, { stockQuantity: qty }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inventory'] });
      setEditingId(null);
      toast.success('Stock updated');
    },
    onError: () => toast.error('Failed to update stock'),
  });

  const items: InventoryItem[] = data?.products || [];
  const total: number = data?.total || 0;
  const lowStockCount = items.filter((i) => i.stockQuantity < LOW_STOCK_THRESHOLD && i.stockQuantity > 0).length;
  const outOfStockCount = items.filter((i) => i.stockQuantity === 0).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-serif font-light text-2xl text-charcoal-900">Inventory</h1>
        <p className="text-xs text-charcoal-400 font-body mt-0.5">{total} products</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Package, label: 'Total Products', value: total, color: 'text-charcoal-900' },
          { icon: TrendingDown, label: 'Low Stock', value: lowStockCount, color: 'text-amber-500' },
          { icon: AlertTriangle, label: 'Out of Stock', value: outOfStockCount, color: 'text-red-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-charcoal-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="text-xs text-charcoal-400 font-body">{label}</p>
            </div>
            <p className={`font-serif font-light text-2xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-luxury pl-10 text-sm py-2"
          />
        </div>
        <button
          onClick={() => { setLowStockOnly(!lowStockOnly); setPage(1); }}
          className={`px-4 py-2 text-xs uppercase tracking-wide font-body border transition-colors flex items-center gap-2 ${lowStockOnly ? 'bg-amber-500 border-amber-500 text-white' : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-600'}`}
        >
          <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Only
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-charcoal-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-charcoal-400 font-body text-sm">No products found.</p>
          </div>
        ) : (
          <table className="w-full min-w-[500px]">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Product', 'SKU', 'Collection', 'Stock', 'Status', ''].map((h) => (
                  <th key={h} className="text-left text-2xs tracking-wider uppercase font-body text-charcoal-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {items.map((item) => {
                const stockColor = item.stockQuantity === 0 ? 'text-red-500' : item.stockQuantity < LOW_STOCK_THRESHOLD ? 'text-amber-500' : 'text-charcoal-700';
                return (
                  <tr key={item.id} className="hover:bg-charcoal-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                          {item.images?.[0] && <img src={item.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                        </div>
                        <Link to={`/admin/products/${item.id}/edit`} className="text-sm font-body font-medium text-charcoal-900 hover:underline truncate max-w-[200px]">
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal-400 font-body">{item.sku || '—'}</td>
                    <td className="px-4 py-3 text-xs text-charcoal-500 font-body">{item.collection?.name || '—'}</td>
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            className="w-16 text-sm border border-charcoal-300 p-1 font-body focus:outline-none focus:border-charcoal-900"
                            autoFocus
                          />
                          <button
                            onClick={() => updateStock.mutate({ id: item.id, qty: parseInt(editQty, 10) })}
                            className="text-2xs text-emerald-luxury border border-emerald-luxury px-2 py-1 hover:bg-emerald-luxury hover:text-ivory transition-colors"
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-2xs text-charcoal-400">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(item.id); setEditQty(String(item.stockQuantity)); }}
                          className={`text-sm font-body font-medium flex items-center gap-1 hover:underline ${stockColor}`}
                        >
                          {item.stockQuantity}
                          {item.stockQuantity < LOW_STOCK_THRESHOLD && <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === 'ACTIVE' ? 'success' : item.status === 'DRAFT' ? 'default' : 'error'} size="sm">
                        {item.status.toLowerCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/products/${item.id}/edit`} className="text-xs text-charcoal-400 hover:text-charcoal-900 font-body transition-colors">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {Math.ceil(total / PAGE_SIZE) > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
