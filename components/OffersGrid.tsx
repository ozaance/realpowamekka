'use client';
import { useCallback, useState } from 'react';
import type { OfferView } from '@/lib/offers';
import CheckoutDialog, { type CheckoutItem } from './CheckoutDialog';

/* Offres à partir de 2 500 € : on en parle d'abord. Le bouton principal ouvre
   WhatsApp avec le nom de l'offre ; « Commander » reste possible en second.
   Liste explicite : les autres offres ne changent pas. */
const TALK_FIRST = new Set(['prototype-mvp', 'saas-standard', 'saas-premium']);

const TALK_BUTTON = {
  borderRadius: 18,
  flex: '1 1 100%',
  justifyContent: 'center',
  textAlign: 'center',
  whiteSpace: 'normal',
  paddingLeft: 18,
  paddingRight: 18,
} as const;

function firstCallLink(offerName: string) {
  return `https://wa.me/33605715122?text=${encodeURIComponent(
    `Bonjour, je souhaite un premier échange au sujet de votre offre ${offerName}.`,
  )}`;
}

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

            {TALK_FIRST.has(offer.id) ? (
              /* Les deux boutons occupent la largeur de la carte et le libellé
                 peut passer à la ligne : la carte ne fait que 214 px de large
                 à l'intérieur sur un écran de 320 px. */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <a
                  className="btn"
                  href={firstCallLink(offer.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={TALK_BUTTON}
                >
                  Demander un premier échange <span className="ar">→</span>
                </a>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setSelected(offer)}
                  style={{ ...TALK_BUTTON, cursor: 'pointer' }}
                >
                  Commander <span className="ar">→</span>
                </button>
              </div>
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

      <CheckoutDialog item={selected} onClose={close} />
    </>
  );
}
