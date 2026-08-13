import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OffersGrid from '@/components/OffersGrid';
import { getOfferViews } from '@/lib/offers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offres & tarifs — Powamekka | Sites web et applications sur mesure',
  description:
    'Landing page, site vitrine, prototype MVP et applications SaaS sur mesure. Tarifs clairs, commande en ligne et paiement sécurisé par Stripe.',
  alternates: { canonical: '/offres' },
  openGraph: {
    title: 'Offres & tarifs — Powamekka',
    description:
      'Landing page, site vitrine, prototype MVP et applications SaaS sur mesure. Tarifs clairs et paiement sécurisé.',
    url: 'https://powamekka.com/offres',
    type: 'website',
  },
};

export default async function OffresPage({
  searchParams,
}: {
  searchParams: Promise<{ annule?: string }>;
}) {
  const { annule } = await searchParams;
  const offers = getOfferViews();

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section
          style={{
            borderBottom: '1px solid var(--line)',
            paddingTop: 'clamp(80px,13vh,150px)',
            paddingBottom: 'clamp(50px,8vh,100px)',
          }}
        >
          <div className="wrap">
            <p
              className="kicker rv d1"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              Offres & tarifs
            </p>
            <h1 className="display rv d2" style={{ maxWidth: '18ch', marginBottom: 28 }}>
              Des formats clairs, des prix annoncés.
            </h1>
            <p className="lede rv d3" style={{ maxWidth: '48ch' }}>
              Choisissez le format adapté à votre situation et lancez le projet immédiatement.
              Paiement sécurisé par Stripe, démarrage dès réception de vos informations.
            </p>
          </div>
        </section>

        {/* OFFRES */}
        <section style={{ padding: 'clamp(50px,8vh,100px) 0', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <OffersGrid offers={offers} canceled={annule === '1'} />
          </div>
        </section>

        {/* HORS CATALOGUE */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0' }}>
          <div
            className="wrap"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.6fr',
              gap: 'clamp(30px,6vw,80px)',
              alignItems: 'start',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-dim)',
              }}
            >
              Un besoin différent
            </p>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px,2vw,24px)',
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                  marginBottom: 28,
                }}
              >
                Audit stratégique, automatisation IA, formation des équipes : ces missions se
                chiffrent après un premier échange. Un appel suffit pour cadrer le périmètre.
              </p>
              <a
                href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20discuter%20d%27un%20projet%20sur%20mesure."
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ borderRadius: 18 }}
              >
                Parler de votre projet <span className="ar">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
