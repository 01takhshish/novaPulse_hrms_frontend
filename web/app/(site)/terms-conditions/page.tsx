import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal-layout";
import { site } from "@/lib/site";

// DRAFT — reflects how the business actually operates, but not reviewed by a
// lawyer. Have counsel review before relying on it.
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of the Nova Pulse website and the basis on which our HRMS, biometric, security, recruitment and lead generation services are supplied.",
  alternates: { canonical: "/terms-conditions" },
};

const UPDATED = "5 September 2026";

export default function TermsConditions() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated={UPDATED}
      intro={`These terms govern your use of the ${site.name} website and set out the basis on which we describe and supply our services. Please read them before submitting an enquiry.`}
    >
      <LegalSection heading="1. Acceptance">
        <p>
          By accessing this website or submitting an enquiry through it, you agree to these terms.
          If you do not agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection heading="2. What we provide">
        <p>
          {site.name} supplies HRMS and payroll software, biometric attendance hardware and its
          configuration, CCTV and access control systems, corporate recruitment services, and B2B
          lead generation services.
        </p>
        <p>
          The content on this website is for general information. It is not an offer, a quotation,
          or a commitment to supply on any particular terms.
        </p>
      </LegalSection>

      <LegalSection heading="3. Quotations and contracts">
        <p>
          Commercial terms — scope, pricing, timelines, payment schedules, and support obligations —
          are set out in the written quotation, proposal, purchase order, or service agreement we
          issue to you. Where anything in that document conflicts with this website or these terms,
          that document prevails.
        </p>
        <p>
          Prices quoted are exclusive of GST unless stated otherwise, and quotations are valid for
          the period stated on them.
        </p>
      </LegalSection>

      <LegalSection heading="4. Hardware, warranties and third-party software">
        <p>
          Biometric devices, cameras, controllers, and related hardware we supply carry the
          warranty of their respective manufacturers. We pass those warranties through to you and
          assist with claims, but we do not extend or replace them.
        </p>
        <p>
          Where we implement or resell third-party software, your use of it is additionally subject
          to that vendor&rsquo;s own licence terms.
        </p>
      </LegalSection>

      <LegalSection heading="5. Service outcomes">
        <p>
          Recruitment and lead generation are professional services delivered on a best-efforts
          basis. We commit to the process, activity levels, and deliverables described in your
          agreement. We do not guarantee that a specific candidate will be placed, that a specific
          number of qualified meetings will convert, or any particular revenue outcome.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your responsibilities">
        <p>You agree to:</p>
        <ul>
          <li>give us accurate information when you enquire or engage us;</li>
          <li>
            provide the site access, network conditions, and electrical infrastructure needed for
            hardware installation; and
          </li>
          <li>
            comply with applicable law — including the DPDP Act and employment law — in how you use
            attendance, biometric, surveillance, and candidate data obtained through our systems.
          </li>
        </ul>
        <p>
          You are the Data Fiduciary for employee and candidate data held in systems we deploy for
          you. Obtaining the necessary notices and consents from your employees is your
          responsibility.
        </p>
      </LegalSection>

      <LegalSection heading="7. Acceptable use of this website">
        <p>
          You may not attempt to gain unauthorised access to this site or its infrastructure,
          interfere with its operation, scrape it at a scale that degrades service, or submit false
          enquiries or another person&rsquo;s details without their permission.
        </p>
      </LegalSection>

      <LegalSection heading="8. Intellectual property">
        <p>
          The design, text, graphics, and logos on this website are owned by {site.name} or its
          licensors. You may view and print pages for your own business evaluation. You may not
          reproduce, republish, or use them commercially without our written permission.
        </p>
      </LegalSection>

      <LegalSection heading="9. Third-party links">
        <p>
          This site links to third-party platforms such as WhatsApp, LinkedIn, Instagram, and
          YouTube. We do not control those services and are not responsible for their content or
          their handling of your data.
        </p>
      </LegalSection>

      <LegalSection heading="10. Limitation of liability">
        <p>
          To the extent permitted by law, we are not liable for indirect or consequential loss,
          including loss of profit, business, or data, arising from use of this website. Our
          liability in connection with services we supply is governed by the agreement covering
          those services.
        </p>
        <p>Nothing in these terms excludes liability that cannot lawfully be excluded.</p>
      </LegalSection>

      <LegalSection heading="11. Governing law">
        <p>
          These terms are governed by the laws of India. The courts at Delhi have exclusive
          jurisdiction over any dispute arising from them.
        </p>
      </LegalSection>

      <LegalSection heading="12. Changes">
        <p>
          We may revise these terms from time to time. The version published on this page at the
          time you use the site is the version that applies.
        </p>
      </LegalSection>

      <LegalSection heading="13. Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
          <a href={site.phoneHref}>{site.phone}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
