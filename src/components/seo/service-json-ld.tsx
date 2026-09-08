export function ServiceJsonLd({
  name,
  description,
  url,
  providerName = "PetSaathi"
}: {
  name: string;
  description: string;
  url: string;
  providerName?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "LocalBusiness",
      name: providerName,
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN"
      }
    },
    areaServed: {
      "@type": "Country",
      name: "India"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
