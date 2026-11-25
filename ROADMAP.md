# Feuille de route POWAMEKKA

> Statuts au 25 novembre 2026, à partir de `main` (`7621d49`, déployé en production). Ils peuvent être périmés : vérifier l'état réel avant de s'y fier. Ce document ne vaut pas validation d'une modification du site ni des paiements. Il remplace la première version du 23 novembre, devenue en partie obsolète.

**Légende**
- ✅ **Réalisé et vérifié** : fusionné sur `main`, donc présent dans la production actuelle, et contrôlé. Le contrôle est indiqué : **(prod)** sondé sur le site en production le 25 novembre ; **(CI)** couvert par un test automatisé exécuté à chaque PR. Aucun paiement réel n'a été effectué pour ces contrôles.
- 🟡 **Réalisé, non revérifié** : fusionné donc en production, mais non contrôlé lors de la revue du 25 novembre.
- ⏳ **En attente** : PR ouverte, ou validation du responsable requise.
- 📌 **Décidé, non implémenté** : la décision est prise, mais le site ne la reflète pas encore.
- 🔲 **Prévu, non décidé** : à étudier ou à planifier, sans décision de détail.

## 1. Décisions validées et leur état réel

| Décision | État | Précision |
|---|---|---|
| Clientèle exclusivement professionnelle (B2B), entreprises françaises au lancement | 📌 | Pas encore reflétée dans tous les textes publics. |
| Mollie est le moyen de paiement actif | ✅ (prod, CI) | La voie Mollie répond en production (erreur de validation sur un client invalide, aucun paiement créé). Création du paiement et montants vérifiés par la CI avec Mollie simulé. **Aucun paiement réel n'a été testé.** |
| Stripe fermé aux nouvelles commandes | ✅ (prod, CI) | Refus côté serveur (PR #35), masqué dans l'interface (PR #18). Code, webhook et confirmation des anciennes commandes conservés. |
| Prototype MVP, SaaS Standard, SaaS Premium : sur devis uniquement | ✅ (prod, CI) | Commande en ligne refusée par le serveur, bouton « Demander un devis » (PR #36). |
| Paiement des offres sur devis en 3 échéances (40 %, 40 %, 20 %) par factures et liens de paiement Mollie | 📌 | Non automatisé : se fait hors du site. |
| Site vitrine payé en 2 fois (50 %, 50 %) ; dernier paiement avant la mise en production pour toutes les offres | 📌 | Aujourd'hui, Mollie encaisse le prix complet en un seul paiement. L'échéancier n'existe que dans le module préparé par la PR #32. |
| Délais affichés : « Délai confirmé après cadrage » | ✅ (prod) | PR #33. |
| Grille tarifaire 2026 (5 offres, 20 prestations à la carte, abonnement d'hébergement) | ⏳ | Préparée dans la PR #32 (`lib/pricing.ts`, pas encore sur `main`), **non publiée et non branchée** : le site affiche et Mollie encaisse les prix actuels de `lib/offers.ts`. |
| Prix principal en HT, TTC en dessous, TVA 20 % | 📌 | Prévu pour la bascule de la grille. Aujourd'hui, la page Offres n'affiche aucune mention HT ou TTC (constaté en production). |
| Hébergement 12 mois inclus (Landing page, Site vitrine), puis abonnement sur acceptation écrite préalable, sans reconduction automatique | 📌 | Aucun mécanisme d'abonnement n'existe ; conditions détaillées en cours de validation. |
| Maintenance ponctuelle distincte de l'abonnement d'hébergement | ⏳ | Distinction préparée dans la PR #32 ; non publiée. |
| Facturation : dénomination, SIREN et adresse de facturation obligatoires ; TVA intracommunautaire facultative ; aucun système de facturation maison | 📌 | Rien n'est collecté ni transmis aujourd'hui ; outil externe à choisir. |
| Conditions générales de vente publiées **avant** la bascule des tarifs | ⏳ | Rédaction en validation ; rien n'est publié. |
| Mentions légales et politique de confidentialité | ⏳ | Brouillons conservés hors du dépôt public ; informations d'identification de l'éditeur à fournir. Aucune page légale n'est en ligne (constaté en production : `/mentions-legales`, `/cgv`, `/confidentialite` répondent 404). |
| Aucune PR fusionnée sans autorisation explicite du responsable | 📌 | Règle de travail documentée, **non imposée techniquement** : le ruleset de `main` impose une PR et des contrôles verts, pas l'autorisation du responsable (voir `COLLABORATION.md`). |

## 2. Réalisé

**Flux de développement**
- ✅ Tests d'intégration versionnés, sans appel réel (PR #34) : réseau sortant verrouillé, Mollie et Resend simulés. 75 tests au minimum exigés (CI).
- ✅ CI sur chaque PR, sans secret (PR #37), rendue stricte (PR #38) : un fichier de test manquant, un test en échec ou moins de 75 tests réussis font échouer le contrôle (CI, exécutée sur chaque PR depuis).
- ✅ Ruleset « Protéger main » actif : PR obligatoire, contrôles `Types, build et tests` et `Vercel`, branche à jour, fusion par commit de fusion uniquement, aucun contournement (configuration relue depuis GitHub le 25 novembre).
- 🟡 Previews Vercel sur chaque branche.

**Sécurité et fiabilité**
- ✅ Formulaire de contact : échappement HTML, limitation de débit, champ piège anti-spam, expéditeur Resend `notifications@powamekka.com` (PR #14, CI).
- ✅ Paiement : le prix vient toujours du catalogue serveur, jamais de la requête ; limitation de débit ; webhooks Stripe et Mollie testés (signature Stripe, pas de doublon à la relecture d'un événement) (CI).
- ✅ En-têtes de sécurité HTTP (PR #30) (prod, CI). Page `/merci` : e-mail masqué et identifiants de paiement vérifiés (PR #31) (CI).

**Paiement et offres**
- ✅ Mollie (PR #6) (CI avec Mollie simulé ; aucun paiement réel testé). Services à la carte (PR #7) (prod : la page Offres affiche 22 boutons « Commander », soit la Landing page, le Site vitrine et les 20 prestations).
- ✅ Stripe fermé côté serveur (PR #35) et offres MVP et SaaS sur devis (PR #36) (prod, CI). 🟡 Stripe masqué dans l'interface (PR #18).

**Textes, conversion et interface**
- ✅ Délais « confirmés après cadrage » (PR #33) (prod).
- 🟡 Premier écran commercial lisible (PR #27). Boutons « Demander un premier échange » (PR #28, PR #29), remplacés sur MVP et SaaS par « Demander un devis » (PR #36).
- 🟡 Libellé Mollie et e-mails sans tirets longs (PR #26).
- 🟡 Ancres, menu mobile, grilles, navigation et accessibilité mobiles (PR #19 à #23).
- 🟡 Polices auto-hébergées (PR #24), optimisation des médias (PR #25).

**SEO**
- ✅ Export Search Console planifié (PR #2 à #5) : workflow actif, trois dernières exécutions hebdomadaires réussies (9, 16 et 23 novembre).
- 🟡 Domaine canonique `www` (PR #1), contenus et consolidation SEO (PR #9, PR #15). La procédure SEO est dans `.claude/skills/seo/SKILL.md`.

## 3. En attente

- **PR #32** : grille tarifaire 2026 préparée, non publiée, non branchée. Elle ne modifie aucun prix affiché, aucun montant encaissé ni aucun parcours de paiement.
- **PR #17** : retrait du dépôt public de six documents de travail (brouillons juridiques et rapport d'analyse). Une copie identique, vérifiée le 25 novembre, est conservée hors du dépôt sur le poste du responsable.
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
Chaque tâche produit une PR indépendante avec critères d'acceptation, `npx tsc --noEmit`, `npm run build` et `npm run test:integration` exécutés, résumé des changements et URL de la Preview. Pour un changement visuel, la Preview est validée par l'utilisateur. La fusion dans `main`, qui déclenche la production, n'a lieu que sur autorisation explicite du responsable pour cette PR précise.
