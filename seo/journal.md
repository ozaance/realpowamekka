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

## 2026-10-26 — Schéma Offer, nettoyage éditorial, deuxième article du backlog

**Chiffres (28 j, Search Console, période 2026-09-24 → 2026-10-22)**
- Page d'accueil : 3 clics, 10 impressions, position moyenne 6,9, CTR 30 %.
- `/services/sites` : 0 clic, 1 impression, position 1. `/vision` : 0 clic, 1 impression,
  position 1.
- Une seule requête distincte remontée dans l'export (seuil de reporting de l'API sur un volume
  aussi faible) : « powamekka » (1 clic, 2 impressions, position 1). La requête « powamekka
  café » du cycle précédent n'apparaît plus.
- Toujours aucune requête commerciale, aucune requête en position 5-20, aucune page à fortes
  impressions et CTR faible : le volume reste trop ténu pour piloter l'étape 4 (optimisation
  on-page ciblée) sur des pages précises. Même constat qu'au cycle du 2026-10-19 — site encore
  trop jeune pour ce niveau de donnée. Étape 4 de nouveau redirigée vers le fond technique et
  éditorial plutôt que vers la réécriture de title/description d'une page identifiée par les
  données.

**Actions**
- Ajouté le schéma `Offer` sur `/offres` (`offerCatalogJsonLd` dans `lib/schema.ts`), aligné sur
  les prix réels de `lib/offers.ts` sans dupliquer ni modifier les tarifs. `lib/offers.ts` non
  touché. Ajout d'un `id` DOM sur chaque carte d'offre (`components/OffersGrid.tsx`) pour que
  les ancres du schéma pointent vers un élément réel de la page. Vérifié en servant le build :
  JSON-LD strict, prix cohérents avec l'affichage.
- Recompressé `public/og-image.png` (770 Ko → 193 Ko, PNG palette 52 couleurs, écart RMSE 0,003
  vs l'original, vérifié visuellement). `public/conviction-illustration.png` non touché : les
  tentatives de compression (WebP lossy et lossless) ont produit un rendu de transparence
  incohérent entre les outils de prévisualisation disponibles dans l'environnement, impossible
  de garantir l'absence d'écart visuel réel pour un visuel de marque ; reporté au backlog avec
  le détail de ce qui a été tenté.
- Reformulé dans `ia-btp-gagner-du-temps.md` les deux passages signalés au backlog précédent
  comme non sourcés (un pourcentage de devis récupérés et un cas client nommé) : retirés sans
  être remplacés par un autre chiffre, personne disponible pour les confirmer en cycle
  automatisé.
- Publié le deuxième article du backlog : **« Combien coûte vraiment l'automatisation d'une
  PME en 2026 »** (`content/blog/combien-coute-automatisation-pme.md`), cluster 1 + 4, 1316
  mots. S'appuie sur les tarifs réels affichés sur `/offres` (205 € à 10 000 € selon le
  périmètre) plutôt que sur des fourchettes de marché non sourcées. 7 liens internes dont 2 vers
  les articles existants ; lien réciproque ajouté depuis `par-ou-commencer-ia-entreprise.md`
  vers ce nouvel article.
- Maillage : le nouvel article est atteignable en 2 clics depuis l'accueil (`Navbar → /blog →
  article`) et listé automatiquement sur `/blog` et dans `sitemap.xml` (vérifié sur le build
  servi localement). Aucune page orpheline détectée.

**Hypothèse testée**
- L'hypothèse canonical → plus d'impressions internes (posée le 2026-09-04) reste invérifiable
  faute de volume : les pages de service apparaissent désormais dans l'export, mais avec 1
  impression chacune, rien de statistiquement exploitable. Je ne la considère plus comme la
  priorité de suivi : le site est simplement trop récent et trop peu visité pour que Search
  Console produise un signal utilisable avant plusieurs mois. → à réévaluer au cycle du
  2026-12-21 (environ 8 semaines), plutôt que toutes les 4 semaines, pour laisser le temps à un
  volume réel de s'accumuler.
- Nouvelle hypothèse posée ce cycle : les articles ancrés sur de vrais prix affichés (plutôt que
  sur des fourchettes de marché génériques) convertissent mieux un lecteur en audit demandé, et
  se différencient davantage des dix premiers résultats actuels, qui restent vagues sur les
  prix. À réévaluer qualitativement (demandes d'audit mentionnant cet article) plutôt que
  quantitativement, le volume de clics organiques étant hors de portée avant plusieurs mois.

**À faire côté Abdoulaye (humain)** : aucune confirmation chiffrée nécessaire ce cycle (les deux
passages non sourcés ont été reformulés plutôt que laissés en attente). Vérifier, quand le temps
le permet, si la fiche Google Business Profile existe toujours et explique la requête
« powamekka café » vue au cycle précédent (non reproduite ce cycle, donc non bloquant).

**PR** : cycle du 2026-10-26

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
