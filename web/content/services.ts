import type { Service as DemoService } from "@/lib/site";

/**
 * Source of truth for /services, the header dropdown, the sitemap and the
 * per-service JSON-LD.
 *
 * Every claim here is traceable to copy that was already on the live site.
 * The `stats` figures are structural facts (how many stages a process has,
 * how many device types are supported) rather than invented performance
 * metrics — replace them with real, measured numbers when you have them.
 */
export type ServiceStat = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
};

export type ServiceContent = {
  slug: string;
  /** Short label for navigation. */
  name: string;
  title: string;
  eyebrow: string;
  tagline: string;
  /** Meta description. */
  description: string;
  icon: string;
  /** Name from components/illustrations. Used in the hero when there is no photo. */
  illustration: string;
  image?: { src: string; alt: string };
  problems: { title: string; body: string }[];
  capabilities: { icon: string; title: string; body: string }[];
  stats: ServiceStat[];
  process: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  /** Preselects the demo form. */
  demoService: DemoService;
  related: string[];
};

export const services: ServiceContent[] = [
  {
    slug: "hrms-payroll",
    name: "HRMS & Payroll",
    title: "HRMS & Payroll Software",
    eyebrow: "Flagship platform",
    tagline: "One workforce. One connected system.",
    description:
      "Connect attendance, HRMS and payroll into one error-free workflow. Biometric logs sync in real time, statutory deductions are automatic, and payslips are one click away.",
    icon: "FaIdCardClip",
    illustration: "PayrollFlow",
    image: {
      src: "/images/hrms-payroll.webp",
      alt: "Nova Pulse HRMS attendance and payroll management interface",
    },
    problems: [
      {
        title: "Attendance lives in one system, payroll in another",
        body: "Punch data is exported to a spreadsheet, re-keyed into payroll, and quietly corrupted somewhere in between. Month-end becomes a reconciliation exercise instead of a payment run.",
      },
      {
        title: "Statutory deductions are calculated by hand",
        body: "PF, ESI and TDS get recalculated every month against changing thresholds. One transposed figure becomes a compliance problem you find out about much later.",
      },
      {
        title: "Every branch keeps its own version of the truth",
        body: "Head office cannot answer a simple question — how many people were on shift last Tuesday — without calling four managers.",
      },
    ],
    capabilities: [
      {
        icon: "FaUsers",
        title: "Employee lifecycle management",
        body: "Digital onboarding records, departmental hierarchies, leave approval chains and employee self-service, in one place.",
      },
      {
        icon: "FaCalculator",
        title: "Automated payroll",
        body: "Work days, late marks, leave and overtime are read straight from biometric logs. PF, ESI and TDS apply automatically, and payslips generate in a single run.",
      },
      {
        icon: "FaNetworkWired",
        title: "Multi-branch architecture",
        body: "Every branch, warehouse and store pushes to one central dashboard. Consolidated shift rosters and attendance across all of them.",
      },
      {
        icon: "FaChartPie",
        title: "Statutory reporting",
        body: "Tax logs and compliance registers generated from the same data that produced the payslips, so the two can never disagree.",
      },
    ],
    stats: [
      { value: 6, label: "Stages from punch to payslip" },
      { value: 3, label: "Statutory deductions automated" },
      { value: 1, label: "Click to run payroll" },
    ],
    process: [
      { title: "Employee", body: "Check-in and check-out at the device." },
      { title: "Biometric capture", body: "Face, fingerprint or RFID, verified at the door." },
      { title: "HRMS sync", body: "Logs push to the cloud in real time — no pen drives." },
      { title: "Leave & shifts", body: "Deductions and shift rules apply automatically." },
      { title: "Payroll run", body: "One click produces every salary slip." },
      { title: "Reports", body: "Statutory tax logs and registers, ready to file." },
    ],
    faqs: [
      {
        question: "Can HRMS integrate with biometric attendance machines?",
        answer:
          "Yes. Our HRMS workflows connect directly with fingerprint, face recognition and RFID machines over LAN, Wi-Fi or cloud push, syncing punch logs in real time.",
      },
      {
        question: "Can it handle payroll processing automatically?",
        answer:
          "Yes. The system calculates work days, late marks, leaves and overtime from biometric logs, applies PF, ESI and TDS, and generates payslips in one run.",
      },
      {
        question: "Can multiple branches be managed from one portal?",
        answer:
          "Yes. All branch machines push to a central cloud server, giving head office a unified attendance dashboard across Delhi NCR, UP and regional offices.",
      },
      {
        question: "Can employees see their own attendance and payslips?",
        answer:
          "Yes. Employees get self-service access to check punch times, submit leave requests and download monthly payslips.",
      },
    ],
    demoService: "HRMS & Payroll",
    related: ["biometric-attendance", "workplace-security"],
  },
  {
    slug: "biometric-attendance",
    name: "Biometric Attendance",
    title: "Biometric Attendance Devices",
    eyebrow: "Hardware & device ecosystem",
    tagline: "Accurate attendance, captured at the door.",
    description:
      "Fingerprint, facial recognition and RFID attendance hardware, procured, installed and mapped into your payroll — with cloud sync instead of manual data extraction.",
    icon: "FaFingerprint",
    illustration: "AttendanceFlow",
    problems: [
      {
        title: "Buddy punching quietly inflates payroll",
        body: "Card and register systems cannot tell who actually turned up. Biometrics tie a punch to a person.",
      },
      {
        title: "Someone walks around with a pen drive every month",
        body: "Offline devices mean manual extraction from every machine, in every branch, before payroll can even start.",
      },
      {
        title: "The device works, but nothing downstream does",
        body: "Hardware is the easy part. Mapping shift rules, grace periods and overtime into payroll is where most deployments stall.",
      },
    ],
    capabilities: [
      {
        icon: "FaFingerprint",
        title: "Fingerprint attendance",
        body: "High-speed optical scanners with real-time push protocols for error-free clock-ins.",
      },
      {
        icon: "FaUserCheck",
        title: "Face recognition",
        body: "Touchless AI-powered verification that works in low light and at speed during shift changes.",
      },
      {
        icon: "FaCreditCard",
        title: "RFID & smart cards",
        body: "Proximity solutions for factories and large facilities where batches of staff change shift at once.",
      },
      {
        icon: "FaCloudArrowUp",
        title: "Cloud synchronisation",
        body: "Automatic Wi-Fi, LAN or 4G push straight into the HRMS. No manual extraction.",
      },
    ],
    stats: [
      { value: 3, label: "Verification modes supported" },
      { value: 3, label: "Connectivity options: LAN, Wi-Fi, 4G" },
      { value: 0, label: "Pen drives required" },
    ],
    process: [
      { title: "Site survey", body: "We assess entry points, headcount, shift patterns and network." },
      { title: "Device selection", body: "The right modality and model for the environment and throughput." },
      { title: "Installation", body: "Physical mounting, power and network routing done on site." },
      { title: "Payroll mapping", body: "Shift rules, grace periods and overtime wired into the HRMS." },
      { title: "Training & handover", body: "Admin staff trained on enrolment, exceptions and reporting." },
    ],
    faqs: [
      {
        question: "Which biometric devices do you supply?",
        answer:
          "Fingerprint, facial recognition and RFID card terminals, selected for your throughput and environment. We handle procurement so you are not buying hardware blind.",
      },
      {
        question: "Do you provide on-site setup?",
        answer:
          "Yes. Our team handles physical mounting, network routing, payroll mapping and administrative staff training.",
      },
      {
        question: "Will the devices work if the internet goes down?",
        answer:
          "Punches are stored on the device and pushed once connectivity returns, so attendance data is never lost during an outage.",
      },
    ],
    demoService: "Biometric Attendance",
    related: ["hrms-payroll", "workplace-security"],
  },
  {
    slug: "workplace-security",
    name: "Workplace Security",
    title: "CCTV & Workplace Security",
    eyebrow: "Premises protection",
    tagline: "Secure the building, not just the spreadsheet.",
    description:
      "CCTV surveillance, access control and visitor management — integrated with the same employee identity your attendance system already uses.",
    icon: "FaShieldHalved",
    illustration: "SecurityScene",
    problems: [
      {
        title: "Cameras record, but nobody watches",
        body: "Footage without remote access and retention planning is only useful after something has already gone wrong.",
      },
      {
        title: "Access is controlled by whoever has a key",
        body: "Server rooms, stock rooms and cash offices need role-based entry that can be revoked the day someone leaves.",
      },
      {
        title: "Visitors sign a paper register nobody reads",
        body: "No verifiable record of who was in the building, when, or who authorised them.",
      },
    ],
    capabilities: [
      {
        icon: "FaVideo",
        title: "CCTV surveillance",
        body: "HD IP cameras, NVR infrastructure and remote mobile viewing for 24/7 workplace protection.",
      },
      {
        icon: "FaDoorClosed",
        title: "Access control",
        body: "Electromagnetic locks, turnstiles and restricted-area access tied to employee biometrics or smart cards.",
      },
      {
        icon: "FaUserShield",
        title: "Visitor management",
        body: "Digital badge generation, visitor logging and entry verification, with a searchable record.",
      },
      {
        icon: "FaNetworkWired",
        title: "One identity across systems",
        body: "The same employee record drives attendance and door access, so revoking someone does both at once.",
      },
    ],
    stats: [
      { value: 24, suffix: "/7", label: "Remote monitoring" },
      { value: 3, label: "Layers: camera, door, visitor" },
      { value: 1, label: "Employee identity across all of it" },
    ],
    process: [
      { title: "Risk walkthrough", body: "We map entry points, blind spots and restricted zones on site." },
      { title: "System design", body: "Camera placement, controller layout and retention plan." },
      { title: "Installation", body: "Cabling, mounting, NVR configuration and door hardware." },
      { title: "Integration", body: "Access rules tied to the employee records already in your HRMS." },
      { title: "Support", body: "Ongoing maintenance and hardware replacement." },
    ],
    faqs: [
      {
        question: "Can access control use the same biometrics as attendance?",
        answer:
          "Yes — that is the point of buying them together. One enrolment drives both, and removing an employee revokes door access and attendance at the same time.",
      },
      {
        question: "Can we view cameras remotely?",
        answer:
          "Yes. Remote mobile viewing is part of a standard deployment, along with an NVR retention plan sized to your requirements.",
      },
      {
        question: "Do you handle maintenance after installation?",
        answer:
          "Yes. A dedicated account manager covers ongoing technical assistance and hardware maintenance.",
      },
    ],
    demoService: "CCTV & Security",
    related: ["biometric-attendance", "hrms-payroll"],
  },
  {
    slug: "corporate-hiring",
    name: "Corporate Hiring",
    title: "Corporate Hiring & Recruitment",
    eyebrow: "Talent acquisition",
    tagline: "Build teams that move the business forward.",
    description:
      "Executive search, B2B sales hiring and candidate background verification — a structured six-stage pipeline from requirement to onboarding.",
    icon: "FaUserPlus",
    illustration: "HiringScene",
    image: {
      src: "/images/hiring.webp",
      alt: "Nova Pulse corporate recruitment and executive hiring process",
    },
    problems: [
      {
        title: "Sales hires look good on paper and miss quota",
        body: "A CV shows where someone worked, not whether they ever hit a number. Past quota attainment has to be verified, not assumed.",
      },
      {
        title: "Leadership searches drag on for months",
        body: "Job boards surface applicants, not the people already succeeding elsewhere who need to be approached directly.",
      },
      {
        title: "Nobody checks the claims",
        body: "Employment history and credentials go unverified until something goes badly wrong.",
      },
    ],
    capabilities: [
      {
        icon: "FaUserTie",
        title: "Executive & leadership search",
        body: "Headhunting department heads and leadership who align with your vision and can execute on strategy.",
      },
      {
        icon: "FaHeadset",
        title: "Sales & revenue talent",
        body: "B2B reps, SDRs and closers vetted specifically for past quota attainment and revenue performance.",
      },
      {
        icon: "FaClipboardCheck",
        title: "Background audits",
        body: "Employment history cross-checks, credential verification and risk auditing before an offer goes out.",
      },
      {
        icon: "FaUsers",
        title: "Scalable corporate staffing",
        body: "Volume hiring for operations and support functions, run to the same structured pipeline.",
      },
    ],
    stats: [
      { value: 6, label: "Stages from brief to onboarding" },
      { value: 3, label: "Verification checks before offer" },
      { value: 2, label: "Specialisms: leadership and revenue" },
    ],
    process: [
      { title: "Requirement", body: "We define the role, the profile and what success looks like." },
      { title: "Sourcing", body: "Direct approach, not just inbound applications." },
      { title: "Screening", body: "Filtered against the brief before you see anyone." },
      { title: "Interview", body: "Coordinated scheduling and structured feedback." },
      { title: "Verification", body: "Employment history and credentials checked." },
      { title: "Onboarding", body: "Handover into your HRMS, with records already in place." },
    ],
    faqs: [
      {
        question: "What roles do you recruit for?",
        answer:
          "Executive and management search, B2B sales and revenue roles, and scalable corporate staffing across operations.",
      },
      {
        question: "Do you verify candidate backgrounds?",
        answer:
          "Yes. Employment history cross-checks, credential verification and risk auditing are part of the standard pipeline, before an offer is made.",
      },
      {
        question: "Do you guarantee a placement?",
        answer:
          "Recruitment is delivered on a best-efforts basis. We commit to the process, activity levels and deliverables set out in your agreement — not to a specific candidate accepting.",
      },
    ],
    demoService: "Hiring & Recruitment",
    related: ["b2b-lead-generation", "hrms-payroll"],
  },
  {
    slug: "b2b-lead-generation",
    name: "B2B Lead Generation",
    title: "B2B Lead Generation & Sales Pipelines",
    eyebrow: "Pipeline generation",
    tagline: "Turn prospects into booked meetings.",
    description:
      "Multi-channel outbound — LinkedIn prospecting, cold email, SDR calling and WhatsApp broadcasts — delivering qualified meetings onto your sales calendar.",
    icon: "FaChartLine",
    illustration: "GrowthFunnel",
    image: {
      src: "/images/lead-generation.webp",
      alt: "Nova Pulse B2B lead generation and prospecting dashboard",
    },
    problems: [
      {
        title: "Your sales team spends its day looking for people to call",
        body: "Closers doing their own prospecting is the most expensive way to build a list.",
      },
      {
        title: "The pipeline is unpredictable",
        body: "Referrals and inbound arrive when they arrive. Outbound is the only channel you can turn up deliberately.",
      },
      {
        title: "Bought data goes stale before it is used",
        body: "Lists without verification and a sequence behind them produce bounces, not conversations.",
      },
    ],
    capabilities: [
      {
        icon: "FaLinkedinIn",
        title: "LinkedIn B2B prospecting",
        body: "Founders, HR directors and enterprise decision-makers reached with personalised sequences that convert into calls.",
      },
      {
        icon: "FaCalendarCheck",
        title: "Appointment setting",
        body: "Dedicated SDR calling teams qualify prospects and place high-intent meetings on your calendar.",
      },
      {
        icon: "FaWhatsapp",
        title: "WhatsApp broadcasts",
        body: "Compliant broadcast workflows over the official API that re-engage prospects and surface warm enquiries.",
      },
      {
        icon: "FaBullseye",
        title: "Verified targeting",
        body: "Company profiles and decision-makers verified before a single message goes out.",
      },
    ],
    stats: [
      { value: 5, label: "Steps in the outbound method" },
      { value: 3, label: "Channels: LinkedIn, email, phone" },
      { value: 1, label: "Handover point — your sales team" },
    ],
    process: [
      { title: "Identify", body: "Target verified company profiles and key decision-makers." },
      { title: "Reach", body: "Engage via LinkedIn, cold email and multi-touch outbound." },
      { title: "Qualify", body: "Filter on budget, timeline and commercial authority." },
      { title: "Book", body: "Schedule demos and discovery meetings directly." },
      { title: "Handover", body: "Deliver ready prospects straight to your sales team." },
    ],
    faqs: [
      {
        question: "Which channels do you use?",
        answer:
          "LinkedIn prospecting, cold email, SDR outbound calling and WhatsApp broadcasts over the official Business API.",
      },
      {
        question: "Do you guarantee a number of meetings?",
        answer:
          "We commit to the process, activity levels and deliverables described in your agreement. We do not guarantee that a specific number of meetings will convert to revenue.",
      },
      {
        question: "Who owns the leads you generate?",
        answer: "You do. Qualified prospects are handed directly to your sales team.",
      },
    ],
    demoService: "Lead Generation",
    related: ["corporate-hiring", "hrms-payroll"],
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}
