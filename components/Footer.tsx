import Image from 'next/image';

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
          <a href="#services">Systèmes Digitaux</a>
          <a href="#services">Sites Premium</a>
          <a href="#services">IA &amp; Automatisation</a>
          <a href="#services">Audits Stratégiques</a>
          <a href="#services">Formation &amp; Adoption</a>
        </div>
        <div className="foot-col">
          <h5>Maison</h5>
          <a href="#approche">Approche</a>
          <a href="#methode">Méthode</a>
          <a href="#contact">Contact</a>
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
