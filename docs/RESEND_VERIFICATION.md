# Vérification de l'expéditeur Resend — action humaine requise

> Statut : **à faire par le propriétaire** dans le dashboard Resend et le DNS Vercel.
> Le code n'a **pas** été modifié : l'expéditeur reste `Powamekka <onboarding@resend.dev>`
> (constante `MAIL_FROM` dans `lib/email.ts`).

## Pourquoi c'est important

`onboarding@resend.dev` est l'adresse de test de Resend. D'après la documentation Resend,
elle ne permet d'envoyer qu'à l'adresse email du compte Resend lui-même. Si ce compte
n'a pas été créé avec `contact@powamekka.com`, **tous les emails du site sont refusés**
(demandes de contact et notifications de commande).

Jusqu'au correctif de la branche `fix/fiabilite-formulaires-paiements`, ces refus étaient
silencieux. Après ce correctif, ils deviennent visibles : erreur 502 côté formulaire,
réponse 500 côté webhooks, et logs `[contact] envoi impossible` / `[webhook] notification échouée`
dans Vercel.

## Constat DNS public (relevé le 23/11/2026, lecture seule)

| Enregistrement | Résultat | Interprétation |
|---|---|---|
| `NS powamekka.com` | `ns1/ns2.vercel-dns.com` | Le DNS se gère dans Vercel → Domains |
| `MX powamekka.com` | `mx1/mx2.privateemail.com` | La boîte `contact@` est chez Namecheap Private Email |
| `TXT resend._domainkey.powamekka.com` | **absent** | Pas de clé DKIM Resend publiée |
| `MX send.powamekka.com` / `TXT send.powamekka.com` | **absents** | Pas d'enregistrements d'envoi Resend |
| `TXT powamekka.com` (SPF) | **absent** | Aucun SPF, y compris pour Private Email |
| `TXT _dmarc.powamekka.com` | **absent** | Aucune politique DMARC |

Conclusion probable : **le domaine `powamekka.com` n'est pas vérifié dans Resend**.
À confirmer dans le dashboard : ce relevé ne remplace pas la page *Domains* de Resend.

## Étapes

1. **Tester l'état actuel** (5 min) : sur une Preview ou en production, envoyer une demande
   via le formulaire d'une page `/services/*`.
   - Email reçu sur `contact@powamekka.com` → l'envoi fonctionne aujourd'hui (le compte
     Resend utilise probablement cette adresse) ; poursuivre quand même les étapes 2-5
     pour la délivrabilité.
   - Pas d'email → consulter *Resend → Logs* et les logs Vercel de `/api/contact`.
2. **Resend → Domains → Add domain** : `powamekka.com` (région UE recommandée).
3. **Copier les enregistrements fournis par Resend** (en général un TXT DKIM
   `resend._domainkey`, un MX et un TXT SPF sur `send`) dans **Vercel → Domains →
   powamekka.com → DNS Records**. Ne pas toucher aux MX `privateemail.com` existants.
4. **Verify** dans Resend, attendre le statut *Verified*.
5. **Recommandé** : ajouter un SPF pour Private Email (valeur fournie par Namecheap) et un
   DMARC en mode observation, par exemple `v=DMARC1; p=none; rua=mailto:contact@powamekka.com`,
   à valider avec Namecheap.
6. **Ensuite seulement**, demander la modification de `MAIL_FROM` dans `lib/email.ts`, par
   exemple `Powamekka <notifications@powamekka.com>` : une ligne, dans une PR dédiée.
7. Refaire le test de l'étape 1 et une commande en **mode test** Stripe/Mollie sur une Preview.

## Vérifier aussi

- `RESEND_API_KEY` est bien définie dans Vercel pour *Production* **et** *Preview*.
- Le quota du plan Resend (les refus de quota renvoient désormais une erreur visible).
