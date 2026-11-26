'use client';
import { useCallback, useState } from 'react';
import type { OfferView } from '@/lib/offers';
import CheckoutDialog, { type CheckoutItem, type CheckoutOptions } from './CheckoutDialog';

/* Prototype MVP et SaaS : sur devis uniquement. Pas de commande en ligne ; le
   bouton ouvre WhatsApp avec une demande de devis pré-remplie au nom de
   l'offre. Le refus est aussi appliqué côté serveur (API de paiement). */
const QUOTE_BUTTON = {
  borderRadius: 18,
  alignSelf: 'flex-start',
  whiteSpace: 'normal',
  textAlign: 'center',
} as const;

function quoteLink(offerName: string) {
  return `https://wa.me/33635097980?text=${encodeURIComponent(
    `Bonjour, je souhaite demander un devis pour votre offre ${offerName}.`,
  )}`;
}

export default function OffersGrid({
  offers,
  canceled,
  checkout,
}: {
  offers: OfferView[];
  canceled: boolean;
  checkout?: CheckoutOptions;
}) {
  const [selected, setSelected] = useState<CheckoutItem | null>(null);
  const close = useCallback(() => setSelected(null), []);

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
          gap: 1,
          background: 'var(--line)',
          border: '1px solid var(--line)',
        }}
      >
        {offers.map((offer) => (
          <div
            key={offer.id}
            id={offer.id}
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
                  className="offer-badge"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Recommandé
                </span>
              )}
            </div>

            <div>
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
              {offer.priceTTCLabel && (
                <p className="price-sub">
                  {offer.priceTTCLabel} <span>({offer.vatLabel})</span>
                </p>
              )}
              {offer.scheduleLabel && <p className="price-sub">{offer.scheduleLabel}</p>}
            </div>

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
                  {/* Puce sur la largeur de l'ancien tiret (1,059 em) : mêmes retours à la ligne. */}
                  <span
                    style={{ color: 'var(--gold)', flexShrink: 0, width: '1.05903em', textAlign: 'center' }}
                    aria-hidden="true"
                  >
                    •
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {offer.excludes && (
              <div>
                <p className="co-label" style={{ marginBottom: 8 }}>Non inclus</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, margin: 0, padding: 0 }}>
                  {offer.excludes.map((x) => (
                    <li key={x} style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-dim)', display: 'flex', gap: 10 }}>
                      <span style={{ flexShrink: 0, width: '1.05903em', textAlign: 'center' }} aria-hidden="true">•</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {offer.note && <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-dim)' }}>{offer.note}</p>}

            <p
              className="offer-note"
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-dim)',
                marginTop: 'auto',
                paddingTop: 12,
              }}
            >
              {offer.delivery}
            </p>

            {offer.quoteOnly ? (
              <a
                className="btn"
                href={quoteLink(offer.name)}
                target="_blank"
                rel="noopener noreferrer"
                style={QUOTE_BUTTON}
              >
                Demander un devis <span className="ar">→</span>
              </a>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={() => setSelected(offer)}
                style={{ alignSelf: 'flex-start', borderRadius: 18, border: 'none', cursor: 'pointer' }}
              >
                Commander <span className="ar">→</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <CheckoutDialog item={selected} onClose={close} options={checkout} />
    </>
  );
}
