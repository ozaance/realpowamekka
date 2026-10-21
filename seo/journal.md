# Journal SEO

Une entrée par cycle, la plus récente en haut. Sert de mémoire à l'agent : il lit ce fichier
avant d'agir pour ne pas refaire deux fois le même travail, et pour savoir si les hypothèses
précédentes se sont vérifiées.

Format d'une entrée :

```
## AAAA-MM-JJ — <titre du cycle>

**Chiffres (28 j, Search Console)**
- Clics : N (évolution vs. période précédente)
- Impressions : N
- Position moyenne : N
- Pages en progression / en recul : …
(ou « données indisponibles » + raison)

**Actions**
- …

**Hypothèse testée**
- …  → à réévaluer le AAAA-MM-JJ (4 semaines plus tard)

**PR** : #N
```

---

## 2026-10-19 — Fondations techniques + premier article du cluster IA

**Chiffres (28 j, Search Console, période 2026-09-17 → 2026-10-15)**
- Clics : 2 (page d'accueil). Impressions : 23 au total sur tout le site.
- Position moyenne page d'accueil : 5,8. `/services/sites` : 1,5 (2 impressions).
  `/vision` : 3 (2 impressions).
- Seulement 2 requêtes distinctes relevées, toutes deux de marque : « powamekka »
  (3 impressions, position 1,3) et « powamekka café » (1 impression, position 13).
- Aucune requête commerciale, aucune requête en position 5-20, aucune page avec impressions
  fortes et CTR faible. **Donnée disponible mais trop ténue pour prioriser l'étape 4 du cycle
  (optimisation on-page ciblée) : le site est encore trop jeune, trop peu indexé sur des
  requêtes autres que la marque.** Hypothèse du cycle précédent (canonical corrigé → plus
  d'impressions sur `/services/*`) : partiellement vérifiée, `/services/sites` apparaît
  désormais dans l'export, mais le volume reste trop faible pour conclure. À réévaluer au
  prochain cycle avec plus d'historique post-correctif.

**Actions**
- Étape 4 (on-page prioritaire) redirigée vers l'audit technique faute de pages cibles
  identifiables dans les données : traité comme fond technique à fort impact plutôt que
  comme réécriture de title/description d'une page précise.
- Corrigé, sur tout le site (`lib/schema.ts`, nouveau) :
  - JSON-LD `BlogPosting` + `BreadcrumbList` sur les articles (`app/blog/[slug]/page.tsx`).
  - JSON-LD `Service` + `BreadcrumbList` sur les cinq pages `app/services/*`, rattaché à
    l'entité `ProfessionalService` de l'accueil via un `@id` ajouté à `app/page.tsx`.
  - `OpenGraph` propre (titre, description, image) sur les cinq pages de service et image
    ajoutée sur l'OpenGraph des articles — ils héritaient jusqu'ici du titre de l'accueil
    sur tout partage social (confirmé en lisant `generate-metadata.md` : le merge de
    métadonnées est **superficiel**, un `openGraph` défini sur une page remplace entièrement
    celui du parent, rien n'est hérité champ par champ).
  - CTA « vous êtes dans le BTP » conditionné à `category` (`app/blog/[slug]/page.tsx`) :
    n'apparaît plus sur les articles hors BTP.
  - `lastModified` du sitemap (`app/sitemap.ts`) : date réelle du dernier commit de chaque
    fichier via `git log`, repli sur une date fixe si la commande échoue.
  - Ajout de 2 liens internes dans chacun des deux articles existants, qui n'en avaient
    aucun (`ia-btp-gagner-du-temps`, `systeme-digital-pme-guide-2026`) → vers
    `/services/audit` et `/services/ia` ou `/services/systemes`.
- Publié l'article du haut du backlog : **« Par où commencer avec l'IA quand on dirige une
  PME sans s'égarer »** (`content/blog/par-ou-commencer-ia-entreprise.md`), cluster 1,
  1273 mots, 5 liens internes (dont les deux articles existants), lien pilier
  `/services/audit`. Reporté dans le backlog comme traité.
- Reporté au backlog, volontairement non traité ce cycle : schéma `Offer` sur `/offres`
  (touche à l'affichage des tarifs, à faire avec plus de soin) et compression de
  `og-image.png` / `conviction-illustration.png` (770 Ko / 677 Ko, nécessite une vérification
  visuelle avant remplacement). Relevé aussi deux chiffres non sourcés dans l'article BTP
  existant, à faire valider par Abdoulaye.

**Hypothèse testée**
- Les corrections OpenGraph/JSON-LD devraient améliorer la qualité des aperçus sociaux et
  l'éligibilité aux rich snippets, mais n'ont pas d'effet attendu sur le volume d'impressions
  avant un recrawl. L'hypothèse du cycle précédent (canonical → plus d'impressions internes)
  reste la priorité de suivi : → à réévaluer le 2026-11-16, avec si possible plus de 28 jours
  de données post-correctif accumulées.

**À faire côté Abdoulaye (humain)** : confirmer ou retirer les deux chiffres non sourcés de
`ia-btp-gagner-du-temps.md` signalés au backlog ; vérifier si une fiche Google Business
Profile existe et pourquoi la requête « powamekka café » y est associée.

**PR** : cycle du 2026-10-19

---

## 2026-09-04 — Mise en place

**Chiffres** : aucun relevé. Point de départ du suivi.

**Actions**
- Création de la compétence `seo` (`.claude/skills/seo/`) : playbook de cycle, checklist
  technique propre au dépôt, gabarit de rédaction, procédure Search Console.
- Création de l'état partagé : `seo/strategie.md`, `seo/backlog.md`, `seo/journal.md`.
- Audit initial consigné dans `seo/backlog.md` — le point le plus grave étant le canonical
  de `app/layout.tsx` figé sur `/`, hérité par toutes les pages.

**Correctif majeur**
- 11 des 12 pages prérendues déclaraient `https://www.powamekka.com` comme URL canonique.
  Cause : `alternates.canonical: '/'` dans `app/layout.tsx`, hérité par toute page ne
  définissant pas le sien (comportement documenté de l'App Router). Google était donc invité
  à traiter les cinq pages de service, `/blog`, `/vision` et les deux articles comme des
  doublons de l'accueil. Seule `/faq` était correcte.
- Correction : suppression du canonical du layout, canonical explicite ajouté sur chaque page,
  `openGraph.url` propre aux articles. Vérifié sur le build : les 12 pages s'auto-canonisent.

**Hypothèse testée**
- Le canonical erroné bridait l'indexation des pages internes. Si c'est le cas, les impressions
  des pages `/services/*` devraient apparaître ou augmenter nettement une fois recrawlées.
  → à réévaluer le 2026-10-02.

**À faire côté Search Console (humain)** : demander une réindexation des cinq pages
`/services/*` via l'inspection d'URL, pour ne pas attendre le recrawl naturel.

**PR** : cycle du 2026-09-04
