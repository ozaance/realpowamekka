# Gabarit d'article — blog Powamekka

## Fichier

`content/blog/<slug>.md`. Slug en minuscules, mots séparés par des tirets, sans accent,
contenant la requête cible : `ia-btp-gagner-du-temps`, pas `article-3`.

Frontmatter, exactement ces cinq champs (le typage `PostMeta` de `lib/posts.ts` les attend) :

```yaml
---
title: "Titre complet, 55-65 caractères, requête cible en début"
date: "AAAA-MM-JJ"
description: "140-160 caractères. Une promesse concrète et vérifiable, pas un résumé."
category: "BTP & IA"
readTime: "6 min de lecture"
---
```

`category` reprend une catégorie existante quand c'est possible : « BTP & IA »,
« Systèmes & Organisation ». N'en créer une nouvelle que si l'article ouvre vraiment un
nouveau thème.

## Structure du corps

1. **Accroche, 2-3 paragraphes courts.** Décrire la situation du lecteur, pas l'entreprise.
   Commencer par « Vous êtes… » ou par le problème concret. Jamais par « Dans un monde où ».
   La requête cible apparaît naturellement dans les 100 premiers mots.

2. **4 à 6 sections en `##`.** Chaque titre de section formulé comme une question que le
   lecteur se pose vraiment, ou comme une affirmation nette. Ce sont ces intertitres qui
   captent les requêtes longue traîne : les écrire en pensant à ce que quelqu'un tape.

3. **Du concret dans chaque section** : un exemple chiffré, un avant/après, une durée, un
   coût. Un article sans un seul nombre vérifiable ne convainc personne.

4. **Une conclusion qui engage**, 2 paragraphes, suivie d'un lien vers la page de service
   pertinente — `/services/audit`, `/services/ia`, `/services/systemes`, `/services/formation`,
   `/services/sites` — ou vers `/offres`.

## Maillage

Minimum **3 liens internes** en Markdown dans le corps, placés dans une phrase qui a du sens,
jamais en « cliquez ici » :

```markdown
Ce diagnostic, c'est exactement l'objet d'un [audit stratégique](/services/audit).
```

Au moins un lien vers un autre article du blog quand il en existe un pertinent.

## Longueur

1200-1800 mots. En dessous, le sujet n'est pas traité. Au dessus, c'est du remplissage :
mieux vaut couper et faire un second article.

## Ton — règles fermes

Interdits : tirets cadratins (—) dans le corps, emojis, points d'exclamation,
« plongez au cœur de », « dans un monde où », « révolutionner », « incontournable »,
« il est important de noter que », « n'hésitez pas à », toute forme de superlatif marketing.

Attendu : phrases courtes. Voix active. Vouvoiement. Le lecteur est un dirigeant de PME
occupé, souvent peu technique, sceptique par défaut. Il veut savoir ce que ça change pour lui
lundi matin.

Ne jamais inventer une statistique, une étude, un nom d'entreprise cliente ou un témoignage.
Si un chiffre n'est pas sourçable, formuler l'idée sans le chiffre.

## Avant de valider

- Le titre donne-t-il envie de cliquer depuis une page de résultats Google ?
- Un lecteur qui ne connaît pas Powamekka apprend-il quelque chose d'utile, même s'il
  n'achète jamais ?
- L'article dit-il quelque chose que les dix premiers résultats actuels ne disent pas ?
  Si non, ne pas le publier : reprendre l'angle ou passer au suivant du backlog.
