# Backlog éditorial & technique

File priorisée. L'agent prend **le premier élément non bloqué** de chaque section à chaque cycle,
puis met ce fichier à jour. Abdoulaye peut réordonner, ajouter ou supprimer librement.

---

## Technique — par ordre d'impact

- [x] ~~**Canonical erroné sur tout le site.**~~ Corrigé le 2026-09-04 : canonical retiré du
      layout, déclaré explicitement sur chaque page. Vérifié sur le build.
- [x] ~~**JSON-LD `BlogPosting`** absent sur `app/blog/[slug]/page.tsx`.~~ Corrigé le
      2026-10-19 : ajouté via `lib/schema.ts`, avec `BreadcrumbList`.
- [x] ~~**CTA BTP codé en dur** sur tous les articles.~~ Corrigé le 2026-10-19 : conditionné à
      `category` (`app/blog/[slug]/page.tsx`), repli générique pour les autres catégories.
- [x] ~~**OpenGraph par page** : les pages de service et les articles héritaient de l'OG de
      l'accueil.~~ Corrigé le 2026-10-19 : `openGraph` propre sur les cinq pages de
      `app/services/*` et image ajoutée sur les articles.
- [x] ~~**`BreadcrumbList`** sur articles et pages de service.~~ Corrigé le 2026-10-19, en
      même temps que le schéma `Service` / `BlogPosting`.
- [x] ~~**`lastModified` du sitemap** : `new Date()` pour toutes les pages statiques.~~ Corrigé
      le 2026-10-19 : date du dernier commit du fichier via `git log`, repli du
      2026-09-04 si la commande échoue (environnement sans historique).
- [x] ~~**Schéma `Service`** sur les cinq pages de `app/services/`.~~ Corrigé le 2026-10-19,
      rattaché à l'entité `ProfessionalService` de l'accueil via `@id`.
- [ ] **Schéma `Offer`** sur `/offres`, aligné sur les prix de `lib/offers.ts`. Reporté : touche
      à l'affichage des tarifs, à traiter avec soin dans un cycle dédié, pas en fin de cycle.
- [x] ~~**Poids des images**~~ Corrigé le 2026-11-09 :
      - `public/og-image.png` (752 Ko, 1731×909, servi tel quel pour l'OpenGraph, hors
        `next/image`) recadré à la taille standard 1200×630 et reconverti en JPEG qualité 90 →
        `public/og-image.jpg`, 36 Ko. Toutes les références mises à jour (`app/layout.tsx`,
        `lib/schema.ts`, les cinq pages `app/services/*`, `app/blog/[slug]/page.tsx`).
        Vérifié visuellement avant remplacement : rendu identique.
      - `public/art/hero-atelier.jpg` (392 Ko, image LCP du hero, `fetchPriority="high"`),
        `cta-atelier.jpg` (492 Ko) et les cinq `discipline-*.jpg` (296 à 380 Ko) recompressés en
        JPEG qualité 70 (chroma 4:2:0), hors `next/image` eux aussi : 170 à 233 Ko chacun après,
        soit environ -55 % en moyenne. Vérifié visuellement (hero + un visuel de discipline) :
        aucun artefact visible.
      - `public/conviction-illustration.png` (664 Ko) non touché : déjà servi via `next/image`
        (`components/Conviction.tsx`, `components/cine/ConvictionCine.tsx`), donc déjà
        redimensionné et recompressé à la volée par Next en production. Le poids de la source
        ne reflète pas ce qui part réellement au navigateur.
- [ ] **Vidéos de fond non optimisées** : découvert en marge de l'audit images du 2026-11-09,
      `public/art/hero-atelier.mp4` (9,4 Mo) et `cta-atelier.mp4` (3,1 Mo) sont servies telles
      quelles. `ffmpeg` est disponible dans l'environnement, mais un ré-encodage touche à la
      section la plus visible du site (hero d'accueil) et mérite une vérification de lecture
      complète (navigateur, pas seulement une capture statique) plutôt qu'un traitement en fin
      de cycle. Reporté à un cycle dédié, avec contrôle du rendu sur `HeroTableau` et `CTACine`.
- [ ] **Articles existants sans aucun lien interne** avant ce cycle : les deux articles du blog
      (`ia-btp-gagner-du-temps`, `systeme-digital-pme-guide-2026`) n'avaient aucun maillage
      sortant. Deux liens ajoutés à chacun le 2026-10-19 (`/services/audit`, `/services/ia` ou
      `/services/systemes`) ; revoir si des liens supplémentaires font sens avec les prochains
      articles.
- [x] ~~**Chiffres non sourcés dans `ia-btp-gagner-du-temps.md`**~~ Traité le 2026-11-09, faute
      de confirmation possible d'Abdoulaye en cycle automatisé : le « 15 à 20 % de devis
      supplémentaires » et le témoignage non vérifiable de l'« artisan électricien en région
      parisienne » ont été reformulés sans chiffre ni cas client inventé, conformément à la
      règle du cycle (« si un chiffre n'est pas sourçable, formuler l'idée sans le chiffre »).
      Si Abdoulaye dispose d'un vrai cas chiffré et vérifiable, il peut le réintroduire à la
      main — l'agent ne le fera pas de lui-même.

---

## Éditorial — file d'attente

Un article par cycle, pris en haut de liste.

~~**« Par où commencer avec l'IA quand on dirige une PME (et qu'on n'y connaît rien) »**~~
Publié le 2026-10-19 (`content/blog/par-ou-commencer-ia-entreprise.md`).

~~**« Combien coûte vraiment l'automatisation d'une PME »**~~
Publié le 2026-11-09 (`content/blog/combien-coute-automatisation-pme.md`), cluster 1 + 4,
1273 mots, 5 liens internes. Fourchettes de prix reprises de `lib/offers.ts` (seules valeurs
chiffrées utilisées), pas de statistique ou de chiffre inventé.

1. **« Relancer ses devis automatiquement : ce que ça change sur un mois »**
   Intention : commerciale, cluster 3 (BTP). Concurrence faible.
   Angle : le calcul concret sur un carnet de devis type.
   Lien pilier : `/services/ia`.

2. **« Former ses équipes à l'IA sans bloquer la production »**
   Intention : informationnelle, cluster 5.
   Lien pilier : `/services/formation`.

3. **« MVP ou site vitrine : ce dont vous avez réellement besoin pour lancer »**
   Intention : transactionnelle, cluster 7.
   Lien pilier : `/offres`.

4. **« Un audit stratégique PME, ça contient quoi et ça prend combien de temps »**
   Ajouté le 2026-11-09, faute de requête GSC nouvelle à exploiter ce cycle (voir
   `seo/journal.md`) : priorisé au jugement à partir de `seo/strategie.md`, cluster 4.
   Intention : commerciale, complète naturellement l'article sur le coût de l'automatisation
   (qui renvoie déjà vers `/services/audit` sans détailler le déroulé). Angle : ce qui est
   livré concrètement, la durée réelle, ce que l'audit ne fait pas.
   Lien pilier : `/services/audit`.

---

## Idées non priorisées

À faire remonter dans la file quand les données Search Console les confirment.

- Étude de cas anonymisée, à écrire uniquement à partir d'une mission réelle validée par Abdoulaye.
- Page glossaire « le vocabulaire de l'IA pour dirigeants », si le cluster 1 progresse.
- Comparatif honnête des outils d'automatisation grand public (Zapier / Make / n8n).
- **À vérifier (technique, pas éditorial)** : la requête « powamekka café » apparaît dans
  l'export GSC du 2026-10-19 (1 impression, position 13, sur la page d'accueil). Cause probable :
  confusion avec un autre établissement, ou une fiche Google Business Profile mal catégorisée.
  Rien à corriger dans le code ; vérifier côté fiche GBP si elle existe.
