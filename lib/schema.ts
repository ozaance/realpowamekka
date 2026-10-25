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
    image: `${BASE}/og-image.png`,
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
