import React, { useEffect } from 'react';
import { Providers } from './providers';
import { AppRouter } from './router';
import { getOrCreateSessionId } from '../lib/utils';
import { DevPanel } from '../components/shared/DevPanel';

export default function App() {
  useEffect(() => {
    getOrCreateSessionId();
  }, []);

  return (
    <Providers>
      <AppRouter />
      {import.meta.env.DEV && <DevPanel />}
    </Providers>
  );
}
