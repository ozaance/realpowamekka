---
name: seo
description: Cycle SEO récurrent du site powamekka.com — audit technique, analyse Search Console, production d'un article de fond, maillage interne, puis Pull Request. Utiliser quand l'utilisateur demande de travailler le référencement, de publier un article, de faire un audit SEO, ou quand l'agent hebdomadaire "SEO Powamekka" se déclenche.
---

# Cycle SEO — powamekka.com

Une exécution de cette compétence = **un cycle complet**, qui se termine par **une Pull Request**
sur `ozaance/realpowamekka`. Jamais de push direct sur `main`.

L'objectif n'est pas de produire du volume. C'est de faire progresser, semaine après semaine, un
petit nombre de pages sur un petit nombre de requêtes qui amènent des clients. Un cycle qui ne
publie rien mais corrige trois pages en profondeur est un bon cycle.

## Contexte à charger avant toute action

Lire dans cet ordre, systématiquement :

1. `seo/strategie.md` — positionnement, personas, clusters de mots-clés, règles de ton.
2. `seo/backlog.md` — file éditoriale priorisée. C'est la mémoire entre deux cycles.
3. `seo/journal.md` — ce qui a été fait aux cycles précédents. **Ne jamais refaire un travail déjà journalisé.**
4. `.claude/skills/seo/references/checklist-technique.md` — audit technique propre à ce Next.js.
5. `.claude/skills/seo/references/gabarit-article.md` — structure et règles de rédaction.

Le site est un Next.js 16 (App Router). `AGENTS.md` s'applique : **cette version a des breaking
changes, lire `node_modules/next/dist/docs/` avant d'écrire du code** (metadata, sitemap, robots).

## Déroulé d'un cycle

### 1. Point de départ propre

```bash
git -C /Users/abdoulaye/Powamekka-v2 checkout main && git pull --ff-only
git checkout -b seo/AAAA-MM-JJ
```

### 2. Mesure — d'où on part

Récupérer les données Search Console si les identifiants sont disponibles
(voir `references/search-console.md`). Elles pilotent tout le reste du cycle.

Sans données GSC, ne pas bloquer : le faire savoir dans la PR, et prioriser au jugement
à partir de `seo/strategie.md`. Mais le signaler explicitement, à chaque fois.

Avec données, extraire sur les 28 derniers jours :

- **Requêtes en position 5-20** — le gisement le plus rentable. Une page déjà en page 2 sur
  une requête commerciale se pousse en page 1 avec du travail on-page, pas un nouvel article.
- **Requêtes à fortes impressions et CTR < 2 %** — problème de title/description, pas de contenu.
- **Pages en perte** de clics vs. la période précédente.
- **Requêtes sans page dédiée** — candidates au backlog éditorial.

Consigner ces chiffres dans `seo/journal.md`. C'est la seule façon de savoir, dans trois mois,
si tout ça sert à quelque chose.

### 3. Audit technique

Dérouler `references/checklist-technique.md`. Corriger ce qui est corrigeable dans le cycle.
Tout ce qui dépasse (refonte d'une page, décision produit) part dans `seo/backlog.md`, pas dans
la PR.

Vérifier ensuite que le build passe :

```bash
npm run build
```

Une PR dont le build casse est un cycle raté. Ne jamais la proposer.

### 4. Optimisation on-page prioritaire

Sur les 2 ou 3 pages identifiées à l'étape 2 (position 5-20, ou CTR faible) :

- Réécrire `title` (≤ 60 caractères, requête cible en tête, marque en fin) et `description`
  (140-160 caractères, une promesse concrète, pas une liste d'adjectifs).
- Vérifier qu'il n'y a **qu'un seul `<h1>`** et que la requête cible y figure naturellement.
- Ajouter les intertitres `<h2>` qui manquent pour couvrir les questions associées.
- Ajouter le JSON-LD adapté au type de page.
- Ajouter 2 à 4 liens internes contextuels entrants vers cette page depuis d'autres pages.

Ne jamais bourrer un mot-clé. Si une phrase sonne écrite pour un moteur, elle est mauvaise :
Google le détecte, et un dirigeant de PME qui la lit aussi.

### 5. Production éditoriale — un article par cycle, maximum

Prendre **le premier article du backlog** dans `seo/backlog.md`. Suivre
`references/gabarit-article.md` intégralement.

Un article publié doit :

- viser **une** intention de recherche précise, nommée en tête du fichier ;
- faire 1200-1800 mots — en dessous c'est mince, au dessus c'est du remplissage ;
- contenir au moins **3 liens internes** vers des pages de service ou d'autres articles ;
- apporter une information qu'un dirigeant ne trouve pas dans les dix premiers résultats
  actuels. Si l'article ne fait que reformuler ce qui existe déjà, il ne se classera pas :
  autant ne pas le publier et passer au suivant du backlog.

Fichier : `content/blog/<slug>.md`, frontmatter identique aux articles existants
(`title`, `date`, `description`, `category`, `readTime`).

**Interdits de rédaction** — le ton de la marque est sobre et direct :
tirets cadratins, « plongez au cœur de », « dans un monde où », « révolutionner »,
« il est important de noter que », emojis, points d'exclamation, superlatifs marketing.
Phrases courtes. Verbes concrets. Chiffres quand ils sont vrais, jamais inventés.

### 6. Maillage interne

Après ajout de l'article : vérifier qu'aucune page du site n'est orpheline (atteignable en
moins de 3 clics depuis l'accueil) et que le nouvel article est lié depuis au moins une page
existante — sinon il n'existe pas pour un crawler.

### 7. Mise à jour de l'état

- `seo/backlog.md` : retirer l'article traité, ajouter 1 à 3 nouvelles idées issues des
  données GSC de l'étape 2, re-prioriser.
- `seo/journal.md` : ajouter une entrée datée — chiffres relevés, actions faites, hypothèse
  testée. Format imposé en fin du fichier.

### 8. Pull Request

```bash
npm run build          # doit passer
git add -A
git commit -m "seo(<AAAA-MM-JJ>): <résumé en une ligne>"
git push -u origin seo/AAAA-MM-JJ
```

Ouvrir ensuite la PR. **`gh` n'est pas installé sur la machine d'Abdoulaye** — vérifier :

```bash
command -v gh >/dev/null \
  && gh pr create --title "SEO — cycle du <date>" --body-file <corps.md> \
  || echo "https://github.com/ozaance/realpowamekka/compare/main...seo/AAAA-MM-JJ?expand=1"
```

Sans `gh`, écrire le corps de la PR dans un fichier hors dépôt et donner à Abdoulaye
l'URL de comparaison ci-dessus, à coller telle quelle. En environnement cloud (agent
programmé), `gh` est disponible et authentifié : utiliser la première branche.

Le corps de la PR, en français, court, structuré ainsi :

- **Chiffres du cycle** — clics, impressions, position moyenne, évolution vs. période précédente.
  Écrire « données Search Console indisponibles » si c'est le cas, sans le masquer.
- **Ce qui change** — liste des fichiers touchés et pourquoi, une ligne chacun.
- **Article publié** — titre, requête visée, volume estimé si connu.
- **À décider par Abdoulaye** — ce qui nécessite un arbitrage humain (le cas échéant).
- **Prochain cycle** — la prochaine action prévue.

Terminer la PR par :

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Et le commit par :

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## Ce qu'il ne faut pas faire

- Publier plusieurs articles d'un coup pour « rattraper ». Une publication régulière et modeste
  bat une rafale suivie de six semaines de silence.
- Toucher au code de paiement (`lib/stripe.ts`, `app/api/checkout`, `app/api/stripe/webhook`)
  ou aux tarifs de `lib/offers.ts`. Hors périmètre, sans exception.
- Inventer des statistiques, des études ou des témoignages clients. Si un chiffre n'est pas
  sourçable, écrire l'idée sans le chiffre.
- Créer des pages « locales » dupliquées (Rouen / Le Havre / Caen avec le même texte). C'est
  du contenu dupliqué, sanctionné, et ça abîme la marque.
- Modifier `robots.ts` pour désindexer quoi que ce soit sans demande explicite.
