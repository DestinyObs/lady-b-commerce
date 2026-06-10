import React from 'react';

const MESSAGES = [
  'Complimentary global shipping on orders over $250',
  'Bespoke commissions now open — limited availability',
  'Handmade in Indianapolis · Premium Japanese seed beads',
  'Each piece crafted by hand · No two are identical',
  'Custom orders ship in 6–8 weeks',
];

const ticker = [...MESSAGES, ...MESSAGES].join('  ·  ');

export function AnnouncementBar() {
  return (
    <div
      className="bg-charcoal-900 text-ivory/80 py-2.5 overflow-hidden"
      role="banner"
      aria-label="Announcement"
    >
      <div className="relative flex">
        <div
          className="flex shrink-0 whitespace-nowrap animate-marquee"
          aria-hidden="false"
        >
          <span className="text-2xs tracking-widest uppercase font-body font-medium px-8">
            {ticker}
          </span>
        </div>
        <div
          className="flex shrink-0 whitespace-nowrap animate-marquee"
          aria-hidden="true"
        >
          <span className="text-2xs tracking-widest uppercase font-body font-medium px-8">
            {ticker}
          </span>
        </div>
      </div>
    </div>
  );
}
