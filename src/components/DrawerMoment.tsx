import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function DrawerMoment() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* LEFT — text */}
        <div>
          <h2 className="font-display text-4xl leading-[1.08] text-ink md:text-5xl">
            One day they&apos;ll
            <br />
            stop drawing <em className="italic text-sage">dragons</em>.
          </h2>

          <span className="my-7 block h-px w-24 bg-navy/25" />

          <div className="space-y-2 font-body text-lg leading-relaxed text-ink">
            <p>The drawings change.</p>
            <p>Then they stop.</p>
            <p>The paper fades.</p>
            <p>Childhood doesn&apos;t wait.</p>
          </div>

          <a
            href="#upload-tool"
            className="group mt-8 inline-flex items-center gap-2 font-hand text-2xl text-terracotta underline decoration-terracotta/40 underline-offset-4 transition hover:text-terracotta/80 hover:decoration-terracotta/70"
          >
            Preserve one today.
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </a>
        </div>

        {/* RIGHT — immersive drawer photo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-paper">
          <Image
            src="/images/drawer-of-drawings.png"
            alt="A drawer full of a child's drawings"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
