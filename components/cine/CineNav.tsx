'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Navigation du récit.
 *
 * Deux états indépendants :
 *  - `solid`    : on a quitté le haut de page, la barre se densifie.
 *  - `overArt`  : le tableau occupe tout l'écran, la barre passe en clair.
 *                 L'information vient du héros via l'évènement `cn:overart`,
 *                 ce qui évite de faire passer toute la page en client.
 */
export default function CineNav() {
  const [solid, setSolid] = useState(false);
  const [overArt, setOverArt] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onArt = (e: Event) => setOverArt(Boolean((e as CustomEvent).detail));
    window.addEventListener('cn:overart', onArt);
    return () => window.removeEventListener('cn:overart', onArt);
  }, []);

  return (
    <nav className="cn-nav" data-solid={solid && !overArt} data-over-art={overArt}>
      <Link className="cn-nav-brand" href="/">
        <Image
          className="cn-nav-mark"
          src="/logo-mark-ink.png"
          alt="POWAMEKKA"
          width={24}
          height={26}
          priority
        />
        <span className="cn-nav-wm">POWAMEKKA</span>
      </Link>

      <div className="cn-nav-links">
        <a className="cn-nav-link" href="/#manifeste">
          Manifeste
        </a>
        <a className="cn-nav-link" href="/#disciplines">
          Disciplines
        </a>
        <a className="cn-nav-link" href="/#methode">
          Méthode
        </a>
        <Link className="cn-nav-link" href="/offres">
          Offres
        </Link>
        <Link className="cn-nav-link" href="/blog">
          Journal
        </Link>
      </div>

      <a
        className="cn-nav-cta"
        href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise."
        target="_blank"
        rel="noopener noreferrer"
      >
        Demander un audit
      </a>
    </nav>
  );
}
