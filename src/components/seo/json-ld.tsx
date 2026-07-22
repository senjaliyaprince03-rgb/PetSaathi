/**
 * JSON-LD structured data components for SEO.
 * These render invisible <script type="application/ld+json"> tags
 * that help search engines understand the page content.
 */

export function LocalBusinessJsonLd({
  name,
  city,
  state,
  description,
}: {
  name: string;
  city: string;
  state: string;
  description: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "IN",
    },
    url: process.env.NEXT_PUBLIC_APP_URL,
    priceRange: "₹₹",
    areaServed: {
      "@type": "City",
      name: city,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "PetSaathi",
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
    mainEntityOfPage: url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
