'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { INTRO_ATTR, INTRO_LIFT_EVENT, INTRO_SCRIPT, introPending, liftIntro } from './intro';

/**
 * Rideau d'ouverture : la ligne d'or se trace, la marque se pose, le
 * rideau se lève. Première visite uniquement (voir intro.ts).
 *
 * - Il se lève de lui-même environ 1,9 s après l'affichage de la page.
 * - Il se passe d'un geste : bouton « Passer », clic, toucher, molette,
 *   défilement ou touche du clavier (sauf Tab, pour atteindre le bouton).
 * - Il ne bloque jamais le défilement.
 * - Si JavaScript tarde, le CSS le retire seul (voir cinema.css).
 */
export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!introPending()) {
      setDone(true);
      return;
    }

    let finished = false;
    const lift = (skipped: boolean) => {
      if (finished) return;
      finished = true;
      setDone(true);
      liftIntro(skipped);
    };
    const skip = () => lift(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' && e.key !== 'Shift') skip();
    };

    /* Levé ailleurs (bouton « Passer ») : on suit. */
    const onLifted = () => {
      finished = true;
      setDone(true);
    };
    window.addEventListener(INTRO_LIFT_EVENT, onLifted);

    /* Calé sur l'affichage de la page (les animations CSS du rideau
       démarrent au premier affichage), et non sur le démarrage de
       JavaScript : le rideau dure environ 1,9 s quel que soit le temps de
       chargement du script. */
    const timer = setTimeout(() => lift(false), Math.max(0, 1900 - performance.now()));
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchmove', skip, { passive: true });
    window.addEventListener('scroll', skip, { passive: true });
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(INTRO_LIFT_EVENT, onLifted);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
      window.removeEventListener('scroll', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  /* Une fois le fondu terminé, l'attribut n'a plus lieu d'être : un retour
     sur l'accueil sans rechargement ne doit pas rejouer l'ouverture. */
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => document.documentElement.removeAttribute(INTRO_ATTR), 900);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <div className="cn-loader" data-done={done}>
        <div className="cn-loader-inner" aria-hidden="true">
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
        <button type="button" className="cn-loader-skip" onClick={() => liftIntro(true)}>
          Passer l&apos;introduction
        </button>
      </div>
    </>
  );
}
