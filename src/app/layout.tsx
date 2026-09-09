import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { SiteMotion } from "@/components/motion/site-motion";
import { CustomCursor } from "@/components/marketing/custom-cursor";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasUsableAnalyticsId } from "@/lib/public-config";

import "./globals.css";
import { CookieConsentBanner } from "@/components/marketing/cookie-consent-banner";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SkipToContent } from "@/components/layout/skip-to-content";

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        url: "/images/hero-care-handover-highres.webp",
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
    images: ["/images/hero-care-handover-highres.webp"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/petsaathi-favicon-v2.png", type: "image/png", sizes: "192x192" }
    ],
    shortcut: "/favicon.ico",
    apple: "/icons/petsaathi-app-icon-v2.png"
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

import { Hanken_Grotesk, Inter } from "next/font/google";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  
  return (
    <html lang="en" className={`scroll-smooth ${hanken.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
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
        {/* Meta Pixel - Marketing conversion tracking */}
        {metaPixelId && (
          <>
            <Script id="meta-pixel" strategy="lazyOnload">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Microsoft Clarity - Session recording and heatmaps */}
        {clarityId && (
          <Script id="ms-clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}

        <SkipToContent />
        <SiteMotion />
        <CustomCursor />
        <ServiceWorkerRegistration />
        {children}
        <WhatsAppButton />
        <CookieConsentBanner analyticsId={analyticsId} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
