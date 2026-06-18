import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import "../styles/hikari-v2.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "POWAMEKKA — Agence IA & Systèmes Digitaux pour PME",
  description:
    "Powamekka aide les dirigeants de PME à automatiser leurs opérations, intégrer l'IA et structurer leur croissance. Audit stratégique, systèmes digitaux et formation. Basé à Rouen, intervient partout en France.",
  keywords: [
    "agence IA PME",
    "consultant intelligence artificielle",
    "automatisation entreprise",
    "conseil IA France",
    "système digital PME",
    "intégration IA PME",
    "consultant IA Rouen",
    "automatisation Normandie",
    "agence consulting IA",
    "transformation digitale PME",
  ],
  authors: [{ name: "Powamekka", url: "https://powamekka.com" }],
  creator: "Powamekka",
  metadataBase: new URL("https://powamekka.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://powamekka.com",
    siteName: "Powamekka",
    title: "POWAMEKKA — Agence IA & Systèmes Digitaux pour PME",
    description:
      "Powamekka aide les dirigeants à automatiser leurs opérations et intégrer l'IA pour diriger avec clarté. Audit, systèmes, formation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Powamekka — Agence IA & Systèmes Digitaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POWAMEKKA — Agence IA & Systèmes Digitaux pour PME",
    description:
      "Automatisation, IA et systèmes digitaux pour les dirigeants de PME. Basé à Rouen, intervient partout en France.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${newsreader.variable} ${hankenGrotesk.variable} ${spaceMono.variable}`}
    >
      <body
        data-palette="calcaire"
        data-type="editorial"
        data-hier="affirme"
        data-hero="field"
        data-nav="barre"
        data-philo="complexite"
        data-svc="pile"
        data-shadows="on"
        data-kanji="off"
        data-italics="off"
      >
        {children}
      </body>
    </html>
  );
}
