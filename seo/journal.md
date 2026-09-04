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
