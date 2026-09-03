import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { faqSections, faqJsonLd } from '@/lib/faq';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questions fréquentes — IA, automatisation et systèmes digitaux pour PME | Powamekka',
  description:
    "Combien coûte un site pour une PME, quelles tâches automatiser en premier, comment se déroule un audit, l'IA remplace-t-elle les salariés : les réponses aux questions que posent les dirigeants.",
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Questions fréquentes — Powamekka',
    description:
      "Les réponses aux questions que posent les dirigeants de PME sur l'IA, l'automatisation, les systèmes digitaux et nos tarifs.",
    url: 'https://www.powamekka.com/faq',
    type: 'website',
  },
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
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
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 20,
              }}
            >
              Questions fréquentes
            </p>
            <h1 className="display" style={{ maxWidth: '18ch', marginBottom: 28 }}>
              Les réponses avant le premier appel.
            </h1>
            <p className="lede" style={{ maxWidth: '48ch' }}>
              Ce que les dirigeants nous demandent le plus souvent sur l&apos;IA, l&apos;automatisation
              et le coût d&apos;un système qui tient dans la durée.
            </p>
          </div>
        </section>

        {/* SECTIONS */}
        {faqSections.map((section) => (
          <section
            key={section.title}
            style={{ padding: 'clamp(50px,8vh,100px) 0', borderBottom: '1px solid var(--line)' }}
          >
            <div
              className="wrap"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.9fr',
                gap: 'clamp(30px,6vw,80px)',
                alignItems: 'start',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  fontWeight: 400,
                  position: 'sticky',
                  top: 100,
                }}
              >
                {section.title}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3vw,40px)' }}>
                {section.items.map((item) => (
                  <div key={item.question}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(19px,1.8vw,25px)',
                        fontWeight: 400,
                        color: 'var(--ink)',
                        lineHeight: 1.3,
                        marginBottom: 14,
                      }}
                    >
                      {item.question}
                    </h3>
                    <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-dim)', maxWidth: '62ch' }}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0' }}>
          <div className="wrap">
            <h2 className="display" style={{ maxWidth: '16ch', marginBottom: 24 }}>
              Votre question n&apos;y est pas ?
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-dim)', marginBottom: 32, maxWidth: '46ch' }}>
              Un premier échange suffit pour savoir si nous pouvons vous être utiles. Aucun engagement.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/33605715122?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20vos%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ borderRadius: 18 }}
              >
                Poser votre question <span className="ar">→</span>
              </a>
              <Link
                href="/offres"
                style={{
                  borderRadius: 18,
                  border: '1px solid var(--ink)',
                  padding: '12px 24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Voir les offres
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
