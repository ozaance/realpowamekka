'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrub } from './scrub';

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
  const panX = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '-56%']);

  return (
    <section ref={ref} className="cn-conviction">
      <div className="cn-conviction-head">
        <h2 className="cn-conviction-title">
          Nous transformons la complexité en maîtrise.
        </h2>
      </div>

      <motion.div className="cn-conviction-art" style={{ scale: narrow ? 1 : scale }}>
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
