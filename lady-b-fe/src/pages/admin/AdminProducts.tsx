import React, { useEffect } from 'react';

export default function AdminProducts() {
  useEffect(() => { document.title = 'Products | Lady B Designs'; }, []);
  return (
    <div className="min-h-screen bg-ivory pt-24 md:pt-32 pb-24">
      <div className="container-luxury max-w-4xl">
        <h1 className="font-serif font-light text-4xl text-charcoal-900 mb-8">Products</h1>
        <p className="text-charcoal-500 font-body">This page is under construction.</p>
      </div>
    </div>
  );
}
