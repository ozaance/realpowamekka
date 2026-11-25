'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { lerpRange, useScrub } from './scrub';

/**
 * CONVICTION — « la complexité devient maîtrise »
 *
 * On réutilise l'illustration existante du site plutôt que d'en générer
 * une nouvelle : elle dit déjà exactement la bonne chose. Le scroll y
 * ajoute ce qui lui manquait — un rai de lumière qui balaie le fil, de
 * l'enchevêtrement vers la ligne droite.
 */
export default function ConvictionCine() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.25'],
  });

  /* Le rai balaie l'image de gauche (le nœud) à droite (la maîtrise). */
  const sweepX = useTransform(scrollYProgress, [0.1, 0.9], ['-40%', '240%']);
  const sweepOpacity = useScrub(scrollYProgress, [0.05, 0.2, 0.8, 0.95], [0, 1, 1, 0]);

  /* L'illustration se rapproche très légèrement. */
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1]);

  /* Sur téléphone l'illustration, entière, ferait 390 px de large et ses
     légendes seraient illisibles. On la montre à 230 % et on la fait
     défiler de l'enchevêtrement vers la maîtrise : le panoramique raconte
     le même trajet que le rai de lumière. */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 759px)');
    const read = () => setNarrow(mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, []);

  /* Le panoramique suit l'illustration elle-même, et non toute la section :
     calé sur la section, il n'atteignait la partie « maîtrise » (drapeau,
     dernier jalon) qu'une fois l'illustration à moitié sortie par le haut
     de l'écran. Ici, il démarre quand l'illustration est visible aux trois
     quarts et se termine avant qu'elle ne passe sous la barre de navigation :
     la partie « maîtrise » est vue en entier. */
  const artRef = useRef<HTMLDivElement>(null);
  const geo = useRef({ art: 0, vh: 1, nav: 0 });
  useEffect(() => {
    const el = artRef.current;
    if (!el) return;
    const measure = () => {
      const nav = document.querySelector<HTMLElement>('.cn-nav');
      geo.current = { art: el.offsetHeight, vh: window.innerHeight, nav: nav?.offsetHeight ?? 0 };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const { scrollYProgress: artProgress } = useScroll({
    target: artRef,
    offset: ['start end', 'end start'],
  });
  /* Largeur du panoramique : 230 % de l'écran (cinema.css). Pour amener
     son bord droit au bord droit de l'écran : (230 - 100) / 230. */
  const PAN_END = -((230 - 100) / 230) * 100;
  const panX = useTransform(artProgress, (v) => {
    const { art, vh, nav } = geo.current;
    const total = vh + art;
    // artProgress vaut 0 quand le haut de l'illustration touche le bas de
    // l'écran, 1 quand son bas passe le haut. Début : 75 % de l'illustration
    // visible. Fin : son haut atteint le bas de la barre de navigation.
    let from = (art * 0.75) / total;
    let to = (vh - nav) / total;
    if (to <= from) {
      // Illustration plus haute que l'écran (téléphone à l'horizontale) :
      // trajet pendant que la ligne des jalons, au milieu de l'image,
      // traverse l'écran (de 80 % à 30 % de la zone sous la navigation).
      const zone = vh - nav;
      from = (vh - (nav + zone * 0.8) + art * 0.5) / total;
      to = (vh - (nav + zone * 0.3) + art * 0.5) / total;
    }
    return `${lerpRange(v, [from, to], [0, PAN_END])}%`;
  });

  return (
    <section ref={ref} className="cn-conviction">
      <div className="cn-conviction-head">
        <h2 className="cn-conviction-title">
          Nous transformons la complexité en maîtrise.
        </h2>
      </div>

      <motion.div
        ref={artRef}
        className="cn-conviction-art"
        style={{ scale: narrow ? 1 : scale }}
      >
        <motion.div className="cn-conviction-pan" style={{ x: narrow ? panX : 0 }}>
        <Image
          src="/conviction-illustration.png"
          alt="Un fil d'or emmêlé qui se déploie en une ligne droite jalonnée d'objectifs"
          width={1693}
          height={929}
          sizes="(max-width: 759px) 230vw, 100vw"
        />
        <motion.div
          className="cn-conviction-sweep"
          style={{ x: sweepX, opacity: sweepOpacity }}
          aria-hidden="true"
        />
        </motion.div>
      </motion.div>

      <p className="cn-conviction-cap">
        Un système clair, c&apos;est un système où chaque élément a une raison d&apos;être
        et où vous gardez le contrôle.
      </p>
    </section>
  );
}
