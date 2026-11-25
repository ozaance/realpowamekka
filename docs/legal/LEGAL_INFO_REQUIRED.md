# Informations juridiques à fournir — POWAMEKKA

> **Statut : NON VALIDÉ.** Document de travail préparé le 23/11/2026 pour la rédaction des
> mentions légales, de la politique de confidentialité et des CGV. Rien ici n'est publié sur le
> site. Aucune information légale n'a été inventée : tout ce qui n'est pas vérifiable dans le
> dépôt est marqué **[À FOURNIR]**. Une validation par un professionnel du droit (avocat,
> expert-comptable ou juriste) est requise avant toute publication.

Brouillons associés, dans le même dossier :
- `BROUILLON-mentions-legales.md`
- `BROUILLON-politique-confidentialite.md`
- `BROUILLON-cgv.md`
- `BROUILLON-acceptation-cgv-paiement.md`

---

## 1. Identité de l'éditeur du site

| Information | Valeur | Source / statut |
|---|---|---|
| Nom commercial | POWAMEKKA | Site |
| Forme juridique (EI, micro-entreprise, SASU, SARL…) | **[À FOURNIR]** | — |
| Dénomination sociale (si société) | **[À FOURNIR]** | — |
| Nom et prénom de l'entrepreneur (si EI) | **[À FOURNIR]** | — |
| Capital social (si société) | **[À FOURNIR]** | — |
| SIREN / SIRET | **[À FOURNIR]** | — |
| Immatriculation RCS / RNE + ville | **[À FOURNIR]** | — |
| Code APE / NAF | **[À FOURNIR]** | — |
| Adresse du siège ou de domiciliation | **[À FOURNIR]** | Le site indique seulement « Rouen » |
| Email de contact | contact@powamekka.com | Site |
| Téléphone | **[À CONFIRMER]** | Le numéro WhatsApp du site peut-il être publié comme numéro légal ? |
| Directeur ou directrice de la publication | **[À FOURNIR]** | — |
| N° de TVA intracommunautaire | **[À FOURNIR]**, ou mention de franchise en base | — |

## 2. Fiscalité et prix

| Question | Pourquoi c'est nécessaire |
|---|---|
| Assujetti à la TVA ou en franchise en base (art. 293 B du CGI) ? | Les prix doivent indiquer HT ou TTC. **Aujourd'hui, aucun prix du site n'indique HT ou TTC.** |
| Les montants de `lib/offers.ts` sont-ils HT ou TTC ? | À afficher sur `/offres`, dans les CGV et dans la fenêtre de commande. |
| Facturation : qui émet la facture, comment est-elle envoyée, sous quel délai ? | Obligation de facturation. Stripe envoie un reçu, ce qui n'est pas une facture. Mollie n'envoie rien. |

## 3. Clientèle visée : professionnels uniquement, ou aussi des particuliers ?

**Décision structurante.** Le paiement en ligne est aujourd'hui ouvert à tous.

- **Professionnels uniquement (B2B)** : CGV plus simples, pas de droit de rétractation légal.
  Il faut alors l'écrire clairement sur `/offres` et dans la fenêtre de commande, et idéalement
  demander le nom de l'entreprise ou le SIRET.
- **Particuliers acceptés (B2C)** : en plus, droit de rétractation de 14 jours et ses
  exceptions, médiateur de la consommation obligatoire, prix TTC, garanties légales,
  information précontractuelle renforcée.

| Information | Statut |
|---|---|
| Clientèle : B2B seul / B2B + B2C | **[À DÉCIDER]** |
| Médiateur de la consommation (si B2C) : nom, site, adresse | **[À FOURNIR]**, adhésion à souscrire |

## 4. Conditions contractuelles à confirmer

Les éléments ci-dessous **figurent déjà sur le site** mais doivent être confirmés comme
engagements contractuels, ou reformulés :

| Affiché sur le site | Où | Question |
|---|---|---|
| « Livrée en 24h » (Landing page) | `lib/offers.ts` | Délai garanti ? À partir de quand (paiement, réception des contenus) ? |
| « Livré en 5 jours » (Site vitrine) | `lib/offers.ts` | Idem, et jours ouvrés ou calendaires ? |
| « Cadrage sous 48h » (Prototype MVP, SaaS) | `lib/offers.ts` | Le délai de livraison final est-il défini ? |
| « Nous vous contactons sous 24h » | `app/merci/page.tsx` | Engagement contractuel ? |
| « Vous validez une première version avant la mise en ligne » | `app/merci/page.tsx` | Nombre d'allers-retours inclus ? |
| « Maintenance de site (1 mois) » | `lib/offers.ts` | Périmètre exact ? |
| « Formation IA pour équipe (2 h en visio) » | `lib/offers.ts` | Taille d'équipe max ? Report ou annulation ? |

À définir **[À FOURNIR]** :
- délai laissé au client pour fournir ses contenus, et conséquence d'un retard ;
- nombre de révisions incluses, et prix des révisions supplémentaires ;
- propriété intellectuelle : cession des droits sur les livrables (à quel moment, quelle étendue), réutilisation par POWAMEKKA, portfolio ;
- hébergement, nom de domaine et abonnements tiers après livraison : qui paie, qui en est titulaire ;
- politique d'annulation et de remboursement, y compris en B2B ;
- limitation de responsabilité (plafond) ;
- droit applicable et tribunal compétent (en B2B) ;
- assurance responsabilité civile professionnelle : assureur, n° de contrat, couverture géographique, si souscrite ;
- version et date d'entrée en vigueur des CGV.

## 5. Données personnelles (RGPD)

Constaté dans le code le 23/11/2026, à confirmer et compléter :

| Traitement | Données | Destinataires / sous-traitants | À fournir |
|---|---|---|---|
| Formulaire de contact (`/services/*`) | nom, email, message, service consulté | Resend (envoi), boîte mail Private Email (Namecheap) | durée de conservation |
| Commande via Stripe | nom, email, téléphone, adresse de facturation, entreprise (facultatif) | Stripe | durée de conservation, base légale |
| Commande via Mollie | nom, email, téléphone et entreprise (facultatifs), saisis sur le site | Mollie | idem |
| Notification de commande | mêmes données, envoyées par email | Resend, Private Email | idem |
| Hébergement et journaux techniques | adresse IP, requêtes | Vercel | durée des logs Vercel (selon le plan) |
| Limitation de fréquence anti-abus | adresse IP, en mémoire du serveur, quelques minutes | aucun | — |
| Lien WhatsApp | ce que la personne écrit sur WhatsApp | Meta (WhatsApp) | conservation des conversations |

Constats :
- **aucun cookie ni outil de mesure d'audience** dans le code (pas de bandeau cookies nécessaire **à ce jour**) ;
- les polices Google sont auto-hébergées (`next/font`), donc aucun appel à Google au chargement des pages ;
- Stripe et Mollie déposent leurs propres cookies sur leurs pages de paiement.

À fournir :
- **[À FOURNIR]** responsable du traitement (identité de la section 1) ;
- **[À FOURNIR]** durées de conservation par traitement (prospects, clients, pièces comptables) ;
- **[À FOURNIR]** adresse pour exercer les droits RGPD (par défaut : contact@powamekka.com ?) ;
- **[À VÉRIFIER]** transferts hors UE : Vercel et Resend sont des sociétés américaines. Vérifier leurs DPA et garanties (Data Privacy Framework ou clauses contractuelles types) et la région d'hébergement choisie ;
- **[À DÉCIDER]** l'ajout futur d'un outil d'analytics (voir rapport P2) devra mettre la politique à jour, et éventuellement imposer un bandeau de consentement selon l'outil.

## 6. Hébergeur

| Information | Valeur | Statut |
|---|---|---|
| Hébergeur | Vercel Inc. | DNS en `vercel-dns.com`, projet Vercel |
| Adresse | **[À VÉRIFIER sur vercel.com/legal]** | Ne pas recopier une adresse non vérifiée |
| Téléphone ou contact | **[À VÉRIFIER]** | — |

## 7. Avant publication

1. Remplir toutes les mentions **[À FOURNIR]** / **[À DÉCIDER]**.
2. Faire relire les trois brouillons par un professionnel du droit.
3. Créer les pages (`/mentions-legales`, `/confidentialite`, `/cgv`) dans une PR dédiée, avec
   des liens dans le footer.
4. Mettre en place l'acceptation des CGV avant paiement (voir
   `BROUILLON-acceptation-cgv-paiement.md`) : c'est une modification du parcours de paiement,
   qui demande une validation explicite.
5. Indiquer HT ou TTC à côté de chaque prix.
