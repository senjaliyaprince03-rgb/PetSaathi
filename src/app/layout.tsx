import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { SiteMotion } from "@/components/motion/site-motion";
import { CustomCursor } from "@/components/marketing/custom-cursor";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasUsableAnalyticsId } from "@/lib/public-config";

import "./globals.css";
import { CookieConsentBanner } from "@/components/marketing/cookie-consent-banner";

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://petsaathi.com"),
  title: {
    default: "PetSaathi | Trusted Pet Care Services",
    template: "%s | PetSaathi"
  },
  description: "Elevating the standard of trusted pet care in India. Find verified pet sitters, groomers, and vets near you.",
  keywords: ["pet care", "pet sitting", "dog walking", "pet grooming", "veterinary", "India", "pet boarding"],
  authors: [{ name: "PetSaathi" }],
  creator: "PetSaathi",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://petsaathi.com",
    siteName: "PetSaathi",
    title: "PetSaathi | Trusted Pet Care Services",
    description: "Elevating the standard of trusted pet care in India. Find verified pet sitters, groomers, and vets near you.",
    images: [
      {
        url: "/images/hero-care-handover-highres.jpg",
        width: 1200,
        height: 630,
        alt: "PetSaathi - Trusted Pet Care Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PetSaathi | Trusted Pet Care Services",
    description: "Elevating the standard of trusted pet care in India. Find verified pet sitters, groomers, and vets near you.",
    images: ["/images/hero-care-handover-highres.jpg"]
  },
  icons: {
    icon: [{ url: "/icons/petsaathi-favicon-v2.png", type: "image/png", sizes: "192x192" }],
    shortcut: "/icons/petsaathi-favicon-v2.png",
    apple: "/icons/petsaathi-app-icon-v2.png"
  },
  manifest: "/manifest.webmanifest"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the middleware request nonce so Next can attach it to framework scripts.
  await headers();
  const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="relative overflow-x-clip bg-background font-sans text-on-background selection:bg-saffron/35" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PetSaathi",
              "url": "https://petsaathi.com",
              "logo": "https://petsaathi.com/icons/petsaathi-favicon-v2.png",
              "description": "Elevating the standard of trusted pet care in India. Find verified pet sitters, groomers, and vets near you.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            })
          }}
        />
        <SiteMotion />
        <CustomCursor />
        {children}
        <CookieConsentBanner analyticsId={analyticsId} />
      </body>
    </html>
  );
}
