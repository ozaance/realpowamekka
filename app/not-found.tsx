import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page introuvable | Powamekka',
  robots: { index: false, follow: true },
};

/* Page 404 aux couleurs du site : navigation et pied de page conservés, trois chemins utiles. */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <section style={{ paddingTop: 'clamp(90px,15vh,170px)', paddingBottom: 'clamp(70px,12vh,150px)' }}>
          <div className="wrap" style={{ maxWidth: 720 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              Erreur 404
            </p>
            <h1 className="display" style={{ maxWidth: '16ch', marginBottom: 28 }}>
              Cette page n&apos;existe pas.
            </h1>
            <p className="lede" style={{ marginBottom: 40 }}>
              Le lien est peut-être ancien ou mal saisi. Reprenez depuis l&apos;accueil, consultez nos offres ou
              écrivez-nous.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/" className="btn" style={{ borderRadius: 18 }}>
                Retour à l&apos;accueil <span className="ar">→</span>
              </Link>
              <Link href="/offres" className="btn" style={{ borderRadius: 18 }}>
                Voir les offres <span className="ar">→</span>
              </Link>
              <a href="mailto:contact@powamekka.com" className="btn" style={{ borderRadius: 18 }}>
                contact@powamekka.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
