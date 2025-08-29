import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { SpeedInsights } from '@vercel/speed-insights/react'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
    <SpeedInsights />
  </React.StrictMode>
);
