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
  title: "POWAMEKKA — Systèmes Digitaux & Conseil en IA",
  description:
    "POWAMEKKA conçoit les systèmes digitaux et l'IA qui aident les entreprises à grandir avec clarté, efficacité et contrôle.",
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
