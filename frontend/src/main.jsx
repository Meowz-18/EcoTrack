import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './firebase.js'
import { reportWebVitals } from './utils/performance.js'

// Add resource hints for performance
const addResourceHint = (rel, href, as) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.as = as;
  document.head.appendChild(link);
};
addResourceHint('preconnect', 'https://fonts.googleapis.com');
addResourceHint('preconnect', 'https://fonts.gstatic.com');
addResourceHint('preconnect', 'https://cdn.jsdelivr.net');
addResourceHint('dns-prefetch', 'https://images.unsplash.com');

initAnalytics();

// Report Core Web Vitals for performance monitoring
reportWebVitals(({ name, value }) => {
  if (import.meta.env.DEV) {
    // In development: log metrics to console for debugging
    console.debug(`[WebVitals] ${name}: ${value}`);
  }
  // In production: metrics could be forwarded to an analytics endpoint
  // e.g. sendToAnalytics({ name, value });
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
