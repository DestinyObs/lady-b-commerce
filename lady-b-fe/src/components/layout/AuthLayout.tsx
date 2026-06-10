import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <header className="py-8 px-6 text-center">
        <Link to="/" className="inline-block">
          <span className="font-serif font-light tracking-luxury text-lg uppercase text-charcoal-900">Lady B</span>
          <span className="block text-2xs tracking-widest uppercase text-charcoal-400 mt-0.5">Designs & Handcraft</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-xs text-charcoal-400 font-body">© {new Date().getFullYear()} Lady B Designs and Handcraft</p>
      </footer>
    </div>
  );
}
