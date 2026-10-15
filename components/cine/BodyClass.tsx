'use client';

import { useEffect } from 'react';

/**
 * Marque le <body> pendant la durée de vie de la page d'accueil.
 * La couche cinématique en a besoin pour calmer l'atmosphère globale
 * de hikari-v2 derrière les scènes, sans toucher aux pages internes.
 */
export default function BodyClass({ name }: { name: string }) {
  useEffect(() => {
    document.body.classList.add(name);
    return () => document.body.classList.remove(name);
  }, [name]);

  return null;
}
