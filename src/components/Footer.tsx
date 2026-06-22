import Link from "next/link";

// Small muted footer. The "Consent Preferences" link is a Termly hook — its
// `termly-display-preferences` class is what reopens the consent modal.
export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-navy/10 pt-8 font-body text-xs text-navy/55">
        <Link href="/privacy-policy" className="transition hover:text-navy">
          Privacy Policy
        </Link>
        <span className="text-navy/30" aria-hidden="true">
          ·
        </span>
        <Link href="/terms" className="transition hover:text-navy">
          Terms &amp; Conditions
        </Link>
        <span className="text-navy/30" aria-hidden="true">
          ·
        </span>
        <Link href="/return-policy" className="transition hover:text-navy">
          Return Policy
        </Link>
        <span className="text-navy/30" aria-hidden="true">
          ·
        </span>
        <a href="#" className="termly-display-preferences transition hover:text-navy">
          Consent Preferences
        </a>
      </div>
    </footer>
  );
}
