# Tests

## Tests d'intégration (aucun appel réel)

```
npm run build
npm run test:integration
```

Le lanceur (`tests/run.mjs`) démarre le site construit avec :
- un faux Resend (`tests/mock-resend.mjs`) : aucun e-mail n'est envoyé ;
- un faux Mollie et un blocage de Stripe (`tests/fake-payments.mjs`) : aucun paiement n'est
  créé, aucune requête ne part vers Mollie ni Stripe ;
- des clés de test imposées, qui priment sur un éventuel `.env.local`. Le faux Mollie refuse
  toute clé qui ne commence pas par `test_`.

Couverture : formulaire de contact, webhooks Stripe et Mollie, commande Mollie (montant,
libellé, métadonnées, retour), montant encaissé égal au prix du catalogue pour les 25 offres
et prestations, page `/merci` (e-mail masqué), pages principales, en-têtes de sécurité.

## Test Mollie en mode test (optionnel)

```
npm run build
MOLLIE_TEST_API_KEY=test_xxx npm run test:mollie
```

Utilise l'API Mollie en mode test (aucun argent réel). Le script refuse de s'exécuter avec une
clé qui ne commence pas par `test_`. Ne jamais y mettre la clé de production.
