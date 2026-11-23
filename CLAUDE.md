@AGENTS.md

# POWAMEKKA — instructions projet

Lis `AGENTS.md` avant toute intervention et respecte ses règles Next.js 16.

## Contexte métier
POWAMEKKA est une agence de conseil en IA et de systèmes digitaux pour PME. La priorité commerciale est le BTP et les entreprises de services, tout en restant ouverte aux autres PME. Les offres couvrent l'audit/conseil IA, l'automatisation, les systèmes digitaux, les sites premium et la formation. Signature à préserver : « Building the future of business ».

## Références de travail
- `COLLABORATION.md` : rôles, cycle de travail et garde-fous ChatGPT × Claude Code.
- `ROADMAP.md` : priorités produit, technique et commerciales.
- `.claude/skills/seo/SKILL.md` : procédure SEO existante ; la lire avant toute tâche SEO.
- `seo/strategie.md`, `seo/backlog.md`, `seo/journal.md` : stratégie et historique SEO.

## Règles d'exécution
- Commence par inspecter l'état Git, la branche et les fichiers concernés.
- Pour une tâche multi-fichiers ou sensible, propose un plan et attends validation avant l'implémentation.
- Travaille sur une branche dédiée, jamais directement sur `main`.
- Limite chaque PR à un objectif cohérent et explique les critères d'acceptation.
- Lance `npm run build` au minimum ; n'affirme pas qu'un test a réussi s'il n'a pas été exécuté.
- Ne touche pas aux secrets, variables d'environnement, tarifs, clés de paiement, webhooks ni à la production sans autorisation explicite.
- N'invente jamais de témoignages, clients, statistiques ou résultats commerciaux.
- Ne supprime pas de fonctionnalité existante sans validation.
- Vérifie l'expérience mobile, l'accessibilité et `prefers-reduced-motion` pour toute modification d'interface.
- Ne fusionne pas de PR et ne déploie pas en production : ouvre une PR et laisse la décision au responsable du projet.
