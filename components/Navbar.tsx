import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar wrap">
      <nav className="v-nav barre" style={{ display: 'flex' }}>
        <Link className="brand" href="/">
          <Image src="/logo-mark-ink.png" alt="POWAMEKKA" width={27} height={27} />
          <span className="wm">POWAMEKKA</span>
        </Link>
        <div className="center">
          <div className="navlinks">
            <a href="#approche">Approche</a>
            <a href="#services">Services</a>
            <a href="#methode">Méthode</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <a className="nav-cta" href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise." target="_blank" rel="noopener noreferrer" style={{ borderRadius: 18 }}>Demander un audit</a>
      </nav>
    </div>
  );
}
