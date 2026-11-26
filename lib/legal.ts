/**
 * Contenu des pages légales : mentions légales et politique de confidentialité.
 *
 * Texte brut, sans balises. Les informations d'identification viennent de l'attestation
 * d'immatriculation au Registre national des entreprises du 26 novembre 2026, fournie par
 * l'éditeur.
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
        "Les conditions générales de vente sont consultables sur la page Conditions générales de vente. Elles sont aussi communiquées à tout professionnel qui en fait la demande à contact@powamekka.com.",
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

/**
 * Politique de confidentialité affichée. Jour de l'activation de la collecte des informations de facturation
 * (BILLING_FIELDS_ENABLED=1), la ligne « Commande en ligne » décrit les nouvelles données ; la page est
 * statique : l'indicateur est lu à la construction, la mise à jour suit donc le déploiement de l'activation.
 */
export function getPolitiqueConfidentialite(): LegalDocument {
  if (process.env.BILLING_FIELDS_ENABLED !== '1') return politiqueConfidentialite;
  const cgv = process.env.CGV_ACCEPTANCE_ENABLED === '1';
  return {
    ...politiqueConfidentialite,
    sections: politiqueConfidentialite.sections.map((section) => ({
      ...section,
      blocks: section.blocks.map((block) =>
        typeof block === 'string'
          ? block
          : {
              list: block.list.map((item) =>
                item.startsWith('Commande en ligne :')
                  ? `Commande en ligne : nom et prénom du contact, e-mail, dénomination de l'entreprise, numéro SIREN, adresse de facturation, numéro de TVA intracommunautaire (facultatif) et, si vous le renseignez, téléphone, pour exécuter la commande et établir la facture.${cgv ? " Nous enregistrons aussi la version des conditions générales de vente acceptée et la date d'acceptation." : ''} Conservation : 3 ans après la fin de la relation commerciale pour les données hors comptabilité, 10 ans pour les pièces comptables.`
                  : item,
              ),
            },
      ),
    })),
  };
}

export const LEGAL_CGV_VERSION = '1.0';

export const conditionsGenerales: LegalDocument = {
  slug: 'cgv',
  kicker: 'Informations légales',
  title: 'Conditions générales de vente',
  lede: "Les règles qui s'appliquent à nos prestations, entre professionnels.",
  updated: LEGAL_UPDATED,
  description:
    "Conditions générales de vente professionnelles de POWAMEKKA : devis, prix, échéanciers de paiement, délais, révisions, propriété intellectuelle, hébergement et abonnement.",
  sections: [
    {
      title: 'Article 1. Objet et clientèle',
      blocks: [
        `Version ${LEGAL_CGV_VERSION}, en vigueur à compter du ${LEGAL_UPDATED}.`,
        "Les présentes conditions générales de vente (« CGV ») régissent les prestations vendues par Osee DIAMPO SENGELE EI, entrepreneur individuel exerçant sous le nom commercial POWAMEKKA (« POWAMEKKA »), dont l'identification complète figure dans les mentions légales.",
        "Les prestations sont exclusivement réservées aux professionnels agissant pour les besoins de leur activité (« le Client ») et immatriculés en France. POWAMEKKA ne conclut pas de contrat avec des consommateurs.",
        "Toute commande ou acceptation de devis implique l'acceptation des présentes CGV, dans la version en vigueur à cette date. Elles sont communiquées à tout professionnel qui en fait la demande.",
      ],
    },
    {
      title: 'Article 2. Prestations',
      blocks: [
        "POWAMEKKA propose des sites web (landing page, site vitrine), des projets sur mesure (prototype MVP, application SaaS Standard ou Premium) et des prestations à la carte (audits, SEO, automatisation, formation, maintenance ponctuelle, entre autres).",
        "Les offres sont fournies sur devis. Lorsque la commande en ligne est ouverte sur la page Offres, certaines offres peuvent aussi être commandées en ligne. Les caractéristiques essentielles de chaque offre sont celles décrites sur la page Offres ou dans le devis au moment de la commande.",
      ],
    },
    {
      title: 'Article 3. Devis',
      blocks: [
        "Les devis émis par POWAMEKKA sont valables 30 jours à compter de leur date d'émission. Passé ce délai, POWAMEKKA peut émettre un nouveau devis.",
        "Un devis est accepté par sa signature ou son acceptation écrite, puis par le règlement de la première échéance prévue. La prestation commence après l'acceptation du devis et ce règlement.",
      ],
    },
    {
      title: 'Article 4. Prix',
      blocks: [
        "Les prix sont exprimés en euros hors taxes (HT). La TVA est facturée en sus au taux de 20 %, et le montant toutes taxes comprises (TTC) est indiqué avec chaque prix.",
        "Aucun escompte n'est accordé en cas de paiement anticipé.",
        "Ne sont pas compris dans le prix, sauf mention contraire : les licences de logiciels ou de composants tiers, les noms de domaine, les consommations d'API et les abonnements à des services tiers.",
      ],
    },
    {
      title: 'Article 5. Informations du Client',
      blocks: [
        "Pour toute commande ou tout devis, le Client communique sa dénomination professionnelle, son numéro SIREN, son adresse de facturation et une adresse e-mail de contact. Son numéro de TVA intracommunautaire est facultatif.",
      ],
    },
    {
      title: 'Article 6. Paiement',
      blocks: [
        "Les paiements s'effectuent par Mollie, au moyen d'un lien de paiement. POWAMEKKA n'a jamais accès aux données bancaires du Client. Chaque échéance donne lieu à une facture.",
        {
          list: [
            "Landing page : 100 % à la commande.",
            "Site vitrine : 50 % à la commande, 50 % avant la livraison.",
            "Prototype MVP, SaaS Standard et SaaS Premium (sur devis uniquement) : 40 % à l'acceptation du devis, 40 % après validation de la conception, 20 % avant la livraison finale.",
            "Prestations à la carte sur devis : 100 % à l'acceptation du devis.",
            "Autres prestations sur mesure : échéancier indiqué dans le devis.",
          ],
        },
        "Le dernier paiement est exigible avant la mise en production et la remise des accès définitifs.",
        "Les factures d'échéance sont payables à réception. Tout retard de paiement entraîne de plein droit, sans rappel préalable, des pénalités de retard au taux de trois fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de 40 euros pour frais de recouvrement.",
        "Les factures sont émises dans le respect de la réglementation applicable, y compris le calendrier de la facturation électronique.",
      ],
    },
    {
      title: 'Article 7. Délais',
      blocks: [
        "Le délai de réalisation est confirmé au Client après le cadrage de son projet. Il court à compter de la dernière de ces deux dates : le règlement de la première échéance et la réception de l'ensemble des éléments nécessaires fournis par le Client.",
        "Lorsque le Client tarde à fournir les contenus, accès, informations ou validations nécessaires, le calendrier est décalé d'une durée au moins égale au retard.",
      ],
    },
    {
      title: 'Article 8. Obligations du Client',
      blocks: [
        "Le Client fournit les contenus, accès et informations nécessaires à la réalisation de la prestation, garantit disposer des droits sur les éléments qu'il transmet (textes, logos, images, données) et désigne un interlocuteur habilité à valider les livrables.",
      ],
    },
    {
      title: 'Article 9. Révisions',
      blocks: [
        "La Landing page et le Site vitrine comprennent deux séries de révisions. Une série de révisions est une liste unique et regroupée de demandes de modification, transmise en une fois par écrit, sans changement du périmètre initial.",
        "Les révisions supplémentaires et les demandes qui modifient le périmètre (nouvelle page, nouvelle fonctionnalité) font l'objet d'un devis complémentaire. Pour les autres offres, le nombre de révisions est fixé au cadrage ou dans le devis.",
      ],
    },
    {
      title: 'Article 10. Mise en production et remise des éléments',
      blocks: [
        "La mise en production a lieu après la validation finale du Client et l'encaissement du dernier paiement.",
        "Les éléments prévus au contrat sont remis au Client dans un délai de 15 jours ouvrés après le règlement des sommes dues. Le nom de domaine est enregistré au nom du Client dès le départ.",
      ],
    },
    {
      title: 'Article 11. Propriété intellectuelle',
      blocks: [
        "Sous réserve du paiement intégral du prix, POWAMEKKA cède au Client les droits patrimoniaux d'auteur sur les créations réalisées spécifiquement pour lui : droits de reproduction, de représentation, d'adaptation et de modification, pour les besoins de l'activité du Client, pour le monde entier et pour la durée légale de protection des droits d'auteur. Jusqu'au paiement intégral, POWAMEKKA reste titulaire de ces droits.",
        "Cette cession exclut les outils, méthodes, savoir-faire et composants préexistants de POWAMEKKA, dont le Client reçoit seulement le droit de les utiliser avec le livrable. Les éléments de tiers (bibliothèques, polices, images, modèles et services d'IA) restent soumis à leurs propres licences.",
      ],
    },
    {
      title: 'Article 12. Prestations à la carte et maintenance ponctuelle',
      blocks: [
        "Chaque prestation à la carte porte sur le périmètre décrit sur la page Offres ou dans le devis. La maintenance de site (1 mois) est une intervention ponctuelle d'un mois : mises à jour et corrections du site, sans nouvelle fonctionnalité ni refonte. Elle est distincte de l'abonnement d'hébergement. Aucun volume horaire n'est fixé.",
      ],
    },
    {
      title: 'Article 13. Hébergement et abonnement',
      blocks: [
        "La Landing page et le Site vitrine comprennent 12 mois d'hébergement.",
        "À partir du 13e mois, le Client peut souscrire l'abonnement d'hébergement à 149 € HT par mois (178,80 € TTC), uniquement après son accord écrit préalable. Le silence du Client ne vaut jamais acceptation et aucun abonnement n'est renouvelé automatiquement. Après acceptation, l'abonnement est mensuel, sans durée minimale d'engagement, et chaque partie peut le résilier avec un préavis d'un mois.",
        "L'abonnement comprend l'hébergement, la surveillance technique et les sauvegardes selon les possibilités du prestataire, et une heure de petites modifications par mois dans le périmètre convenu. Les sauvegardes sont conservées 30 jours puis supprimées, sous réserve des obligations légales.",
        "Sont exclus : les nouvelles fonctionnalités, les refontes, les licences, les noms de domaine, les consommations d'API et les frais exceptionnels. Sans accord écrit du Client, aucun abonnement n'est facturé ; les modalités applicables au site à la fin des 12 mois sont précisées au Client avant cette échéance.",
      ],
    },
    {
      title: 'Article 14. Responsabilité',
      blocks: [
        "POWAMEKKA est tenue d'une obligation de moyens. Elle ne garantit aucun résultat commercial, notamment en matière de trafic, de positionnement dans les moteurs de recherche ou de ventes.",
      ],
    },
    {
      title: 'Article 15. Données personnelles',
      blocks: [
        "Le traitement des données personnelles des interlocuteurs du Client est décrit dans la politique de confidentialité. Lorsque POWAMEKKA traite des données personnelles pour le compte du Client, les parties formalisent cette relation par un accord de sous-traitance conforme au règlement général sur la protection des données.",
      ],
    },
    {
      title: 'Article 16. Confidentialité et références',
      blocks: [
        "Chaque partie garde confidentielles les informations non publiques reçues de l'autre partie. POWAMEKKA ne cite le Client, son nom, son logo ou la réalisation comme référence commerciale qu'avec l'accord écrit préalable du Client.",
      ],
    },
    {
      title: 'Article 17. Droit applicable et litiges',
      blocks: [
        "Les présentes CGV sont soumises au droit français. Les parties recherchent d'abord une solution amiable. À défaut, les juridictions compétentes sont déterminées selon les règles légales de compétence.",
      ],
    },
  ],
};
