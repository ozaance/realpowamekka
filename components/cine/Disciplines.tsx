'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useScrub } from './scrub';

/**
 * LES CINQ DISCIPLINES
 *
 * Un seul cadre, posé au centre, qui s'ouvre une fois jusqu'au plein
 * écran (même geste que le héros, pour que le site parle une seule
 * langue). Les cinq tableaux se succèdent ensuite à l'intérieur en
 * fondu, chacun avec son texte.
 */

const ZOOM = 0.12; // part du scroll consacrée à l'ouverture du cadre

const DISCIPLINES = [
  {
    id: 'audit',
    no: '01',
    title: 'Audits stratégiques',
    lede: 'Comprendre vos opérations avant de proposer quoi que ce soit, et nommer les leviers qui comptent vraiment.',
    href: '/services/audit',
    art: '/art/discipline-audit.jpg',
    alt: "Table d'atelier couverte de relevés et d'instruments de mesure sous la lumière d'une fenêtre",
  },
  {
    id: 'systemes',
    no: '02',
    title: 'Systèmes digitaux',
    lede: 'Architecturer la base : outils, données et équipes enfin reliés par une même structure.',
    href: '/services/systemes',
    art: '/art/discipline-systemes.jpg',
    alt: 'Maquette d’architecture en plâtre posée sur un plan, reliée par des fils d’or',
  },
  {
    id: 'ia',
    no: '03',
    title: 'IA & automatisation',
    lede: 'Automatiser le répétitif, augmenter les décisions, garder la main sur ce qui est délégué.',
    href: '/services/ia',
    art: '/art/discipline-ia.jpg',
    alt: 'Mécanisme d’horlogerie doré en mouvement dans un atelier baigné de lumière',
  },
  {
    id: 'sites',
    no: '04',
    title: 'Sites premium',
    lede: 'Donner au système une vitrine crédible et durable, à la hauteur de ce que vous construisez.',
    href: '/services/sites',
    art: '/art/discipline-sites.jpg',
    alt: 'Grande vitrine d’atelier ouverte sur la lumière, plans affichés sur le mur',
  },
  {
    id: 'formation',
    no: '05',
    title: 'Formation & adoption',
    lede: 'Ancrer la maîtrise durablement : vos équipes tiennent le système après notre départ.',
    href: '/services/formation',
    art: '/art/discipline-formation.jpg',
    alt: 'Maître transmettant un instrument de précision à un apprenti dans un atelier',
  },
];

export default function Disciplines() {
  const trackRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 900 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const narrow = size.w < 760;
  const frameW = narrow ? size.w * 0.86 : Math.min(size.w * 0.62, 980);
  const frameH = frameW * (9 / 16);
  const framePad = Math.max(9, frameW * 0.03);

  const width = useTransform(p, [0, ZOOM], [frameW, size.w], { clamp: true });
  const height = useTransform(p, [0, ZOOM], [frameH, size.h], { clamp: true });
  const padding = useTransform(p, [0, ZOOM * 0.92], [framePad, 0], { clamp: true });
  const indexOpacity = useScrub(p, [ZOOM * 0.7, ZOOM, 0.97, 1], [0, 1, 1, 0]);

  const n = DISCIPLINES.length;
  const span = (1 - ZOOM) / n;

  useMotionValueEvent(p, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor((v - ZOOM) / span)));
    setActive(i);
  });

  return (
    <section
      ref={trackRef}
      className="cn-gallery"
      id="disciplines"
      style={{ height: `${narrow ? n * 70 + 30 : n * 90 + 40}svh` }}
      aria-label="Nos cinq disciplines"
    >
      <div className="cn-gallery-stage">
        <motion.div className="cn-slide-frame" style={{ width, height, padding }}>
          <div className="cn-slide-canvas">
            {DISCIPLINES.map((d, i) => (
              <Slide key={d.id} data={d} index={i} progress={p} span={span} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="cn-gallery-index"
          style={{ opacity: indexOpacity }}
          aria-hidden="true"
        >
          {DISCIPLINES.map((d, i) => (
            <span key={d.id} data-on={i === active}>
              {d.title}
              <i />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Slide({
  data,
  index,
  progress,
  span,
}: {
  data: (typeof DISCIPLINES)[number];
  index: number;
  progress: MotionValue<number>;
  span: number;
}) {
  const start = ZOOM + index * span;
  const end = start + span;
  const fade = span * 0.22;

  /* Le premier tableau est déjà là pendant l'ouverture du cadre ;
     les suivants arrivent en fondu. */
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, end - fade, end]
      : [start - fade, start, end - fade, end],
    index === 0 ? [1, 1, 0] : [0, 1, 1, index === DISCIPLINES.length - 1 ? 1 : 0],
  );

  /* Le texte change plus vite que l'image : deux titres lisibles en
     même temps se brouillent, alors que deux images en fondu non. */
  const isLast = index === DISCIPLINES.length - 1;
  const textOpacity = useScrub(
    progress,
    index === 0
      ? [0, end - fade, end - fade * 0.6]
      : isLast
        ? [start - fade * 0.4, start, 1]
        : [start - fade * 0.4, start, end - fade, end - fade * 0.6],
    index === 0 ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );

  /* Chaque tableau respire légèrement pendant sa traversée. */
  const scale = useTransform(progress, [start - fade, end], [1.08, 1], { clamp: true });

  return (
    <motion.div className="cn-slide" style={{ opacity }}>
      <motion.div style={{ scale, position: 'absolute', inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.art} alt={data.alt} width={2560} height={1440} loading="lazy" decoding="async" />
      </motion.div>
      <div className="cn-slide-veil" />
      <motion.div className="cn-slide-body" style={{ opacity: textOpacity }}>
        <div className="cn-slide-no">
          {data.no} — Discipline
        </div>
        <h3 className="cn-slide-title">{data.title}</h3>
        <p className="cn-slide-lede">{data.lede}</p>
        <Link className="cn-slide-link" href={data.href}>
          Voir la discipline <span aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
