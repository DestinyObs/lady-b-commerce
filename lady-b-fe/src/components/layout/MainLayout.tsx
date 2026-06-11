import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ScrollRestorer } from '../shared/ScrollRestorer';
import { useUiStore } from '../../store/ui.store';

export function MainLayout() {
  const { isCartOpen, closeCart } = useUiStore();

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <ScrollRestorer />
      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-charcoal-900 focus:text-ivory focus:px-4 focus:py-2 focus:text-xs focus:tracking-luxury focus:uppercase focus:font-body"
      >
        Skip to content
      </a>

      {/* Fixed top bar: announcement strip + navigation header together */}
      <div className="fixed top-0 inset-x-0 z-40">
        <AnnouncementBar />
        <Header />
      </div>

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}
