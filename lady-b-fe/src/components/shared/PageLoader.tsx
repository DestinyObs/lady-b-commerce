import React from 'react';

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-ivory flex items-center justify-center z-50" aria-label="Loading">
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 border border-charcoal-200 rounded-full" />
            <div className="absolute inset-0 border-t border-charcoal-900 rounded-full animate-spin" />
          </div>
          <span className="text-2xs tracking-widest uppercase text-charcoal-400 font-body">
            Lady B Designs
          </span>
        </div>
      </div>
    </div>
  );
}
