import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';
import { config } from '../../app/config';

const SHOP_LINKS = [
  { label: 'Bead Bags', href: '/collections/bead-bags' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'Bespoke', href: '/bespoke' },
  { label: 'Gift Cards', href: '/gift-cards' },
];

const BRAND_LINKS = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'Craftsmanship', href: '/craftsmanship' },
  { label: 'Journal', href: '/journal' },
  { label: 'Press', href: '/press' },
  { label: 'Wholesale', href: '/wholesale' },
];

const HELP_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Accessibility', href: '/accessibility' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Sustainability', href: '/sustainability' },
];

export function Footer() {
  const [email, setEmail] = useState('');

  const newsletterMutation = useMutation({
    mutationFn: (address: string) =>
      api.post('/newsletter/subscribe', { email: address }).then((r) => r.data),
    onSuccess: () => {
      toast.success('You\'re on the list. Welcome to the inner circle.');
      setEmail('');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Could not subscribe. Please try again.');
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    newsletterMutation.mutate(email.trim());
  };

  return (
    <footer className="bg-charcoal-900 text-ivory" role="contentinfo">
      {/* Newsletter band */}
      <div className="border-b border-ivory/10">
        <div className="container-luxury py-14 md:py-20">
          <div className="max-w-xl">
            <span className="section-label">Private Access</span>
            <h2 className="font-serif font-light text-2xl md:text-4xl text-ivory mt-3 mb-4">
              Join the Inner Circle
            </h2>
            <p className="text-ivory/60 text-sm font-body font-light leading-relaxed mb-8">
              Be first to know. New collections, bespoke availability, exclusive events, and stories from the atelier — for women who understand that true luxury is made by hand.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe} noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-ivory/20 text-ivory placeholder:text-ivory/30 px-5 py-4 text-sm font-body focus:outline-none focus:border-gold-champagne transition-colors"
                aria-label="Email for newsletter"
                disabled={newsletterMutation.isPending}
              />
              <button
                type="submit"
                disabled={newsletterMutation.isPending}
                className="border border-ivory/40 text-ivory px-6 md:px-8 py-4 text-xs tracking-luxury uppercase font-body font-medium hover:bg-ivory hover:text-charcoal-900 transition-all duration-300 flex-shrink-0 disabled:opacity-50"
              >
                {newsletterMutation.isPending ? '…' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-luxury py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6">
              <span className="font-serif font-light tracking-luxury text-base uppercase">Lady B</span>
              <span className="block text-2xs tracking-widest uppercase text-ivory/40 mt-1">Designs &amp; Handcraft</span>
            </div>
            <p className="text-ivory/50 text-sm font-body font-light leading-relaxed mb-6">
              Luxury handcrafted accessories for women of distinction. Made by hand, one bead at a time.
            </p>
            <div className="space-y-2 mb-6">
              <a href={`tel:${config.brand.phone}`} className="block text-sm text-ivory/50 hover:text-ivory transition-colors font-body font-light">
                {config.brand.phone}
              </a>
              <a href={`mailto:${config.brand.email}`} className="block text-sm text-ivory/50 hover:text-ivory transition-colors font-body font-light break-all">
                {config.brand.email}
              </a>
            </div>
            <div className="flex gap-4">
              <a href={config.brand.social.instagram} target="_blank" rel="noopener noreferrer" className="text-ivory/40 hover:text-gold-champagne transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={config.brand.social.facebook} target="_blank" rel="noopener noreferrer" className="text-ivory/40 hover:text-gold-champagne transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-2xs tracking-widest uppercase text-gold-champagne font-body font-medium mb-5">Shop</h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-ivory/50 hover:text-ivory transition-colors font-body font-light">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div>
            <h3 className="text-2xs tracking-widest uppercase text-gold-champagne font-body font-medium mb-5">Brand</h3>
            <ul className="space-y-3">
              {BRAND_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-ivory/50 hover:text-ivory transition-colors font-body font-light">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-2xs tracking-widest uppercase text-gold-champagne font-body font-medium mb-5">Help</h3>
            <ul className="space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-ivory/50 hover:text-ivory transition-colors font-body font-light">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="container-luxury py-5 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory/30 text-xs font-body text-center sm:text-left">
            © {new Date().getFullYear()} Lady B Designs and Handcraft. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="text-xs text-ivory/30 hover:text-ivory/60 transition-colors font-body">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 opacity-40" aria-label="Accepted payment methods">
            {['Visa', 'MC', 'Amex', 'PayPal', 'Stripe'].map((p) => (
              <span key={p} className="text-2xs text-ivory/60 border border-ivory/20 px-2 py-0.5 font-body">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
