import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Package, Recycle, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

const PILLARS = [
  {
    icon: Heart,
    title: 'Handcrafted with Intention',
    body: 'Every Lady B piece is made entirely by hand in small batches, ensuring no piece is ever mass-produced. Handcraft preserves traditional skills, reduces industrial waste, and means each piece receives the time and care it deserves.',
  },
  {
    icon: Leaf,
    title: 'Thoughtful Material Sourcing',
    body: 'We source our seed beads, glass beads, and threading materials from suppliers who share our values around ethical trade. We prioritise partners who provide fair wages, safe working conditions, and transparent supply chains.',
  },
  {
    icon: Package,
    title: 'Minimal, Recyclable Packaging',
    body: 'Our packaging is plastic-free where possible. All boxes, tissue paper, and ribbons are FSC-certified or recycled. We encourage customers to repurpose our packaging — many have found beautiful second lives for our gift boxes.',
  },
  {
    icon: Recycle,
    title: 'Made to Last',
    body: 'Sustainability is not just about materials — it is about longevity. We design and build our pieces to be heirlooms: items passed down rather than discarded. We also offer a repair and restore service for any Lady B piece.',
  },
];

const COMMITMENTS = [
  'All fabrics and linings sourced from ethical suppliers',
  'No synthetic dyes on any fabric component',
  'Packaging is 90%+ recycled or FSC-certified material',
  'Zero single-use plastic in production or shipping',
  'Repair service offered for lifetime of every piece',
  'Artisan wages above living wage in all supply chain partners',
  'Annual sustainability audit of all supply chain partners',
  'Carbon offset programme for all international shipments',
];

export default function SustainabilityPage() {
  useEffect(() => { document.title = 'Sustainability | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <div className="pt-36 md:pt-44 pb-20 bg-charcoal-50">
        <div className="container-luxury max-w-3xl">
          <Breadcrumbs items={[{ label: 'Sustainability', href: '/sustainability' }]} showHome />
          <div className="mt-6">
            <motion.p className="section-label mb-3" variants={FADE_UP} initial="hidden" animate="visible" custom={0}>
              Our Values
            </motion.p>
            <motion.h1
              className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-6 leading-tight"
              variants={FADE_UP} initial="hidden" animate="visible" custom={1}
            >
              Crafted consciously.<br />Designed to endure.
            </motion.h1>
            <motion.p
              className="text-charcoal-500 font-body leading-relaxed text-base md:text-lg"
              variants={FADE_UP} initial="hidden" animate="visible" custom={2}
            >
              At Lady B Designs, we believe that true luxury is inseparable from responsibility. From the artisans who create our pieces to the packaging they arrive in, every decision is made with care for people and planet.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <section className="py-20 md:py-28">
        <div className="container-luxury max-w-3xl">
          <div className="space-y-12">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                className="flex gap-6"
                variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              >
                <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon className="h-5 w-5 text-ivory" />
                </div>
                <div>
                  <h2 className="font-body font-semibold text-charcoal-900 mb-2">{title}</h2>
                  <p className="text-charcoal-600 font-body leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16 md:py-24 bg-charcoal-900 text-ivory">
        <div className="container-luxury max-w-3xl">
          <p className="section-label text-gold-champagne mb-4">Our Commitments</p>
          <h2 className="font-serif font-light text-3xl text-ivory mb-8">What we stand behind</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMITMENTS.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm font-body text-charcoal-300">
                <Leaf className="h-4 w-4 text-emerald-luxury flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan section */}
      <section className="py-20 md:py-28">
        <div className="container-luxury max-w-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-label mb-3">The Human Element</p>
              <h2 className="font-serif font-light text-3xl text-charcoal-900 mb-4">
                Behind every bead, a skilled hand
              </h2>
              <p className="text-charcoal-600 font-body leading-relaxed mb-4">
                Our small team of specialist artisans has been creating beadwork for generations. We invest in training, fair compensation, and safe working environments — because we believe the people who make beautiful things deserve beautiful lives.
              </p>
              <p className="text-charcoal-600 font-body leading-relaxed mb-6">
                We do not outsource production to factories. Every piece — from the most accessible necklace to the most elaborate bespoke commission — passes through the same hands that have been perfecting this craft for decades.
              </p>
              <Link to="/craftsmanship" className="flex items-center gap-2 text-xs tracking-luxury uppercase font-body text-charcoal-900 hover:text-charcoal-600 transition-colors border-b border-charcoal-900 pb-0.5 w-fit">
                Learn about our craft <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-charcoal-100 aspect-square overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Repair programme */}
      <section className="py-16 bg-charcoal-50">
        <div className="container-luxury max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-2">Repair &amp; Restore</h2>
              <p className="text-charcoal-500 font-body text-sm leading-relaxed max-w-lg">
                Every Lady B piece comes with a lifetime repair commitment. If a clasp fails, beads loosen, or a lining wears, we will restore it — because our pieces should last as long as you love them.
              </p>
            </div>
            <Link to="/contact" className="btn-primary inline-flex gap-2 flex-shrink-0 text-xs">
              Start a repair <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
