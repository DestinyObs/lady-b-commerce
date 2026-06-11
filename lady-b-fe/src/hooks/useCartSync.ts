import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { useCartStore, CartItem } from '../store/cart.store';

interface BeProduct {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  images?: Array<{ url: string; altText?: string | null }>;
}

interface BeVariant {
  id: string;
  name: string;
  color?: string | null;
  size?: string | null;
  price?: string | number;
}

interface BeCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: string | number;
  product: BeProduct;
  variant?: BeVariant | null;
}

export function mapBeCartItem(item: BeCartItem): CartItem {
  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId ?? null,
    quantity: item.quantity,
    price: Number(item.price),
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      images: (item.product.images ?? []).map((img) => ({
        url: img.url,
        altText: img.altText ?? null,
      })),
    },
    variant: item.variant
      ? {
          id: item.variant.id,
          name: item.variant.name,
          color: item.variant.color ?? null,
          size: item.variant.size ?? null,
        }
      : null,
  };
}

export function useCartSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setItems = useCartStore((s) => s.setItems);

  const { data } = useQuery<{ items: BeCartItem[] } | null>({
    queryKey: ['cart-be', isAuthenticated],
    queryFn: () => api.get('/cart').then((r) => r.data.data),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (data?.items && data.items.length > 0) {
      setItems(data.items.map(mapBeCartItem));
    }
  }, [data, setItems]);
}
