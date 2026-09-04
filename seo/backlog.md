# Backlog éditorial & technique

File priorisée. L'agent prend **le premier élément non bloqué** de chaque section à chaque cycle,
puis met ce fichier à jour. Abdoulaye peut réordonner, ajouter ou supprimer librement.

---

## Technique — par ordre d'impact

- [x] ~~**Canonical erroné sur tout le site.**~~ Corrigé le 2026-09-04 : canonical retiré du
      layout, déclaré explicitement sur chaque page. Vérifié sur le build.
- [ ] **JSON-LD `BlogPosting`** absent sur `app/blog/[slug]/page.tsx`.
- [ ] **CTA BTP codé en dur** sur tous les articles (`app/blog/[slug]/page.tsx`), y compris
      ceux qui ne parlent pas de BTP. Le conditionner à `category`.
- [ ] **OpenGraph par page** : les pages de service et les articles héritent de l'OG de
      l'accueil. Tout partage social affiche le mauvais titre.
- [ ] **`BreadcrumbList`** sur articles et pages de service.
- [ ] **`lastModified` du sitemap** : `new Date()` pour toutes les pages statiques, donc
      « modifié aujourd'hui » à chaque build. Utiliser la date du dernier commit du fichier.
- [ ] **Schéma `Service`** sur les cinq pages de `app/services/`.
- [ ] **Schéma `Offer`** sur `/offres`, aligné sur les prix de `lib/offers.ts`.
- [ ] Vérifier le poids de `public/og-image.png` et `public/conviction-illustration.png`.

---

## Éditorial — file d'attente

Un article par cycle, pris en haut de liste.

1. **« Par où commencer avec l'IA quand on dirige une PME (et qu'on n'y connaît rien) »**
   Intention : informationnelle haute, entrée de tunnel. Cluster 1.
   Angle : l'ordre dans lequel s'y prendre, les trois erreurs qui coûtent le plus cher.
   Lien pilier : `/services/audit`.

2. **« Combien coûte vraiment l'automatisation d'une PME »**
   Intention : commerciale. Cluster 1 + 4. Peu traité honnêtement par la concurrence.
   Angle : fourchettes réelles, ce qui fait varier le prix, ce qui ne vaut pas le coup.
   Lien pilier : `/offres`, `/services/audit`.

3. **« Relancer ses devis automatiquement : ce que ça change sur un mois »**
   Intention : commerciale, cluster 3 (BTP). Concurrence faible.
   Angle : le calcul concret sur un carnet de devis type.
   Lien pilier : `/services/ia`.

4. **« Former ses équipes à l'IA sans bloquer la production »**
   Intention : informationnelle, cluster 5.
   Lien pilier : `/services/formation`.

5. **« MVP ou site vitrine : ce dont vous avez réellement besoin pour lancer »**
   Intention : transactionnelle, cluster 7.
   Lien pilier : `/offres`.

---

## Idées non priorisées

À faire remonter dans la file quand les données Search Console les confirment.

- Étude de cas anonymisée, à écrire uniquement à partir d'une mission réelle validée par Abdoulaye.
- Page glossaire « le vocabulaire de l'IA pour dirigeants », si le cluster 1 progresse.
- Comparatif honnête des outils d'automatisation grand public (Zapier / Make / n8n).
