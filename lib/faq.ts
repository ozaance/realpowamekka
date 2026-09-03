/**
 * Contenu de la page /faq.
 *
 * Sert à la fois au rendu de la page et au JSON-LD FAQPage : les réponses sont
 * donc du texte brut, sans balises.
 */

export type FaqItem = { question: string; answer: string };
export type FaqSection = { title: string; items: FaqItem[] };

export const faqSections: FaqSection[] = [
  {
    title: "L'IA en pratique",
    items: [
      {
        question: "L'intelligence artificielle est-elle vraiment utile pour une PME ?",
        answer:
          "Oui, à condition de l'appliquer à des tâches précises plutôt qu'à l'entreprise entière. Rédaction de devis, relances clients, tri des messages, rapports d'intervention : ce sont des tâches répétitives et sans valeur stratégique que l'IA traite aujourd'hui de façon fiable. Un dirigeant de PME passe entre 30 et 40 % de son temps sur ce type de travail administratif. C'est ce temps que l'automatisation rend disponible.",
      },
      {
        question: "Faut-il des compétences techniques pour utiliser l'IA dans son entreprise ?",
        answer:
          "Non. Les systèmes que nous déployons sont conçus pour être utilisés par vos équipes, pas par des développeurs. La formation fait partie de la mission : nous formons vos collaborateurs sur les outils réellement déployés chez vous, à partir de vos propres cas, et nous documentons le fonctionnement pour que l'usage tienne dans la durée.",
      },
      {
        question: "Quelles tâches faut-il automatiser en premier ?",
        answer:
          "Celles qui reviennent chaque semaine et suivent toujours la même logique. En pratique : la rédaction de devis, les relances de devis restés sans réponse, la saisie des rapports de fin de journée et le tri des demandes entrantes. L'audit sert précisément à identifier les deux ou trois tâches qui consomment le plus de temps chez vous, puis à les traiter par ordre d'impact.",
      },
      {
        question: "L'IA va-t-elle remplacer mes salariés ?",
        answer:
          "Ce n'est ni l'objectif ni ce que nous mettons en place. L'automatisation prend en charge ce qui ne demande pas de jugement humain : la ressaisie, la mise en forme, le suivi. Vos équipes gardent la relation client, les décisions et le travail de terrain, avec plus de temps pour s'y consacrer.",
      },
    ],
  },
  {
    title: 'Systèmes et outils',
    items: [
      {
        question: "Qu'est-ce qu'un système digital pour une PME ?",
        answer:
          "C'est l'ensemble cohérent formé par vos outils, vos données et vos processus. La plupart des PME n'ont pas choisi leurs outils, elles les ont accumulés : un tableur pour les devis, une messagerie pour coordonner les équipes, un logiciel de comptabilité qui ne se connecte à rien. Chaque outil fonctionne isolément, mais l'ensemble crée du bruit et des ressaisies. Construire un système, c'est faire circuler l'information d'un point à l'autre sans copier-coller.",
      },
      {
        question: 'Faut-il abandonner les outils que nous utilisons déjà ?',
        answer:
          "Rarement. Nous partons de l'existant et nous cherchons d'abord à le faire fonctionner ensemble. Remplacer un outil n'a de sens que s'il bloque réellement le reste du système. L'objectif est de réduire le travail, pas d'imposer une migration.",
      },
      {
        question: 'Comment sont traitées nos données ?',
        answer:
          "Les systèmes sont construits sur vos propres outils et vos propres comptes : vos données restent chez vous. Nous n'accédons qu'à ce qui est nécessaire à la mission, et cet accès prend fin avec elle.",
      },
    ],
  },
  {
    title: 'Travailler ensemble',
    items: [
      {
        question: 'Comment se déroule une mission ?',
        answer:
          "Elle commence par un audit : nous cartographions vos outils, vos processus et vos flux de travail pour nommer ce qui freine votre croissance et dans quel ordre l'adresser. Viennent ensuite le déploiement des automatisations et des systèmes retenus, puis la formation des équipes et la documentation.",
      },
      {
        question: 'Combien de temps avant de voir des résultats ?',
        answer:
          "Les premières automatisations produisent un effet en quelques semaines. Un artisan électricien avec qui nous avons travaillé passait 10 heures par semaine sur l'administratif ; après trois semaines de mise en place, il était descendu à 4 heures. Les projets plus larges, comme une application métier, se comptent en mois.",
      },
      {
        question: 'Intervenez-vous en dehors de Rouen et de la Normandie ?',
        answer:
          "Oui. Nous sommes basés à Rouen et nous intervenons partout en France. L'essentiel du travail se fait à distance, les rendez-vous sur site restent possibles selon le projet.",
      },
      {
        question: 'Comment savoir si mon entreprise est prête ?',
        answer:
          "Il n'y a pas de prérequis technique. Si vos équipes perdent du temps sur des tâches répétitives, il y a matière à travailler. Le premier échange sert à cadrer : nous regardons votre activité et nous vous disons si nous pouvons vous être utiles.",
      },
    ],
  },
  {
    title: 'Sites web et tarifs',
    items: [
      {
        question: 'Combien coûte un site internet pour une PME ?',
        answer:
          "Une landing page, page unique pensée pour convertir, coûte 149 €. Un site vitrine de 3 à 5 pages coûte 499 €. Ces tarifs sont affichés et se règlent en ligne. Les projets sur mesure, comme une application métier, sont chiffrés après un premier échange.",
      },
      {
        question: 'En combien de temps un site est-il livré ?',
        answer:
          "Une landing page est livrée sous 24 heures, un site vitrine en 5 jours, à compter de la réception de vos informations : contenus, logo, références. Le délai dépend donc en partie de la rapidité avec laquelle vous nous transmettez ces éléments.",
      },
      {
        question: 'Peut-on commander et payer en ligne ?',
        answer:
          "Oui. Les offres web se commandent directement depuis la page Offres, avec un paiement sécurisé par Stripe. Nous vous contactons ensuite sous 24 heures pour réunir les éléments nécessaires au démarrage.",
      },
    ],
  },
];

/** Toutes les questions à plat, pour le balisage FAQPage. */
export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqSections.flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      }))
    ),
  };
}
