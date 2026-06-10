import React, { useEffect } from 'react';

export default function ReturnPolicyPage() {
  useEffect(() => { document.title = 'Return & Refund Policy | Lady B Designs'; }, []);
  const sections = [
    { title: 'Returns', items: ['Due to the handcrafted nature of our items, returns are accepted only for damaged or defective products.', 'Contact us within 7 days of receiving your item to be eligible for a return.', 'Items must be returned in original condition and packaging.', 'Custom or personalized orders cannot be returned unless they arrive damaged or defective.'] },
    { title: 'Refunds', items: ['Once we receive and inspect your item, we will notify you of the refund status.', 'Approved refunds are processed to your original payment method within 5–7 business days.', 'Shipping costs are non-refundable unless the return is due to our error.'] },
    { title: 'Exchanges', items: ['We only replace items if they are defective or damaged.', 'Contact us with a photo and description of the issue to initiate an exchange.'] },
  ];
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-24">
      <div className="container-luxury max-w-3xl">
        <div className="mb-12"><span className="section-label block mb-3">Legal</span><h1 className="font-serif font-light text-5xl text-charcoal-900">Return &amp; Refund Policy</h1><p className="text-charcoal-400 font-body text-sm mt-3">Effective Date: June 10, 2026</p></div>
        <div className="space-y-10 font-body text-charcoal-700 leading-relaxed">
          <p className="text-lg text-charcoal-600 font-light">At Lady B Designs and Handcraft, we take great pride in the quality of our handmade products. If you are not entirely satisfied, we are here to help.</p>
          {sections.map(s => (
            <section key={s.title}>
              <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">{s.title}</h2>
              <ul className="space-y-3 text-charcoal-600">{s.items.map(item => (<li key={item} className="flex items-start gap-3"><div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0" />{item}</li>))}</ul>
            </section>
          ))}
          <section><h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">Non-Returnable Items</h2><ul className="space-y-2 text-charcoal-600">{['Custom-made products','Personalized items','Sale or clearance items'].map(item=>(<li key={item} className="flex items-start gap-3"><div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0"/>{item}</li>))}</ul></section>
          <section>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">Contact Us to Return</h2>
            <div className="border border-charcoal-200 p-6 space-y-1">
              <p className="font-medium text-charcoal-900">Lady B Designs and Handcraft</p>
              <p className="text-charcoal-600">731 Westbury West Dr, Indianapolis, IN 46224</p>
              <p className="text-charcoal-600">Email: <a href="mailto:Adebiyiblessing55@gmail.com" className="text-charcoal-900 hover:underline">Adebiyiblessing55@gmail.com</a></p>
              <p className="text-charcoal-600">Phone: <a href="tel:+13175074966" className="text-charcoal-900 hover:underline">+1 (317) 507-4966</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
