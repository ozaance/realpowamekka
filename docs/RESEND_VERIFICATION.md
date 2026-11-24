# Resend : configuration de l'envoi d'emails et vérification en production

> Statut au 23/11/2026 : le domaine `powamekka.com` est **vérifié dans Resend**.
> L'expéditeur dans le code est `Powamekka <notifications@powamekka.com>`
> (constante `MAIL_FROM`, `lib/email.ts`). Le destinataire est `contact@powamekka.com` (`MAIL_TO`).

## Pourquoi cette configuration existe

Avant, l'expéditeur était `onboarding@resend.dev`, l'adresse de test de Resend. Elle ne peut
envoyer qu'à l'adresse du compte Resend lui-même. Les envois vers `contact@powamekka.com` étaient
donc refusés (erreur 403 « You can only send testing emails to your own email address »).
Ces refus passaient inaperçus : le formulaire affichait « Message envoyé » et les notifications
de commande se perdaient. Depuis `fix/fiabilite-formulaires-paiements`, un refus devient visible :

- formulaire : erreur 502 et message d'échec au visiteur ;
- webhooks Stripe et Mollie : réponse 500, donc nouvelle tentative par le prestataire ;
- journaux Vercel : `[contact] envoi impossible` ou `[webhook] notification échouée`.

## Enregistrements DNS en place (relevé public du 23/11/2026, vérifiable avec `dig`)

| Enregistrement | Valeur (début) | Rôle |
|---|---|---|
| `TXT resend._domainkey` | `p=MIGfMA0GCSqG…` | Clé DKIM Resend |
| `CNAME send` | `send.forge.rmta.net` | Retour d'envoi Resend |
| `CNAME rsend` | `rsend-euw1.forge.rmta.net` | Suivi Resend |
| `MX` (racine) | `mx1/mx2.privateemail.com` | Réception de `contact@` chez Namecheap : **ne pas toucher** |
| `TXT` (racine) | `v=spf1 include:spf.privateemail.com ~all` | SPF de la boîte Private Email |
| `TXT default._domainkey` | `v=DKIM1;k=rsa;…` | DKIM de Private Email |
| `TXT _dmarc` | `v=DMARC1; p=none; rua=mailto:contact@powamekka.com` | DMARC en observation |

Resend gère son propre SPF sur les sous-domaines `send` et `rsend` : le SPF racine n'a pas besoin
d'être modifié. N'ajoutez pas de MX de réception Resend sur la racine : il concurrencerait ceux
de Private Email.

Commande de contrôle (remplacer le type et le nom) :
`dig +noall +answer resend._domainkey.powamekka.com TXT @1.1.1.1`

## Vérifier la configuration en production (à refaire après chaque changement de clé ou de domaine)

1. **Resend → Domains** : `powamekka.com` doit être en statut **Verified**.
2. **Clé API** : dans Vercel → Settings → Environment Variables, `RESEND_API_KEY` doit exister
   pour **Production** *et* **Preview**, et provenir du **même compte Resend** que celui où le
   domaine est vérifié. Une clé d'un autre compte produit l'erreur 403 ci-dessus. Dans Resend →
   API keys, la colonne « Last used » doit se mettre à jour après un envoi.
3. **Test réel en production** : envoyer une demande depuis le formulaire d'une page `/services/*`.
   Attendu : message de succès au visiteur, **un** email « Nouvelle demande — … » dans
   `contact@powamekka.com` (vérifier aussi les spams), expéditeur `notifications@powamekka.com`.
   Dans Resend → Emails, l'envoi apparaît avec le statut **Delivered**.
4. **Journaux Vercel** (Logs, filtre « Error ») : aucune ligne `[contact] envoi impossible` ni
   `[webhook] notification échouée`. Une erreur `validation_error` / 403 indique une clé d'un
   autre compte ou un domaine non vérifié.
5. **Commande** : après le premier paiement réel, vérifier la réception d'un seul email
   « Commande payée ». En cas d'échec, le webhook répond 500 et le prestataire rejoue l'événement
   (Mollie : environ 26 h ; Stripe : jusqu'à 3 jours), sans doublon grâce à la clé d'idempotence.
6. **Quota** : surveiller le plan Resend. Un dépassement de quota renvoie désormais une erreur visible.

## Pour aller plus loin (facultatif)

- DMARC est en `p=none` (observation). Après quelques semaines sans problème de délivrabilité,
  envisager `p=quarantine` en consultant les rapports reçus sur `contact@powamekka.com`.
- Un second expéditeur (par exemple pour répondre aux clients) peut utiliser le même domaine
  vérifié : une ligne à changer dans `lib/email.ts`.
