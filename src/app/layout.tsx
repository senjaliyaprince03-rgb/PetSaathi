import type { Metadata, Viewport } from "next";

import { SiteMotion } from "@/components/motion/site-motion";
import { CustomCursor } from "@/components/marketing/custom-cursor";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasUsableAnalyticsId } from "@/lib/public-config";

import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "PetSaathi | Trust Pet Care Services",
  description: "Elevating the standard of trusted pet care in India.",
  icons: {
    icon: [{ url: "/icons/petsaathi-favicon-v2.png", type: "image/png", sizes: "192x192" }],
    shortcut: "/icons/petsaathi-favicon-v2.png",
    apple: "/icons/petsaathi-app-icon-v2.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="relative overflow-x-clip bg-background font-sans text-on-background selection:bg-saffron/35">
        <SiteMotion />
        <CustomCursor />
        {children}
        {hasUsableAnalyticsId(analyticsId) && (
          <GoogleAnalytics gaId={analyticsId!} />
        )}
      </body>
    </html>
  );
}
