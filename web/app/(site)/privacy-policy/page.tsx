import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal-layout";
import { site } from "@/lib/site";

// DRAFT — accurate to what the site actually collects, but not reviewed by a
// lawyer. Have counsel review before relying on it.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nova Pulse collects, uses, stores and protects personal data submitted through this website, and your rights under India's DPDP Act, 2023.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "5 September 2026";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      intro={`This policy explains what personal data ${site.name} collects through this website, why we collect it, how long we keep it, and the rights you have over it under India's Digital Personal Data Protection Act, 2023 ("DPDP Act").`}
    >
      <LegalSection heading="1. Who we are">
        <p>
          {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides HRMS and payroll software,
          biometric attendance hardware, workplace security systems, recruitment services, and B2B
          lead generation services. We operate from Adarsh Nagar, Delhi – 110033 and Mainpuri,
          Uttar Pradesh, India.
        </p>
        <p>
          For the personal data described in this policy, we act as the <strong>Data
          Fiduciary</strong> as defined under the DPDP Act.
        </p>
      </LegalSection>

      <LegalSection heading="2. What we collect">
        <p>We only collect data you choose to give us. Specifically:</p>
        <ul>
          <li>
            <strong>Demo and enquiry form:</strong> your name, mobile number, company name, work
            email address, the requirement you select, and any message you write.
          </li>
          <li>
            <strong>Direct contact:</strong> anything you send us by WhatsApp, email, or phone.
          </li>
          <li>
            <strong>Technical logs:</strong> our hosting provider records standard request data such
            as IP address, browser type, and timestamps, for security and reliability.
          </li>
        </ul>
        <p>
          We do not run advertising or analytics trackers on this website, and we do not collect
          biometric data through it. Biometric templates captured by devices we supply are stored on
          your own hardware and systems under your control, not ours.
        </p>
      </LegalSection>

      <LegalSection heading="3. Why we use it">
        <p>We use the data you submit to:</p>
        <ul>
          <li>respond to your enquiry and schedule a demonstration;</li>
          <li>prepare quotations and proposals for the services you asked about;</li>
          <li>provide and support services you go on to purchase; and</li>
          <li>keep records required for tax, accounting, and statutory compliance.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not add you to unrelated marketing lists
          without your consent.
        </p>
      </LegalSection>

      <LegalSection heading="4. Your consent">
        <p>
          We process the data you submit through this website on the basis of the consent you give
          when you submit the form. You may withdraw that consent at any time by writing to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Withdrawing consent does not affect
          processing already carried out, and may mean we can no longer provide a service you asked
          for.
        </p>
      </LegalSection>

      <LegalSection heading="5. Who we share it with">
        <p>
          We share personal data only with service providers who help us run this website and
          respond to you, and only to the extent they need it:
        </p>
        <ul>
          <li>our form-processing provider, which delivers enquiry submissions to our inbox;</li>
          <li>our website hosting provider;</li>
          <li>our email provider.</li>
        </ul>
        <p>
          We may also disclose data where we are legally required to do so. We do not otherwise
          share, rent, or sell your data to third parties.
        </p>
      </LegalSection>

      <LegalSection heading="6. How long we keep it">
        <p>
          Enquiries that do not become customers are retained for up to 24 months so we can follow
          up on your requirement, then deleted. Records relating to customers are kept for as long
          as the commercial relationship lasts and afterwards for the period required by Indian tax
          and accounting law.
        </p>
      </LegalSection>

      <LegalSection heading="7. How we protect it">
        <p>
          This website is served over HTTPS, and access to enquiry data is restricted to the members
          of our team who need it to respond to you. No system is perfectly secure, but we take
          reasonable technical and organisational measures to protect the data you give us, and we
          will notify you and the Data Protection Board as required if a breach affects your data.
        </p>
      </LegalSection>

      <LegalSection heading="8. Your rights">
        <p>Under the DPDP Act you have the right to:</p>
        <ul>
          <li>ask what personal data of yours we hold and how it is being processed;</li>
          <li>have inaccurate or incomplete data corrected or updated;</li>
          <li>have your data erased when it is no longer needed for the purpose you gave it;</li>
          <li>nominate another person to exercise these rights on your behalf; and</li>
          <li>raise a grievance with us, and escalate to the Data Protection Board of India.</li>
        </ul>
        <p>
          To exercise any of these, write to <a href={`mailto:${site.email}`}>{site.email}</a>. We
          will respond within a reasonable period.
        </p>
      </LegalSection>

      <LegalSection heading="9. Cookies">
        <p>
          This website does not set advertising or analytics cookies. Any storage used is strictly
          necessary for the site to function.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to this policy">
        <p>
          We may update this policy as our services or the law change. The &ldquo;last
          updated&rdquo; date at the top of this page always reflects the current version.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact and grievances">
        <p>
          For any question about this policy, or to raise a grievance about how we have handled your
          personal data, contact us at <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
          <a href={site.phoneHref}>{site.phone}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
