import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// EMERGENCY SERVICE WORKER CLEANUP
// execute with a delay to ensure document is valid/active
const cleanup = () => {
  setTimeout(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          // Silently unregister
          await registration.unregister().catch(() => {});
        }
      } catch (error) {
        // Silently ignore InvalidStateError and other context errors
        // These are common during HMR/reloads and are benign
      }
    }

    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        for (const key of keys) {
          // Silently delete
          await caches.delete(key).catch(() => {});
        }
      } catch (error) {
        // Silently ignore cache errors
      }
    }
  }, 1000); // 1 second delay ensures document state is valid
};

if (document.readyState === 'complete') {
  cleanup();
} else {
  window.addEventListener('load', cleanup);
}