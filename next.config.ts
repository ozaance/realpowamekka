import type { NextConfig } from "next";

/**
 * En-têtes de sécurité envoyés sur toutes les réponses.
 *
 * Choisis pour ne rien changer au chargement des ressources : pas de
 * Content-Security-Policy restrictive (scripts, styles, images, vidéos)
 * tant qu'elle n'a pas été analysée. La seule directive CSP posée,
 * frame-ancestors, dit qui peut afficher le site dans un cadre ; elle ne
 * limite rien de ce que le site charge lui-même.
 *
 * Non concernés :
 * - Mollie : le paiement se fait par redirection vers mollie.com, pas dans un
 *   cadre, et le retour arrive sur /merci par une navigation normale ;
 * - WhatsApp : liens ouverts dans un nouvel onglet (rel="noopener") ;
 * - HSTS : déjà envoyé par Vercel (max-age=63072000), laissé tel quel.
 */
const securityHeaders = [
  // Interdit l'affichage du site dans un cadre (anti « clickjacking »).
  // X-Frame-Options pour les navigateurs anciens, frame-ancestors pour les récents.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Le navigateur respecte le type annoncé des fichiers, sans le deviner.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Vers un autre site, seul le domaine est transmis, jamais l'adresse complète
  // (ex. /merci?mollie_id=…).
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Fonctions du navigateur que le site n'utilise pas.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Supprime l'en-tête « X-Powered-By: Next.js » (inutile, il renseigne sur la technologie).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // AVIF en priorité (environ 20 % plus léger que WebP), WebP sinon, et
    // l'original pour les rares navigateurs qui ne prennent ni l'un ni l'autre.
    formats: ["image/avif", "image/webp"],
    // 75 : valeur par défaut (logo, illustration « conviction »).
    // 85 : tableaux plein écran (héros, disciplines, CTA), où 75 dégradait
    // visiblement les dégradés et les textures.
    qualities: [75, 85],
  },
};

export default nextConfig;
