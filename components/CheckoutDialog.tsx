'use client';
import { useEffect, useRef, useState } from 'react';
import { parseBilling, type BillingField } from '@/lib/billing';

type Provider = 'stripe' | 'mollie';

export type CheckoutItem = {
  id: string;
  name: string;
  priceLabel: string;
  /** Grille 2026 active : prix HT, TTC et TVA (absents sinon). */
  priceHTLabel?: string;
  priceTTCLabel?: string;
  vatLabel?: string;
  /** Grille 2026 active : montant dû maintenant et solde éventuel. */
  dueNowLabel?: string;
  balanceLabel?: string;
};

/**
 * Options de collecte, transmises par le serveur (désactivées par défaut) :
 * `fields` = informations de facturation d'un client professionnel,
 * `cgv` = case d'acceptation des conditions générales de vente.
 */
export type CheckoutOptions = { fields: boolean; cgv: boolean };
const NO_OPTIONS: CheckoutOptions = { fields: false, cgv: false };

const EMPTY_BILLING = { companyName: '', siren: '', vatNumber: '', street: '', street2: '', postalCode: '', city: '' };
type FieldErrors = Partial<Record<BillingField | 'name' | 'email', string>>;

/**
 * Stripe est masqué (désaccord avec le prestataire) : le parcours passe
 * directement par Mollie. Le code Stripe (route, webhook, /merci) est conservé,
 * remettre `true` suffit à réafficher le choix.
 */
const STRIPE_ENABLED = false;

const ERROR = "Le paiement n'a pas pu être ouvert. Réessayez ou contactez-nous.";

/**
 * Fenêtre de commande partagée par les offres et les services à la carte :
 * récapitulatif, puis coordonnées et paiement Mollie (choix Stripe / Mollie
 * réaffiché si STRIPE_ENABLED).
 */
export default function CheckoutDialog({
  item,
  onClose,
  options = NO_OPTIONS,
}: {
  item: CheckoutItem | null;
  onClose: () => void;
  options?: CheckoutOptions;
}) {
  // Initialisé à 'mollie' quand Stripe est masqué : évite d'afficher un instant l'écran de choix
  // avant que l'effet d'ouverture ne s'exécute.
  const [provider, setProvider] = useState<Provider | null>(STRIPE_ENABLED ? null : 'mollie');
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', company: '' });
  const [bill, setBill] = useState(EMPTY_BILLING);
  const [acceptCgv, setAcceptCgv] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const panelRef = useRef<HTMLDivElement>(null);

  // Réinitialise l'étape à chaque ouverture ; les coordonnées saisies sont gardées.
  useEffect(() => {
    if (!item) return;
    setProvider(STRIPE_ENABLED ? null : 'mollie');
    setPending(null);
    setError(null);
    setErrors({});
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
          // Envoyés seulement si la collecte est active : sinon la requête est celle d'avant.
          ...(options.fields && chosen === 'mollie' ? { billing: bill } : {}),
          ...(options.cgv && chosen === 'mollie' ? { acceptCgv } : {}),
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      // Erreur de saisie renvoyée par le serveur (400) : affichée sous le champ concerné.
      if (res.status === 400 && typeof data.error === 'string') {
        if (data.field) setErrors({ [data.field]: data.error });
        setError(data.field ? null : data.error);
        setPending(null);
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
  const setB = (key: keyof typeof bill) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBill({ ...bill, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  /** Contrôle côté navigateur (le serveur recontrôle tout) ; place le curseur sur le premier champ en erreur. */
  function validate(): boolean {
    const found: FieldErrors = {};
    // Ordre d'insertion = ordre d'affichage : le curseur va sur le premier champ visible en erreur.
    const parsed = parseBilling(bill);
    if (!parsed.ok) found[parsed.field] = parsed.error;
    if (!customer.name.trim()) found.name = 'Indiquez votre nom et prénom.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) found.email = 'Indiquez une adresse e-mail valide.';
    if (options.cgv && !acceptCgv) found.acceptCgv = 'Acceptez les conditions générales de vente pour continuer.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) panelRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    return !first;
  }

  const errorProps = (key: keyof FieldErrors) => ({
    'data-field': key,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `co-err-${key}` : undefined,
  });
  const fieldError = (key: keyof FieldErrors) =>
    errors[key] ? (
      <p id={`co-err-${key}`} className="co-error co-fielderr" role="alert">
        {errors[key]}
      </p>
    ) : null;

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
          <div style={{ textAlign: 'right' }}>
            <p className="co-price">{item.priceLabel}</p>
            {item.priceTTCLabel && (
              <p className="co-vat">
                {item.vatLabel}
                <br />
                <strong>{item.priceTTCLabel}</strong>
              </p>
            )}
          </div>
        </div>

        {item.dueNowLabel && (
          <p className="co-note">
            <strong>À payer maintenant : {item.dueNowLabel}.</strong>
            {item.balanceLabel && (
              <>
                <br />
                {item.balanceLabel}
              </>
            )}
          </p>
        )}

        {provider !== 'mollie' ? (
          <div className="co-body">
            <p className="co-label">Moyen de paiement</p>
            {STRIPE_ENABLED && (
              <button type="button" className="co-choice" disabled={pending !== null} onClick={() => checkout('stripe')}>
                <span className="co-choice-name">
                  {pending === 'stripe' ? 'Redirection…' : 'Payer avec Stripe'}
                </span>
                <span className="co-choice-note">Carte bancaire, Apple Pay, Google Pay</span>
                <span className="co-choice-ar" aria-hidden>→</span>
              </button>
            )}
            <button type="button" className="co-choice" disabled={pending !== null} onClick={() => setProvider('mollie')}>
              <span className="co-choice-name">Payer avec Mollie</span>
              <span className="co-choice-note">Carte bancaire, virement, Bancontact, Belfius</span>
              <span className="co-choice-ar" aria-hidden>→</span>
            </button>
          </div>
        ) : (
          <form
            className="co-body"
            noValidate={options.fields}
            onSubmit={(e) => {
              e.preventDefault();
              if (options.fields && !validate()) return;
              checkout('mollie');
            }}
          >
            {options.fields ? (
              <>
                <p className="co-label">Votre entreprise</p>
                <input className="co-field" required placeholder="Nom de l'entreprise ou du professionnel" autoComplete="organization" maxLength={100} value={bill.companyName} onChange={setB('companyName')} autoFocus {...errorProps('companyName')} />
                {fieldError('companyName')}
                <input className="co-field" required inputMode="numeric" placeholder="SIREN (9 chiffres)" autoComplete="off" maxLength={14} value={bill.siren} onChange={setB('siren')} {...errorProps('siren')} />
                {fieldError('siren')}
                <input className="co-field" placeholder="N° de TVA intracommunautaire (facultatif)" autoComplete="off" autoCapitalize="characters" maxLength={17} value={bill.vatNumber} onChange={setB('vatNumber')} {...errorProps('vatNumber')} />
                {fieldError('vatNumber')}
                <p className="co-label" style={{ marginTop: 8 }}>Adresse de facturation</p>
                <input className="co-field" required placeholder="Adresse" autoComplete="address-line1" maxLength={120} value={bill.street} onChange={setB('street')} {...errorProps('street')} />
                {fieldError('street')}
                <input className="co-field" placeholder="Complément d'adresse (facultatif)" autoComplete="address-line2" maxLength={80} value={bill.street2} onChange={setB('street2')} />
                <div className="co-row">
                  <input className="co-field" required inputMode="numeric" placeholder="Code postal" autoComplete="postal-code" maxLength={5} value={bill.postalCode} onChange={setB('postalCode')} {...errorProps('postalCode')} />
                  <input className="co-field" required placeholder="Ville" autoComplete="address-level2" maxLength={60} value={bill.city} onChange={setB('city')} {...errorProps('city')} />
                </div>
                {fieldError('postalCode')}
                {fieldError('city')}
                <p className="co-note">Pays : France. La commande est réservée aux entreprises immatriculées en France.</p>
                <p className="co-label" style={{ marginTop: 8 }}>Votre contact</p>
                <input className="co-field" required placeholder="Nom et prénom" autoComplete="name" value={customer.name} onChange={set('name')} {...errorProps('name')} />
                {fieldError('name')}
                <input className="co-field" required type="email" placeholder="Email" autoComplete="email" value={customer.email} onChange={set('email')} {...errorProps('email')} />
                {fieldError('email')}
                <input className="co-field" type="tel" placeholder="Téléphone (facultatif)" autoComplete="tel" value={customer.phone} onChange={set('phone')} />
              </>
            ) : (
              <>
                <p className="co-label">Vos coordonnées</p>
                <input className="co-field" required placeholder="Nom et prénom" autoComplete="name" value={customer.name} onChange={set('name')} autoFocus />
                <input className="co-field" required type="email" placeholder="Email" autoComplete="email" value={customer.email} onChange={set('email')} />
                <input className="co-field" type="tel" placeholder="Téléphone (facultatif)" autoComplete="tel" value={customer.phone} onChange={set('phone')} />
                <input className="co-field" placeholder="Entreprise (facultatif)" autoComplete="organization" value={customer.company} onChange={set('company')} />
              </>
            )}
            {options.cgv && (
              <>
                <label className="co-check">
                  <input type="checkbox" checked={acceptCgv} onChange={(e) => { setAcceptCgv(e.target.checked); if (errors.acceptCgv) setErrors({ ...errors, acceptCgv: undefined }); }} {...errorProps('acceptCgv')} />
                  <span>
                    J&apos;agis pour les besoins de mon activité professionnelle et j&apos;accepte les{' '}
                    <a href="/cgv" target="_blank" rel="noopener noreferrer">conditions générales de vente</a>.
                  </span>
                </label>
                {fieldError('acceptCgv')}
              </>
            )}
            <button type="submit" className="btn" disabled={pending !== null} style={{ borderRadius: 18, border: 'none', justifyContent: 'center', cursor: pending ? 'wait' : 'pointer' }}>
              {pending ? 'Redirection…' : 'Continuer vers Mollie'}
              {!pending && <span className="ar">→</span>}
            </button>
            {STRIPE_ENABLED && (
              <button type="button" className="co-link" disabled={pending !== null} onClick={() => setProvider(null)}>
                ← Changer de moyen de paiement
              </button>
            )}
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
