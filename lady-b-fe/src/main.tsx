import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';
import { getOrCreateSessionId } from './lib/utils';

// Ensure a stable session ID exists before any API calls so the backend
// can attribute guest carts via X-Session-Id.
getOrCreateSessionId();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
