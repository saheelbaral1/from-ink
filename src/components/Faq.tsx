import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Will it actually look like their drawing?",
    answer:
      "Yes — we keep the composition, characters, and details of the original drawing intact, then bring it to life with rich watercolor textures, like it stepped out of a storybook. You'll see the finished piece before you pay, so you'll know exactly what you're getting.",
  },
  {
    question: "What can I order?",
    answer:
      "Right now, every order is a museum-quality 40×50cm poster print on premium paper, shipped right to your door.",
  },
  {
    question: "What if I don't like the result?",
    answer:
      "You won't pay a cent until you've seen the finished piece. Generate your free preview first — if it's not quite right, you can try again before deciding to order.",
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28">
      <div className="grid gap-10 md:grid-cols-5 md:gap-12">
        {/* LEFT — label + headline */}
        <div className="md:col-span-2">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
            Questions
          </span>
          <h2 className="mt-3 font-display text-4xl italic leading-tight text-ink sm:text-5xl">
            Frequently asked.
          </h2>
        </div>

        {/* RIGHT — accordion */}
        <div className="md:col-span-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-navy/10 py-5 first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-base text-ink [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-navy/50 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-navy/70">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
