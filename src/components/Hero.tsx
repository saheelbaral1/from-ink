import Image from "next/image";
import { Menu, Star, CheckCircle, Package, Truck, UploadCloud, ArrowRight, Heart } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";

const announcements = [
  { icon: Star, text: "New — preserve their drawings" },
  { icon: CheckCircle, text: "Free preview before you order" },
  { icon: Package, text: "Printed locally, wherever you are" },
  { icon: Truck, text: "Free shipping included" },
];

// Small circular crops of real keepsakes — ties the social proof to the
// actual artwork rather than generic avatar placeholders.
const proofThumbnails = [
  "/images/dragon-knight-after.jpeg",
  "/images/house-after.jpeg",
  "/images/unicorn-after.jpeg",
];

export default function Hero() {
  return (
    <section className="relative overflow-x-clip">
      {/* Announcement bar */}
      <div className="border-b border-navy/10 bg-navy/[0.03]">
        <div className="mx-auto flex max-w-[1440px] flex-nowrap items-center justify-center gap-x-5 overflow-x-auto px-6 py-2 sm:flex-wrap sm:gap-x-6 sm:overflow-visible md:px-10">
          {announcements.map(({ icon: Icon, text }, i) => (
            <span key={text} className="flex shrink-0 items-center gap-5">
              {i > 0 && <span className="hidden h-3 w-px bg-navy/15 sm:block" aria-hidden />}
              <span className="flex items-center gap-1.5 whitespace-nowrap font-body text-[11px] text-ink/70 sm:text-xs">
                <Icon className="h-3.5 w-3.5 text-terracotta" strokeWidth={2} />
                {text}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <span className="font-display text-2xl tracking-tight text-ink md:text-3xl">
          From<span className="font-light italic text-ink/65">.ink</span>
        </span>
        <div className="flex items-center gap-5">
          <span className="hidden font-hand text-xl text-navy/70 sm:inline">
            Made for memories
          </span>
          <button
            type="button"
            aria-label="Open menu"
            className="text-ink/70 transition hover:text-ink"
          >
            <Menu className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Main hero — asymmetric two-column layout */}
      <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-20 md:pt-4">
        <div className="grid items-center gap-10 md:grid-cols-5 md:gap-12">
          {/* LEFT — ~40% */}
          <div className="md:col-span-2">
            <h1 className="font-display text-4xl leading-[1.12] text-ink sm:text-5xl md:text-[2.05rem] md:leading-[1.2] lg:text-[2.35rem]">
              Their drawings
              <br />
              won&apos;t last forever.
              <br />
              Turn them into artwork
              <br />
              you&apos;ll <em className="italic text-sage">keep forever</em>.
            </h1>

            <span className="mt-5 block h-px w-14 bg-terracotta/50" />

            <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-ink/70">
              Children&apos;s drawings fade, get lost, and eventually stop coming.
              We transform them into beautiful artwork and museum-quality
              prints you&apos;ll treasure for decades.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#upload-tool"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 font-body text-sm font-medium text-paper shadow-[0_10px_24px_-12px_rgba(72,84,106,0.8)] transition hover:bg-navy/90"
              >
                <UploadCloud className="h-4 w-4" strokeWidth={2} />
                Upload a Drawing
              </a>
              <a
                href="#hero-carousel"
                className="group inline-flex items-center gap-1.5 font-body text-sm text-terracotta underline-offset-4 transition hover:underline"
              >
                See Examples
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-7 flex items-center gap-3">
              <span className="flex shrink-0 -space-x-2.5">
                {proofThumbnails.map((src) => (
                  <span
                    key={src}
                    className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-paper"
                  >
                    <Image src={src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                ))}
              </span>
              <div>
                <p className="font-hand text-lg leading-tight text-navy/80 sm:text-xl">
                  Be one of our first families.
                </p>
                <p className="mt-0.5 flex items-center gap-1 font-body text-xs text-navy/55">
                  Made with care, one drawing at a time
                  <Heart className="h-3 w-3 fill-terracotta/40 text-terracotta/60" strokeWidth={2} />
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — ~60% */}
          <div className="md:col-span-3">
            <HeroCarousel />
          </div>
        </div>
      </div>

      {/* Torn-paper bottom edge — contrast band sits behind the torn strip so the cuts are visible */}
      <div aria-hidden="true" className="relative h-20 w-full md:h-28">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/[0.07] to-transparent" />
        <div
          className="absolute inset-x-0 top-0 h-10 md:h-14"
          style={{
            backgroundColor: "var(--color-paper)",
            clipPath:
              "polygon(0% 38%, 8% 12%, 17% 42%, 26% 8%, 35% 30%, 44% 4%, 53% 36%, 62% 10%, 71% 28%, 80% 2%, 90% 32%, 100% 14%, 100% 100%, 0% 100%)",
            filter: "drop-shadow(0 18px 16px rgba(28, 28, 28, 0.22))",
          }}
        />
      </div>
    </section>
  );
}
