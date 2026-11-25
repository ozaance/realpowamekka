/**
 * Utilitaires de sécurité partagés par les routes API.
 */

/** Échappe une valeur avant de l'insérer dans un gabarit HTML (emails). */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Retire les caractères de contrôle (sauts de ligne compris) : utile pour un objet d'email. */
export function singleLine(s: string): string {
  return s.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
}

/** Adresse IP du client telle que transmise par Vercel (premier maillon de x-forwarded-for). */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'inconnue';
}

/**
 * Limitation de fréquence en mémoire, par clé (ex. « contact:<ip> »).
 *
 * Limite connue : sur Vercel, chaque instance de fonction a sa propre mémoire.
 * Ce garde-fou freine un script naïf ou un double clic insistant, pas une
 * attaque distribuée. Pour une protection stricte, il faudra un stockage
 * partagé (Vercel KV / Upstash) ou une règle de pare-feu Vercel.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);

  // Nettoyage opportuniste pour que la table ne grossisse pas indéfiniment.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}
