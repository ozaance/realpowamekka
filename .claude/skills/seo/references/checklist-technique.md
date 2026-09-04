# Checklist technique — powamekka.com

Spécifique à ce dépôt. À dérouler à chaque cycle. Cocher mentalement, corriger ce qui est
corrigeable dans le cycle, renvoyer le reste dans `seo/backlog.md`.

## Indexation

- `app/robots.ts` — `/api/` et `/merci` restent interdits, rien d'autre ne doit être bloqué.
- `app/sitemap.ts` — toute nouvelle route de `app/` y figure. Le tableau `services` est
  codé en dur : le mettre à jour à chaque nouvelle page de service.
- `lastModified` : les pages statiques utilisent `new Date()`, donc « modifiée aujourd'hui »
  à chaque build. Google finit par ignorer un sitemap qui ment. Préférer des dates réelles
  (date du dernier commit touchant le fichier, via `git log -1 --format=%cI -- <fichier>`).
- Une seule URL canonique : `https://www.powamekka.com` (avec `www`). Aucun lien interne
  ne doit pointer vers la version sans `www`.

## Métadonnées par page

Chaque route de `app/` exporte `metadata` ou `generateMetadata`. Vérifier pour chacune :

- `title` unique sur le site, ≤ 60 caractères.
- `description` unique, 140-160 caractères.
- `alternates.canonical` renseigné. **Aujourd'hui seul `app/layout.tsx` en a un, figé sur `/`
  — c'est un canonical erroné hérité par toutes les pages sans override.** Priorité haute :
  chaque page doit déclarer le sien.
- `openGraph` : les pages de service et les articles n'en ont pas. Elles héritent de celui du
  layout, donc tous les partages sociaux affichent le titre de l'accueil.

## Données structurées

Présentes : `ProfessionalService` sur `app/page.tsx`, `FAQPage` sur `app/faq/page.tsx`.

Manquantes, par ordre d'impact :

- `BlogPosting` sur `app/blog/[slug]/page.tsx` — headline, description, datePublished,
  dateModified, author, image, mainEntityOfPage.
- `BreadcrumbList` sur les articles et les pages de service.
- `Service` sur chaque page de `app/services/*`, rattaché au `ProfessionalService` de l'accueil.
- `Offer` / `Product` sur `app/offres/page.tsx`, cohérent avec `lib/offers.ts`
  (les prix affichés doivent correspondre — sinon Google signale une incohérence).

Valider tout JSON-LD ajouté : le rendu doit être du JSON strict, sans virgule finale.

## Contenu et structure

- Un seul `<h1>` par page.
- Hiérarchie `h1 → h2 → h3` sans saut de niveau.
- Toutes les `<img>` / `next/image` portent un `alt` descriptif (pas « image », pas vide,
  sauf décoratif). Vérifier `public/conviction-illustration.png` et les logos.
- Pas de page de moins de 300 mots indexable.

## Bug connu à corriger

`app/blog/[slug]/page.tsx` affiche un CTA codé en dur — « Vous êtes dans le BTP… » — sur
**tous** les articles, y compris ceux qui n'ont rien à voir avec le BTP. Rendre le CTA
dépendant du `category` du frontmatter, ou le neutraliser.

## Performance (Core Web Vitals)

- Les polices passent par `next/font` avec `display: swap` : bon, ne pas y toucher.
- Vérifier qu'aucune image de `public/` ne dépasse ~200 ko non optimisée. `og-image.png`
  et `conviction-illustration.png` sont les suspects.
- Pas de `framer-motion` sur le contenu au-dessus de la ligne de flottaison qui retarderait
  le LCP.

## Vérification finale

```bash
npm run build
```

Puis, sur le build local, contrôler que `/sitemap.xml` et `/robots.txt` répondent et que le
sitemap contient bien le nouvel article.
