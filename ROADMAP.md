# Feuille de route POWAMEKKA — première version

> Document de cadrage initial fondé sur l'état du dépôt `main` consulté le 23 novembre 2026. Ce document ne vaut pas validation d'une modification du site ni des paiements.

## Objectif général

Faire de POWAMEKKA un site d'agence premium qui transforme clairement les visites en demandes qualifiées : conseil en IA, automatisation et systèmes digitaux pour PME, avec une priorité commerciale BTP et services.

## Phase 0 — Assainir le flux de développement

**Priorité immédiate — avant toute nouvelle refonte**

- [ ] Examiner les PR SEO ouvertes #10, #11 et #12 : comparer leurs diffs, repérer les changements qui se recouvrent et ne conserver que les changements validés.
- [ ] Examiner les branches historiques `feat/refonte-cinematique`, `feat/services-a-la-carte`, `feat/stripe-checkout` et `feat/mollie-checkout` ; déterminer si elles sont déjà intégrées, obsolètes ou encore utiles. Ne pas fusionner à l'aveugle.
- [ ] Confirmer dans Vercel que `main` est bien la branche de production et que les autres branches créent des déploiements Preview.
- [ ] Mettre en place une règle d'équipe : toute évolution passe par une branche et une PR ; aucun déploiement de production sans validation.
- [ ] Ajouter une vérification automatique de build sur les PR (GitHub Actions) après validation de la commande de build et des variables nécessaires.

**Livrable :** historique Git lisible, PR en attente réconciliées, Preview Vercel utilisée systématiquement.

## Phase 1 — Fiabilité et sécurité

**Priorité très élevée — protéger les demandes entrantes et les paiements**

- [ ] Revoir `app/api/contact/route.ts` : les champs utilisateur sont injectés dans le HTML de l'email sans échappement HTML visible dans le code consulté. Échapper toutes les valeurs, valider les formats et limiter les longueurs avant envoi.
- [ ] Ajouter une protection anti-spam proportionnée au formulaire (limitation de débit et/ou honeypot), sans bloquer les vrais prospects.
- [ ] Vérifier la configuration Resend : domaine expéditeur vérifié, adresse d'envoi, gestion des erreurs et délivrabilité. Le code actuel utilise `onboarding@resend.dev`.
- [ ] Auditer le flux de paiement Stripe et Mollie : prix exclusivement déterminés côté serveur, signature des webhooks, idempotence, gestion des échecs/annulations et redirections autorisées.
- [ ] Tester les parcours de paiement en mode test avant tout changement en production ; ne pas modifier les identifiants ou tarifs pendant cet audit.
- [ ] Ajouter ou documenter les commandes de qualité (lint, typecheck, tests) ; le `package.json` consulté expose actuellement `dev`, `build` et `start`.

**Critère de sortie :** formulaires et paiements testés de bout en bout, erreurs maîtrisées, aucun secret dans Git, build validé.

## Phase 2 — Positionnement et conversion

**Priorité élevée — faire comprendre l'offre en quelques secondes**

- [ ] Rendre la promesse d'accueil plus concrète : à qui POWAMEKKA s'adresse, quels problèmes sont résolus, quels résultats opérationnels sont recherchés.
- [ ] Garder la signature « Building the future of business », mais accompagner le message éditorial « Bâtir des entreprises plus claires » d'une explication très concrète : automatiser l'administratif, fiabiliser le suivi client, connecter les outils, exploiter les données.
- [ ] Clarifier la hiérarchie des offres : 1) audit et conseil IA, 2) automatisation et intégration, 3) systèmes digitaux sur mesure ; présenter sites premium et formation comme offres complémentaires selon le besoin.
- [ ] Construire un parcours BTP lisible (exemples de processus : devis, relances, comptes rendus, suivi d'intervention), sans enfermer l'agence dans ce seul secteur.
- [ ] Créer une preuve de compétence pour chaque offre : démonstration, capture, schéma avant/après ou étude de cas réelle autorisée. Aucun chiffre ni témoignage ne doit être inventé.
- [ ] Vérifier que les CTA conduisent à une action simple et mesurable : audit, prise de rendez-vous ou formulaire qualifiant. Comparer le parcours WhatsApp au formulaire existant.
- [ ] Harmoniser les pages Services, Offres, Vision, FAQ et Blog avec cette hiérarchie et éviter les promesses trop générales.

**Critère de sortie :** un visiteur comprend la cible, les problèmes traités, les prestations et l'étape suivante sans devoir interpréter le discours.

## Phase 3 — Expérience, performance et accessibilité

**Priorité élevée — préserver le premium sans pénaliser l'usage**

- [ ] Tester le parcours complet sur mobile réel : navigation, ancres, menus, CTA, lecture, formulaire et paiement.
- [ ] Mesurer l'effet du héros cinématique et de la galerie à défilement long. Le code actuel réserve 420svh au héros sur grand écran et 300svh sur petit écran ; la galerie réserve environ 490svh sur grand écran et 380svh sur petit écran.
- [ ] Garder une expérience cohérente avec `prefers-reduced-motion` et vérifier les interactions clavier, focus, contrastes et lecteurs d'écran.
- [ ] Mesurer les Core Web Vitals et identifier les ressources les plus lourdes. Le PR #12 signale notamment deux vidéos de 9,4 Mo et 3,1 Mo, encore à examiner.
- [ ] Optimiser les images et vidéos sans dégrader le rendu de marque ; contrôler le rendu final dans la Preview.
- [ ] Vérifier les titres, descriptions, canonicals, Open Graph, sitemap, robots et données structurées après consolidation des PR SEO.

**Critère de sortie :** site rapide et utilisable sur mobile, animation non bloquante, accessibilité de base vérifiée.

## Phase 4 — Mesure et acquisition

**Priorité moyenne — piloter avec des données fiables**

- [ ] Vérifier Search Console : propriété du domaine, indexation des pages de service, erreurs et requêtes non-marque.
- [ ] Activer et vérifier une mesure d'audience respectueuse de la configuration choisie. Le PR #12 rapporte un retour 404 de Vercel Web Analytics ; activation à confirmer dans le tableau de bord.
- [ ] Suivre des événements utiles : clic WhatsApp, envoi du formulaire, début de checkout, achat confirmé.
- [ ] Définir un tableau de bord mensuel : visites qualifiées, sources, clics CTA, demandes, rendez-vous et ventes.
- [ ] Construire le calendrier éditorial à partir des questions clients et des données réelles, pas d'un volume d'articles sans intention commerciale.

**Critère de sortie :** POWAMEKKA sait quelles pages et sources génèrent des demandes, et peut prioriser les améliorations à partir de données.

## Ordre recommandé des 5 premières tâches

1. Réconcilier les PR #10–#12 et les branches de paiement/refonte.
2. Sécuriser et fiabiliser le formulaire de contact.
3. Auditer les paiements Stripe/Mollie sans modifier les tarifs.
4. Clarifier la promesse et les offres de la page d'accueil.
5. Tester mobile, performance et accessibilité du parcours cinématique.

## Règle de validation

Chaque tâche produit une PR indépendante avec critères d'acceptation, build vérifié, résumé des changements et URL Preview. La fusion dans `main` reste une décision humaine.
