import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, ChevronRight, Star, Truck, RotateCcw, Shield,
  ChevronLeft, Share2, Copy, Bell, X, ZoomIn, ExternalLink,
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatCurrency, formatDate, getImageUrl } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
};

/* ── Image Lightbox ─────────────────────────────────────────────────────── */
function Lightbox({ images, index, onClose }: {
  images: Array<{ id: string; url: string; altText?: string }>;
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent(c => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(images.length - 1, c + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-charcoal-900/95 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-ivory/60 hover:text-ivory" aria-label="Close">
        <X className="h-6 w-6" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center disabled:opacity-30 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-ivory" />
          </button>
          <button
            onClick={() => setCurrent(c => Math.min(images.length - 1, c + 1))}
            disabled={current === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center disabled:opacity-30 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-ivory" />
          </button>
        </>
      )}
      <img
        src={getImageUrl(images[current].url, 1200)}
        alt={images[current].altText || ''}
        className="max-w-full max-h-[90vh] object-contain"
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-5 h-1.5 bg-ivory' : 'w-1.5 h-1.5 bg-ivory/30'}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Reviews section ────────────────────────────────────────────────────── */
function ReviewsSection({ productId, count }: { productId: string; count: number }) {
  const { data } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => api.get(`/products/${productId}/reviews?limit=5`).then(r => r.data?.data?.reviews || []),
    enabled: count > 0,
    staleTime: 5 * 60 * 1000,
  });

  if (count === 0) return null;
  const reviews: Array<{ id: string; rating: number; title?: string; body: string; createdAt: string; user: { firstName: string } }> = data || [];

  return (
    <section className="pt-16 border-t border-charcoal-100">
      <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6">
        Reviews <span className="text-charcoal-400 text-lg font-body">({count})</span>
      </h2>
      {reviews.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2 p-4 bg-charcoal-50">
              <div className="h-3 bg-charcoal-100 w-24" />
              <div className="h-4 bg-charcoal-100 w-1/2" />
              <div className="h-3 bg-charcoal-100 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-charcoal-50 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'text-gold-champagne fill-gold-champagne' : 'text-charcoal-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-charcoal-500 font-body">{r.user.firstName} · {formatDate(r.createdAt)}</span>
              </div>
              {r.title && <p className="text-sm font-body font-medium text-charcoal-900 mb-1">{r.title}</p>}
              <p className="text-sm text-charcoal-600 font-body font-light leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Related products ───────────────────────────────────────────────────── */
function RelatedProducts({ productId, categoryId }: { productId: string; categoryId?: string }) {
  const { data } = useQuery({
    queryKey: ['related-products', productId],
    queryFn: () =>
      api.get(`/products?status=ACTIVE&limit=4${categoryId ? `&categoryId=${categoryId}` : ''}&exclude=${productId}`)
        .then(r => r.data?.data?.products || []),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

  const products: Array<{ id: string; name: string; slug: string; price: number; images?: Array<{ url: string; altText?: string }> }> = data || [];
  if (products.length === 0) return null;

  return (
    <section className="pt-16 border-t border-charcoal-100">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-serif font-light text-2xl text-charcoal-900">You may also love</h2>
        <Link to="/shop" className="text-xs tracking-luxury uppercase text-charcoal-400 hover:text-charcoal-900 transition-colors font-body">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => (
          <motion.div key={p.id} variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
            <Link to={`/product/${p.slug}`} className="group block">
              <div className="aspect-[3/4] bg-charcoal-50 overflow-hidden mb-3">
                {p.images?.[0] ? (
                  <img
                    src={getImageUrl(p.images[0].url, 400)}
                    alt={p.images[0].altText || p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                )}
              </div>
              <p className="font-serif font-light text-sm text-charcoal-900 mb-1 line-clamp-2 group-hover:text-charcoal-600 transition-colors">{p.name}</p>
              <p className="text-sm text-charcoal-500 font-body">{formatCurrency(p.price)}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function ProductPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDone, setNotifyDone] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  /* Sticky CTA observer */
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => api.get(`/products/slug/${productSlug}`).then((r) => r.data.data),
    enabled: !!productSlug,
  });

  const product = data;

  useEffect(() => {
    if (product) document.title = product.seoTitle || `${product.name} | Lady B Designs`;
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants?.find((v: { id: string }) => v.id === selectedVariant);
    addItem({
      id: `${product.id}-${selectedVariant || 'default'}-${Date.now()}`,
      productId: product.id,
      variantId: selectedVariant,
      quantity,
      price: variant?.price ?? product.price,
      product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
      variant: variant ?? null,
    });
    toast.success('Added to your bag');
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: location.pathname } }); return; }
    setWishlisted(v => !v);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: wishlisted ? '🤍' : '❤️' });
  };

  const notifyMutation = useMutation({
    mutationFn: (email: string) =>
      api.post(`/products/${product?.id}/notify`, { email }).then(r => r.data),
    onSuccess: () => setNotifyDone(true),
    onError: () => toast.error('Could not subscribe. Please try again.'),
  });

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${product?.name} by Lady B Designs`);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'));
  };

  if (isLoading) return <ProductPageSkeleton />;
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-2xl text-charcoal-900 mb-4">Product not found</p>
        <Link to="/shop" className="text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors">← Return to shop</Link>
      </div>
    </div>
  );

  const images: Array<{ id: string; url: string; altText?: string }> = product.images || [];
  const activeVariant = product.variants?.find((v: { id: string }) => v.id === selectedVariant);
  const displayPrice = activeVariant?.price ?? product.price;
  const compareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const stock: number | undefined = activeVariant?.stock ?? product.stock;
  const isOutOfStock = stock !== undefined && stock === 0;

  return (
    <>
      <div className="min-h-screen bg-ivory pt-24 md:pt-32 pb-24">
        <div className="container-luxury">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-charcoal-400 font-body mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link to="/shop" className="hover:text-charcoal-900 transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            {product.category && (
              <>
                <Link to={`/collections/${product.category.slug}`} className="hover:text-charcoal-900 transition-colors">{product.category.name}</Link>
                <ChevronRight className="h-3 w-3 flex-shrink-0" />
              </>
            )}
            <span className="text-charcoal-600 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20">
            {/* ─── Image gallery ──────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-charcoal-50 overflow-hidden group">
                <div ref={emblaRef} className="w-full h-full overflow-hidden">
                  <div className="flex h-full">
                    {images.length > 0 ? images.map((img, i) => (
                      <div key={img.id} className="flex-shrink-0 w-full h-full relative">
                        <img
                          src={getImageUrl(img.url, 900)}
                          alt={img.altText || product.name}
                          className="w-full h-full object-cover"
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    )) : (
                      <div className="flex-shrink-0 w-full h-full flex items-center justify-center">
                        <p className="text-charcoal-300 text-xs font-body tracking-wider uppercase">No image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zoom button */}
                {images.length > 0 && (
                  <button
                    onClick={() => { setLightboxIndex(selectedIndex); setLightboxOpen(true); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-ivory/80 hover:bg-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="View full size"
                  >
                    <ZoomIn className="h-4 w-4 text-charcoal-700" />
                  </button>
                )}

                {/* Badges */}
                {product.isNewArrival && (
                  <div className="absolute top-4 left-4 z-10"><Badge variant="luxury">New</Badge></div>
                )}
                {product.isMadeToOrder && (
                  <div className="absolute top-4 right-4 z-10"><Badge variant="outline">Made to Order</Badge></div>
                )}

                {/* Prev / next */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => emblaApi?.scrollPrev()}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-ivory/90 hover:bg-ivory flex items-center justify-center transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4 text-charcoal-700" />
                    </button>
                    <button
                      onClick={() => emblaApi?.scrollNext()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-ivory/90 hover:bg-ivory flex items-center justify-center transition-colors z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4 text-charcoal-700" />
                    </button>
                  </>
                )}

                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={`rounded-full transition-all duration-200 ${selectedIndex === i ? 'w-5 h-1.5 bg-charcoal-900' : 'w-1.5 h-1.5 bg-charcoal-400'}`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => scrollTo(i)}
                      className={`flex-shrink-0 w-[72px] h-[72px] bg-charcoal-50 overflow-hidden border-2 transition-all duration-200 ${
                        selectedIndex === i ? 'border-charcoal-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={getImageUrl(img.url, 160)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Product info ────────────────────────────────────────── */}
            <div className="lg:py-4">
              {product.category && (
                <Link to={`/collections/${product.category.slug}`} className="text-2xs tracking-widest uppercase text-gold-champagne hover:text-charcoal-900 transition-colors font-body">
                  {product.category.name}
                </Link>
              )}

              <h1 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mt-2 mb-2">
                {product.name}
              </h1>

              {/* Review stars + stock status */}
              <div className="flex flex-wrap items-center gap-4 mb-5">
                {product._count?.reviews > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'text-gold-champagne fill-gold-champagne' : 'text-charcoal-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-charcoal-400 font-body">({product._count.reviews})</span>
                  </div>
                )}
                {/* Stock indicator */}
                {stock !== undefined && (
                  <span className={`text-xs font-body font-medium ${
                    isOutOfStock ? 'text-red-500' : stock <= 3 ? 'text-amber-600' : 'text-emerald-luxury'
                  }`}>
                    {isOutOfStock ? 'Out of stock' : stock <= 3 ? `Only ${stock} left` : 'In stock'}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-serif text-3xl font-light text-charcoal-900">{formatCurrency(displayPrice)}</span>
                {compareAtPrice && Number(compareAtPrice) > Number(displayPrice) && (
                  <span className="text-base text-charcoal-400 line-through font-body">{formatCurrency(compareAtPrice)}</span>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mb-6">
                  <p className="label-luxury mb-3">{activeVariant ? `Selected: ${activeVariant.name}` : 'Select Option'}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant: { id: string; name: string; isAvailable: boolean }) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        disabled={!variant.isAvailable}
                        className={`px-4 py-2 text-xs tracking-wide font-body border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                          selectedVariant === variant.id
                            ? 'border-charcoal-900 bg-charcoal-900 text-ivory'
                            : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-900'
                        }`}
                      >
                        {variant.name}
                        {!variant.isAvailable && ' (Unavailable)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {!isOutOfStock && (
                <div className="mb-8">
                  <p className="label-luxury mb-3">Quantity</p>
                  <div className="inline-flex items-center border border-charcoal-200">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 text-charcoal-500 hover:text-charcoal-900 transition-colors" aria-label="Decrease">−</button>
                    <span className="w-12 text-center text-sm font-body">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 text-charcoal-500 hover:text-charcoal-900 transition-colors" aria-label="Increase">+</button>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mb-6">
                {isOutOfStock ? (
                  <div className="flex-1 bg-charcoal-100 text-charcoal-400 py-4 text-xs tracking-luxury uppercase font-body text-center">
                    Out of Stock
                  </div>
                ) : (
                  <Button variant="primary" size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingBag className="h-4 w-4" /> Add to Bag
                  </Button>
                )}
                <button
                  onClick={toggleWishlist}
                  className={`sm:w-14 h-14 border transition-colors flex items-center justify-center ${
                    wishlisted ? 'border-charcoal-900 bg-charcoal-900 text-ivory' : 'border-charcoal-200 text-charcoal-500 hover:border-charcoal-900 hover:text-charcoal-900'
                  }`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`h-5 w-5 ${wishlisted ? 'fill-ivory' : ''}`} />
                </button>
              </div>

              {/* Notify me — shows when out of stock */}
              {isOutOfStock && !notifyDone && (
                <div className="mb-8 p-4 bg-charcoal-50 border border-charcoal-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-4 w-4 text-charcoal-500" />
                    <p className="text-sm font-body font-medium text-charcoal-900">Notify me when available</p>
                  </div>
                  <form
                    onSubmit={(e) => { e.preventDefault(); notifyEmail && notifyMutation.mutate(notifyEmail); }}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.value)}
                      placeholder="Your email address"
                      className="flex-1 border border-charcoal-200 px-3 py-2 text-sm font-body text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-charcoal-600 bg-transparent"
                    />
                    <button
                      type="submit"
                      disabled={notifyMutation.isPending || !notifyEmail}
                      className="px-4 bg-charcoal-900 text-ivory text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors disabled:opacity-50"
                    >
                      {notifyMutation.isPending ? '…' : 'Notify'}
                    </button>
                  </form>
                </div>
              )}

              {notifyDone && (
                <div className="mb-8 p-4 bg-emerald-luxury/8 border border-emerald-luxury/20">
                  <p className="text-sm text-emerald-luxury font-body">We'll email you when this is back in stock.</p>
                </div>
              )}

              {/* Share */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs text-charcoal-400 font-body tracking-luxury uppercase">Share</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="text-charcoal-300 hover:text-charcoal-900 transition-colors p-1"
                    aria-label="Share on X / Twitter"
                    title="Share on X"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="text-charcoal-300 hover:text-charcoal-900 transition-colors p-1"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="text-charcoal-300 hover:text-charcoal-900 transition-colors p-1"
                    aria-label="Copy product link"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Trust signals */}
              <div className="space-y-3 py-6 border-t border-b border-charcoal-100 mb-8">
                {[
                  { icon: Truck, text: 'Complimentary global shipping on orders over $250' },
                  { icon: RotateCcw, text: '7-day return window for damaged or defective items' },
                  { icon: Shield, text: 'Secure checkout via Stripe and PayPal' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon className="h-4 w-4 text-gold-champagne flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-charcoal-500 font-body">{text}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-serif font-light text-lg text-charcoal-900 mb-3">Description</h3>
                  <p className="text-sm text-charcoal-600 font-body font-light leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Details accordion */}
              {[
                { label: 'Materials', content: product.materials },
                { label: 'Dimensions', content: product.dimensions },
                { label: 'Care Instructions', content: product.careInstructions },
                { label: 'Craftsmanship', content: product.craftDetails },
              ].filter(d => d.content).map((detail) => (
                <details key={detail.label} className="border-t border-charcoal-100 py-4 group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-xs tracking-editorial uppercase text-charcoal-600 font-body font-medium">{detail.label}</span>
                    <ChevronRight className="h-4 w-4 text-charcoal-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm text-charcoal-500 font-body font-light leading-relaxed">{detail.content}</p>
                </details>
              ))}

              {product.isMadeToOrder && product.madeToOrderLeadDays && (
                <div className="mt-4 bg-gold-champagne/10 border border-gold-champagne/20 p-4">
                  <p className="text-xs text-cocoa font-body font-medium uppercase tracking-wide mb-1">Made to Order</p>
                  <p className="text-sm text-charcoal-700 font-body font-light">
                    This piece is crafted upon order. Allow {product.madeToOrderLeadDays} business days for completion.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <ReviewsSection productId={product.id} count={product._count?.reviews || 0} />

          {/* Related products */}
          <RelatedProducts productId={product.id} categoryId={product.category?.id} />
        </div>
      </div>

      {/* ── Sticky mobile add-to-bag ───────────────────────────────────── */}
      <AnimatePresence>
        {showSticky && !isOutOfStock && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed bottom-0 left-0 right-0 bg-ivory border-t border-charcoal-100 px-4 py-3 flex items-center gap-3 z-40 lg:hidden shadow-lg"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-charcoal-500 font-body truncate">{product.name}</p>
              <p className="text-sm font-serif text-charcoal-900">{formatCurrency(displayPrice)}</p>
            </div>
            <Button variant="primary" className="flex-shrink-0 h-12 px-6" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-ivory pt-32 container-luxury pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="flex gap-2.5">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="w-[72px] h-[72px]" />)}
          </div>
        </div>
        <div className="space-y-4 py-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-14 flex-1" />
            <Skeleton className="h-14 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
