# Feuille de route POWAMEKKA

> Mise à jour le 25 novembre 2026 à partir de `main` (`7621d49`). Ce document ne vaut pas validation d'une modification du site ni des paiements. Il remplace la première version du 23 novembre, devenue en partie obsolète.

**Légende**
- ✅ **Réalisé** : fusionné sur `main`.
- ⏳ **En attente** : PR ouverte, ou validation du responsable requise.
- 📌 **Décidé, non implémenté** : la décision est prise, mais le site ne la reflète pas encore.
- 🔲 **Prévu** : à étudier ou à planifier, pas encore décidé en détail.

## 1. Décisions validées et leur état réel

| Décision | État | Précision |
|---|---|---|
| Clientèle exclusivement professionnelle (B2B), entreprises françaises au lancement | 📌 | Pas encore reflétée dans tous les textes publics. |
| Mollie est le moyen de paiement actif | ✅ | Seul moyen proposé et accepté pour les nouvelles commandes. |
| Stripe fermé aux nouvelles commandes | ✅ | Refus côté serveur (PR #35), masqué dans l'interface (PR #18). Code, webhook et confirmation des anciennes commandes conservés. |
| Prototype MVP, SaaS Standard, SaaS Premium : sur devis uniquement | ✅ | Commande en ligne refusée par le serveur, bouton « Demander un devis » (PR #36). |
| Paiement des offres sur devis en 3 échéances (40 %, 40 %, 20 %) par factures et liens de paiement Mollie | 📌 | Non automatisé : se fait hors du site. |
| Délais affichés : « Délai confirmé après cadrage » | ✅ | PR #33. |
| Grille tarifaire 2026 (5 offres, 20 prestations à la carte, abonnement d'hébergement) | ⏳ | Préparée dans la PR #32 (`lib/pricing.ts`, pas encore sur `main`), **non branchée** : le site affiche et Mollie encaisse toujours les prix actuels de `lib/offers.ts`. |
| Prix principal en HT, TTC en dessous, TVA 20 % | 📌 | Prévu pour la bascule de la grille. Aujourd'hui, la page Offres n'affiche aucune mention HT ou TTC. |
| Hébergement 12 mois inclus (Landing page, Site vitrine), puis abonnement sur acceptation écrite préalable, sans reconduction automatique | 📌 | Aucun mécanisme d'abonnement n'existe ; conditions détaillées en cours de validation. |
| Maintenance ponctuelle distincte de l'abonnement d'hébergement | ⏳ | Distinction prévue dans la grille de la PR #32 ; non publiée. |
| Facturation : dénomination, SIREN et adresse de facturation obligatoires ; TVA intracommunautaire facultative ; aucun système de facturation maison | 📌 | Rien n'est collecté ni transmis aujourd'hui ; outil externe à choisir. |
| Conditions générales de vente publiées **avant** la bascule des tarifs | ⏳ | Rédaction en validation ; rien n'est publié. Les documents juridiques de travail sont conservés hors du dépôt public. |
| Aucune PR fusionnée sans autorisation explicite du responsable | ✅ | Règle de travail, voir `COLLABORATION.md` ; fusion technique protégée par le ruleset de `main`. |

## 2. Réalisé (✅)

**Flux de développement**
- Toute évolution passe par une branche et une PR ; Previews Vercel systématiques.
- Tests d'intégration versionnés, sans appel réel (PR #34) : réseau sortant verrouillé, Mollie et Resend simulés, 75 tests au minimum exigés.
- CI sur chaque PR, sans secret (PR #37), rendue stricte (PR #38) : un fichier de test manquant, un test en échec ou moins de 75 tests réussis font échouer le contrôle.
- Ruleset « Protéger main » actif : PR obligatoire, contrôles `Types, build et tests` et `Vercel`, branche à jour, fusion par commit de fusion uniquement, aucun contournement.

**Sécurité et fiabilité**
- Formulaire de contact : échappement HTML, limitation de débit, champ piège anti-spam ; expéditeur Resend `notifications@powamekka.com` (PR #14).
- Paiement : le prix vient toujours du catalogue serveur, jamais de la requête ; limitation de débit ; webhooks Stripe et Mollie testés (signature Stripe, pas de doublon à la relecture d'un événement).
- En-têtes de sécurité HTTP (PR #30). Page `/merci` : e-mail masqué et identifiants de paiement vérifiés (PR #31).

**Paiement et offres**
- Mollie (PR #6), services à la carte (PR #7), Stripe masqué (PR #18) puis fermé côté serveur (PR #35), offres MVP et SaaS sur devis (PR #36).

**Textes, conversion et interface**
- Premier écran commercial lisible (PR #27), boutons « Demander un premier échange » (PR #28, PR #29), délais « confirmés après cadrage » (PR #33), libellé Mollie et e-mails sans tirets longs (PR #26).
- Ancres, menu mobile, grilles, navigation et accessibilité mobiles (PR #19 à #23).
- Polices auto-hébergées (PR #24), optimisation des médias (PR #25).

**SEO**
- Domaine canonique `www` (PR #1), export Search Console planifié (PR #2 à #5), contenus et consolidation SEO (PR #9, PR #15). La procédure SEO est dans `.claude/skills/seo/SKILL.md`.

## 3. En attente (⏳)

- **PR #32** : grille tarifaire 2026 préparée, non branchée. Elle ne modifie aucun prix affiché, aucun montant encaissé ni aucun parcours de paiement.
- **PR #17** : retrait du dépôt public de six documents de travail (brouillons juridiques et rapport d'analyse). Des copies sont conservées hors du dépôt.
- **PR #13** : cette documentation, en Draft.
- **Validations du responsable** : conditions générales de vente, mentions légales et politique de confidentialité ; conditions de l'abonnement d'hébergement ; choix de l'outil de facturation.

## 4. Prévu

### Phase A : bascule de la grille 2026 (priorité)
Une seule PR de bascule, après les étapes 1 et 2, et avec validation explicite.
1. 📌 Valider puis publier les conditions de vente, mentions légales et politique de confidentialité, adaptées à une clientèle professionnelle. **La publication précède la bascule.**
2. 📌 Collecter à la commande la dénomination, le SIREN (avec contrôle de validité) et l'adresse de facturation ; numéro de TVA facultatif ; choisir l'outil de facturation externe.
3. 📌 Bascule : affichage HT et TTC, montants Mollie (première échéance pour les offres en plusieurs paiements), données structurées, FAQ et mentions d'acompte, **mis à jour ensemble** pour éviter tout écart entre prix affiché et montant encaissé.
4. 📌 Tests de paiement en mode test Mollie, avec une clé de test uniquement, avant toute mise en production.
5. 🔲 Abonnement d'hébergement : mécanisme d'encaissement mensuel à choisir (facture et lien de paiement, ou prélèvement), après validation des conditions de résiliation, de préavis et de transfert.

### Phase B : qualité continue
- 🔲 Étudier l'ajout d'un lint (aucune commande de lint n'existe aujourd'hui dans `package.json`).
- 🔲 Adapter la lecture des prix des tests (expression régulière sur `lib/offers.ts`) lors de la bascule de la grille.
- Ne jamais baisser le plancher de 75 tests ni assouplir la CI sans décision explicite.

### Phase C : positionnement et conversion (non revérifié depuis le 23 novembre)
- 🔲 Rendre la promesse d'accueil plus concrète : à qui POWAMEKKA s'adresse, quels problèmes sont résolus.
- 🔲 Clarifier la hiérarchie des offres : audit et conseil IA, automatisation et intégration, systèmes digitaux sur mesure ; sites premium et formation en complément.
- 🔲 Construire un parcours BTP lisible (devis, relances, comptes rendus, suivi d'intervention) sans enfermer l'agence dans ce secteur.
- 🔲 Créer une preuve de compétence par offre : démonstration, schéma avant / après ou étude de cas réelle autorisée. Aucun chiffre ni témoignage ne doit être inventé.
- 🔲 Vérifier que chaque appel à l'action mène à une action simple et mesurable.

### Phase D : expérience, performance, mesure (non revérifié depuis le 23 novembre)
- 🔲 Tester le parcours complet sur mobile réel ; mesurer le héros cinématique et la galerie à défilement long ; vérifier `prefers-reduced-motion`, clavier, focus, contrastes.
- 🔲 Mesurer les Core Web Vitals et identifier les ressources les plus lourdes.
- 🔲 Vérifier Search Console (propriété, indexation, requêtes hors marque) et l'état de la mesure d'audience ; suivre des événements utiles (clic WhatsApp, formulaire, début de commande, achat confirmé).

## 5. Ordre recommandé des prochaines tâches
1. Valider et publier les documents légaux adaptés au B2B.
2. Choisir l'outil de facturation et définir les informations à collecter à la commande.
3. Préparer la PR de bascule de la grille 2026, avec tests en mode test Mollie.
4. Reprendre l'audit mobile, performance et accessibilité du parcours cinématique.
5. Produire les premières preuves de compétence réelles et autorisées.

## Règle de validation
Chaque tâche produit une PR indépendante avec critères d'acceptation, `npx tsc --noEmit`, `npm run build` et `npm run test:integration` exécutés, résumé des changements et URL de la Preview. La fusion dans `main`, qui déclenche la production, n'a lieu que sur autorisation explicite du responsable pour cette PR.
