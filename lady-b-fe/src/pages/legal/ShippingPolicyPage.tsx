import React, { useEffect } from 'react';

export default function ShippingPolicyPage() {
  useEffect(() => { document.title = 'Shipping Policy | Lady B Designs'; }, []);
  const sections = [
    { title: 'Processing Time', body: 'Ready-made items ship within 3–5 business days of payment confirmation. Custom and bespoke orders require 6–8 weeks of crafting time before shipping.' },
    { title: 'Destinations', body: 'We ship domestically within the United States and internationally to most countries.' },
    { title: 'Domestic Shipping (USA)', body: 'Standard: 5–7 business days. Expedited: 2–3 business days. Free standard shipping on all orders over $250.' },
    { title: 'International Shipping', body: 'International orders typically arrive within 10–21 business days. The customer is responsible for any customs duties, taxes, or import fees.' },
    { title: 'Order Tracking', body: 'Once your order ships, you will receive a confirmation email with a tracking number.' },
    { title: 'Lost or Stolen Packages', body: 'Lady B Designs is not responsible for lost or stolen packages once confirmed as delivered. Ensure your shipping address is correct before ordering.' },
    { title: 'Damaged Items', body: 'If your item arrives damaged, contact us within 7 days of delivery with photos. We will resolve the issue promptly.' },
  ];
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-24">
      <div className="container-luxury max-w-3xl">
        <div className="mb-12"><span className="section-label block mb-3">Legal</span><h1 className="font-serif font-light text-5xl text-charcoal-900">Shipping Policy</h1><p className="text-charcoal-400 font-body text-sm mt-3">Effective Date: June 10, 2026</p></div>
        <div className="space-y-0">
          {sections.map(s => (
            <section key={s.title} className="border-t border-charcoal-100 py-8">
              <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-3">{s.title}</h2>
              <p className="text-charcoal-600 font-body leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 bg-pearl border-l-2 border-gold-champagne p-6 font-body text-charcoal-700">
          Questions? Email <a href="mailto:Adebiyiblessing55@gmail.com" className="text-charcoal-900 font-medium hover:underline">Adebiyiblessing55@gmail.com</a> or call <a href="tel:+13175074966" className="text-charcoal-900 font-medium hover:underline">+1 (317) 507-4966</a>
        </div>
      </div>
    </div>
  );
}
