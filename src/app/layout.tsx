import type { Metadata } from "next";
import "./globals.css";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { GoogleAnalytics, GoogleTagManager } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Proto-Model | הנדסה רב-תחומית",
    template: "%s | Proto-Model",
  },
  description:
    "פתרונות הנדסיים קצה לקצה — מכניקה, אלקטרוניקה ומיכון. 12+ שנות ניסיון, 50+ פרויקטים, 3 פטנטים. פנה לנבט בן חיים.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "הנדסה רב-תחומית",
    "תכנון PCB",
    "IoT",
    "אוטומציה תעשייתית",
    "PLC",
    "הדפסת תלת מימד",
    "פיתוח מוצר",
    "אב טיפוס",
    "מהנדס עצמאי ישראל",
    "Proto-Model",
  ].join(", "),
  authors: [{ name: "נבט בן חיים", url: `${SITE_URL}/about` }],
  creator: "נבט בן חיים",
  publisher: "Proto-Model",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Proto-Model | הנדסה רב-תחומית",
    description: "פתרונות הנדסיים מכניקה, אלקטרוניקה ומיכון — תחת קורת גג אחת.",
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: "Proto-Model",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Proto-Model" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proto-Model",
    description: "הנדסה רב-תחומית לפתרונות מורכבים — מכניקה, PCB, IoT, אוטומציה.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        {/* Heebo — Google Font מותאם לעברית */}
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Global JSON-LD: Organization + WebSite */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* GTM noscript must be first in body */}
        <GoogleTagManager />
        {children}
        {/* Accessibility widget — מופיע בכל דף */}
        <AccessibilityWidget />
        {/* GA4 — loaded after interactive */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
