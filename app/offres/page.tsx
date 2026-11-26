import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OffersGrid from '@/components/OffersGrid';
import ServicesCatalog from '@/components/ServicesCatalog';
import { offers as rawOffers, gridPriceHT, isQuoteOnly, onlineOrdersOpen, pricing2026Enabled, getOfferViews, getServiceViews, serviceCategories } from '@/lib/offers';
import { jsonLdScript, offerCatalogJsonLd } from '@/lib/schema';
import { billingFieldsEnabled, cgvAcceptanceEnabled } from '@/lib/billing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offres & tarifs : sites web sur mesure | Powamekka',
  description:
    'Landing page, site vitrine, prototype MVP, applications SaaS, audits IA et prestations à la carte. Un devis personnalisé après un premier échange.',
  alternates: { canonical: '/offres' },
  openGraph: {
    title: 'Offres & tarifs | Powamekka',
    description:
      'Landing page, site vitrine, prototype MVP, applications SaaS, audits IA et prestations à la carte. Un devis personnalisé.',
    url: 'https://www.powamekka.com/offres',
    type: 'website',
    // Un openGraph de page remplace celui du layout : sans cette ligne, /offres était partagée sans image.
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Powamekka : offres' }],
  },
};

export default async function OffresPage({
  searchParams,
}: {
  searchParams: Promise<{ annule?: string }>;
}) {
  const { annule } = await searchParams;
  const offers = getOfferViews();
  const services = getServiceViews();
  // Collecte des informations de facturation et case CGV : désactivées par défaut (voir lib/billing.ts).
  const checkout = { fields: billingFieldsEnabled(), cgv: cgvAcceptanceEnabled() };

  const offerCatalogSchema = offerCatalogJsonLd(
    rawOffers.map((o) => ({
      ...o,
      // Grille 2026 active : prix HT de la grille ; sinon le prix du catalogue, comme avant.
      price: pricing2026Enabled() ? (gridPriceHT(o.id) ?? o.price) : o.price,
      vatExcluded: pricing2026Enabled(),
      quoteOnly: isQuoteOnly(o.id) || !onlineOrdersOpen(),
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(offerCatalogSchema) }}
      />
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
              {onlineOrdersOpen() ? 'Des formats clairs, un devis pour le sur-mesure.' : 'Des formats clairs, un devis pour chaque projet.'}
            </h1>
            <p className="lede rv d3" style={{ maxWidth: '48ch' }}>
              {onlineOrdersOpen()
                ? "Commandez en ligne la landing page, le site vitrine et nos prestations simples. Pour un projet sur mesure ou une prestation à cadrer, demandez un devis. Paiement sécurisé par Mollie, démarrage dès réception de vos informations."
                : "Choisissez le format qui correspond à votre besoin, puis demandez un devis : un premier échange gratuit permet de cadrer le projet, le périmètre et le calendrier. Les modalités de paiement sont précisées dans le devis."}
            </p>
            {pricing2026Enabled() && (
              <p className="rv d3" style={{ maxWidth: '48ch', marginTop: 14, fontSize: 13, color: 'var(--ink-dim)' }}>
                Prix en euros hors taxes (HT). La TVA de 20 % s&apos;ajoute : le montant TTC est indiqué sous chaque prix.
              </p>
            )}
          </div>
        </section>

        {/* OFFRES */}
        <section style={{ padding: 'clamp(50px,8vh,100px) 0', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <OffersGrid offers={offers} canceled={annule === '1'} checkout={checkout} />
          </div>
        </section>

        {/* SERVICES À LA CARTE */}
        <section
          id="services-a-la-carte"
          style={{ padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' }}
        >
          <div className="wrap">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 16,
              }}
            >
              Services à la carte
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(28px,3.4vw,44px)',
                lineHeight: 1.15,
                color: 'var(--ink)',
                maxWidth: '22ch',
                marginBottom: 14,
              }}
            >
              {onlineOrdersOpen()
                ? "Un besoin précis ? Commandez uniquement ce qu'il vous faut."
                : "Un besoin précis ? Demandez uniquement ce qu'il vous faut."}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-dim)', maxWidth: '56ch', marginBottom: 40 }}>
              {onlineOrdersOpen()
                ? "Des prestations ponctuelles, à commander directement ou à faire chiffrer sur devis, pour améliorer un site existant, gagner en visibilité ou démarrer avec l'IA."
                : "Des prestations ponctuelles, chiffrées sur devis, pour améliorer un site existant, gagner en visibilité ou démarrer avec l'IA."}
            </p>
            <ServicesCatalog services={services} categories={serviceCategories} checkout={checkout} />
          </div>
        </section>

        {/* HORS CATALOGUE */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0' }}>
          <div
            className="wrap split split-16"
            style={{
              display: 'grid',
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
                Un projet plus large ou qui ne figure pas ici ? Ces missions se chiffrent après un
                premier échange. Un appel suffit pour cadrer le périmètre.
              </p>
              <a
                href="https://wa.me/33635097980?text=Bonjour%2C%20je%20souhaite%20discuter%20d%27un%20projet%20sur%20mesure."
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
