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
- [x] ~~**Schéma `Offer`** sur `/offres`.~~ Corrigé le 2026-10-26 : `offerCatalogJsonLd` ajouté
      à `lib/schema.ts` (type `OfferCatalog`, un `Offer` par formule avec `price`/`priceCurrency`
      lus directement depuis `lib/offers.ts`, jamais dupliqués en dur) et injecté dans
      `app/offres/page.tsx`. `lib/offers.ts` lui-même non modifié. Un `id` DOM a été ajouté à
      chaque carte dans `components/OffersGrid.tsx` pour que les ancres `#<id>` du schéma
      pointent vers un élément réel.
- [x] ~~**Poids de `public/og-image.png`**~~ (770 Ko, servi tel quel pour l'OpenGraph, hors
      pipeline `next/image`). Corrigé le 2026-10-26 : recompressé en PNG palette (52 couleurs,
      193 Ko), écart RMSE 0,003 vs l'original (imperceptible), vérifié visuellement avant
      remplacement.
- [ ] **Poids de `public/conviction-illustration.png`** (677 Ko). Tenté le 2026-10-26 : WebP
      lossy et lossless testés, mais le rendu de la transparence diffère entre les outils de
      prévisualisation disponibles dans l'environnement (fond crème vs blanc selon le décodeur),
      impossible de confirmer avec certitude l'absence d'écart visuel réel. Non remplacé par
      prudence — c'est un visuel de marque. Priorité plus basse que `og-image.png` : cette image
      passe par `next/image`, qui ré-encode déjà les octets réellement servis aux visiteurs ;
      le poids du fichier source affecte surtout le dépôt, pas le LCP. À reprendre avec un outil
      de compression qui gère proprement l'alpha (pngquant avec dithering, ou vérification sur
      un vrai navigateur plutôt qu'un rendu d'outil).
- [ ] **Articles existants sans aucun lien interne** avant ce cycle : les deux articles du blog
      (`ia-btp-gagner-du-temps`, `systeme-digital-pme-guide-2026`) n'avaient aucun maillage
      sortant. Deux liens ajoutés à chacun le 2026-10-19 (`/services/audit`, `/services/ia` ou
      `/services/systemes`) ; revoir si des liens supplémentaires font sens avec les prochains
      articles.
- [x] ~~**Chiffres non sourcés dans `ia-btp-gagner-du-temps.md`**~~ (« 15 à 20 % de devis
      supplémentaires » et le cas de l'« artisan électricien en région parisienne »). Reformulés
      le 2026-10-26 sans chiffre ni témoignage client invérifiable, comme prévu par ce backlog
      si non confirmés avant ce cycle. Aucun humain disponible pour confirmer en cycle
      automatisé.

---

## Éditorial — file d'attente

Un article par cycle, pris en haut de liste.

~~**« Par où commencer avec l'IA quand on dirige une PME (et qu'on n'y connaît rien) »**~~
Publié le 2026-10-19 (`content/blog/par-ou-commencer-ia-entreprise.md`).

~~**« Combien coûte vraiment l'automatisation d'une PME »**~~
Publié le 2026-10-26 (`content/blog/combien-coute-automatisation-pme.md`). Fourchettes de prix
réelles issues de `lib/offers.ts` (audit à 205 €, briques ponctuelles 205-299 €, sur-mesure à
partir de 2 500 €), ce qui fait varier la facture, ce qui ne vaut pas le coût, quatre questions
à poser avant de signer un devis. Lien pilier `/services/audit` et `/offres`, 2 liens vers les
articles existants (`par-ou-commencer-ia-entreprise`, `ia-btp-gagner-du-temps`) — lien
réciproque ajouté depuis le premier.

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

---

## Idées non priorisées

À faire remonter dans la file quand les données Search Console les confirment.

- Étude de cas anonymisée, à écrire uniquement à partir d'une mission réelle validée par Abdoulaye.
- Page glossaire « le vocabulaire de l'IA pour dirigeants », si le cluster 1 progresse.
- Comparatif honnête des outils d'automatisation grand public (Zapier / Make / n8n).
- **À vérifier (technique, pas éditorial)** : la requête « powamekka café » apparaît dans
  l'export GSC du 2026-10-19 (1 impression, position 13, sur la page d'accueil). Cause probable :
  confusion avec un autre établissement, ou une fiche Google Business Profile mal catégorisée.
  Rien à corriger dans le code ; vérifier côté fiche GBP si elle existe. N'apparaît plus dans
  l'export du 2026-10-26 (une seule requête remontée, « powamekka ») : possible disparition
  naturelle, à ne pas sur-interpréter sur un aussi faible volume.
- Une fois l'article `combien-coute-automatisation-pme` indexé (délai habituel 2 à 8 semaines),
  surveiller s'il capte des impressions sur des requêtes de type « prix automatisation PME » /
  « combien coûte un chatbot IA ». Si oui, candidat à une FAQ dédiée sur `/offres` qui reprendrait
  les mêmes questions en format `FAQPage` structuré.
- Le schéma `Offer` ajouté le 2026-10-26 ne couvre que les 5 offres principales de
  `lib/offers.ts` (`offers`), pas le catalogue de 22 prestations à la carte (`services`). À
  étendre si Google Merchant / rich results sur les offres principales montrent un effet
  mesurable après quelques semaines — pas de valeur à l'étendre en aveugle.
