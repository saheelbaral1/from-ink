import Hero from "@/components/Hero";
import UploadWizard from "@/components/UploadWizard";
import DrawerMoment from "@/components/DrawerMoment";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      {/* Hero stays static — it's the first thing visible on load. */}
      <Hero />

      {/* Anchor target for the Hero & DrawerMoment CTAs */}
      <Reveal>
        <section id="upload-tool" className="mx-auto max-w-4xl scroll-mt-6 px-6 pb-20">
          <div className="rounded-3xl bg-[#fffdf8] p-6 shadow-paper ring-1 ring-navy/10 md:p-10">
            <UploadWizard />
          </div>
        </section>
      </Reveal>

      {/* Emotional beat — the drawer moment */}
      <Reveal>
        <DrawerMoment />
      </Reveal>

      <Faq />

      <Footer />
    </main>
  );
}
