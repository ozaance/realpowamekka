import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "POWAMEKKA — Systèmes Digitaux & Conseil en IA",
  description:
    "POWAMEKKA conçoit les systèmes et l'IA qui mettent de l'ordre dans la complexité. Visibilité, opérations, croissance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${dmMono.variable}`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
