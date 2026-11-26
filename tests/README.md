# Tests

## Tests d'intégration (aucun appel réel)

```
npm run build
npm run test:integration
```

Le lanceur (`tests/run.mjs`) fait, dans l'ordre :

1. **Refuse de démarrer si un port est déjà occupé** (3190 pour le site, 4010 pour le faux Resend) :
   sinon les tests tourneraient contre un autre serveur, peut-être avec de vraies clés.
2. **Teste le garde-fou réseau** (`tests/garde-fous.mjs`) : si le verrouillage ne bloque pas tout, rien ne démarre.
3. Démarre le site construit avec :
   - un faux Resend (`tests/mock-resend.mjs`) : aucun e-mail n'est envoyé ;
   - un **réseau sortant verrouillé** (`tests/fake-payments.mjs`, préchargé par `NODE_OPTIONS`) :
     - Mollie est simulé et refuse toute clé qui ne commence pas par `test_` ;
     - **tout autre appel sortant est bloqué et journalisé**, par `fetch` comme par `node:http` et
       `node:https`. Cette seconde voie est celle du SDK Stripe, qui n'utilise pas `fetch` ;
     - seul le réseau local (127.0.0.1) reste ouvert ;
   - des clés et URL de test imposées, qui priment sur un éventuel `.env.local`.
4. Lance `tests/integration.mjs`.

Les appels simulés ou bloqués sont consignés dans l'état partagé (`calls`) : les tests s'en servent
pour prouver qu'**aucun appel à Stripe ni à un service externe** n'a eu lieu.

### Couverture

- formulaire de contact, webhooks Stripe et Mollie ;
- commande Mollie : montant, libellé, métadonnées, retour vers `/merci` ;
- **montant encaissé égal au prix du catalogue** pour les 9 offres et prestations commandables en ligne (les 16 autres sont sur devis, refusées par le serveur) ;
- **Prototype MVP, SaaS Standard, SaaS Premium : refusés côté serveur** (403), quel que soit le
  prestataire demandé ou le montant envoyé, sans aucun appel à Mollie ni à Stripe ;
- **Stripe fermé aux nouvelles commandes** : 403, jamais de repli sur Stripe par défaut ;
- **informations de facturation et acceptation des CGV** (`lib/billing.ts`) : désactivées par défaut (le serveur principal des tests garde le comportement de production et prouve que la requête envoyée à Mollie est inchangée) ; un **second serveur**, démarré par `tests/run.mjs` avec `BILLING_FIELDS_ENABLED=1` et `CGV_ACCEPTANCE_ENABLED=1`, vérifie les refus (SIREN, TVA, adresse, case CGV), les métadonnées Mollie, la limite de taille et la notification interne ;
- **grille tarifaire 2026** (`lib/pricing.ts`, indicateur `PRICING_2026`) : désactivée par défaut (le serveur principal prouve que les anciens prix, sans HT ni TTC, sont inchangés) ; un **troisième serveur** avec `PRICING_2026=1` vérifie que le montant envoyé à Mollie est le prix HT x 1,20 de la grille (recopiée indépendamment dans le test), l'affichage HT, TVA et TTC, les 16 offres sur devis toujours refusées, Stripe fermé et les données structurées en HT ;
- page `/merci` (e-mail masqué), pages principales, en-têtes de sécurité.

### Ces tests décrivent l'état de `main` après les PR #35 et #36

Ils supposent que Stripe est fermé aux nouvelles commandes (#35) et que les trois offres
Prototype MVP / SaaS sont réservées au devis (#36). Fusionnés avant elles, ils échouent, et c'est
voulu : ils signalent que ces protections manquent.

### Limites connues

- Les prix attendus sont lus dans `lib/offers.ts` par expression régulière : si la structure de ce
  fichier change (par exemple au branchement de la grille 2026), adapter la lecture.
- Le nombre d'identifiants (25) est vérifié explicitement : toute offre ajoutée ou retirée doit
  être répercutée ici.
- Le verrouillage couvre `fetch`, `node:http` et `node:https`. Il ne couvre pas un module qui
  ouvrirait directement une socket (`node:net`), ce que le code actuel ne fait pas.

## Test Mollie en mode test (optionnel)

```
npm run build
MOLLIE_TEST_API_KEY=test_xxx npm run test:mollie
```

Utilise l'API Mollie en **mode test** (aucun argent réel) : ce test, lui, contacte vraiment Mollie.
Le script refuse de s'exécuter avec une clé qui ne commence pas par `test_`, et avec un port déjà
occupé (3191, variable `TEST_MOLLIE_PORT`). Ne jamais y mettre la clé de production.
