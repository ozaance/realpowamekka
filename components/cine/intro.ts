/**
 * Ouverture cinématique de l'accueil : seulement à la première visite.
 *
 * Le rendu serveur montre toujours l'accueil « ouvert » : tableau plein écran,
 * titre, sous-titre et boutons lisibles immédiatement. Pour un nouveau
 * visiteur, un petit script exécuté avant le premier affichage pose
 * `data-cn-intro` sur <html> : le rideau (Loader) s'affiche alors, puis le
 * tableau s'ouvre dans son cadre. Les visiteurs suivants, les arrivées sur
 * une ancre (/#methode) et le réglage « réduire les animations » n'ont pas
 * d'ouverture.
 */

export const INTRO_ATTR = 'data-cn-intro';
export const INTRO_SEEN_KEY = 'cn-intro-seen';
/** Évènement émis quand le rideau se lève : { skipped: boolean }. */
export const INTRO_LIFT_EVENT = 'cn:intro-lift';
/** Au-delà, l'ouverture n'a plus lieu (JavaScript trop lent à démarrer) :
    le rideau s'est déjà retiré seul en CSS, on ne referme pas le tableau. */
export const INTRO_DEADLINE_MS = 3500;

/* Exécuté dans le HTML, avant l'affichage. Toute erreur (stockage bloqué,
   navigation privée) laisse l'accueil ouvert : le message reste visible. */
export const INTRO_SCRIPT = `try{var d=document.documentElement;if(!localStorage.getItem('${INTRO_SEEN_KEY}')&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('${INTRO_ATTR}','1')}}catch(e){}`;

type IntroWindow = Window & { __cnIntroLifted?: boolean };

/** L'ouverture est-elle en cours (rideau pas encore levé) ? */
export function introPending(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as IntroWindow).__cnIntroLifted) return false;
  if (document.documentElement.getAttribute(INTRO_ATTR) !== '1') return false;
  return performance.now() < INTRO_DEADLINE_MS;
}

/** Lève le rideau une seule fois, mémorise la visite et prévient le héros. */
export function liftIntro(skipped: boolean) {
  const w = window as IntroWindow;
  if (w.__cnIntroLifted) return;
  w.__cnIntroLifted = true;
  try {
    localStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    /* stockage indisponible : l'ouverture rejouera, sans gravité */
  }
  window.dispatchEvent(new CustomEvent(INTRO_LIFT_EVENT, { detail: { skipped } }));
}
