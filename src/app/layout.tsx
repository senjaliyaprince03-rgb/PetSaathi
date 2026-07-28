/* eslint-disable @next/next/no-page-custom-font -- Material Symbols is loaded once in the App Router root layout. */
import type { Metadata } from "next";
import { Manrope, Playfair_Display, Inter, Plus_Jakarta_Sans, Outfit } from "next/font/google";

import { SiteMotion } from "@/components/motion/site-motion";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

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
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.variable} ${outfit.variable} ${manrope.variable} ${inter.variable} ${playfair.variable} relative overflow-x-hidden bg-background font-sans text-on-background selection:bg-saffron/35`}>
        <SiteMotion />
        {children}
      </body>
    </html>
  );
}
