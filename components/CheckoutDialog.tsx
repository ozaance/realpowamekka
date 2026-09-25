'use client';
import { useEffect, useRef, useState } from 'react';

type Provider = 'stripe' | 'mollie';

export type CheckoutItem = { id: string; name: string; priceLabel: string };

const ERROR = "Le paiement n'a pas pu être ouvert. Réessayez ou contactez-nous.";

/**
 * Fenêtre de commande partagée par les offres et les services à la carte :
 * récapitulatif, choix Stripe / Mollie, puis coordonnées si Mollie.
 */
export default function CheckoutDialog({
  item,
  onClose,
}: {
  item: CheckoutItem | null;
  onClose: () => void;
}) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', company: '' });
  const panelRef = useRef<HTMLDivElement>(null);

  // Réinitialise l'étape à chaque ouverture ; les coordonnées saisies sont gardées.
  useEffect(() => {
    if (!item) return;
    setProvider(null);
    setPending(null);
    setError(null);
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  async function checkout(chosen: Provider) {
    if (!item) return;
    setPending(chosen);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: item.id,
          provider: chosen,
          customer: chosen === 'mollie' ? customer : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // message affiché ci-dessous
    }
    setError(ERROR);
    setPending(null);
  }

  const set = (key: keyof typeof customer) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer({ ...customer, [key]: e.target.value });

  return (
    <div className="co-overlay" onClick={() => !pending && onClose()}>
      <div
        ref={panelRef}
        className="co-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="co-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="co-head">
          <div>
            <p className="co-label">Votre commande</p>
            <h2 id="co-title" className="co-title">{item.name}</h2>
          </div>
          <p className="co-price">{item.priceLabel}</p>
        </div>

        {provider !== 'mollie' ? (
          <div className="co-body">
            <p className="co-label">Moyen de paiement</p>
            <button type="button" className="co-choice" disabled={pending !== null} onClick={() => checkout('stripe')}>
              <span className="co-choice-name">
                {pending === 'stripe' ? 'Redirection…' : 'Payer avec Stripe'}
              </span>
              <span className="co-choice-note">Carte bancaire, Apple Pay, Google Pay</span>
              <span className="co-choice-ar" aria-hidden>→</span>
            </button>
            <button type="button" className="co-choice" disabled={pending !== null} onClick={() => setProvider('mollie')}>
              <span className="co-choice-name">Payer avec Mollie</span>
              <span className="co-choice-note">Carte bancaire, PayPal, Bancontact, virement…</span>
              <span className="co-choice-ar" aria-hidden>→</span>
            </button>
          </div>
        ) : (
          <form
            className="co-body"
            onSubmit={(e) => {
              e.preventDefault();
              checkout('mollie');
            }}
          >
            <p className="co-label">Vos coordonnées</p>
            <input className="co-field" required placeholder="Nom et prénom" autoComplete="name" value={customer.name} onChange={set('name')} autoFocus />
            <input className="co-field" required type="email" placeholder="Email" autoComplete="email" value={customer.email} onChange={set('email')} />
            <input className="co-field" type="tel" placeholder="Téléphone (facultatif)" autoComplete="tel" value={customer.phone} onChange={set('phone')} />
            <input className="co-field" placeholder="Entreprise (facultatif)" autoComplete="organization" value={customer.company} onChange={set('company')} />
            <button type="submit" className="btn" disabled={pending !== null} style={{ borderRadius: 18, border: 'none', justifyContent: 'center', cursor: pending ? 'wait' : 'pointer' }}>
              {pending ? 'Redirection…' : 'Continuer vers Mollie'}
              {!pending && <span className="ar">→</span>}
            </button>
            <button type="button" className="co-link" disabled={pending !== null} onClick={() => setProvider(null)}>
              ← Changer de moyen de paiement
            </button>
          </form>
        )}

        {error && <p className="co-error" role="alert">{error}</p>}

        <div className="co-foot">
          <span>Paiement sécurisé, aucune donnée bancaire ne transite par ce site.</span>
          <button type="button" className="co-link" disabled={pending !== null} onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
