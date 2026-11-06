import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site, programmes } from "@/content/site";

// Plus Jakarta Sans across display & body: 300 body, 500 nav, 600 buttons/eyebrows, 800 headlines.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url.startsWith("http") && !site.url.includes("[") ? site.url : "https://example.com"),
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  keywords: [
    "online school",
    "online madrasa",
    "remedial learning",
    "life skills",
    "online academy",
    "Tane",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: site.name }],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F7574",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  slogan: site.tagline,
  description: site.description,
  url: site.url,
  email: site.contact.email,
  telephone: site.contact.phone,
  address: site.contact.address,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Programmes",
    itemListElement: programmes.items.map((p) => ({
      "@type": "Course",
      name: p.name,
      description: p.line,
      provider: { "@type": "EducationalOrganization", name: site.name },
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        {/* Flags JS so CSS can hold initial animation states (no flash, no layout shift). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

