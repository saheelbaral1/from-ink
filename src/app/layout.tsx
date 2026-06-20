import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Caveat } from "next/font/google";
import "./globals.css";

// Display / editorial headlines — includes italic for emphasis words
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body, UI, navigation
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Handwritten annotations / captions only
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "From Ink — Turn your child's drawings into keepsakes",
  description:
    "Turn your child's drawings into beautiful watercolor artwork you'll want to keep forever. Printed and shipped as a poster.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-body text-ink">{children}</body>
    </html>
  );
}
