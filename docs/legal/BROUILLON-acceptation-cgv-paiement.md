# ⚠️ BROUILLON NON VALIDÉ — Acceptation des CGV avant paiement

> Spécification de travail. **Rien n'est implémenté** : cette évolution modifie le parcours de
> paiement et ne doit être développée qu'après validation des CGV et accord explicite du
> propriétaire, dans une PR dédiée, testée en mode test Stripe/Mollie sur une Preview.

## État actuel (constaté le 23/11/2026)

- `components/CheckoutDialog.tsx` : le Client choisit Stripe ou Mollie et part directement au
  paiement. Aucune mention des CGV, aucune case à cocher.
- Aucune page `/cgv` n'existe.
- Les prix n'indiquent ni HT ni TTC.

## Informations à présenter avant le clic de paiement

Dans la fenêtre de commande, au-dessus des boutons de paiement :

1. récapitulatif : nom de l'offre, prix **[HT/TTC]**, délai indicatif affiché ;
2. **case à cocher, non cochée par défaut** : « J'ai lu et j'accepte les
   [conditions générales de vente](/cgv) », avec un lien qui s'ouvre dans un nouvel onglet pour
   ne pas perdre la commande ;
3. **[B2B uniquement]** : « Je commande pour les besoins de mon activité professionnelle » (case
   ou mention, à décider avec le juriste) ;
4. **[B2C uniquement]** : une case distincte, non cochée par défaut, si l'exécution doit commencer
   avant la fin du délai de rétractation :
   « Je demande que la prestation commence avant la fin du délai de rétractation de 14 jours et je
   reconnais perdre mon droit de rétractation une fois la prestation pleinement exécutée. »
   *(Formulation à valider par un professionnel du droit.)*
5. les boutons de paiement ne sont actifs qu'une fois la ou les cases requises cochées. Leur
   libellé doit indiquer clairement l'obligation de paiement (par ex. « Payer avec Stripe »,
   « Commander et payer »).

## Preuve de l'acceptation (côté serveur)

Pour pouvoir démontrer l'acceptation :

- `/api/checkout` refuse une commande sans `acceptedTerms: true` (erreur 400) ; la case seule, côté
  navigateur, ne suffit pas ;
- on enregistre la **version des CGV** acceptée et l'horodatage dans les métadonnées du paiement :
  - Mollie : `metadata.cgv_version`, `metadata.cgv_accepted_at` ;
  - Stripe : `metadata.cgv_version`, `metadata.cgv_accepted_at`. Stripe Checkout propose aussi
    une collecte native de l'acceptation (`consent_collection.terms_of_service`), qui exige de
    renseigner l'URL des CGV dans le dashboard Stripe. **Option à évaluer** : c'est un
    changement de paramètres de session de paiement, à valider ;
- la version des CGV figure en tête de la page `/cgv` (cf. brouillon).

## Points à trancher avant le développement

- B2B seul ou B2B + B2C (cf. `LEGAL_INFO_REQUIRED.md` §3) ;
- texte définitif des cases ;
- Stripe : métadonnées seules, ou en plus la collecte native ;
- email de confirmation au Client avec les CGV (lien ou PDF) : recommandé, surtout pour Mollie,
  qui n'envoie aucun reçu.

## Fichiers concernés (prévision)

`components/CheckoutDialog.tsx`, `app/api/checkout/route.ts`, nouvelle page `app/cgv/page.tsx`,
`components/Footer.tsx` (liens légaux).
