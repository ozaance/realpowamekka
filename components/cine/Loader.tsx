'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Rideau d'ouverture : la ligne d'or se trace, la marque se pose, le
 * rideau se lève. Il se retire au plus tard après 2,6 s pour ne jamais
 * retenir la page si une image traîne, et marque le body pendant ce
 * temps pour empêcher un scroll qui casserait l'entrée dans le tableau.
 */
export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    /* Arrivée sur une ancre (/#methode) ou mouvement réduit : pas de
       rideau, sinon on remonterait le visiteur de force en haut. */
    if (
      window.location.hash ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDone(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const lift = () => setDone(true);
    const soonest = setTimeout(lift, 2000);
    const latest = setTimeout(lift, 2600);

    return () => {
      clearTimeout(soonest);
      clearTimeout(latest);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      document.body.style.overflow = '';
    }, 400);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <div className="cn-loader" data-done={done} aria-hidden="true">
      <div className="cn-loader-inner">
        <Image
          className="cn-loader-mark"
          src="/logo-mark-ink.png"
          alt=""
          width={38}
          height={41}
          priority
        />
        <div className="cn-loader-rule">
          <i />
        </div>
        <div className="cn-loader-word">Moins de complexité. Plus d&apos;impact.</div>
      </div>
    </div>
  );
}
