import { useTransform, type MotionValue } from 'framer-motion';

/**
 * Interpolation linéaire par morceaux, bornée aux extrémités.
 *
 * Pourquoi ne pas utiliser `useTransform(p, entrée, sortie)` pour les
 * opacités : framer-motion les confie alors à une ViewTimeline native du
 * navigateur, dont la plage est calculée différemment de celle de son
 * propre `useScroll` dès que la cible contient un enfant `sticky`. Les
 * opacités se décalaient alors des transformations (texte fantôme dans le
 * héros). Avec une fonction, la valeur reste calculée en JS, sur la même
 * progression que tout le reste.
 */
export function lerpRange(v: number, input: number[], output: number[]): number {
  const last = input.length - 1;
  if (v <= input[0]) return output[0];
  if (v >= input[last]) return output[last];

  for (let i = 0; i < last; i++) {
    if (v <= input[i + 1]) {
      const t = (v - input[i]) / (input[i + 1] - input[i] || 1);
      return output[i] + (output[i + 1] - output[i]) * t;
    }
  }
  return output[last];
}

export function useScrub(p: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(p, (v) => lerpRange(v, input, output));
}
