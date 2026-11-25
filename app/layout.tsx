import type { Metadata } from "next";
import localFont from "next/font/local";
import "./fonts/fallbacks.css";
import "./globals.css";
import "../styles/hikari-v2.css";
import "../styles/cinema.css";
import "../styles/mobile-menu.css";
import "../styles/a11y-mobile.css";

// Polices auto-hébergées (app/fonts, licence SIL OFL 1.1). Ce sont les fichiers
// du sous-ensemble « latin » que next/font/google téléchargeait à chaque build,
// identiques octet pour octet. next/font/google faisait parfois échouer le build
// Vercel : quand Google Fonts répond avec des URL /l/font?kit=…&…, Turbopack
// refuse la requête (« next/font/google queries have exactly one entry »,
// vercel/next.js#99114). La plage unicode-range est celle du sous-ensemble
// latin de Google, pour que les caractères hors plage (flèches →, ←) gardent
// la police de repli, comme avant. Les polices de repli (fallbacks.css)
// reprennent les métriques exactes que next/font/google générait.
const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin.woff2", weight: "300 500", style: "normal" },
    { path: "./fonts/newsreader-latin-italic.woff2", weight: "300 500", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Newsreader Fallback"],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const hankenGrotesk = localFont({
  src: [{ path: "./fonts/hanken-grotesk-latin.woff2", weight: "300 600", style: "normal" }],
  variable: "--font-hanken",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Hanken Grotesk Fallback"],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const spaceMono = localFont({
  src: [
    { path: "./fonts/space-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-mono-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Space Mono Fallback"],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

export const metadata: Metadata = {
  title: "POWAMEKKA | Agence IA & Systèmes Digitaux pour PME",
  description:
    "Powamekka aide les dirigeants de PME à automatiser leurs tâches administratives et intégrer l'IA. Audit, systèmes et formation. Basé à Rouen, partout en France.",
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
  authors: [{ name: "Powamekka", url: "https://www.powamekka.com" }],
  creator: "Powamekka",
  metadataBase: new URL("https://www.powamekka.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.powamekka.com",
    siteName: "Powamekka",
    title: "POWAMEKKA | Agence IA & Systèmes Digitaux pour PME",
    description:
      "Powamekka aide les dirigeants à automatiser leurs opérations et intégrer l'IA pour diriger avec clarté. Audit, systèmes, formation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Powamekka : Agence IA & Systèmes Digitaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POWAMEKKA | Agence IA & Systèmes Digitaux pour PME",
    description:
      "Automatisation, IA et systèmes digitaux pour les dirigeants de PME. Basé à Rouen, intervient partout en France.",
    images: ["/og-image.jpg"],
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
