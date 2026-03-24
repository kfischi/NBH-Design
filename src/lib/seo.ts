/**
 * SEO Utilities — NBH Engineering Solutions
 * Centralized metadata, structured data, and canonical URL helpers.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nbh-engineering.com";
export const SITE_NAME = "NBH Engineering Solutions";
export const SITE_DESCRIPTION =
  "פתרונות הנדסיים רב-תחומיים — מכניקה, אלקטרוניקה ומיכון — תחת קורת גג אחת. 12+ שנות ניסיון, 50+ פרויקטים, 3 פטנטים.";
export const SITE_TWITTER = "@NBHEngineering";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Build full Next.js Metadata object per page */
export function buildMeta({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image = OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("NBH") ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "he_IL",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description,
      images: [image],
      creator: SITE_TWITTER,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" as const },
    },
  };
}

/** JSON-LD: Organization */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  description: SITE_DESCRIPTION,
  email: "nevet@nbh-engineering.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IL",
    addressRegion: "מרכז",
  },
  sameAs: ["https://www.linkedin.com/in/nevet-benhaim"],
};

/** JSON-LD: Person (Nevet) */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "נבט בן חיים",
  alternateName: "Nevet Benhaim",
  jobTitle: "Multidisciplinary Product Architect",
  description:
    "מהנדס מוצר רב-תחומי עם 12+ שנות ניסיון במכניקה, אלקטרוניקה ואוטומציה.",
  url: `${SITE_URL}/about`,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  knowsAbout: [
    "מכניקה ותכנון פיזי",
    "תכנון PCB",
    "מערכות IoT",
    "אוטומציה תעשייתית",
    "PLC ו-SCADA",
    "הדפסת תלת-מימד",
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "B.Sc. הנדסת אלקטרוניקה" },
    { "@type": "EducationalOccupationalCredential", name: "Certified PLC Engineer" },
    { "@type": "EducationalOccupationalCredential", name: "Certified PCB Designer" },
  ],
};

/** JSON-LD: WebSite with SearchAction */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "he-IL",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** JSON-LD: ProfessionalService */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  areaServed: { "@type": "Country", name: "Israel" },
  provider: { "@id": `${SITE_URL}/#person` },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "שירותי הנדסה",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "מכניקה ותכנון פיזי" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "תכנון PCB ואלקטרוניקה" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "מיכון ואוטומציה תעשייתית" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "50",
    bestRating: "5",
  },
};

/** JSON-LD: FAQ */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** JSON-LD: BreadcrumbList */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** JSON-LD: BlogPosting */
export function articleSchema({
  title, description, slug, publishedTime, modifiedTime, image,
}: {
  title: string; description: string; slug: string;
  publishedTime: string; modifiedTime?: string; image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${slug}`,
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    image: image ?? OG_IMAGE,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "he-IL",
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog` },
  };
}
