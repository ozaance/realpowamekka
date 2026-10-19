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
- [ ] **Poids des images** : `public/og-image.png` (770 Ko) et
      `public/conviction-illustration.png` (677 Ko) dépassent largement les ~200 Ko visés.
      `og-image.png` est servi tel quel (pas optimisé par `next/image`) pour l'OpenGraph : son
      poids ralentit l'aperçu social, pas le LCP. À compresser (format WebP ou PNG optimisé)
      avec vérification visuelle avant de remplacer les fichiers de marque.
- [ ] **Articles existants sans aucun lien interne** avant ce cycle : les deux articles du blog
      (`ia-btp-gagner-du-temps`, `systeme-digital-pme-guide-2026`) n'avaient aucun maillage
      sortant. Deux liens ajoutés à chacun le 2026-10-19 (`/services/audit`, `/services/ia` ou
      `/services/systemes`) ; revoir si des liens supplémentaires font sens avec les prochains
      articles.
- [ ] **Chiffres non sourcés dans `ia-btp-gagner-du-temps.md`** à vérifier avec Abdoulaye :
      « 15 à 20 % de devis supplémentaires » et le cas de l'« artisan électricien en région
      parisienne » (ligne ~29 et ~45). Présents avant ce cycle, non modifiés, mais à confirmer
      ou reformuler sans chiffre si non vérifiables — l'interdit sur les statistiques et
      témoignages inventés s'applique aussi au contenu existant.

---

## Éditorial — file d'attente

Un article par cycle, pris en haut de liste.

~~**« Par où commencer avec l'IA quand on dirige une PME (et qu'on n'y connaît rien) »**~~
Publié le 2026-10-19 (`content/blog/par-ou-commencer-ia-entreprise.md`).

1. **« Combien coûte vraiment l'automatisation d'une PME »**
   Intention : commerciale. Cluster 1 + 4. Peu traité honnêtement par la concurrence.
   Angle : fourchettes réelles, ce qui fait varier le prix, ce qui ne vaut pas le coup.
   Lien pilier : `/offres`, `/services/audit`.

2. **« Relancer ses devis automatiquement : ce que ça change sur un mois »**
   Intention : commerciale, cluster 3 (BTP). Concurrence faible.
   Angle : le calcul concret sur un carnet de devis type.
   Lien pilier : `/services/ia`.

3. **« Former ses équipes à l'IA sans bloquer la production »**
   Intention : informationnelle, cluster 5.
   Lien pilier : `/services/formation`.

4. **« MVP ou site vitrine : ce dont vous avez réellement besoin pour lancer »**
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
  Rien à corriger dans le code ; vérifier côté fiche GBP si elle existe.
