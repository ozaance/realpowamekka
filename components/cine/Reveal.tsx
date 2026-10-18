'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Révélation simple à l'entrée dans le viewport.
 * Utilisé pour les sections qui n'ont pas besoin d'une progression
 * continue — un IntersectionObserver suffit et coûte moins cher
 * qu'un abonnement au scroll.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: 'div' | 'section' | 'li' | 'p' | 'h2' | 'h3';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error — le ref polymorphe reste un HTMLElement quel que soit le tag
    <Tag ref={ref} className={`cn-rise ${className}`.trim()} data-in={shown} data-d={delay}>
      {children}
    </Tag>
  );
}
