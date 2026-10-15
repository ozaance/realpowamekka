'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useScrub } from './scrub';

/**
 * HÉROS — « Le Tableau »
 *
 * Le récit se joue sur une piste de scroll de 420svh dont la scène est
 * collée (sticky) en haut. La progression `p` ∈ [0,1] pilote tout :
 *
 *   p = 0      le tableau est un cadre 16/9 posé au centre de l'écran
 *   p = FULL   le cadre remplit 100 % de l'écran, la vidéo est à 2 s
 *   p = 0.80   la vidéo a fini sa traversée, le texte est épinglé
 *   p = 1      la scène s'efface et découvre le manifeste posé derrière
 *
 * La vidéo n'est jamais lue : elle est « scrubée », sa position temporelle
 * est une fonction du scroll. Sur mobile le scrub est abandonné (iOS ne
 * cherche pas assez vite dans un mp4) et seule l'image fixe est zoomée.
 */

const FULL = 0.3; // progression à laquelle le cadre remplit l'écran
const VIDEO_AT_FULL = 2; // secondes de vidéo écoulées à cet instant
const VIDEO_END = 0.8; // progression à laquelle la vidéo s'arrête

type Size = { w: number; h: number };

/* Le texte du héros est rendu à deux endroits — version scrollée et
   version statique pour « mouvement réduit ». Une seule source. */
const HERO_CONTENT = (
  <>
    <span className="cn-hero-eyebrow">Agence IA &amp; systèmes digitaux</span>
    <h1 className="cn-hero-title">
      Bâtir des entreprises
      <br />
      plus claires.
    </h1>
    <p className="cn-hero-lede">
      Powamekka prend en charge la gestion du quotidien — opérations, données,
      automatisations — pour que vous puissiez diriger.
    </p>
    <div className="cn-hero-actions">
      <a
        className="cn-btn-light"
        href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise."
        target="_blank"
        rel="noopener noreferrer"
      >
        Demander un audit <span className="ar">→</span>
      </a>
      <a className="cn-btn-outline" href="#disciplines">
        Notre approche
      </a>
    </div>
    <div className="cn-hero-proof">
      <div>
        <div className="n">Visibilité</div>
        <div className="t">Une présence digitale qui inspire confiance.</div>
      </div>
      <div>
        <div className="n">Efficacité</div>
        <div className="t">Des opérations fluides, automatisées, mesurées.</div>
      </div>
      <div>
        <div className="n">Croissance</div>
        <div className="t">Des décisions plus rapides, mieux informées.</div>
      </div>
    </div>
  </>
);


export default function HeroTableau() {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  const [size, setSize] = useState<Size>({ w: 1440, h: 900 });
  const [scrubbable, setScrubbable] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [armed, setArmed] = useState(false);
  const reduced = useReducedMotion();

  /* Dimensions de la fenêtre : le cadre est animé en pixels pour que sa
     transformation 16/9 → format de l'écran soit exacte. */
  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  /* Le scrub vidéo est réservé aux écrans larges avec pointeur fin. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px) and (pointer: fine)');
    const read = () => setScrubbable(mq.matches && !reduced);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, [reduced]);

  /* La vidéo pèse quelques mégaoctets : on ne la monte qu'une fois le
     rideau levé, ou dès le premier geste de scroll si l'on est plus
     pressé que lui. Le premier rendu n'a ainsi que l'image à charger. */
  useEffect(() => {
    if (!scrubbable) return;

    const arm = () => setArmed(true);
    const t = setTimeout(arm, 2600);
    window.addEventListener('scroll', arm, { once: true, passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', arm);
    };
  }, [scrubbable]);

  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  /* Sur petit écran le tableau doit rester lisible : il occupe presque
     toute la largeur plutôt que les 62 % du bureau. */
  const narrow = size.w < 760;
  const frameW = narrow ? size.w * 0.86 : Math.min(size.w * 0.62, 980);
  const frameH = frameW * (9 / 16);

  const framePad = Math.max(9, frameW * 0.03);

  const width = useTransform(p, [0, FULL], [frameW, size.w], { clamp: true });
  const height = useTransform(p, [0, FULL], [frameH, size.h], { clamp: true });
  /* La moulure s'amincit puis disparaît : on traverse le cadre. */
  const padding = useTransform(p, [0, FULL * 0.92], [framePad, 0], { clamp: true });

  /* Après le plein écran, la poussée continue très légèrement. */
  const mediaScale = useTransform(p, [FULL, 1], [1, 1.14], { clamp: true });

  /* Légende sous le cadre : disparaît dès qu'on entre dans le tableau. */
  const captionOpacity = useScrub(p, [0, 0.1], [1, 0]);

  /* Voile d'encre : absent tant qu'on regarde le tableau de loin. */
  const veilOpacity = useScrub(p, [FULL * 0.5, FULL], [0, 1]);

  /* Contenu du héros : entre une fois l'écran rempli, sort à la fin. */
  const contentOpacity = useScrub(p, [FULL, FULL + 0.1, 0.78, 0.9], [0, 1, 1, 0]);
  const contentY = useTransform(p, [FULL, FULL + 0.12], [34, 0], { clamp: true });

  /* Toute la scène s'efface pour découvrir le manifeste. Une fois
     transparente elle doit aussi cesser d'intercepter les clics, sans
     quoi elle resterait posée par-dessus le texte révélé dessous. */
  const stageOpacity = useScrub(p, [0.86, 1], [1, 0]);
  const stagePointer = useTransform(p, (v) => (v > 0.97 ? 'none' : 'auto'));

  /* Position de la vidéo, pilotée par le scroll et appliquée en rAF. */
  useMotionValueEvent(p, 'change', (v) => {
    const video = videoRef.current;
    if (!video || !scrubbable || !videoReady) return;

    const duration = video.duration;
    if (!Number.isFinite(duration) || duration === 0) return;

    const t =
      v <= FULL
        ? (v / FULL) * VIDEO_AT_FULL
        : VIDEO_AT_FULL +
          ((Math.min(v, VIDEO_END) - FULL) / (VIDEO_END - FULL)) * (duration - VIDEO_AT_FULL);

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      try {
        video.currentTime = Math.max(0, Math.min(t, duration - 0.05));
      } catch {
        /* seek refusé pendant un chargement : la frame suivante corrigera */
      }
    });
  });

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Signale à la navigation qu'elle se trouve au-dessus du tableau sombre.
     Sans récit scrollé la scène ne passe jamais en plein écran : la nav
     doit rester en encre sur papier, sinon elle devient illisible. */
  useMotionValueEvent(p, 'change', (v) => {
    const over = !reduced && v > FULL * 0.72 && v < 0.9;
    window.dispatchEvent(new CustomEvent('cn:overart', { detail: over }));
  });

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent('cn:overart', { detail: false }));
    };
  }, []);

  /* Mouvement réduit : plus de récit scrollé. Le tableau est posé en
     plein écran, le contenu est lisible immédiatement, et la page
     redevient un empilement de sections classiques. */
  if (reduced) {
    return (
      <section className="cn-hero cn-hero-static">
        <div className="cn-frame-inner">
          <div className="cn-frame-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/art/hero-atelier.jpg"
              alt="Atelier d'architecte baigné de lumière, un fil d'or traverse les plans posés sur la table"
              width={2560}
              height={1440}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="cn-frame-veil" />
          <div className="cn-hero-content">{HERO_CONTENT}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      className="cn-hero"
      style={{ height: narrow ? '300svh' : '420svh' }}
    >
      <motion.div
        className="cn-hero-stage"
        style={{ opacity: stageOpacity, pointerEvents: stagePointer }}
      >
        <motion.div className="cn-frame" style={{ width, height, padding }}>
          <div className="cn-frame-inner">
            <motion.div className="cn-frame-media" style={{ scale: mediaScale }}>
              {/* Image fixe : premier rendu, poster de la vidéo, et seul
                  visuel sur mobile où le scrub n'est pas fiable. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/art/hero-atelier.jpg"
                alt="Atelier d'architecte baigné de lumière, un fil d'or traverse les plans posés sur la table"
                width={2560}
                height={1440}
                fetchPriority="high"
                decoding="async"
              />
              {scrubbable && armed && (
                <video
                  ref={videoRef}
                  className="cn-frame-media cn-frame-video"
                  data-ready={videoReady}
                  src="/art/hero-atelier.mp4"
                  poster="/art/hero-atelier.jpg"
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  onLoadedData={() => setVideoReady(true)}
                />
              )}
            </motion.div>

            <motion.div className="cn-frame-veil" style={{ opacity: veilOpacity }} />
          </div>
        </motion.div>

        {/* Légende de musée, avant l'entrée dans le tableau */}
        <motion.div className="cn-hero-caption" style={{ opacity: captionOpacity }}>
          <span className="l">Powamekka — Atelier des systèmes</span>
          <span className="cn-scroll-hint" aria-hidden="true">
            <i />
          </span>
        </motion.div>

        {/* Contenu épinglé, une fois dans le tableau */}
        <motion.div
          className="cn-hero-content"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {HERO_CONTENT}
        </motion.div>
      </motion.div>
    </section>
  );
}
