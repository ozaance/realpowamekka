'use client';
import { useCallback, useState } from 'react';
import type { OfferView } from '@/lib/offers';
import CheckoutDialog, { type CheckoutItem } from './CheckoutDialog';

export default function OffersGrid({
  offers,
  canceled,
}: {
  offers: OfferView[];
  canceled: boolean;
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

            <button
              type="button"
              className="btn"
              onClick={() => setSelected(offer)}
              style={{ alignSelf: 'flex-start', borderRadius: 18, border: 'none', cursor: 'pointer' }}
            >
              Commander <span className="ar">→</span>
            </button>
          </div>
        ))}
      </div>

      <CheckoutDialog item={selected} onClose={close} />
    </>
  );
}
