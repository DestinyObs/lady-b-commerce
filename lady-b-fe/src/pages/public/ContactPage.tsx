import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] } }),
};

export default function ContactPage() {
  useEffect(() => { document.title = 'Contact Us | Lady B Designs & Handcraft'; }, []);

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-charcoal-900">
        <div className="container-luxury text-center">
          <motion.p
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-gold-champagne text-xs tracking-luxury uppercase font-body mb-4"
          >
            Lady B Designs & Handcraft
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="font-serif font-light text-5xl md:text-7xl text-ivory mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={FADE_UP}
            className="text-charcoal-300 font-body text-lg max-w-xl mx-auto leading-relaxed"
          >
            Whether you have a question, a bespoke commission in mind, or simply wish to connect — we'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">

            {/* Left — Contact details */}
            <div className="lg:col-span-2">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
                <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-8">Contact Information</p>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 border border-charcoal-200 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-charcoal-600" />
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-luxury uppercase text-charcoal-400 mb-1">Atelier</p>
                      <p className="font-body text-charcoal-800 leading-relaxed">
                        731 Westbury West Dr<br />
                        Indianapolis, IN 46224<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 border border-charcoal-200 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-charcoal-600" />
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-luxury uppercase text-charcoal-400 mb-1">Phone</p>
                      <a href="tel:+13175074966" className="font-body text-charcoal-800 hover:text-charcoal-600 transition-colors">
                        +1 (317) 507-4966
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 border border-charcoal-200 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-charcoal-600" />
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-luxury uppercase text-charcoal-400 mb-1">Email</p>
                      <a href="mailto:Adebiyiblessing55@gmail.com" className="font-body text-charcoal-800 hover:text-charcoal-600 transition-colors break-all">
                        Adebiyiblessing55@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 border border-charcoal-200 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-charcoal-600" />
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-luxury uppercase text-charcoal-400 mb-1">Hours</p>
                      <div className="font-body text-charcoal-800 leading-relaxed space-y-0.5">
                        <p>Monday – Friday: 9am – 6pm EST</p>
                        <p>Saturday: 10am – 4pm EST</p>
                        <p>Sunday: By appointment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="mt-12 pt-8 border-t border-charcoal-100">
                  <p className="font-body text-xs tracking-luxury uppercase text-charcoal-400 mb-4">Bespoke Commissions</p>
                  <p className="text-charcoal-600 font-body text-sm leading-relaxed">
                    For custom orders and bespoke pieces, please include your vision, preferred timeline, and budget in your message. All commissions begin with a personal consultation.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right — Contact form */}
            <div className="lg:col-span-3">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={FADE_UP}>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 border border-charcoal-200 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-8 w-8 text-charcoal-700" />
                    </div>
                    <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-4">Message Received</h2>
                    <p className="text-charcoal-500 font-body max-w-sm leading-relaxed">
                      Thank you for reaching out. We'll respond within 24–48 business hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="mt-8 text-xs tracking-luxury uppercase font-body text-charcoal-500 hover:text-charcoal-900 transition-colors border-b border-charcoal-300 pb-0.5"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Full Name *</label>
                        <input
                          id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                          className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Email Address *</label>
                        <input
                          id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                          className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Phone (optional)</label>
                        <input
                          id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                          className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors placeholder:text-charcoal-300"
                          placeholder="+1 (000) 000-0000"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Subject *</label>
                        <select
                          id="subject" name="subject" required value={form.subject} onChange={handleChange}
                          className="w-full bg-ivory border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors appearance-none"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Enquiry</option>
                          <option value="bespoke">Bespoke Commission</option>
                          <option value="order">Order Support</option>
                          <option value="wholesale">Wholesale Enquiry</option>
                          <option value="press">Press & Media</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs tracking-luxury uppercase font-body text-charcoal-500 mb-2">Message *</label>
                      <textarea
                        id="message" name="message" required rows={7} value={form.message} onChange={handleChange}
                        className="w-full bg-transparent border border-charcoal-200 px-4 py-3 font-body text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-600 transition-colors resize-none placeholder:text-charcoal-300"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="group flex items-center gap-3 bg-charcoal-900 text-ivory px-10 py-4 font-body text-xs tracking-luxury uppercase hover:bg-charcoal-800 transition-colors duration-300 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border border-ivory/40 border-t-ivory rounded-full animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                      )}
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location visual */}
      <section className="bg-charcoal-50 py-16">
        <div className="container-luxury text-center">
          <p className="text-charcoal-400 text-xs tracking-luxury uppercase font-body mb-3">Indianapolis Atelier</p>
          <p className="font-serif font-light text-2xl text-charcoal-900 mb-2">731 Westbury West Dr, Indianapolis, IN 46224</p>
          <p className="text-charcoal-500 font-body text-sm">By appointment for in-person consultations</p>
        </div>
      </section>
    </div>
  );
}
