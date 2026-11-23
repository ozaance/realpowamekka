import { Resend } from 'resend';

/**
 * Expéditeur actuel. `onboarding@resend.dev` est l'adresse de test de Resend :
 * à remplacer par une adresse @powamekka.com une fois le domaine vérifié dans
 * le dashboard Resend (voir docs/RESEND_VERIFICATION.md). Non modifié ici.
 */
export const MAIL_FROM = 'Powamekka <onboarding@resend.dev>';
export const MAIL_TO = 'contact@powamekka.com';

/** Échec d'envoi : configuration absente ou erreur renvoyée par Resend. */
export class EmailSendError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode: number | null
  ) {
    super(message);
    this.name = 'EmailSendError';
  }
}

type Mail = {
  subject: string;
  html: string;
  replyTo?: string;
  /** Rend l'envoi idempotent pendant 24 h côté Resend (rejeu de webhook). */
  idempotencyKey?: string;
};

/**
 * Envoie un email à Powamekka et lève une `EmailSendError` en cas d'échec.
 *
 * Le SDK Resend ne lève pas d'exception quand l'API refuse l'envoi : il
 * renvoie `{ data: null, error }`. Sans ce contrôle, un envoi raté passait
 * pour un succès.
 */
export async function sendMail(mail: Mail): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new EmailSendError('RESEND_API_KEY manquante', 'missing_api_key', null);
  }

  const { data, error } = await new Resend(apiKey).emails.send(
    {
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
    },
    mail.idempotencyKey ? { idempotencyKey: mail.idempotencyKey } : undefined
  );

  if (error || !data) {
    throw new EmailSendError(
      error?.message ?? 'Réponse Resend vide',
      error?.name ?? 'unknown',
      error?.statusCode ?? null
    );
  }
  return { id: data.id };
}

/** Résumé loggable d'une erreur d'envoi, sans donnée personnelle. */
export function describeEmailError(err: unknown) {
  if (err instanceof EmailSendError) {
    return { code: err.code, statusCode: err.statusCode, message: err.message };
  }
  return { code: 'exception', message: err instanceof Error ? err.message : String(err) };
}
