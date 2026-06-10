import React, { useEffect } from 'react';

export default function PrivacyPolicyPage() {
  useEffect(() => { document.title = 'Privacy Policy | Lady B Designs'; }, []);
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-24">
      <div className="container-luxury max-w-3xl">
        <div className="mb-12"><span className="section-label block mb-3">Legal</span><h1 className="font-serif font-light text-5xl text-charcoal-900">Privacy Policy</h1><p className="text-charcoal-400 font-body text-sm mt-3">Effective Date: June 10, 2026</p></div>
        <div className="space-y-10 font-body text-charcoal-700 leading-relaxed">
          <p className="text-lg text-charcoal-600 font-light">At Lady B Designs and Handcraft, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
          {[
            { title: 'Information We Collect', items: ['Contact Information: Name, email, phone, shipping and billing address', 'Order Information: Products purchased, payment details (processed securely via third parties)', 'Usage Information: Pages viewed, time on site, browser type via cookies'] },
            { title: 'How We Use Your Information', items: ['To process and fulfill your orders', 'To communicate about your order or inquiries', 'To send updates and newsletters (opt out anytime)', 'To improve our website and customer experience', 'To comply with legal obligations'] },
            { title: 'Who We Share It With', items: ['Payment processors (PayPal, Stripe)', 'Shipping providers (USPS, FedEx)', 'Analytics tools (Google Analytics)', 'Legal authorities if required by law'] },
          ].map(s => (
            <section key={s.title}>
              <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">{s.title}</h2>
              <ul className="space-y-3 text-charcoal-600">{s.items.map(item=>(<li key={item} className="flex items-start gap-3"><div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0"/>{item}</li>))}</ul>
            </section>
          ))}
          <section><h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">Cookies</h2><p className="text-charcoal-600">Our website uses cookies to enhance your browsing experience. You can disable cookies through your browser settings.</p></section>
          <section><h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">Security</h2><p className="text-charcoal-600">We take reasonable measures to protect your personal information. No method of internet transmission is 100% secure.</p></section>
          <section><h2 className="font-serif font-light text-2xl text-charcoal-900 mb-4">Your Rights</h2><ul className="space-y-3 text-charcoal-600">{['Access, update, or delete your personal information','Withdraw consent for marketing communications','Request details about how your data is used'].map(item=>(<li key={item} className="flex items-start gap-3"><div className="w-4 h-px bg-gold-champagne mt-3 flex-shrink-0"/>{item}</li>))}</ul></section>
          <div className="border border-charcoal-200 p-6 space-y-1">
            <p className="font-medium text-charcoal-900">Lady B Designs and Handcraft</p>
            <p className="text-charcoal-600">731 Westbury West Dr, Indianapolis, IN 46224</p>
            <p className="text-charcoal-600">Email: <a href="mailto:Adebiyiblessing55@gmail.com" className="text-charcoal-900 hover:underline">Adebiyiblessing55@gmail.com</a></p>
            <p className="text-charcoal-600">Phone: <a href="tel:+13175074966" className="text-charcoal-900 hover:underline">+1 (317) 507-4966</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
