import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NBH Engineering Solutions | הנדסה רב-תחומית",
  description:
    "פתרונות הנדסיים קצה לקצה - מכניקה, אלקטרוניקה ומערכת. NBH Engineering Solutions בהובלת נבט בן חיים.",
  keywords: "הנדסה, מכניקה, אלקטרוניקה, IoT, RFID, אוטומציה, PLC, CAD",
  openGraph: {
    title: "NBH Engineering Solutions",
    description: "הנדסה רב-תחומית לפתרונות מורכבים",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="min-h-full flex flex-col bg-slate-50 text-slate-900"
        style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
