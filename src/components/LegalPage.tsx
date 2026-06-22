import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

// Shared, static shell for legal pages. No animation/Reveal/grain — fast and
// quiet. Typography for the body content (h2/p/ul/a) is defined once here via
// descendant selectors so each page just writes semantic markup.
export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Nav (no announcement bar on legal pages) */}
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink md:text-3xl">
          From<span className="font-light italic text-ink/65">.ink</span>
        </Link>
        <span className="hidden font-hand text-xl text-navy/70 sm:inline">Made for memories</span>
      </header>

      <main className="mx-auto max-w-[720px] px-6 pb-16 pt-4 md:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-sm text-navy/60 transition hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to from.ink
        </Link>

        <h1 className="mt-6 font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
        <p className="mt-2 font-body text-sm text-navy/55">Last updated: {lastUpdated}</p>
        <hr className="mt-6 border-t border-navy/15" />

        <div className="mt-8 font-body text-base leading-relaxed text-ink/80 [&_a:hover]:text-terracotta/80 [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:leading-snug [&_h2]:text-navy [&_li]:pl-1 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}
