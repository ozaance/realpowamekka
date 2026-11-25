import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
