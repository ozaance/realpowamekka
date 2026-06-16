'use client';

import { useEffect } from 'react';

/**
 * Reproduces the reveal-on-load behaviour from the Claude Design export:
 * adds a `preload` class to <html> (which triggers the .rv fade/rise
 * animations defined in hikari-v2.css), then removes it once the page
 * has loaded (or after 3.4s as a fallback so it never gets stuck).
 *
 * Render this once near the top of app/layout.tsx, inside <body>.
 */
export default function RevealInit() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.documentElement.classList.add('preload');
    }

    const settle = () => document.documentElement.classList.remove('preload');
    window.addEventListener('load', () => setTimeout(settle, 2000));
    const fallback = setTimeout(settle, 3400);

    return () => clearTimeout(fallback);
  }, []);

  return null;
}
