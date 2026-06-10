import React, { useEffect } from 'react';

export default function TermsPage() {
  useEffect(() => { document.title = 'Terms & Conditions | Lady B Designs'; }, []);
  const sections = [
    { num: '01', title: 'General Information', body: 'Lady B Designs and Handcraft offers unique, handmade products. Slight variations in color, size, or design may occur — this is part of the charm of handcrafted goods.' },
    { num: '02', title: 'Orders', body: 'All orders are subject to availability and confirmation of payment. Once placed, you will receive an email confirmation. Custom orders may require additional processing time communicated before payment.' },
    { num: '03', title: 'Pricing and Payment', body: 'All prices are listed in USD. We accept Credit/Debit Cards, PayPal, and Stripe. Full payment must be received before items are shipped.' },
    { num: '04', title: 'Shipping and Delivery', body: 'We ship domestically and internationally. Delivery times vary and Lady B Designs is not responsible for lost or stolen packages once shipped.' },
    { num: '05', title: 'Returns and Refunds', body: 'Please review our Return and Refund Policy page for full details on eligibility, procedures, and conditions.' },
    { num: '06', title: 'Custom Orders', body: 'Custom or personalized items are made to order and non-refundable unless defective. Ensure all details are correct when placing a custom order.' },
    { num: '07', title: 'Intellectual Property', body: 'All content, designs, images, and products are the property of Lady B Designs and Handcraft and protected by intellectual property laws.' },
    { num: '08', title: 'Limitation of Liability', body: 'Lady B Designs and Handcraft shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or website.' },
    { num: '09', title: 'Governing Law', body: 'These terms shall be governed by the laws of the State of Indiana, United States. Disputes shall be resolved in Marion County, Indiana.' },
    { num: '10', title: 'Changes to Terms', body: 'We reserve the right to update these Terms at any time. Changes will be posted on this page with a revised effective date.' },
  ];
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-24">
      <div className="container-luxury max-w-3xl">
        <div className="mb-12"><span className="section-label block mb-3">Legal</span><h1 className="font-serif font-light text-5xl text-charcoal-900">Terms &amp; Conditions</h1><p className="text-charcoal-400 font-body text-sm mt-3">Effective Date: June 10, 2026</p></div>
        <p className="text-lg text-charcoal-600 font-body font-light leading-relaxed mb-12">Welcome to Lady B Designs and Handcraft. By accessing our website and purchasing our handmade products, you agree to be bound by the following terms.</p>
        <div className="space-y-0">
          {sections.map(s => (
            <div key={s.num} className="border-t border-charcoal-100 py-8 grid grid-cols-[3rem_1fr] gap-6">
              <span className="font-serif text-3xl font-light text-charcoal-200">{s.num}</span>
              <div><h2 className="font-serif font-light text-xl text-charcoal-900 mb-2">{s.title}</h2><p className="text-charcoal-600 font-body leading-relaxed">{s.body}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-10 border border-charcoal-200 p-6 space-y-1 font-body">
          <p className="font-medium text-charcoal-900">Lady B Designs and Handcraft</p>
          <p className="text-charcoal-600">731 Westbury West Dr, Indianapolis, IN 46224</p>
          <p className="text-charcoal-600">Email: <a href="mailto:Adebiyiblessing55@gmail.com" className="text-charcoal-900 hover:underline">Adebiyiblessing55@gmail.com</a></p>
          <p className="text-charcoal-600">Phone: <a href="tel:+13175074966" className="text-charcoal-900 hover:underline">+1 (317) 507-4966</a></p>
        </div>
      </div>
    </div>
  );
}
