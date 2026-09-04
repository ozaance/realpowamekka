# Accès Google Search Console

La propriété `https://www.powamekka.com/` est vérifiée dans Search Console.

## Lecture automatisée — en place

Un compte de service Google lit l'API Search Console une fois par semaine, le dimanche à
21h00 UTC (avant le cycle SEO du lundi), via `.github/workflows/seo-gsc-export.yml` et
`scripts/export-gsc.mjs`. Le résultat est commité sur une branche dédiée **`seo-data`**,
jamais sur `main` : cette branche est un cache de données, pas du contenu à relire.

Au début de chaque cycle, récupérer le dernier export :

```bash
git fetch origin seo-data
git show origin/seo-data:seo/data/latest.json > /tmp/gsc-latest.json 2>/dev/null \
  && echo "GSC disponible" || echo "GSC indisponible"
```

`latest.json` contient :

- `period` — la fenêtre de 28 jours couverte (avec 3 jours de décalage, délai habituel de GSC).
- `queries` — chaque ligne requête × page : `clicks`, `impressions`, `ctr`, `position`.
- `pages` — les mêmes métriques agrégées par page.

C'est ce fichier qui alimente l'étape 2 du cycle (`SKILL.md`) : requêtes en position 5-20,
CTR faible malgré de fortes impressions, pages en recul.

Si le fichier est absent ou date de plus de 10 jours, le secret `GSC_SERVICE_ACCOUNT_JSON`
n'est probablement pas configuré côté GitHub, ou l'Action a échoué : regarder l'onglet
**Actions** du dépôt. Continuer le cycle sans bloquer (voir repli ci-dessous), et le signaler
dans la PR.

## Repli manuel

Sans données, le cycle continue mais à l'aveugle. Dans ce cas :

- l'écrire noir sur blanc dans la PR, à chaque fois, sans l'enfouir ;
- prioriser à partir de `seo/strategie.md` et de l'état réel des pages.

## Rappels

- La donnée Search Console a 2 à 3 jours de retard. Ne jamais conclure sur les 72 dernières heures.
- Un nouvel article met 2 à 8 semaines à se positionner. Ne pas le juger, ni le réécrire,
  avant un mois.
- Comparer toujours à la même période de l'année précédente ou aux 28 jours précédents,
  jamais à une semaine isolée.
