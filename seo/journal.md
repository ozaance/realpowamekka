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

## 2026-11-27 : Page « IA à Rouen » (priorité « ia rouen », « agence ia rouen »)

**Chiffres (28 j, Search Console, période 2026-10-23 → 2026-11-20, export `seo-data` du 2026-11-23)**
- Clics : 1 (accueil, requête « powamekka », position 1). Impressions : 16 sur tout le site
  (8 sur l'accueil, position moyenne 1,9 ; 1 impression chacune sur `/blog`, `/faq`, les cinq
  pages de service et `/blog/par-ou-commencer-ia-entreprise`, positions 2 à 9).
- Toujours une seule requête visible (marque). Aucune requête « rouen » dans les données : la page
  locale part de zéro. Volume trop faible pour une optimisation on-page guidée par les données.
- Pas de nouvel export depuis le 2026-11-23 (le prochain est attendu le 2026-11-30).
- Vercel Web Analytics : 404 « Web Analytics not found », toujours inactif sur le projet.

**Erreurs 404 et 5xx**
- Vercel : aucune erreur d'exécution sur les 7 derniers jours (`get_runtime_errors`). Les journaux
  détaillés ne remontent qu'à une heure (offre Hobby) : impossible de lister les 404 réels.
- Production : `sitemap.xml` répond 200 (17 URL). Le réseau de l'environnement bloque l'accès
  direct au site, donc les autres URL de production n'ont pas été sondées une par une.
- Build local : exploration de tous les liens internes depuis l'accueil et le sitemap, 18 pages,
  toutes en 200, aucune à plus de 2 clics de l'accueil.

**Actions**
- Créé `/agence-ia-rouen` (`app/agence-ia-rouen/page.tsx`) : title « Agence IA à Rouen :
  automatisation pour PME | Powamekka » (55 caractères), description de 144 caractères, H1
  unique « Agence IA à Rouen pour les PME. », sections (accompagnement à distance, usages de l'IA,
  pour qui, déroulé, FAQ de 6 questions, appel à l'action), 9 liens internes (4 services, 4
  articles, FAQ). JSON-LD `Service` (zone desservie : Rouen et France, sans adresse),
  `BreadcrumbList`, `FAQPage`. Aucun chiffre, client ni délai inventé.
- Sitemap : page ajoutée (`app/sitemap.ts`).
- Liens entrants : accueil (ligne sous les boutons du dernier écran, `components/cine/CTACine.tsx`
  et `styles/cinema.css`) et `/services/ia` (pastille « IA à Rouen »).
- FAQ (`lib/faq.ts`) : la réponse « les rendez-vous sur site restent possibles selon le projet »
  contredisait l'accompagnement uniquement à distance ; remplacée par « Powamekka exerce son
  activité à Rouen […] L'accompagnement se fait uniquement à distance ».
- Test d'intégration (`tests/integration.mjs`) : la vérification de la PR #51 interdisait toute
  mention de Rouen. Remplacée, conformément à la nouvelle décision, par des vérifications plus
  ciblées (Normandie et LinkedIn toujours interdits, aucune adresse ni `LocalBusiness` dans le
  balisage, aucune promesse de rendez-vous sur place) et 4 vérifications de la nouvelle page.
  153 tests réussis, 0 échec.
- `seo/strategie.md` : cluster 6 réécrit pour autoriser `/agence-ia-rouen` et fixer ses limites.
- Pas d'article de blog ce cycle : le cycle est consacré à la page prioritaire.

**Hypothèse testée**
- Une page dédiée avec « IA à Rouen » dans le title et le H1 fera apparaître le site sur
  « ia rouen » et « agence ia rouen » dans Search Console une fois indexée → à réévaluer le
  2026-12-25.

**À faire côté responsable (humain)** : valider la Preview (changement visuel sur l'accueil) ;
demander l'indexation de `/agence-ia-rouen` dans Search Console après mise en production ;
activer Vercel Web Analytics si souhaité.

**PR** : cycle du 2026-11-27

---

## 2026-11-26 — Retrait du témoignage de l'électricien et des estimations non sourcées (manuel)

**Chiffres (28 j, Search Console)**
- Données indisponibles : intervention éditoriale manuelle, hors cycle hebdomadaire.

**Actions**
- Décision définitive d'Abdoulaye : le cas de l'artisan électricien ne peut pas être justifié, il est retiré partout. Cela annule la confirmation du 2026-11-23.
- `content/blog/ia-btp-gagner-du-temps.md` : paragraphe de l'électricien remplacé par une formulation sans chiffre ; titre sans promesse de « 5 heures par semaine » (adresse de l'article inchangée) ; « 8 à 12 heures », « 30 à 45 minutes », « 3 minutes » et « 2 heures récupérées » reformulés sans chiffre.
- `content/blog/systeme-digital-pme-guide-2026.md` : « 4 à 8 heures par semaine » retiré.
- FAQ et page Vision déjà corrigées par la PR #43.

**Hypothèse testée**
- Aucune. Le retrait d'un chiffre ne vise pas le référencement ; surveiller seulement que la position de l'article BTP ne recule pas après le changement de titre → à réévaluer le 2026-12-24.

**PR** : voir la PR de la branche `seo/2026-11-26-retrait-electricien`

---

## 2026-11-23 — Consolidation des PR #10, #11 et #12 (cycle manuel)

**Contexte** : les cycles des 26/10, 02/11 et 09/11 ont chacun ouvert une PR depuis `main` sans voir
les précédentes, non fusionnées. Les trois PR créaient le même article et se contredisaient sur
`og-image` (5 à 8 conflits par paire). Consolidation demandée par Abdoulaye dans une nouvelle PR,
sans modifier ni fermer les PR d'origine.

**Retenu**
- PR #12 (base) : compression des images `public/art/*.jpg`, `og-image.png` → `og-image.jpg`
  (36 Ko) et références mises à jour, article « Combien coûte vraiment l'automatisation d'une PME ».
- PR #11 : titres et descriptions raccourcis (layout, `/faq`, `/offres`, `/blog`, `/vision`), liens
  internes vers le nouvel article depuis `ia-btp-gagner-du-temps` et `systeme-digital-pme-guide-2026`.
- PR #10 : schéma `OfferCatalog` sur `/offres` (sans `position`, invalide sur `Offer`), ancres
  `#<id>` sur les offres, lien interne depuis `par-ou-commencer-ia-entreprise`.

**Écarté**
- Versions de l'article des PR #10 et #11 (doublons de celle de la #12).
- Compression de `og-image.png` de la PR #10 (fichier remplacé par le `.jpg` de la #12).
- Reformulation du cas de l'artisan électricien (PR #10 et #12) : cas confirmé réel par Abdoulaye,
  paragraphe d'origine rétabli mot pour mot.

**Corrigé dans l'article retenu** (contenu invérifiable ou incohérent avec le catalogue)
- « la moitié découvre… » (statistique client non sourcée) → reformulé sans chiffre.
- « livrées en quelques jours » (délai absent du catalogue) → retiré.
- « plusieurs dizaines de milliers d'euros » → « 10 000 € », plafond réel de `lib/offers.ts`.
- « avec un gain mesurable » (promesse) → retiré. Deux fautes de grammaire corrigées.
- Date de l'article : 2026-11-23 (jamais publiée auparavant).

**Règle ajoutée** à `.claude/skills/seo/SKILL.md` (étape 1) : vérifier les branches SEO non
fusionnées avant d'en créer une nouvelle, et y ajouter le travail plutôt que d'ouvrir une PR.

**PR** : consolidation du 2026-11-23

---

## 2026-11-09 — Compression d'images, nettoyage de contenu invérifiable, 2e article

**Chiffres (28 j, Search Console, période 2026-10-09 → 2026-11-06, export `seo-data` du
2026-11-09T00:32 UTC)**
- Clics : 1 (page d'accueil, requête « powamekka »). Impressions : 17 au total sur tout le
  site (7 accueil, 2 `/services/sites`, 1 chacune sur `/blog`, l'article existant, `/faq`,
  les quatre autres pages de service, `/vision`).
- Une seule requête distincte dans l'export `queries` : « powamekka » (marque), position 1,
  CTR 50 %. Aucune requête commerciale, aucune requête en position 5-20 avec un volume
  exploitable, aucune page à fort CTR/fortes impressions à corriger. Même constat qu'au
  cycle du 2026-10-19, trois semaines plus tard : le volume n'a pas bougé de façon
  significative. **Hypothèse du 2026-10-19 (canonical → plus d'impressions internes) toujours
  ni confirmée ni infirmée : le bruit (17 impressions) est trop faible pour trancher.**
- **Vercel Web Analytics interrogé via le connecteur MCP** (`aggregate_pageviews` sur le
  projet `powamekka`) : 404 `Web Analytics not found`. Le produit ne semble pas activé sur le
  projet Vercel, donc aucune donnée de trafic réel disponible non plus par ce canal cette
  semaine. À vérifier côté Abdoulaye si Web Analytics doit être activé sur le dashboard Vercel.
- Étape 2 et étape 4 du cycle (priorisation et on-page ciblé par les données) redirigées vers
  l'audit technique et la production éditoriale, comme au cycle précédent, faute de signal.

**Actions**
- Poids des images (point ouvert du backlog depuis le 2026-09-04/2026-10-19) :
  - `public/og-image.png` (752 Ko, 1731×909, hors `next/image`) recadré en 1200×630 et
    reconverti en JPEG qualité 90 → `public/og-image.jpg`, 36 Ko. Références mises à jour dans
    `app/layout.tsx`, `lib/schema.ts`, les cinq pages `app/services/*/page.tsx` et
    `app/blog/[slug]/page.tsx`. Vérifié visuellement avant remplacement.
  - Découverte en marge de l'audit : `public/art/hero-atelier.jpg` (image LCP du hero, servie
    hors `next/image` avec `fetchPriority="high"`), `cta-atelier.jpg` et les cinq
    `discipline-*.jpg` pesaient 296 à 492 Ko chacune. Recompressées en JPEG qualité 70
    (chroma 4:2:0, mêmes dimensions) : 170 à 233 Ko après, soit environ -55 % en moyenne.
    Vérifié visuellement (hero + un visuel de discipline) : aucun artefact perceptible.
  - `public/conviction-illustration.png` non touché : déjà optimisé à la volée par
    `next/image`, donc le poids de la source ne reflète pas ce qui part au navigateur.
  - Reporté au backlog : les vidéos `hero-atelier.mp4` (9,4 Mo) et `cta-atelier.mp4` (3,1 Mo),
    découvertes au même moment, non traitées ce cycle (risque plus élevé, nécessite une
    vérification de lecture complète plutôt qu'une capture statique).
- Nettoyage de contenu invérifiable dans `content/blog/ia-btp-gagner-du-temps.md`, signalé au
  backlog depuis le 2026-10-19 sans confirmation possible d'Abdoulaye en cycle automatisé :
  le chiffre « 15 à 20 % de devis supplémentaires » et le témoignage non sourcé de l'« artisan
  électricien en région parisienne » ont été reformulés sans chiffre ni cas client inventé.
- Publié le deuxième article du backlog : **« Combien coûte vraiment l'automatisation d'une
  PME en 2026 »** (`content/blog/combien-coute-automatisation-pme.md`), cluster 1 + 4,
  1273 mots, 5 liens internes (dont un vers l'article BTP existant). Les seules valeurs
  chiffrées utilisées sont les prix réels de `lib/offers.ts` (non modifié), aucune statistique
  inventée. Lien pilier `/services/audit` et `/offres`. Reporté dans le backlog comme traité.
- Maillage : le nouvel article est automatiquement listé sur `/blog` (`getAllPosts()`), donc
  atteignable en 2 clics depuis l'accueil (nav → Blog → article). Pas de page orpheline
  détectée sur le reste du site lors de la revue.
- Audit technique (checklist) : `robots.ts`, `sitemap.ts` (services à jour, `lastModified`
  réel), canonical `www`, H1 unique par page (vérifié via les composants partagés `Hero.tsx` /
  `HeroTableau.tsx` / `ServicePage.tsx`, un seul rendu par page), attributs `alt` descriptifs
  sur toutes les images : rien à corriger cette semaine, tout conforme.
- Ajouté une idée au backlog éditorial faute de requête GSC nouvelle à exploiter : « Un audit
  stratégique PME, ça contient quoi et ça prend combien de temps », cluster 4, en
  prolongement naturel de l'article publié ce cycle.

**Hypothèse testée**
- Les images compressées ce cycle (og-image, hero, cta, disciplines) ne sont pas optimisées
  par `next/image` : le gain de poids (environ -55 % à -95 % selon les fichiers) devrait se
  voir directement sur le temps de chargement réel, en particulier le LCP du hero. Pas de
  mesure Core Web Vitals en place pour le vérifier précisément ce cycle → à recouper avec
  Vercel Web Analytics si le produit est activé d'ici le prochain cycle, sinon au jugement
  visuel. L'hypothèse canonical du 2026-09-04, toujours en attente de volume suffisant pour
  conclure → à réévaluer le 2026-12-07 (délai allongé, le rythme d'accumulation de données
  étant plus lent que prévu).

**À faire côté Abdoulaye (humain)** : activer Vercel Web Analytics sur le projet si ce n'est
pas déjà fait (404 côté connecteur MCP cette semaine) ; les deux points déjà en attente du
cycle précédent (fiche Google Business Profile pour « powamekka café », chiffres de l'article
BTP) sont traités ou n'appellent plus d'action de sa part, sauf s'il souhaite réintroduire un
cas client réel et vérifiable à la place du passage reformulé.

**PR** : cycle du 2026-11-09

---

## 2026-11-02 — Titres/descriptions hors normes + article coûts automatisation

> Entrée reprise de la PR #11 (jamais fusionnée) lors de la consolidation du 2026-11-23.
> Les actions décrites ne sont en ligne que via la PR de consolidation, et seulement pour les éléments retenus.

**Chiffres (28 j, Search Console, période 2026-10-02 → 2026-10-30)**
- Clics : 4 au total (3 sur `/`, 1 sur rien d'autre de mesurable). Impressions : 19 sur
  tout le site, réparties sur 8 pages (contre 2 pages avec impressions au cycle précédent).
- Position moyenne `/` : 3,18 (11 impressions, 3 clics, CTR 27 %). Seule requête nommément
  identifiée dans l'export : « powamekka » (marque, position 1, 2 impressions) — la requête
  « powamekka café » du cycle précédent n'apparaît plus dans cet export.
- Signal nouveau : les quatre pages `/services/*` et `/blog/par-ou-commencer-ia-entreprise`
  apparaissent désormais avec 1 impression chacune, à des positions 5 à 9 — exactement le
  gisement « position 5-20 » visé par l'étape 2 du cycle. **Mais 1 impression par page ne
  permet pas de savoir quelle requête l'a déclenchée** : impossible d'en tirer un title ou
  une description ciblés sans deviner. Donnée disponible, toujours trop ténue pour une
  optimisation on-page requête par requête.
- Vercel Web Analytics : interrogé via le connecteur, l'API renvoie 404 (« Web Analytics not
  found ») sur le projet `powamekka` — la fonctionnalité n'est pas activée côté Vercel pour ce
  projet. Signalé pour qu'Abdoulaye l'active si le volume de trafic réel doit un jour compléter
  Search Console.

**Actions**
- Étape 4 (on-page prioritaire) à nouveau redirigée vers l'audit technique, pour la même
  raison qu'au cycle précédent : aucune requête commerciale identifiable avec assez de volume
  pour cibler une page précise. Repris en revanche un point de la checklist jamais vérifié
  jusqu'ici — la longueur des titres et descriptions hors des pages de service (celles-ci
  avaient déjà été calibrées le 2026-10-19) :
  - `/` : description à 208 caractères (`app/layout.tsx`), largement au-dessus de 160 →
    réduite à 160, promesse resserrée sur l'automatisation et l'IA sans perdre Rouen/France.
  - `/offres` : titre à 66 caractères → 50, même promesse.
  - `/faq` : titre à 83 caractères → 56 ; description à 193 → 152.
  - `/vision` : description à 169 → 159.
  - `/blog` : description à 137 (sous la borne basse de 140) → 150.
  - `/` étant la seule page du site avec des clics mesurés ce cycle (3), c'est la correction
    la plus susceptible d'avoir un effet visible sur le CTR une fois réindexée.
- Publié l'article du haut du backlog : **« Combien coûte vraiment l'automatisation d'une
  PME »** (`content/blog/combien-coute-automatisation-pme.md`), cluster 1 + 4, 1312 mots,
  4 liens internes (`/offres`, `/services/audit`, `/services/ia`,
  `/blog/par-ou-commencer-ia-entreprise`). Angle tenu : les prix réels affichés sur `/offres`
  pour les prestations IA à la carte (audit IA, plan d'automatisation, chatbot, automatisation
  e-mails, formation — tous entre 205 € et 299 €, prix publiés donc sourcés, pas inventés),
  et les facteurs qui font varier un devis sur mesure, sans donner de fourchette chiffrée
  inventée pour ce dernier cas.
- Maillage : ajouté un lien contextuel vers ce nouvel article depuis les deux articles
  existants (`ia-btp-gagner-du-temps.md`, `systeme-digital-pme-guide-2026.md`), en plus de
  son apparition automatique sur `/blog` et dans le sitemap. Reporté dans le backlog comme
  traité.
- En relisant `systeme-digital-pme-guide-2026.md` pour y ajouter ce lien, relevé un chiffre
  non sourcé qui n'avait pas été signalé le 2026-10-19 (« 4 à 8 heures par semaine récupérées,
  PME type ») : ajouté à la liste des chiffres à confirmer avec Abdoulaye dans `seo/backlog.md`,
  non modifié par prudence tant que la confirmation n'est pas donnée.

**Hypothèse testée**
- Hypothèse du 2026-10-19 (canonical corrigé → plus d'impressions sur `/services/*`) :
  **partiellement confirmée** ce cycle — les cinq pages de service et un article apparaissent
  désormais dans l'export avec des impressions, contre deux pages seulement au cycle
  précédent. Le volume (1 impression/page) reste trop faible pour conclure définitivement.
  → nouvelle échéance de réévaluation inchangée, 2026-11-16, avec si possible un export
  couvrant une période plus longue post-correctifs.
- Nouvelle hypothèse : la description de `/` resserrée à 160 caractères devrait améliorer le
  CTR de la page d'accueil (actuellement 27 % sur 11 impressions, échantillon encore faible)
  une fois le nouveau snippet repris par Google. → à réévaluer le 2026-12-01, avec au moins
  un mois de données post-correctif.

**À faire côté Abdoulaye (humain)** : confirmer ou retirer les chiffres non sourcés dans
`ia-btp-gagner-du-temps.md` (signalé le 2026-10-19) et, nouveau ce cycle, dans
`systeme-digital-pme-guide-2026.md` ; activer Vercel Web Analytics sur le projet `powamekka`
si un second signal de trafic réel est souhaité en complément de Search Console.

**PR** : cycle du 2026-11-02

---

## 2026-10-26 — Schéma Offer, nettoyage éditorial, deuxième article du backlog

> Entrée reprise de la PR #10 (jamais fusionnée) lors de la consolidation du 2026-11-23.
> Les actions décrites ne sont en ligne que via la PR de consolidation, et seulement pour les éléments retenus.

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
