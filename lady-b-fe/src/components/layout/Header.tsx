import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Custom Orders', href: '/custom-orders' },
  { label: 'Craftsmanship', href: '/craftsmanship' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Journal', href: '/journal' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated } = useAuthStore();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, openCart, openSearch } = useUiStore();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { closeMobileMenu(); }, [location.pathname, closeMobileMenu]);

  return (
    <header
      className={cn(
        'w-full transition-all duration-500',
        isScrolled
          ? 'bg-ivory/96 backdrop-blur-md shadow-luxury border-b border-charcoal-100'
          : 'bg-ivory border-b border-charcoal-100/60',
      )}
      role="banner"
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-18 md:h-22">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 focus-visible:outline-none" aria-label="Lady B Designs — Home">
            <div className="text-center">
              <span className="block font-serif font-light tracking-luxury text-sm md:text-base uppercase text-charcoal-900 transition-colors duration-300">
                Lady B
              </span>
              <span className="block text-2xs tracking-widest uppercase font-body text-charcoal-400">
                Designs & Handcraft
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'text-xs tracking-luxury uppercase font-body font-medium transition-colors duration-200',
                    'relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full after:bg-charcoal-900',
                    'text-charcoal-600 hover:text-charcoal-900',
                    isActive && 'text-charcoal-900 after:w-full',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={openSearch}
              aria-label="Search"
              className="p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <Link to="/wishlist" aria-label="Wishlist" className="p-2.5 text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200">
              <Heart className="h-[18px] w-[18px]" />
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
      </div>

      {/* Mobile menu */}
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

            <nav className="flex flex-col gap-6 flex-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      cn('font-serif font-light text-3xl text-ivory/80 hover:text-ivory transition-colors duration-200', isActive && 'text-ivory')
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-ivory/10 pt-6 flex flex-col gap-3">
              <Link to="/contact" onClick={closeMobileMenu} className="text-ivory/50 text-xs tracking-luxury uppercase hover:text-ivory/80 transition-colors">Contact</Link>
              <Link to="/wholesale" onClick={closeMobileMenu} className="text-ivory/50 text-xs tracking-luxury uppercase hover:text-ivory/80 transition-colors">Wholesale</Link>
              <p className="text-ivory/30 text-2xs tracking-wider mt-2">+1 (317) 507-4966</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
