'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { lerpRange, useScrub } from './scrub';
import { ART_QUALITY, ART_SIZES } from './art';
import { INTRO_LIFT_EVENT, introPending } from './intro';

/**
 * HÉROS — « Le Tableau »
 *
 * Le message commercial est lisible dès le premier écran : le tableau est
 * posé en plein écran, voilé, avec le titre, le sous-titre et les boutons.
 *
 * Première visite (voir intro.ts) : après le rideau, le tableau part d'un
 * cadre 16/9 posé au centre et s'ouvre de lui-même jusqu'au plein écran
 * (`open` ∈ [0,1], animé dans le temps et non plus au scroll). Visites
 * suivantes : il est ouvert d'emblée.
 *
 * Ensuite, la piste de scroll (collée en haut) pilote `p` ∈ [0,1] :
 *
 *   p = 0      tableau plein écran, texte lisible, vidéo au début
 *   p = 0.80   la vidéo a fini sa traversée
 *   p = 0.78 → 0.90  le texte sort
 *   p = 1      la scène s'efface et découvre le manifeste posé derrière
 *
 * La vidéo n'est jamais lue : elle est « scrubée », sa position temporelle
 * est une fonction du scroll. Sur mobile le scrub est abandonné (iOS ne
 * cherche pas assez vite dans un mp4) et seule l'image fixe est zoomée.
 */

const VIDEO_END = 0.8; // progression à laquelle la vidéo s'arrête
const OPEN_DURATION = 1.3; // secondes, ouverture du cadre à la première visite

type Size = { w: number; h: number };

const WHATSAPP_FIRST_CALL =
  'https://wa.me/33635097980?text=Bonjour%2C%20je%20souhaite%20un%20premier%20%C3%A9change%20au%20sujet%20de%20mon%20entreprise.';

/* Le texte du héros est rendu à deux endroits (version scrollée et
   version statique pour « mouvement réduit »). Une seule source. */
const HERO_CONTENT = (
  <>
    <p className="cn-hero-eyebrow">
      <span className="svc">Conseil IA</span>
      <span className="sep" aria-hidden="true">·</span> <span className="svc">Automatisation</span>
      <span className="sep" aria-hidden="true">·</span> <span className="svc">Sites web</span>
      <span className="sep" aria-hidden="true">·</span> <span className="svc">Formation</span>
    </p>
    <h1 className="cn-hero-title">
      Moins de tâches manuelles.
      <br />
      Plus de maîtrise.
    </h1>
    <p className="cn-hero-lede">
      Nous aidons les PME, notamment dans le BTP et les services, à gagner du temps
      grâce au conseil en IA, à l&apos;automatisation et aux systèmes digitaux sur
      mesure. Nous créons également des sites web qui renforcent leur visibilité.
    </p>
    <div className="cn-hero-actions">
      <a className="cn-btn-light" href={WHATSAPP_FIRST_CALL} target="_blank" rel="noopener noreferrer">
        Demander un premier échange <span className="ar">→</span>
      </a>
      <a className="cn-btn-outline" href="/offres">
        Voir les offres et tarifs
      </a>
    </div>
    <p className="cn-hero-note">Gratuit et sans engagement, sur WhatsApp.</p>
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
    {/* Signature du tableau, en bas à droite : discrète, sous le message. */}
    <p className="cn-hero-signature" lang="en">
      Building the future of business
    </p>
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
  /* Fichier réellement chargé par l'image fixe (AVIF/WebP à la bonne taille),
     réutilisé comme poster de la vidéo : déjà en cache, aucun octet de plus. */
  const [poster, setPoster] = useState<string>();
  /* Préférence « réduire les animations » : inconnue du serveur. On la
     n'applique qu'après le montage, pour que le premier rendu soit identique
     au HTML serveur (sinon React signale une erreur d'hydratation #418). */
  const reducedPref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted && Boolean(reducedPref);

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

  /* Ouverture du cadre : 1 = plein écran (rendu serveur, visites suivantes),
     0 = cadre posé au centre (première visite, sous le rideau). */
  const open = useMotionValue(1);
  const [opened, setOpened] = useState(true);

  /* Avant le premier affichage : si le rideau de première visite est là,
     on referme le cadre dessous ; il s'ouvrira quand le rideau se lèvera. */
  useLayoutEffect(() => {
    if (!introPending()) return;
    open.set(0);
    setOpened(false);

    let anim: ReturnType<typeof animate> | undefined;
    const onLift = (e: Event) => {
      const skipped = Boolean((e as CustomEvent<{ skipped: boolean }>).detail?.skipped);
      if (skipped) {
        // Passé : le message tout de suite, sans attendre l'ouverture.
        open.set(1);
        setOpened(true);
        return;
      }
      anim = animate(open, 1, {
        duration: OPEN_DURATION,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.15,
        onComplete: () => setOpened(true),
      });
    };
    /* Un geste pendant l'ouverture : on la termine aussitôt. */
    const finish = () => {
      if (open.get() > 0 && open.get() < 1) {
        anim?.stop();
        open.set(1);
        setOpened(true);
      }
    };
    window.addEventListener(INTRO_LIFT_EVENT, onLift);
    window.addEventListener('wheel', finish, { passive: true });
    window.addEventListener('touchmove', finish, { passive: true });
    window.addEventListener('keydown', finish);
    return () => {
      anim?.stop();
      window.removeEventListener(INTRO_LIFT_EVENT, onLift);
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchmove', finish);
      window.removeEventListener('keydown', finish);
    };
  }, [open]);

  /* Sur petit écran le tableau doit rester lisible : il occupe presque
     toute la largeur plutôt que les 62 % du bureau. */
  const narrow = size.w < 760;
  const frameW = narrow ? size.w * 0.86 : Math.min(size.w * 0.62, 980);
  const frameH = frameW * (9 / 16);

  const framePad = Math.max(9, frameW * 0.03);

  const width = useTransform(open, [0, 1], [frameW, size.w], { clamp: true });
  const height = useTransform(open, [0, 1], [frameH, size.h], { clamp: true });
  /* La moulure s'amincit puis disparaît : on traverse le cadre. */
  const padding = useTransform(open, [0, 0.92], [framePad, 0], { clamp: true });

  /* Une fois dans le tableau, la poussée continue très légèrement au scroll. */
  const mediaScale = useTransform(p, [0, 1], [1, 1.14], { clamp: true });

  /* Légende sous le cadre : visible seulement pendant l'ouverture. */
  const captionOpacity = useScrub(open, [0, 0.25], [1, 0]);

  /* Voile d'encre : absent tant qu'on regarde le tableau de loin. */
  const veilOpacity = useScrub(open, [0.5, 1], [0, 1]);

  /* Contenu du héros : entre à la fin de l'ouverture, sort à la fin du scroll. */
  const contentOpacity = useTransform(
    [open, p] as const,
    ([o, v]: number[]) => lerpRange(o, [0.6, 0.92], [0, 1]) * lerpRange(v, [0.78, 0.9], [1, 0]),
  );
  const contentY = useTransform(open, [0.6, 0.95], [34, 0], { clamp: true });

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

    const t = (Math.min(v, VIDEO_END) / VIDEO_END) * duration;

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
  const emitOverArt = () => {
    const over = !reduced && open.get() > 0.72 && p.get() < 0.9;
    window.dispatchEvent(new CustomEvent('cn:overart', { detail: over }));
  };
  useMotionValueEvent(p, 'change', emitOverArt);
  useMotionValueEvent(open, 'change', emitOverArt);

  useEffect(() => {
    emitOverArt();
    return () => {
      window.dispatchEvent(new CustomEvent('cn:overart', { detail: false }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* Mouvement réduit : plus de récit scrollé. Le tableau est posé en
     plein écran, le contenu est lisible immédiatement, et la page
     redevient un empilement de sections classiques. */
  if (reduced) {
    return (
      <section className="cn-hero cn-hero-static">
        <div className="cn-frame-inner">
          <div className="cn-frame-media">
            <Image
              src="/art/hero-atelier.jpg"
              alt="Atelier d'architecte baigné de lumière, un fil d'or traverse les plans posés sur la table"
              width={2560}
              height={1429}
              sizes={ART_SIZES}
              quality={ART_QUALITY}
              loading="eager"
              fetchPriority="high"
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
      style={{ height: narrow ? '220svh' : '300svh' }}
    >
      <motion.div
        className="cn-hero-stage"
        style={{ opacity: stageOpacity, pointerEvents: stagePointer }}
      >
        {/* Ouvert : dimensions en CSS (100 %), justes dès le rendu serveur,
            avant même que la taille de l'écran soit connue en JavaScript. */}
        <motion.div
          className="cn-frame"
          style={opened ? { width: '100%', height: '100%', padding: 0 } : { width, height, padding }}
        >
          <div className="cn-frame-inner">
            <motion.div className="cn-frame-media" style={{ scale: mediaScale }}>
              {/* Image fixe : premier rendu, poster de la vidéo, et seul
                  visuel sur mobile où le scrub n'est pas fiable. */}
              <Image
                src="/art/hero-atelier.jpg"
                alt="Atelier d'architecte baigné de lumière, un fil d'or traverse les plans posés sur la table"
                width={2560}
                height={1429}
                sizes={ART_SIZES}
                quality={ART_QUALITY}
                loading="eager"
                fetchPriority="high"
                onLoad={(e) => setPoster(e.currentTarget.currentSrc)}
              />
              {scrubbable && armed && (
                <video
                  ref={videoRef}
                  className="cn-frame-media cn-frame-video"
                  data-ready={videoReady}
                  src="/art/hero-atelier.mp4"
                  poster={poster}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  onLoadedData={() => setVideoReady(true)}
                />
              )}
            </motion.div>

            <motion.div className="cn-frame-veil" style={{ opacity: opened ? 1 : veilOpacity }} />
          </div>
        </motion.div>

        {/* Légende de musée, pendant l'ouverture de la première visite */}
        <motion.div
          className="cn-hero-caption"
          style={{ opacity: opened ? 0 : captionOpacity }}
          aria-hidden="true"
        >
          <span className="l">Powamekka, atelier des systèmes</span>
          <span className="cn-scroll-hint" aria-hidden="true">
            <i />
          </span>
        </motion.div>

        {/* Contenu épinglé : visible dès l'arrivée, ou à la fin de l'ouverture */}
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
