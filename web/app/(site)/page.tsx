import { serializeJsonLd } from "@/lib/json-ld";
import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";
import { Pillars } from "@/components/sections/pillars";
import { Hrms } from "@/components/sections/hrms";
import { ServicesGrid } from "@/components/sections/services-grid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyUs } from "@/components/sections/why-us";
import { Clients } from "@/components/sections/clients";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { faqs } from "@/lib/faqs";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

/**
 * Eleven sections, in the order a buyer actually reads: what we do, proof that
 * we exist, the positioning, the flagship product in depth, the rest of the
 * range as cards, how a rollout runs, why us, proof, objections, ask.
 *
 * Depth belongs on /services/<slug> and /industries/<slug> — the homepage links
 * to them rather than restating them, which is what it used to do.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <Hero />
      <TrustBand />
      <Pillars />
      <Hrms />
      <ServicesGrid />
      <HowItWorks />
      <WhyUs />
      <Clients />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
