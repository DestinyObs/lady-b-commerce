import React, { useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'lb_bar_dismissed';

const MESSAGES = [
  'Complimentary global shipping on orders over $250',
  'Bespoke commissions now open — limited availability',
  'Handmade in Indianapolis · Premium Japanese seed beads',
  'Each piece crafted by hand · No two are identical',
  'Custom orders ship in 6–8 weeks',
];

const ticker = [...MESSAGES, ...MESSAGES].join('  ·  ');

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => !!sessionStorage.getItem(STORAGE_KEY));

  if (dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  return (
    <div
      className="bg-charcoal-900 text-ivory/80 py-2.5 overflow-hidden relative"
      role="banner"
      aria-label="Announcement"
    >
      <div className="relative flex pr-8">
        <div className="flex shrink-0 whitespace-nowrap animate-marquee" aria-hidden="false">
          <span className="text-2xs tracking-widest uppercase font-body font-medium px-8">{ticker}</span>
        </div>
        <div className="flex shrink-0 whitespace-nowrap animate-marquee" aria-hidden="true">
          <span className="text-2xs tracking-widest uppercase font-body font-medium px-8">{ticker}</span>
        </div>
      </div>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory transition-colors p-1"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
