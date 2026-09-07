/**
 * Industry pages. The services × industries matrix is how B2B buyers actually
 * search ("biometric attendance for factories"), and each page reuses the
 * service content rather than restating it.
 */
export type IndustryContent = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  illustration: string;
  challenges: { title: string; body: string }[];
  /** Slugs from content/services.ts, in priority order for this sector. */
  services: string[];
  notes: string[];
};

export const industries: IndustryContent[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing & Factories",
    eyebrow: "Shop floor",
    title: "Workforce systems for manufacturing",
    tagline: "Shift changes at scale, without a queue at the gate.",
    description:
      "Attendance, access control and payroll for factories and plants — built for high-throughput shift changes, contract labour and multi-gate sites.",
    icon: "FaNetworkWired",
    illustration: "FactoryFloor",
    challenges: [
      {
        title: "300 people clock in within ten minutes",
        body: "Throughput, not accuracy, is the binding constraint. A single fingerprint reader at one gate becomes a queue and a safety issue.",
      },
      {
        title: "Hands are not always readable",
        body: "Oil, dust and calluses push fingerprint failure rates well above the datasheet figure — and every failed read becomes a manual override.",
      },
      {
        title: "Contract labour changes weekly",
        body: "Enrolment and de-enrolment has to be fast, and access has to be revoked the same day someone leaves the site.",
      },
    ],
    services: ["biometric-attendance", "hrms-payroll", "workplace-security"],
    notes: [
      "RFID or face recognition at gates, sized for peak shift change",
      "Multiple parallel readers rather than one bottleneck",
      "Contractor enrolment separated from permanent staff records",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    eyebrow: "Clinical settings",
    title: "Workforce systems for healthcare",
    tagline: "Contactless attendance, restricted areas, rotating rosters.",
    description:
      "Touchless attendance, controlled access to pharmacy and records, and rostering built for round-the-clock shift patterns in hospitals and clinics.",
    icon: "FaUserShield",
    illustration: "ClinicRoster",
    challenges: [
      {
        title: "Touch surfaces are a clinical problem",
        body: "Shared fingerprint readers are a poor fit in patient-facing environments. Facial recognition removes the contact entirely.",
      },
      {
        title: "Rosters are not nine-to-five",
        body: "Night shifts, on-call and rotating patterns break payroll rules written for a standard week.",
      },
      {
        title: "Some rooms need real access control",
        body: "Pharmacy, records and stores need role-based entry with a log, not a key that circulates.",
      },
    ],
    services: ["biometric-attendance", "workplace-security", "hrms-payroll"],
    notes: [
      "Contactless facial recognition at staff entrances",
      "Shift and on-call rules encoded once, applied automatically",
      "Access logs for restricted rooms, searchable after the fact",
    ],
  },
  {
    slug: "retail-distribution",
    name: "Retail & Distribution",
    eyebrow: "Multi-site",
    title: "Workforce systems for retail and distribution",
    tagline: "Many locations, one attendance dashboard.",
    description:
      "Consolidated attendance and payroll across stores, warehouses and depots — with CCTV and stock-room access managed from the same employee record.",
    icon: "FaChartLine",
    illustration: "MultiSiteNetwork",
    challenges: [
      {
        title: "Every store keeps its own register",
        body: "Head office cannot answer basic staffing questions without calling each location, and payroll waits for the slowest one to report.",
      },
      {
        title: "Shrinkage needs a record, not a hunch",
        body: "Stock-room access tied to employee identity, plus camera coverage, turns an argument into a log.",
      },
      {
        title: "High churn makes onboarding the bottleneck",
        body: "Enrolling and removing staff has to take minutes, at the store, without head office involvement.",
      },
    ],
    services: ["hrms-payroll", "workplace-security", "biometric-attendance"],
    notes: [
      "Cloud push from every site into one central dashboard",
      "Store-level enrolment with head-office visibility",
      "Stock-room and cash-office access on the same identity",
    ],
  },
  {
    slug: "it-and-bpo",
    name: "IT & BPO",
    eyebrow: "Offices & delivery centres",
    title: "Workforce systems for IT and BPO",
    tagline: "Shift-based delivery, client-grade access control.",
    description:
      "Attendance and access built for 24/7 delivery centres, with the audit trail client security reviews ask for — plus hiring support for the roles that are hardest to fill.",
    icon: "FaIdCardClip",
    illustration: "DeliveryFloor",
    challenges: [
      {
        title: "Clients audit your access controls",
        body: "Delivery floors and secure rooms need documented, role-based access with retained logs — often as a contractual requirement.",
      },
      {
        title: "Rotating shifts across time zones",
        body: "Night differentials and rotating rosters have to feed payroll automatically or they get calculated by hand every month.",
      },
      {
        title: "Hiring is the constraint on growth",
        body: "Delivery capacity is limited by how fast you can hire and verify people, not by demand.",
      },
    ],
    services: ["workplace-security", "hrms-payroll", "corporate-hiring"],
    notes: [
      "Zone-based access with retained logs for client audits",
      "Shift differentials encoded into payroll rules",
      "Verified hiring pipelines for delivery and leadership roles",
    ],
  },
  {
    slug: "education",
    name: "Schools & Institutes",
    eyebrow: "Campuses",
    title: "Workforce systems for education",
    tagline: "Staff attendance, campus access, visitor records.",
    description:
      "Staff attendance and payroll for schools and institutes, with campus access control and a verifiable visitor log at the gate.",
    icon: "FaUsers",
    illustration: "CampusGate",
    challenges: [
      {
        title: "Visitors sign a paper register",
        body: "Campuses need a verifiable record of who was on site and who authorised them — paper does not provide it.",
      },
      {
        title: "Teaching staff have irregular hours",
        body: "Period-based and part-time schedules do not map onto a standard attendance rule without configuration.",
      },
      {
        title: "Multiple buildings, one administration",
        body: "Blocks and annexes each have entrances, but payroll and records are managed centrally.",
      },
    ],
    services: ["biometric-attendance", "workplace-security", "hrms-payroll"],
    notes: [
      "Digital visitor badges and a searchable entry log",
      "Part-time and period-based attendance rules",
      "One dashboard across buildings and campuses",
    ],
  },
];

export const industrySlugs = industries.map((i) => i.slug);
export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
