import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Keyboard, Monitor, MessageCircle } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 1, 0.5, 1] } }),
};

const FEATURES = [
  {
    icon: Eye,
    title: 'Visual Accessibility',
    items: [
      'Sufficient colour contrast ratios meeting WCAG 2.1 AA standards',
      'Text resizable up to 200% without loss of content or functionality',
      'Non-text content has meaningful text alternatives',
      'No reliance on colour alone to convey information',
    ],
  },
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    items: [
      'All functionality accessible via keyboard alone',
      'Visible focus indicators on all interactive elements',
      'Logical tab order following the visual layout',
      'Skip-to-content link at the top of each page',
    ],
  },
  {
    icon: Monitor,
    title: 'Screen Reader Support',
    items: [
      'Semantic HTML5 elements throughout',
      'ARIA labels and roles where appropriate',
      'Dynamic content changes announced to assistive technologies',
      'Form inputs have associated, descriptive labels',
    ],
  },
  {
    icon: MessageCircle,
    title: 'Content Accessibility',
    items: [
      'Plain language used throughout',
      'Decorative images marked as presentational',
      'Product images have meaningful alternative text',
      'Error messages are descriptive and suggest corrections',
    ],
  },
];

export default function AccessibilityPage() {
  useEffect(() => { document.title = 'Accessibility | Lady B Designs'; }, []);

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury max-w-3xl">
        <Breadcrumbs items={[{ label: 'Accessibility', href: '/accessibility' }]} showHome />
        <div className="mt-6 mb-12">
          <motion.p className="section-label mb-3" variants={FADE_UP} initial="hidden" animate="visible" custom={0}>
            Legal
          </motion.p>
          <motion.h1
            className="font-serif font-light text-4xl md:text-5xl text-charcoal-900 mb-6"
            variants={FADE_UP} initial="hidden" animate="visible" custom={1}
          >
            Accessibility Statement
          </motion.h1>
          <motion.p className="text-charcoal-500 font-body leading-relaxed" variants={FADE_UP} initial="hidden" animate="visible" custom={2}>
            Lady B Designs is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
          </motion.p>
        </div>

        <div className="prose prose-charcoal max-w-none space-y-10">

          <div>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-3">Our Commitment</h2>
            <p className="text-charcoal-600 font-body leading-relaxed">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines help make web content more accessible to people with disabilities, including those with visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-6">Accessibility Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map(({ icon: Icon, title, items }) => (
                <div key={title} className="bg-charcoal-50 p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 bg-charcoal-900 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-ivory" />
                    </div>
                    <h3 className="font-body font-semibold text-charcoal-900 text-sm">{title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="text-xs font-body text-charcoal-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-gold-champagne rounded-full mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-3">Known Limitations</h2>
            <p className="text-charcoal-600 font-body leading-relaxed">
              While we strive to adhere to WCAG 2.1 AA standards, some older user-generated content and third-party embedded content (such as payment widgets) may not fully meet all criteria. We are working to address these limitations in ongoing development cycles.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-3">Assistive Technologies Tested</h2>
            <div className="text-charcoal-600 font-body space-y-1 text-sm">
              {[
                'NVDA with Chrome on Windows',
                'VoiceOver with Safari on macOS',
                'VoiceOver with Safari on iOS',
                'TalkBack with Chrome on Android',
              ].map((tech) => (
                <p key={tech} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-charcoal-400 rounded-full flex-shrink-0" />
                  {tech}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-3">Feedback & Contact</h2>
            <p className="text-charcoal-600 font-body leading-relaxed mb-3">
              We welcome feedback on the accessibility of ladybdesigns.com. If you encounter barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="bg-charcoal-50 p-5 text-sm font-body text-charcoal-700 space-y-1.5">
              <p><strong>Email:</strong> <a href="mailto:hello@ladybdesigns.com" className="text-charcoal-900 border-b border-charcoal-300">hello@ladybdesigns.com</a></p>
              <p><strong>Response time:</strong> We aim to respond within 2 business days.</p>
            </div>
          </div>

          <div>
            <h2 className="font-serif font-light text-2xl text-charcoal-900 mb-3">Enforcement Procedure</h2>
            <p className="text-charcoal-600 font-body leading-relaxed text-sm">
              If you are not satisfied with our response, you can contact the <a href="https://www.equalityhumanrights.com/en/contact-us" target="_blank" rel="noopener noreferrer" className="border-b border-charcoal-300">Equality and Human Rights Commission (EHRC)</a> if you are in the UK, or the relevant accessibility enforcement body in your jurisdiction.
            </p>
          </div>

          <p className="text-xs text-charcoal-400 font-body border-t border-charcoal-100 pt-6">
            This statement was last reviewed on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        </div>
      </div>
    </div>
  );
}
