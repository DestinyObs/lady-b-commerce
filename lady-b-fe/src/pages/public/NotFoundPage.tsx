import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function NotFoundPage() {
  useEffect(() => { document.title = 'Page Not Found | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-[8rem] font-light text-charcoal-100 leading-none mb-0">404</p>
        <h1 className="font-serif font-light text-3xl text-charcoal-900 -mt-4 mb-4">Page Not Found</h1>
        <p className="text-sm text-charcoal-500 font-body leading-relaxed mb-8">
          The page you're looking for has moved, or perhaps it was never here. Let us guide you back.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"><Button variant="primary">Return Home</Button></Link>
          <Link to="/shop"><Button variant="secondary">Explore Collection</Button></Link>
        </div>
      </div>
    </div>
  );
}
