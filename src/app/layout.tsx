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
      {/* Termly consent banner + autoBlock. Rendered as a plain async script so
          React 19 hoists it into <head> and it loads early, before trackers can
          fire. NOTE: next/script `beforeInteractive` was tried first but caused a
          hydration mismatch (#418) under Next 16 — Termly mutates the document
          before hydration, which full-document hydration can't reconcile.
          suppressHydrationWarning on <body> tolerates Termly's runtime DOM injection. */}
      <body suppressHydrationWarning className="min-h-full bg-paper font-body text-ink">
        <script async src="https://app.termly.io/resource-blocker/c6f777ce-e1cc-4e40-8529-135243b4f409?autoBlock=on" />
        {children}
      </body>
    </html>
  );
}
