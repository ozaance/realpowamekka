This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Paiements Stripe

Le catalogue vendu en ligne est décrit dans [`lib/offers.ts`](lib/offers.ts). Le front n'envoie
qu'un identifiant d'offre : le prix facturé vient toujours du `priceId` Stripe côté serveur.

| Élément | Emplacement |
| --- | --- |
| Catalogue et tarifs affichés | `lib/offers.ts` |
| Page publique | `/offres` |
| Création de la session Checkout | `POST /api/checkout` |
| Page de retour après paiement | `/merci?session_id=...` |
| Webhook (notification email) | `POST /api/stripe/webhook` |

### Variables d'environnement

```bash
STRIPE_SECRET_KEY=sk_live_...      # ou sk_test_... en développement
STRIPE_WEBHOOK_SECRET=whsec_...    # secret de signature du webhook
NEXT_PUBLIC_SITE_URL=https://powamekka.com
```

### Webhook

Endpoint `we_1U3xgbAmS2hPu7V9iBYUTRnp`, déclaré sur `https://powamekka.com/api/stripe/webhook`
avec l'événement `checkout.session.completed`. Chaque commande payée déclenche un email vers
`contact@powamekka.com`.

Le compte Stripe étant partagé avec d'autres produits (Ozance), l'endpoint reçoit aussi leurs
événements : le handler ne traite que les sessions portant `metadata.source === 'powamekka.com'`,
posée à la création de la session dans `/api/checkout`.

En local :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Tester avec des prix de test

Les `priceId` du catalogue sont ceux du mode **live**. Pour tester avec des clés `sk_test_`,
surchargez chaque prix sans toucher au code, via `STRIPE_PRICE_<OFFRE>` :

```bash
STRIPE_PRICE_LANDING_PAGE=price_test_...
STRIPE_PRICE_SITE_VITRINE=price_test_...
```

### Modifier un tarif

Changez le prix dans Stripe (nouveau `Price`), puis reportez le nouveau `priceId` **et** le champ
`price` (en centimes, pour l'affichage) dans `lib/offers.ts`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
