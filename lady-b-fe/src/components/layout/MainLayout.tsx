import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { useUiStore } from '../../store/ui.store';

export function MainLayout() {
  const { isCartOpen, closeCart } = useUiStore();

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
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
