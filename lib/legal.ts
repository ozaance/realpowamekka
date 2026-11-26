/**
 * Contenu des pages légales : mentions légales et politique de confidentialité.
 *
 * Texte brut, sans balises. Les informations d'identification viennent de l'attestation
 * d'immatriculation au Registre national des entreprises du 26 novembre 2026, fournie par
 * l'éditeur. Les conditions générales de vente ne sont pas publiées : voir « Conditions de vente ».
 */

export type LegalBlock = string | { list: string[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalDocument = {
  slug: string;
  kicker: string;
  title: string;
  lede: string;
  updated: string;
  description: string;
  sections: LegalSection[];
};

export const LEGAL_UPDATED = '26 novembre 2026';

export const mentionsLegales: LegalDocument = {
  slug: 'mentions-legales',
  kicker: 'Informations légales',
  title: 'Mentions légales',
  lede: "Qui édite ce site, qui l'héberge et comment nous joindre.",
  updated: LEGAL_UPDATED,
  description:
    "Mentions légales du site powamekka.com : éditeur, immatriculation, directeur de la publication, hébergeur et contact.",
  sections: [
    {
      title: 'Éditeur du site',
      blocks: [
        'Le site www.powamekka.com est édité par Osee DIAMPO SENGELE EI, entrepreneur individuel, exerçant sous le nom commercial POWAMEKKA.',
        {
          list: [
            "Adresse : 22 rue d'Ottmarsheim, 68100 Mulhouse, France",
            'Téléphone : +33 6 35 09 79 80',
            'Adresse e-mail : contact@powamekka.com',
            'SIREN : 822 349 841',
            'SIRET du siège : 822 349 841 00012',
            'Immatriculation au Registre national des entreprises : 6 septembre 2016',
            'Numéro individuel d’identification à la TVA : FR35822349841',
          ],
        },
        "Le site s'adresse exclusivement aux professionnels.",
      ],
    },
    {
      title: 'Directeur de la publication',
      blocks: ['Osee DIAMPO SENGELE.'],
    },
    {
      title: 'Hébergeur',
      blocks: [
        'Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis. Contact : privacy@vercel.com.',
      ],
    },
    {
      title: 'Propriété intellectuelle',
      blocks: [
        "Les textes, le logo, le nom POWAMEKKA et la mise en page de ce site sont la propriété de l'éditeur. Toute reproduction sans autorisation préalable est interdite.",
      ],
    },
    {
      title: 'Données personnelles et stockage dans le navigateur',
      blocks: [
        'Le traitement des données personnelles est décrit dans la politique de confidentialité.',
        "Le site n'utilise aucun cookie de mesure d'audience ni de publicité. Il enregistre dans le navigateur un seul indicateur technique non personnel, qui évite de rejouer l'animation d'ouverture de la page d'accueil.",
      ],
    },
    {
      title: 'Conditions de vente',
      blocks: [
        "Les conditions générales de vente applicables sont communiquées à tout professionnel qui en fait la demande à contact@powamekka.com.",
      ],
    },
    {
      title: 'Contact',
      blocks: ['contact@powamekka.com'],
    },
  ],
};

export const politiqueConfidentialite: LegalDocument = {
  slug: 'confidentialite',
  kicker: 'Informations légales',
  title: 'Politique de confidentialité',
  lede: 'Les données que nous recevons, pourquoi, combien de temps, et vos droits.',
  updated: LEGAL_UPDATED,
  description:
    "Politique de confidentialité de powamekka.com : données collectées, finalités, durées de conservation, prestataires et droits des personnes.",
  sections: [
    {
      title: 'Responsable du traitement',
      blocks: [
        "Osee DIAMPO SENGELE EI, entrepreneur individuel, nom commercial POWAMEKKA, SIREN 822 349 841, 22 rue d'Ottmarsheim, 68100 Mulhouse, joignable à contact@powamekka.com.",
        "Le site s'adresse à des professionnels. Le RGPD protège aussi les personnes qui les représentent : dirigeants, salariés, interlocuteurs.",
      ],
    },
    {
      title: 'Données collectées, finalités et durées',
      blocks: [
        {
          list: [
            "Formulaire de contact : nom, e-mail, message et service consulté, pour répondre à votre demande. Conservation : 3 ans après le dernier échange.",
            "Commande en ligne : nom, e-mail, et, si vous les renseignez, téléphone et entreprise, pour exécuter la commande. Conservation : 3 ans après la fin de la relation commerciale, hors pièces comptables.",
            "Facturation : pièces et données de facturation, pour respecter nos obligations comptables. Conservation : 10 ans.",
            "Sécurité du site : adresse IP et données techniques de connexion, pour prévenir les abus. La limitation de débit garde l'adresse IP quelques minutes, en mémoire. Les journaux de l'hébergeur suivent sa propre politique.",
            "Échange sur WhatsApp : ce que vous choisissez d'écrire, pour échanger avec vous. Conservation : 3 ans après le dernier échange.",
          ],
        },
        "Aucune donnée n'est vendue ni utilisée à des fins publicitaires.",
      ],
    },
    {
      title: 'Destinataires et sous-traitants',
      blocks: [
        "Vos données ne sont accessibles qu'à l'éditeur et aux prestataires techniques suivants, dans la limite de leur mission :",
        {
          list: [
            'Vercel Inc. : hébergement du site ;',
            'Resend : envoi des e-mails du site (demandes de contact, notifications de commande) ;',
            'Namecheap (Private Email) : boîte de réception contact@powamekka.com ;',
            'Mollie B.V. : paiement en ligne ;',
            'WhatsApp (Meta) : seulement si vous choisissez ce canal.',
          ],
        },
      ],
    },
    {
      title: "Transferts hors de l'Union européenne",
      blocks: [
        "Certains prestataires techniques sont établis hors de l'Union européenne, notamment aux États-Unis. Ces transferts s'appuient sur les garanties prévues par le RGPD : décision d'adéquation, comme le cadre de protection des données UE-États-Unis, ou clauses contractuelles types de la Commission européenne.",
        "Vercel déclare adhérer au cadre de protection des données UE-États-Unis et utiliser les clauses contractuelles types.",
      ],
    },
    {
      title: 'Stockage dans le navigateur',
      blocks: [
        "Le site ne dépose aucun cookie de mesure d'audience ni de publicité. Il enregistre dans le navigateur un seul indicateur technique non personnel, qui évite de rejouer l'animation d'ouverture de la page d'accueil.",
        'Les pages de paiement de Mollie sont régies par la politique de Mollie.',
      ],
    },
    {
      title: 'Vos droits',
      blocks: [
        "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, et vous pouvez définir des directives sur leur sort après votre décès. Pour les exercer, écrivez à contact@powamekka.com : nous répondons dans un délai d'un mois.",
        'Vous pouvez aussi adresser une réclamation à la CNIL (www.cnil.fr).',
      ],
    },
    {
      title: 'Sécurité',
      blocks: [
        "Les échanges avec le site sont chiffrés (HTTPS). Aucune donnée bancaire ne transite par ce site : les paiements sont traités par Mollie. Sur la page de confirmation de commande, votre adresse e-mail n'est affichée que partiellement.",
      ],
    },
    {
      title: "Données traitées pour le compte d'un client",
      blocks: [
        "Lorsqu'une prestation conduit POWAMEKKA à traiter des données personnelles pour le compte d'un client, POWAMEKKA agit comme sous-traitant et un accord de sous-traitance est signé avec ce client.",
      ],
    },
    {
      title: 'Modifications',
      blocks: [
        "Cette politique évoluera si de nouveaux outils sont ajoutés au site, par exemple un outil de facturation ou une mesure d'audience. La date de mise à jour figure en tête de page.",
      ],
    },
  ],
};
