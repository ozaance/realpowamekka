'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * CTA FINAL — l'atelier en ordre
 *
 * Le dernier tableau occupe tout l'écran et respire doucement en
 * parallaxe. La vidéo, elle, se lit normalement (en boucle, sans son)
 * et n'est montée que lorsque la section approche : rien n'est
 * téléchargé tant que le visiteur n'y est pas.
 */
export default function CTACine() {
  const ref = useRef<HTMLElement>(null);
  const [mountVideo, setMountVideo] = useState(false);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.04, 1.12]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMountVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={ref} className="cn-cta" id="contact">
      <motion.div className="cn-cta-media" style={{ y, scale }}>
        {mountVideo ? (
          <video
            src="/art/cta-atelier.mp4"
            poster="/art/cta-atelier.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/art/cta-atelier.jpg"
            alt="L'atelier au crépuscule, la table rangée, le fil d'or tendu en ligne droite vers la fenêtre"
            width={2560}
            height={1440}
            loading="lazy"
            decoding="async"
          />
        )}
      </motion.div>
      <div className="cn-cta-veil" />

      <div className="cn-cta-inner">
        <div className="cn-cta-eyebrow">Parlons de votre entreprise</div>
        <h2 className="cn-cta-title">
          Reprenez le contrôle
          <br />
          de vos systèmes.
        </h2>
        <p className="cn-cta-sub">
          Un seul échange peut révéler vos premiers leviers de croissance, de clarté
          et d&apos;efficacité.
        </p>
        <div className="cn-cta-actions">
          <a
            className="cn-btn-light"
            href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise."
            target="_blank"
            rel="noopener noreferrer"
          >
            Demander un audit <span className="ar">→</span>
          </a>
          <a className="cn-btn-outline" href="mailto:contact@powamekka.com">
            contact@powamekka.com
          </a>
        </div>
      </div>
    </section>
  );
}
