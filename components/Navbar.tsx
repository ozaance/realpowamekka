'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';

const services = [
  { label: 'Audit Stratégique', href: '/services/audit' },
  { label: 'Systèmes Digitaux', href: '/services/systemes' },
  { label: 'IA & Automatisation', href: '/services/ia' },
  { label: 'Sites Premium', href: '/services/sites' },
  { label: 'Formation & Adoption', href: '/services/formation' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }

  function handleLeave() {
    timer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="navbar wrap">
      <nav className="v-nav barre" style={{ display: 'flex' }}>
        <Link className="brand" href="/">
          <Image src="/logo-mark-ink.png" alt="POWAMEKKA" width={27} height={27} />
          <span className="wm">POWAMEKKA</span>
        </Link>
        <div className="center">
          <div className="navlinks">
            <a href="/#approche">Approche</a>

            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <a href="/#services" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Services
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* Pont invisible pour combler le gap */}
              {open && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: 14, background: 'transparent' }} />
              )}

              {open && (
                <div
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                  style={{
                    position: 'absolute', top: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--paper)', border: '1px solid var(--line)',
                    borderRadius: 8, padding: '8px 0', minWidth: 220,
                    boxShadow: '0 16px 40px -12px rgba(28,24,19,0.18)', zIndex: 50,
                  }}>
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setOpen(false)} style={{
                      display: 'block', padding: '10px 20px',
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--ink-soft)', textDecoration: 'none',
                      transition: 'color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                      (e.currentTarget as HTMLElement).style.background = 'color-mix(in oklab, var(--plaster) 40%, var(--paper))';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="/#methode">Méthode</a>
            <Link href="/blog">Blog</Link>
            <a href="/#contact">Contact</a>
          </div>
        </div>
        <a className="nav-cta" href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise." target="_blank" rel="noopener noreferrer" style={{ borderRadius: 18 }}>Demander un audit</a>
      </nav>
    </div>
  );
}
