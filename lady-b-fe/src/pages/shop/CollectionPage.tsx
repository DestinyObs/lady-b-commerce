import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Select } from '../../components/ui/Select';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: [0.25, 1, 0.5, 1] } }),
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
];

const PAGE_SIZE = 12;

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: Array<{ id: string; url: string; altText?: string | null }>;
  category?: { name: string; slug: string };
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isMadeToOrder?: boolean;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addItem, openCart } = useCartStore();
  const img = product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-default-${Date.now()}`,
      productId: product.id,
      variantId: null,
      quantity: 1,
      price: product.price,
      product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
      variant: null,
    });
    toast.success('Added to your bag');
    openCart();
  };

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index % 6}
      variants={FADE_UP}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div
          className="relative overflow-hidden bg-charcoal-50 aspect-[3/4]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {img ? (
            <img
              src={getImageUrl(img.url, 700)}
              alt={img.altText || product.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-charcoal-200 text-xs font-body tracking-wider uppercase">No image</p>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && <Badge variant="luxury" size="sm">New</Badge>}
            {product.isBestseller && <Badge variant="outline" size="sm">Bestseller</Badge>}
            {product.isMadeToOrder && <Badge variant="default" size="sm">Made to Order</Badge>}
          </div>

          {/* Hover actions */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3 flex gap-2"
            initial={false}
            animate={{ y: hovered ? 0 : '120%', opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          >
            <button
              onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
              className={`p-2.5 transition-colors ${wished ? 'bg-charcoal-900 text-ivory' : 'bg-ivory/90 text-charcoal-700 hover:bg-charcoal-900 hover:text-ivory'}`}
              aria-label="Add to wishlist"
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-charcoal-900/90 text-ivory text-xs tracking-luxury uppercase font-body hover:bg-charcoal-900 transition-colors py-2.5 px-4 backdrop-blur-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Bag
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="pt-4">
          {product.category && (
            <p className="text-2xs tracking-widest uppercase text-gold-champagne font-body mb-1">{product.category.name}</p>
          )}
          <h3 className="font-serif font-light text-lg text-charcoal-900 group-hover:text-charcoal-600 transition-colors mb-1 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-charcoal-900 font-body font-medium">{formatCurrency(product.price)}</p>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <p className="text-charcoal-400 font-body text-sm line-through">{formatCurrency(product.compareAtPrice)}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function ProductSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="pt-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('featured');

  const { data: collectionData, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', slug],
    queryFn: () => api.get(`/collections/slug/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['collection-products', slug, page, sort],
    queryFn: () =>
      api.get(`/products?collection=${slug}&page=${page}&limit=${PAGE_SIZE}&sort=${sort}`)
        .then((r) => r.data.data),
    enabled: !!slug,
  });

  const collection = collectionData;
  const products: Product[] = productsData?.products || [];
  const totalPages = Math.ceil((productsData?.total || 0) / PAGE_SIZE);
  const isLoading = collectionLoading || productsLoading;

  useEffect(() => {
    if (collection) {
      document.title = `${collection.name} | Lady B Designs`;
    } else {
      document.title = 'Collection | Lady B Designs';
    }
  }, [collection]);

  useEffect(() => {
    setPage(1);
  }, [slug, sort]);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ivory">

      {/* Hero header */}
      <section className={`relative pt-36 md:pt-44 pb-16 overflow-hidden ${collection?.coverImage ? '' : 'bg-charcoal-50'}`}>
        {collection?.coverImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(collection.coverImage, 1600)})` }}
            />
            <div className="absolute inset-0 bg-charcoal-900/55" />
          </>
        )}
        <div className={`container-luxury relative z-10 ${collection?.coverImage ? 'text-ivory' : 'text-charcoal-900'}`}>
          <Breadcrumbs
            items={[
              { label: 'Collections', href: '/collections' },
              { label: collection?.name || 'Collection' },
            ]}
            className={collection?.coverImage ? 'text-ivory/60 mb-6 [&_a]:hover:text-ivory [&_a]:text-ivory/60' : 'mb-6'}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            {collectionLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-4 w-96 max-w-full" />
              </div>
            ) : (
              <>
                <span className={`section-label mb-3 block ${collection?.coverImage ? 'text-gold-champagne' : ''}`}>
                  {collection?.category?.name || 'Collection'}
                </span>
                <h1 className="font-serif font-light text-5xl md:text-6xl mb-4">
                  {collection?.name || 'Collection'}
                </h1>
                {collection?.description && (
                  <p className={`font-body font-light text-base max-w-xl leading-relaxed ${collection?.coverImage ? 'text-ivory/80' : 'text-charcoal-500'}`}>
                    {collection.description}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="border-b border-charcoal-100 sticky top-[calc(theme(spacing.18)+theme(spacing.9))] md:top-[calc(theme(spacing.22)+theme(spacing.9))] bg-ivory/96 backdrop-blur-sm z-20">
        <div className="container-luxury py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-charcoal-400 font-body">
            <SlidersHorizontal className="h-4 w-4" />
            <span>
              {productsLoading
                ? '...'
                : `${productsData?.total ?? products.length} pieces`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-charcoal-400 font-body tracking-wide uppercase hidden sm:block">Sort</label>
            <Select
              options={SORT_OPTIONS}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs py-2 border-charcoal-200 min-w-[160px]"
            />
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section className="py-14 md:py-20">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif font-light text-3xl text-charcoal-300 mb-4">No pieces in this collection yet</p>
              <Link to="/shop" className="text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 transition-colors border-b border-charcoal-300">
                Browse all pieces
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              <div className="mt-14 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bespoke CTA */}
      <section className="mx-6 md:mx-16 mb-16 bg-charcoal-900 py-14">
        <div className="text-center px-6">
          <p className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-3">Can't find what you envision?</p>
          <h2 className="font-serif font-light text-3xl text-ivory mb-4">Commission a bespoke piece</h2>
          <p className="text-charcoal-300 font-body text-sm mb-6 max-w-md mx-auto">Your exact vision, crafted exclusively for you. Every bespoke commission is a collaboration.</p>
          <Link
            to="/custom-orders/start"
            className="inline-flex items-center gap-3 bg-ivory text-charcoal-900 px-8 py-3.5 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-100 transition-colors"
          >
            Start Your Commission
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
