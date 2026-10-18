'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

/**
 * MÉTHODE
 *
 * Quatre étapes reliées par une ligne d'or qui se trace au scroll ;
 * chaque jalon s'allume quand la ligne l'atteint.
 */

const STEPS = [
  {
    no: '01 — Audit',
    title: 'Comprendre',
    text: 'Nous analysons vos opérations, vos données et vos objectifs avant toute solution.',
  },
  {
    no: '02 — Conception',
    title: 'Architecturer',
    text: 'Nous dessinons le système juste, sans superflu, aligné sur votre réalité.',
  },
  {
    no: '03 — Déploiement',
    title: 'Mettre en œuvre',
    text: "Nous déployons l'IA et les automatisations qui créent une valeur réelle.",
  },
  {
    no: '04 — Pilotage',
    title: 'Piloter la croissance',
    text: 'Nous mesurons, ajustons et accompagnons votre montée en maîtrise.',
  },
];

export default function MethodeCine() {
  const ref = useRef<HTMLElement>(null);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.6'],
  });

  const scaleX = useTransform(scrollYProgress, [0.12, 0.9], [0, 1], { clamp: true });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = (v - 0.12) / (0.9 - 0.12);
    setReached(Math.max(0, Math.min(STEPS.length, Math.ceil(t * STEPS.length))));
  });

  return (
    <section ref={ref} className="cn-method" id="methode">
      <div className="cn-method-inner">
        <h2 className="cn-method-title">Une méthode qui inspire confiance.</h2>

        <div className="cn-method-track">
          <div className="cn-method-rule" aria-hidden="true">
            <motion.i style={{ scaleX }} />
          </div>

          <div className="cn-method-steps">
            {STEPS.map((s, i) => (
              <div className="cn-method-step" key={s.no} data-on={i < reached}>
                <div className="no">{s.no}</div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
