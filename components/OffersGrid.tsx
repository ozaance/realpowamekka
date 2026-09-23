'use client';
import { useState } from 'react';
import type { OfferView } from '@/lib/offers';

type Provider = 'stripe' | 'mollie';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--line)',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 14,
  background: 'var(--paper)',
  color: 'var(--ink)',
};

const choiceStyle: React.CSSProperties = {
  textAlign: 'left',
  border: '1px solid var(--line)',
  borderRadius: 14,
  padding: '12px 16px',
  background: 'var(--paper)',
  color: 'var(--ink)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const choiceNoteStyle: React.CSSProperties = { fontSize: 12, color: 'var(--ink-dim)' };

export default function OffersGrid({
  offers,
  canceled,
}: {
  offers: OfferView[];
  canceled: boolean;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Offre dont le choix du moyen de paiement est ouvert, et moyen choisi.
  const [selected, setSelected] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', company: '' });

  function open(offerId: string) {
    setSelected(offerId);
    setProvider(null);
    setError(null);
  }

  async function handleCheckout(offerId: string, chosen: Provider) {
    setPending(offerId);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          provider: chosen,
          customer: chosen === 'mollie' ? customer : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError("Le paiement n'a pas pu être ouvert. Réessayez ou contactez-nous.");
    } catch {
      setError("Le paiement n'a pas pu être ouvert. Réessayez ou contactez-nous.");
    }
    setPending(null);
  }

  return (
    <>
      {canceled && (
        <p
          style={{
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: '14px 20px',
            marginBottom: 32,
            fontSize: 14,
            color: 'var(--ink-dim)',
          }}
        >
          Paiement annulé. Aucun montant n&apos;a été débité.
        </p>
      )}

      {error && (
        <p style={{ fontSize: 13, color: '#c0392b', marginBottom: 24 }}>{error}</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 1,
          background: 'var(--line)',
          border: '1px solid var(--line)',
        }}
      >
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              background: offer.featured
                ? 'color-mix(in oklab, var(--plaster) 45%, var(--paper))'
                : 'var(--paper)',
              padding: 'clamp(28px,3vw,40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(20px,1.9vw,26px)',
                  fontWeight: 400,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                }}
              >
                {offer.name}
              </h2>
              {offer.featured && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Le plus choisi
                </span>
              )}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px,3vw,38px)',
                color: 'var(--ink)',
                lineHeight: 1,
              }}
            >
              {offer.priceLabel}
            </p>

            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)' }}>{offer.tagline}</p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0 }}>
              {offer.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: 'var(--ink-soft)',
                    display: 'flex',
                    gap: 10,
                  }}
                >
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>—</span>
                  {feature}
                </li>
              ))}
            </ul>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-dim)',
                marginTop: 'auto',
                paddingTop: 12,
              }}
            >
              {offer.delivery}
            </p>

            {selected !== offer.id ? (
              <button
                type="button"
                className="btn"
                onClick={() => open(offer.id)}
                disabled={pending !== null}
                style={{
                  alignSelf: 'flex-start',
                  borderRadius: 18,
                  border: 'none',
                  cursor: pending ? 'wait' : 'pointer',
                  opacity: pending ? 0.5 : 1,
                }}
              >
                Commander <span className="ar">→</span>
              </button>
            ) : provider !== 'mollie' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ ...choiceNoteStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Moyen de paiement
                </p>
                <button
                  type="button"
                  style={choiceStyle}
                  disabled={pending !== null}
                  onClick={() => {
                    setProvider('stripe');
                    handleCheckout(offer.id, 'stripe');
                  }}
                >
                  <span>{pending === offer.id ? 'Redirection...' : 'Payer avec Stripe'}</span>
                  <span style={choiceNoteStyle}>Carte bancaire, Apple Pay, Google Pay</span>
                </button>
                <button
                  type="button"
                  style={choiceStyle}
                  disabled={pending !== null}
                  onClick={() => setProvider('mollie')}
                >
                  <span>Payer avec Mollie</span>
                  <span style={choiceNoteStyle}>Carte bancaire, PayPal, Bancontact, virement…</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  disabled={pending !== null}
                  style={{ ...choiceNoteStyle, alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckout(offer.id, 'mollie');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <p style={{ ...choiceNoteStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Vos coordonnées
                </p>
                <input required placeholder="Nom et prénom" autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} style={fieldStyle} />
                <input required type="email" placeholder="Email" autoComplete="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} style={fieldStyle} />
                <input type="tel" placeholder="Téléphone (facultatif)" autoComplete="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} style={fieldStyle} />
                <input placeholder="Entreprise (facultatif)" autoComplete="organization" value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} style={fieldStyle} />
                <button
                  type="submit"
                  className="btn"
                  disabled={pending !== null}
                  style={{ alignSelf: 'flex-start', borderRadius: 18, border: 'none', cursor: pending ? 'wait' : 'pointer' }}
                >
                  {pending === offer.id ? 'Redirection...' : 'Payer avec Mollie'}
                  {pending !== offer.id && <span className="ar">→</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setProvider(null)}
                  disabled={pending !== null}
                  style={{ ...choiceNoteStyle, alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Retour
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
