import { serializeJsonLd } from "@/lib/json-ld";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { Pillars } from "@/components/sections/pillars";
import { StatsBand } from "@/components/sections/stats-band";
import { Hrms } from "@/components/sections/hrms";
import { Biometrics } from "@/components/sections/biometrics";
import { Security } from "@/components/sections/security";
import { Hiring } from "@/components/sections/hiring";
import { Growth } from "@/components/sections/growth";
import { HowItWorks } from "@/components/sections/how-it-works";
import { IndustriesStrip } from "@/components/sections/industries-strip";
import { WhyUs } from "@/components/sections/why-us";
import { Clients } from "@/components/sections/clients";
import { Faq } from "@/components/sections/faq";
import { About } from "@/components/sections/about";
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <Hero />
      <TrustStrip />
      <Pillars />
      <StatsBand />
      <Hrms />
      <Biometrics />
      <Security />
      <Hiring />
      <Growth />
      <IndustriesStrip />
      <HowItWorks />
      <WhyUs />
      <Clients />
      <Faq />
      <About />
      <FinalCta />
    </>
  );
}
