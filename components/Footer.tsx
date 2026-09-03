import Image from 'next/image';
import Link from 'next/link';

const services = [
  { label: 'Systèmes Digitaux', href: '/services/systemes' },
  { label: 'Sites Premium', href: '/services/sites' },
  { label: 'IA & Automatisation', href: '/services/ia' },
  { label: 'Audits Stratégiques', href: '/services/audit' },
  { label: 'Formation & Adoption', href: '/services/formation' },
];

export default function Footer() {
  return (
    <footer className="wrap">
      <div className="foot-grid">
        <div className="foot-brand">
          <div className="brand" style={{ gap: 12 }}>
            <Image src="/logo-mark-ink.png" alt="POWAMEKKA" width={24} height={24} />
            <span className="wm">POWAMEKKA</span>
          </div>
          <p>Systèmes digitaux &amp; conseil en IA. Building the future of business.</p>
        </div>
        <div className="foot-col">
          <h5>Services</h5>
          {services.map((s) => (
            <Link key={s.href} href={s.href}>{s.label}</Link>
          ))}
        </div>
        <div className="foot-col">
          <h5>Maison</h5>
          {/* Ancres préfixées par « / » : elles doivent ramener à l'accueil
              depuis n'importe quelle page du site, pas chercher la section
              sur la page courante. */}
          <a href="/#approche">Approche</a>
          <a href="/#methode">Méthode</a>
          <Link href="/offres">Offres</Link>
          <Link href="/faq">FAQ</Link>
          <a href="/#contact">Contact</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 POWAMEKKA</span>
        <span>Moins de complexité. Plus d&apos;impact.</span>
        <a href="mailto:contact@powamekka.com">contact@powamekka.com</a>
      </div>
    </footer>
  );
}
