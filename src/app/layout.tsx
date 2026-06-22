import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Caveat } from "next/font/google";
import Script from "next/script";
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
      {/* Termly consent banner + autoBlock, loaded afterInteractive so Termly's
          DOM mutations happen AFTER hydration completes — avoiding the hydration
          mismatch (#418) that both `beforeInteractive` and a plain async script
          caused (those let Termly mutate the document during hydration; on Vercel's
          timing the async race consistently lost). autoBlock still intercepts
          trackers added after Termly loads. suppressHydrationWarning on <body> is
          a safety net for Termly's runtime DOM injection. */}
      <body suppressHydrationWarning className="min-h-full bg-paper font-body text-ink">
        <Script
          id="termly-resource-blocker"
          src="https://app.termly.io/resource-blocker/c6f777ce-e1cc-4e40-8529-135243b4f409?autoBlock=on"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
