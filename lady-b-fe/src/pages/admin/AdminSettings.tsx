import React, { useEffect } from 'react';

export default function AdminSettings() {
  useEffect(() => { document.title = 'Settings | Lady B Designs'; }, []);
  return (
    <div className="min-h-screen bg-ivory pt-24 md:pt-32 pb-24">
      <div className="container-luxury max-w-4xl">
        <h1 className="font-serif font-light text-4xl text-charcoal-900 mb-8">Settings</h1>
        <p className="text-charcoal-500 font-body">This page is under construction.</p>
      </div>
    </div>
  );
}
