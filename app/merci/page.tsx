import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getStripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/offers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commande confirmée — Powamekka',
  description: 'Confirmation de votre commande Powamekka.',
  robots: { index: false, follow: false },
};

type Confirmation = {
  paid: boolean;
  offerName: string;
  amount: string;
  email: string | null;
};

async function loadConfirmation(sessionId: string | undefined): Promise<Confirmation | null> {
  if (!sessionId) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === 'paid',
      offerName: session.metadata?.offer_name || 'votre commande',
      amount: session.amount_total !== null ? formatPrice(session.amount_total) : '',
      email: session.customer_details?.email ?? null,
    };
  } catch (err) {
    console.error('[merci] session illisible', err);
    return null;
  }
}

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const confirmation = await loadConfirmation(session_id);
  const paid = confirmation?.paid ?? false;

  return (
    <>
      <Navbar />
      <main>
        <section
          style={{
            paddingTop: 'clamp(90px,15vh,170px)',
            paddingBottom: 'clamp(70px,12vh,150px)',
          }}
        >
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
              {paid ? 'Commande confirmée' : 'Commande enregistrée'}
            </p>

            <h1 className="display" style={{ maxWidth: '16ch', marginBottom: 28 }}>
              {paid ? 'Merci, tout est en ordre.' : 'Merci pour votre commande.'}
            </h1>

            {confirmation && paid ? (
              <p className="lede" style={{ marginBottom: 40 }}>
                Votre paiement de {confirmation.amount} pour l&apos;offre {confirmation.offerName} a
                bien été reçu. Un reçu Stripe vient de partir
                {confirmation.email ? ` sur ${confirmation.email}` : ''}.
              </p>
            ) : (
              <p className="lede" style={{ marginBottom: 40 }}>
                Votre commande est enregistrée. Si le paiement est encore en cours de traitement par
                votre banque, la confirmation vous parviendra par email dans quelques minutes.
              </p>
            )}

            <div
              style={{
                border: '1px solid var(--line)',
                borderRadius: 18,
                padding: 'clamp(24px,3vw,36px)',
                marginBottom: 40,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  marginBottom: 20,
                }}
              >
                La suite
              </p>
              <ol
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {[
                  'Nous vous contactons sous 24h pour réunir vos informations : contenus, logo, références.',
                  'Le travail démarre dès réception de ces éléments.',
                  'Vous validez une première version avant la mise en ligne.',
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 14, fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', paddingTop: 4 }}>
                      0{i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/33605715122?text=Bonjour%2C%20je%20viens%20de%20passer%20commande%20sur%20votre%20site."
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ borderRadius: 18 }}
              >
                Envoyer mes informations <span className="ar">→</span>
              </a>
              <Link
                href="/"
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
                Retour à l&apos;accueil
              </Link>
            </div>

            <p style={{ marginTop: 32, fontSize: 13, color: 'var(--ink-dim)' }}>
              Une question ?{' '}
              <a href="mailto:contact@powamekka.com" style={{ color: 'var(--gold)' }}>
                contact@powamekka.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
