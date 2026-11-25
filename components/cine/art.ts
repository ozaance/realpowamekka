/**
 * Réglages communs des tableaux plein écran (héros, disciplines, CTA).
 *
 * Les tableaux sont au format 16:9 et couvrent l'écran (object-fit: cover),
 * avec une légère respiration (scale jusqu'à 1,12). Sur un écran plus haut
 * que 16:9 (téléphone en portrait, portable 16:10), c'est la hauteur qui
 * commande : l'image doit faire environ 1,78 × la hauteur de l'écran, d'où
 * 200vh. Sinon, la largeur de l'écran plus la marge de respiration (112vw).
 * Avec « 100vw », un téléphone recevrait une image trois fois trop étroite
 * et le tableau serait flou.
 */
export const ART_SIZES = '(max-aspect-ratio: 16/9) 200vh, 112vw';

/** Qualité d'encodage des tableaux (voir images.qualities dans next.config.ts). */
export const ART_QUALITY = 85;
