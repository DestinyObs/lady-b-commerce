import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, ChevronRight, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function ProductPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => api.get(`/products/slug/${productSlug}`).then((r) => r.data.data),
    enabled: !!productSlug,
  });

  const product = data;

  useEffect(() => {
    if (product) {
      document.title = product.seoTitle || `${product.name} | Lady B Designs`;
    }
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
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: product.images,
      },
      variant: variant ?? null,
    });
    toast.success('Added to your bag');
    openCart();
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

  const primaryImage = product.images?.[0]?.url;
  const currentImage = product.images?.[selectedImage]?.url || primaryImage;
  const activeVariant = product.variants?.find((v: { id: string }) => v.id === selectedVariant);
  const displayPrice = activeVariant?.price ?? product.price;
  const compareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;

  return (
    <div className="min-h-screen bg-ivory pt-24 md:pt-32">
      <div className="container-luxury">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-400 font-body mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-charcoal-900 transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          {product.category && (
            <>
              <Link to={`/collections/${product.category.slug}`} className="hover:text-charcoal-900 transition-colors">{product.category.name}</Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-charcoal-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 pb-24">
          {/* ─── Image gallery ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <motion.div
              className="aspect-[4/5] bg-charcoal-50 overflow-hidden relative"
              layoutId={`product-image-${product.id}`}
            >
              {currentImage ? (
                <img
                  src={getImageUrl(currentImage, 900)}
                  alt={product.images?.[selectedImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-charcoal-300 text-xs font-body tracking-wider uppercase">No image</p>
                </div>
              )}
              {product.isNewArrival && (
                <div className="absolute top-4 left-4">
                  <Badge variant="luxury">New</Badge>
                </div>
              )}
              {product.isMadeToOrder && (
                <div className="absolute top-4 right-4">
                  <Badge variant="outline">Made to Order</Badge>
                </div>
              )}
            </motion.div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {product.images.map((img: { id: string; url: string; altText?: string }, i: number) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 bg-charcoal-50 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-charcoal-900' : 'border-transparent'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={getImageUrl(img.url, 160)} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product info ──────────────────────────────────────────── */}
          <div className="lg:py-4">
            {product.category && (
              <Link to={`/collections/${product.category.slug}`} className="text-2xs tracking-widest uppercase text-gold-champagne hover:text-charcoal-900 transition-colors font-body">
                {product.category.name}
              </Link>
            )}

            <h1 className="font-serif font-light text-3xl md:text-4xl text-charcoal-900 mt-2 mb-1">
              {product.name}
            </h1>

            {product._count?.reviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'text-gold-champagne fill-gold-champagne' : 'text-charcoal-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-charcoal-400 font-body">({product._count.reviews} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-3xl font-light text-charcoal-900">
                {formatCurrency(displayPrice)}
              </span>
              {compareAtPrice && Number(compareAtPrice) > Number(displayPrice) && (
                <span className="text-base text-charcoal-400 line-through font-body">
                  {formatCurrency(compareAtPrice)}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <p className="label-luxury mb-3">
                  {activeVariant ? `Selected: ${activeVariant.name}` : 'Select Option'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: { id: string; name: string; colorHex?: string; isAvailable: boolean }) => (
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
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="label-luxury mb-3">Quantity</p>
              <div className="inline-flex items-center border border-charcoal-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                isLoading={false}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
              </Button>
              <button
                className="sm:w-14 h-14 border border-charcoal-200 text-charcoal-500 hover:text-charcoal-900 hover:border-charcoal-900 transition-colors flex items-center justify-center"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
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
              <div className="prose prose-sm prose-charcoal mb-6">
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
            ].filter((d) => d.content).map((detail) => (
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
      </div>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-ivory pt-32 container-luxury">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="space-y-4 py-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-24" />
          <div className="space-y-2 mt-6">
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-20" />)}
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-14 flex-1" />
            <Skeleton className="h-14 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
