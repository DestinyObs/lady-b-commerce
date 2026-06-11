import React, { useEffect } from 'react';
import { Providers } from './providers';
import { AppRouter } from './router';
import { getOrCreateSessionId } from '../lib/utils';
import { DevPanel } from '../components/shared/DevPanel';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { BackToTop } from '../components/shared/BackToTop';
import { CookieConsent } from '../components/shared/CookieConsent';
import { NewsletterPopup } from '../components/shared/NewsletterPopup';

export default function App() {
  useEffect(() => {
    getOrCreateSessionId();
  }, []);

  return (
    <ErrorBoundary>
      <Providers>
        <AppRouter />
        <BackToTop />
        <CookieConsent />
        <NewsletterPopup />
        {import.meta.env.DEV && <DevPanel />}
      </Providers>
    </ErrorBoundary>
  );
}
