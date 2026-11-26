'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Item = { label: string; href: string };

const MAIN: Item[] = [
  { label: 'Approche', href: '/#manifeste' },
  { label: 'Vision', href: '/vision' },
  { label: 'Méthode', href: '/#methode' },
  { label: 'Offres', href: '/offres' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/#contact' },
];

const SERVICES: Item[] = [
  { label: 'Audit Stratégique', href: '/services/audit' },
  { label: 'Systèmes Digitaux', href: '/services/systemes' },
  { label: 'IA & Automatisation', href: '/services/ia' },
  { label: 'Sites Premium', href: '/services/sites' },
  { label: 'Formation & Adoption', href: '/services/formation' },
];

const WHATSAPP =
  'https://wa.me/33635097980?text=Bonjour%2C%20je%20souhaite%20un%20premier%20%C3%A9change%20au%20sujet%20de%20mon%20entreprise.';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu de navigation des petits écrans, partagé par la navigation de
 * l'accueil (CineNav) et celle des pages internes (Navbar).
 *
 * Le bouton n'est visible que là où les liens de la barre sont masqués
 * (règles dans cinema.css et hikari-v2.css). Le panneau est rendu dans
 * `document.body` : la barre de l'accueil applique un `backdrop-filter`,
 * qui ferait d'elle le repère d'un panneau `position: fixed`.
 *
 * Accessibilité : `aria-expanded` / `aria-controls`, fermeture par Échap,
 * clic sur un lien ou bouton « Fermer », focus piégé dans le panneau puis
 * rendu au bouton, défilement de la page bloqué pendant l'ouverture.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    // Repasser en grand écran (rotation, redimensionnement) referme le panneau.
    const mq = window.matchMedia('(min-width: 921px)');
    const onResize = () => mq.matches && setOpen(false);

    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const renderLink = (item: Item) =>
    item.href.includes('#') ? (
      <a href={item.href} onClick={close}>
        {item.label}
      </a>
    ) : (
      <Link href={item.href} onClick={close}>
        {item.label}
      </Link>
    );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mm-trigger"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>

      {open &&
        createPortal(
          <div
            id={panelId}
            ref={panelRef}
            className="mm-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <div className="mm-top">
              <span className="mm-top-wm">POWAMEKKA</span>
              <button type="button" className="mm-close" onClick={close}>
                Fermer
              </button>
            </div>

            <nav aria-label="Navigation principale" className="mm-body">
              <ul className="mm-list">
                {MAIN.map((item) => (
                  <li key={item.href}>{renderLink(item)}</li>
                ))}
              </ul>

              <p className="mm-label">Services</p>
              <ul className="mm-list mm-list-sub">
                {SERVICES.map((item) => (
                  <li key={item.href}>{renderLink(item)}</li>
                ))}
              </ul>
            </nav>

            <a className="mm-cta" href={WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={close}>
              Demander un premier échange <span aria-hidden>→</span>
            </a>
          </div>,
          document.body
        )}
    </>
  );
}
