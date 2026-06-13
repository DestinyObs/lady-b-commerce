import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Craftsmanship', href: '/craftsmanship' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

const MOBILE_NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Craftsmanship', href: '/craftsmanship' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

const TRENDING = ['Cobalt evening clutch', 'Pearl statement necklace', 'Bespoke commission'];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated } = useAuthStore();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, openCart } = useUiStore();

  const debouncedQuery = useDebounce(searchQuery.trim(), 320);

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist-count'],
    queryFn: () => api.get('/account/wishlist?limit=1').then(r => r.data?.data?.total ?? 0),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
  const wishlistCount: number = wishlistData ?? 0;

  const { data: searchResults } = useQuery({
    queryKey: ['header-search', debouncedQuery],
    queryFn: () =>
      api.get(`/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`).then((r) => r.data.data),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const products: Array<{ id: string; name: string; slug: string; images?: Array<{ url: string }> }> =
    searchResults?.products || [];
  const showDropdown = isSearchMode && debouncedQuery.length >= 2;

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    closeSearch();
  }, [location.pathname]);

  const openSearch = useCallback(() => {
    setIsSearchMode(true);
    setSearchQuery('');
    setTimeout(() => searchInputRef.current?.focus(), 80);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchMode(false);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    if (!isSearchMode) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSearchMode, closeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) { closeSearch(); return; }
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    closeSearch();
  };

  return (
    <header
      className={cn(
        'w-full transition-all duration-500',
        isScrolled
          ? 'bg-ivory shadow-luxury border-b border-charcoal-100'
          : 'bg-ivory border-b border-charcoal-100/60',
      )}
      role="banner"
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-18 md:h-22 gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 focus-visible:outline-none"
            aria-label="Lady B Designs — Home"
            onClick={closeSearch}
          >
            <div className="text-center">
              <span className="block font-serif font-light tracking-luxury text-sm md:text-base uppercase text-charcoal-900 transition-colors duration-300">
                Lady B
              </span>
              <span className="block text-2xs tracking-widest uppercase font-body text-charcoal-400">
                Designs & Handcraft
              </span>
            </div>
          </Link>

          {/* Desktop nav / inline search */}
          <div className="hidden lg:flex flex-1 items-center justify-center min-w-0 px-6 relative">
            <AnimatePresence mode="wait" initial={false}>
              {isSearchMode ? (
                /* ── Inline search bar ────────────────────────────────── */
                <motion.form
                  key="search-form"
                  onSubmit={handleSearchSubmit}
                  className="w-full max-w-2xl flex items-end gap-3 group"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                >
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for pieces, collections..."
                      autoComplete="off"
                      className={cn(
                        'w-full bg-transparent text-charcoal-900 font-serif font-light text-lg',
                        'placeholder:text-charcoal-300 placeholder:font-light placeholder:text-base',
                        'focus:outline-none border-none ring-0 pb-2',
                        'border-b border-charcoal-900/30 focus:border-charcoal-900',
                        'transition-colors duration-200 caret-gold-champagne',
                      )}
                      aria-label="Search products"
                    />

                    {/* Dropdown results */}
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          className="absolute top-full left-0 right-0 mt-1 bg-ivory shadow-luxury-lg border border-charcoal-100 z-50 max-h-72 overflow-y-auto"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          {products.length > 0 ? (
                            <>
                              {products.map((p) => (
                                <Link
                                  key={p.id}
                                  to={`/product/${p.slug}`}
                                  onClick={closeSearch}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-charcoal-50 transition-colors"
                                >
                                  <div className="w-9 h-9 bg-charcoal-50 flex-shrink-0 overflow-hidden">
                                    {p.images?.[0] && (
                                      <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                                    )}
                                  </div>
                                  <span className="text-sm text-charcoal-900 font-body">{p.name}</span>
                                </Link>
                              ))}
                              <Link
                                to={`/shop?q=${encodeURIComponent(debouncedQuery)}`}
                                onClick={closeSearch}
                                className="block px-4 py-3 text-xs text-charcoal-400 hover:text-charcoal-900 font-body tracking-wide uppercase border-t border-charcoal-50 transition-colors"
                              >
                                See all results for "{debouncedQuery}"
                              </Link>
                            </>
                          ) : (
                            <div className="px-4 py-5">
                              <p className="text-sm text-charcoal-400 font-body mb-3">No results found</p>
                              <div className="flex flex-wrap gap-2">
                                {TRENDING.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => { setSearchQuery(t); }}
                                    className="text-xs text-charcoal-500 font-body border border-charcoal-200 px-3 py-1 hover:border-charcoal-900 transition-colors"
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              ) : (
                /* ── Desktop navigation ───────────────────────────────── */
                <motion.nav
                  key="desktop-nav"
                  className="flex items-center gap-6 xl:gap-8"
                  aria-label="Main navigation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={({ isActive }) =>
                        cn(
                          'text-xs tracking-luxury uppercase font-body font-medium transition-colors duration-200 whitespace-nowrap',
                          'relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full after:bg-charcoal-900',
                          'text-charcoal-700 hover:text-charcoal-900',
                          isActive && 'text-charcoal-900 after:w-full',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search toggle */}
            <button
              onClick={isSearchMode ? closeSearch : openSearch}
              aria-label={isSearchMode ? 'Close search' : 'Search'}
              aria-expanded={isSearchMode}
              className="p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSearchMode ? (
                  <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-[18px] w-[18px]" />
                  </motion.span>
                ) : (
                  <motion.span key="search" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Search className="h-[18px] w-[18px]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link
              to="/wishlist"
              aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`}
              className="p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200 relative"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-charcoal-900 text-ivory rounded-full text-2xs font-body font-medium">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to={isAuthenticated ? '/account' : '/login'}
              aria-label="Account"
              className="p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            <button
              onClick={openCart}
              aria-label={`Shopping bag (${itemCount} items)`}
              className="p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200 relative"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-gold-champagne text-charcoal-900 rounded-full text-2xs font-body font-medium">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile inline search bar */}
        <AnimatePresence>
          {isSearchMode && (
            <motion.div
              className="lg:hidden px-1 pb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pieces..."
                  autoComplete="off"
                  className={cn(
                    'w-full bg-transparent text-charcoal-900 font-body text-sm',
                    'placeholder:text-charcoal-300',
                    'focus:outline-none border-b border-charcoal-300 focus:border-charcoal-900 pb-2',
                    'transition-colors duration-200',
                  )}
                  aria-label="Search products"
                />

                {/* Mobile dropdown */}
                <AnimatePresence>
                  {showDropdown && products.length > 0 && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-1 bg-ivory shadow-luxury-lg border border-charcoal-100 z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {products.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-charcoal-50 transition-colors border-b border-charcoal-50 last:border-0"
                        >
                          <span className="text-sm text-charcoal-900 font-body">{p.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-charcoal-900 flex flex-col pt-24 px-8 pb-8"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <button
              onClick={closeMobileMenu}
              className="absolute top-6 right-6 text-ivory/60 hover:text-ivory transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>

            <nav className="flex flex-col gap-6 flex-1 overflow-y-auto" aria-label="Mobile navigation">
              {MOBILE_NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      cn(
                        'font-serif font-light text-3xl text-ivory/80 hover:text-ivory transition-colors duration-200',
                        isActive && 'text-ivory',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-ivory/10 pt-6 flex flex-col gap-2">
              <a href="tel:+13173331333" className="text-ivory/40 text-xs font-body tracking-wide hover:text-ivory/70 transition-colors">+1 (317) 333-1333</a>
              <a href="mailto:Adebiyiblessing55@gmail.com" className="text-ivory/40 text-xs font-body tracking-wide hover:text-ivory/70 transition-colors break-all">Adebiyiblessing55@gmail.com</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
