'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrub } from './scrub';

/**
 * MANIFESTE
 *
 * Posé derrière le héros (marge négative d'un écran côté CSS), il se
 * découvre à mesure que la scène du tableau s'efface. Les mots s'allument
 * un à un, indexés sur la progression du scroll.
 */

const LINE = 'Nous concevons des systèmes digitaux qui aident les entreprises à grandir avec plus de clarté, d’efficacité et de contrôle.';

const HIGHLIGHT = new Set(['clarté,', 'd’efficacité', 'contrôle.']);

const SECTORS = ['PME', 'Construction', 'Industrie', 'Services', 'Dirigeants & fondateurs'];

export default function Manifeste() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center 0.4'],
  });

  const words = LINE.split(' ');

  return (
    <section ref={ref} className="cn-manifeste" id="manifeste">
      <div className="cn-manifeste-inner">
        <div className="cn-manifeste-label">Ce que nous faisons</div>
        <h2 className="cn-manifeste-text">
          {words.map((word, i) => (
            <Word
              key={`${word}-${i}`}
              progress={scrollYProgress}
              index={i}
              total={words.length}
              highlight={HIGHLIGHT.has(word)}
            >
              {word}
            </Word>
          ))}
        </h2>
        <div className="cn-manifeste-foot sectors">
          {SECTORS.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  progress,
  index,
  total,
  highlight,
  children,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
  total: number;
  highlight: boolean;
  children: string;
}) {
  /* Chaque mot occupe une tranche de la progression, avec un léger
     chevauchement pour que la phrase se lise comme une vague. */
  const start = index / total;
  const end = Math.min(1, start + 1.8 / total);

  const opacity = useScrub(progress, [start, end], [0.14, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);

  return (
    <>
      <motion.span className="cn-word" style={{ opacity, y }}>
        {highlight ? <span className="em">{children}</span> : children}
      </motion.span>{' '}
    </>
  );
}
