# Rapport P2 — Conversion, mobile et mesure (préparation, rien n'est implémenté)

> Préparé le 23/11/2026 à partir de `origin/main` (`acccf67`). Objectif : décider et chiffrer la
> suite **sans lancer de refonte**, en conservant la direction artistique cinématique actuelle
> (tableau, fil d'or, Newsreader / Hanken Grotesk / Space Mono, palette calcaire).
> Chaque point fera l'objet d'une PR séparée, testée sur une Preview, desktop et mobile.

## Synthèse et ordre proposé

| # | Sujet | Impact | Complexité | Dépend de |
|---|---|---|---|---|
| 1 | Ancres cassées | Moyen | Faible (1 h) | — |
| 2 | Menu mobile accessible | Élevé | Faible-moyenne (½ j) | — |
| 3 | Grilles responsive + focus visible | Élevé (formulaire mobile) | Faible (½ j) | — |
| 4 | Promesse et CTA dès le premier écran | **Très élevé** | Moyenne (½-1 j) | Validation visuelle |
| 5 | Rideau d'ouverture | Moyen | Faible | 4 |
| 6 | Formulaire de contact amélioré | Élevé | Moyenne | Branche `fix/fiabilite-formulaires-paiements`, Resend vérifié |
| 7 | Suivi analytique des conversions | Élevé (pilotage) | Faible-moyenne | Choix de l'outil, politique de confidentialité |
| 8 | `/merci` selon le type d'offre | Moyen | Faible | — |

---

## 1. Ancres cassées

**Constat** : l'accueil cinématique expose `#manifeste`, `#disciplines`, `#methode` et `#contact`,
mais plus `#approche` ni `#services`. Liens morts :
- `components/Navbar.tsx` (utilisée par toutes les pages internes) : `/#approche`, `/#services` ;
- `components/Footer.tsx` : `/#approche` ;
- `components/ServicePage.tsx` : « ← Tous les services » → `/#services`.

**Proposition** : `/#approche` → `/#manifeste` ; `/#services` → `/#disciplines`. Le libellé
« Approche » peut rester.

## 2. Menu mobile accessible

**Constat** : les liens de navigation sont masqués sous 920 px (`styles/cinema.css`, `.cn-nav-links`)
et sous 980 px (`styles/hikari-v2.css`, `.navlinks`), **sans menu de remplacement**. Sur
téléphone, seul le bouton WhatsApp reste visible : Offres, Journal/Blog, FAQ et Services ne sont
accessibles que par le footer.

**Proposition** (dans le style actuel) :
- un bouton « Menu » en Space Mono capitales, comme les libellés existants, avec
  `aria-expanded` et `aria-controls` ;
- un panneau plein écran sur fond papier, liens en Newsreader, fil d'or en séparateur ;
- fermeture par Échap, par clic sur un lien et par le bouton ; focus piégé dans le panneau et
  rendu au bouton à la fermeture ; défilement de la page bloqué pendant l'ouverture ;
- le même composant pour `CineNav` (accueil) et `Navbar` (pages internes), pour ne plus avoir
  deux navigations divergentes ;
- animation réduite si `prefers-reduced-motion`.

## 3. Grilles responsive et focus visible

**Constat** : grilles en style inline, qui ne peuvent pas s'adapter à la largeur d'écran :
- `components/ServicePage.tsx` : `1fr 1.6fr` (intro) et **`1fr 1fr` (bloc contact + formulaire)**.
  Sur mobile, le seul formulaire du site est coincé dans une demi-colonne ;
- `app/vision/page.tsx` : `1fr 1.6fr` (×2) et `repeat(3, 1fr)` ;
- `app/faq/page.tsx` : `1fr 1.9fr` ; `app/offres/page.tsx` : `1fr 1.6fr`.

Les champs du formulaire suppriment le contour de focus (`outline: 'none'`) sans le remplacer :
navigation au clavier invisible.

**Proposition** : classes CSS (`.split`, `.split-wide`, `.grid-3`) passant à une colonne sous
760 px, et une règle globale `:focus-visible` (contour or `var(--gold)`, décalé de 3 px).
Aucun changement visuel sur ordinateur.

## 4. Promesse et CTA visibles dès le premier écran

**Constat** (vérifié dans le HTML pré-rendu) : dans `components/cine/HeroTableau.tsx`, le bloc
`cn-hero-content` (H1 « Bâtir des entreprises plus claires », accroche, bouton « Demander un
audit ») est servi avec `opacity:0`. Il n'apparaît qu'après avoir fait défiler 30 % d'une piste
de **420svh** (300svh sur mobile), soit environ 1,3 écran. Au premier affichage, le visiteur voit
un tableau encadré et la légende « Powamekka — Atelier des systèmes », sans savoir ce que fait
l'agence.

**Options** (à choisir sur maquette ou Preview) :
- **A — recommandée** : afficher dès l'arrivée, sous le cadre (zone de la légende), une ligne
  d'accroche et le bouton principal. Exemple : « Agence IA & systèmes digitaux pour PME » +
  « Demander un audit ». Ce bloc s'efface comme la légende quand on entre dans le tableau.
  Le geste cinématique reste intact ;
- B : poser le contenu sur le tableau dès le départ, avec un voile, et garder le zoom ;
- C : raccourcir la piste (420 → environ 260svh) pour que le contenu arrive plus vite.
  Complémentaire de A.

Points techniques associés :
- la taille du cadre est calculée à partir d'un état initial 1440×900 (`useState`), puis
  corrigée au chargement : saut probable sur mobile. Dimensionner en CSS (`vw`/`svh`) jusqu'au
  chargement de la page ;
- la galerie `Disciplines` réserve 490svh sur ordinateur (380 sur mobile) ; à réévaluer avec les
  données de défilement (point 7).

**Message** : la promesse actuelle reste abstraite. La roadmap recommande d'ajouter une phrase
concrète (automatiser l'administratif, fiabiliser le suivi client, connecter les outils).
**Le texte relève d'une décision du propriétaire** : aucune proposition chiffrée ni promesse de
résultat ne sera ajoutée sans validation.

## 5. Rideau d'ouverture (`components/cine/Loader.tsx`)

**Constat** : à chaque visite de l'accueil, défilement bloqué et page masquée pendant 2 à 2,6 s,
avant même que le contenu soit lisible. Déjà désactivé si `prefers-reduced-motion` ou arrivée sur
une ancre.

**Proposition** : ne l'afficher qu'à la première visite de la session (`sessionStorage`), et le
raccourcir à environ 1,2 s sans bloquer le défilement. À combiner avec le point 4.

## 6. Formulaire de contact amélioré

**Constat** : un formulaire n'existe que sur les 5 pages `/services/*`. L'accueil ne propose que
WhatsApp et `mailto:`. Le mot « audit » y a trois sens : bouton « Demander un audit » vers
WhatsApp, « audit gratuit » dans le blog (`app/blog/[slug]/page.tsx`), « Audit IA » vendu
205 € sur `/offres`.

**Proposition** (après fusion de la branche de fiabilisation et vérification Resend) :
- extraire le formulaire de `ServicePage` dans un composant `ContactForm` réutilisable, et
  l'ajouter à la section `#contact` de l'accueil ;
- champs : nom, email professionnel, entreprise (facultatif), sujet (liste : audit, automatisation,
  systèmes, site, formation, autre), message, téléphone (facultatif) ;
- mention d'information RGPD courte sous le bouton, avec lien vers la politique de
  confidentialité, une fois publiée ;
- état de succès qui confirme le canal de réponse, sans promettre de délai non validé ;
- **décision du propriétaire** : clarifier « audit » (ex. « échange découverte » gratuit
  ≠ « Audit IA » payant) et harmoniser les libellés des boutons.

## 7. Suivi analytique des conversions

**Constat** : aucun outil de mesure dans le code. D'après le journal SEO, Vercel Web Analytics
répond 404, donc il n'est pas activé. Search Console : 17 impressions et 1 clic sur 28 jours
(export du 09/11).

**Proposition** :
- activer Vercel Web Analytics (sans cookie) dans le dashboard, puis ajouter `@vercel/analytics`.
  **À vérifier** : la disponibilité des événements personnalisés selon le plan Vercel du projet ;
  sinon, une alternative sans cookie (Plausible, par exemple) ;
- événements : `cta_whatsapp` (avec emplacement : nav, héros, CTA, blog), `contact_submit`
  (succès ou échec), `checkout_open` (offre), `checkout_redirect` (Stripe ou Mollie),
  `purchase_confirmed` (page `/merci` payée) ;
- mettre à jour la politique de confidentialité avant activation ;
- tableau de bord mensuel : visites, sources, clics CTA, demandes, commandes.

## 8. `/merci` selon le type d'offre

**Constat** : `app/merci/page.tsx` affiche les mêmes étapes pour toutes les commandes (« contenus,
logo, références… première version avant la mise en ligne »). Elles ne conviennent pas à un audit,
une formation, un chatbot ou un SaaS.

**Proposition** : choisir les étapes selon l'offre achetée. `offer_id` figure déjà dans les
métadonnées Stripe et Mollie, et `lib/offers.ts` connaît les catégories (`sites`, `visibilite`,
`ia`, `audit`, plus les offres SaaS). Par exemple : sites → étapes actuelles ; audit → collecte
d'accès et créneau d'entretien ; SaaS → appel de cadrage. **Contenu des étapes à valider par le
propriétaire** (aucun délai nouveau ne sera inventé). Ajouter les liens légaux une fois publiés.
