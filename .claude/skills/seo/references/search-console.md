# Accès Google Search Console

La propriété `https://www.powamekka.com/` est vérifiée dans Search Console.

## Lecture automatisée (souhaitable)

L'API Search Console permet à l'agent de lire les requêtes sans intervention humaine.
Mise en place, une seule fois :

1. Console Google Cloud → créer un projet → activer **Google Search Console API**.
2. Créer un **compte de service**, générer une clé JSON.
3. Dans Search Console → Paramètres → Utilisateurs et autorisations → ajouter l'adresse
   email du compte de service en **Lecteur complet**.
4. Stocker la clé hors dépôt (elle ne doit jamais être commitée) et exposer son chemin via
   `GSC_SERVICE_ACCOUNT_FILE`, ou son contenu via `GSC_SERVICE_ACCOUNT_JSON`.

Vérifier au début de chaque cycle :

```bash
[ -n "$GSC_SERVICE_ACCOUNT_JSON" ] || [ -f "${GSC_SERVICE_ACCOUNT_FILE:-/dev/null}" ] \
  && echo "GSC disponible" || echo "GSC indisponible"
```

Requête type sur `searchanalytics/query`, propriété `https://www.powamekka.com/`,
dimensions `query` et `page`, 28 derniers jours, `rowLimit` 500.

## Repli manuel

Sans identifiants, le cycle continue mais à l'aveugle. Dans ce cas :

- l'écrire noir sur blanc dans la PR, à chaque fois, sans l'enfouir ;
- prioriser à partir de `seo/strategie.md` et de l'état réel des pages ;
- proposer à Abdoulaye d'exporter manuellement le CSV « Performances » de Search Console
  (28 jours, requêtes + pages) et de le déposer dans `seo/data/` — le cycle suivant s'en
  servira.

## Rappels

- La donnée Search Console a 2 à 3 jours de retard. Ne jamais conclure sur les 72 dernières heures.
- Un nouvel article met 2 à 8 semaines à se positionner. Ne pas le juger, ni le réécrire,
  avant un mois.
- Comparer toujours à la même période de l'année précédente ou aux 28 jours précédents,
  jamais à une semaine isolée.
