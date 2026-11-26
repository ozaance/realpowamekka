const BASE = 'https://www.powamekka.com';
const ORG_ID = `${BASE}/#organization`;

export function serviceJsonLd({
  name,
  description,
  url,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${BASE}${url}`,
    provider: { '@id': ORG_ID },
    areaServed: 'France',
    serviceType,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.url}`,
    })),
  };
}

export function blogPostingJsonLd({
  title,
  description,
  slug,
  date,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: `${BASE}/blog/${slug}`,
    url: `${BASE}/blog/${slug}`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: `${BASE}/og-image.jpg`,
  };
}

export function offerCatalogJsonLd(
  offers: { id: string; name: string; tagline: string; price: number; quoteOnly?: boolean; vatExcluded?: boolean }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Offres Powamekka',
    url: `${BASE}/offres`,
    itemListElement: offers.map((offer) => ({
      // `position` n'existe pas sur Offer (il appartient à ListItem) : retiré
      // par rapport à la PR #10 pour un balisage valide.
      '@type': 'Offer',
      url: `${BASE}/offres#${offer.id}`,
      seller: { '@id': ORG_ID },
      // Offre sur devis : aucun prix public, donc aucun prix dans le balisage.
      // Grille 2026 : le prix du balisage est HT, ce que `valueAddedTaxIncluded: false` précise.
      ...(offer.quoteOnly
        ? {}
        : offer.vatExcluded
          ? {
              priceSpecification: {
                '@type': 'PriceSpecification',
                price: (offer.price / 100).toFixed(2),
                priceCurrency: 'EUR',
                valueAddedTaxIncluded: false,
              },
            }
          : { priceCurrency: 'EUR', price: (offer.price / 100).toFixed(2) }),
      itemOffered: {
        '@type': 'Service',
        name: offer.name,
        description: offer.tagline,
      },
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
