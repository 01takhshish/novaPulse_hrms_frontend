/** Single source of truth for contact details, nav structure and SEO config. */

const PRODUCTION_URL = "https://www.novapulse.co.in";

/**
 * Canonical origin. Preview deployments resolve to their own URL so they never
 * emit production canonicals, and `isProduction` gates indexing (see robots.ts).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? PRODUCTION_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : PRODUCTION_URL);

/** Only the real production deployment should be indexable. */
export const isProduction =
  process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === "production";

export const site = {
  name: "Nova Pulse",
  url: siteUrl,
  tagline: "The Pulse of Every Growing Business",
  description:
    "Nova Pulse helps growing businesses manage attendance, payroll automation, biometric devices, workplace security, corporate hiring, and B2B growth pipelines.",
  phone: "+91 87966 23604",
  phoneHref: "tel:+918796623604",
  email: "growth@novapulse.co.in",
  whatsapp: "https://wa.me/+918796623604",
  whatsappWithMessage:
    "https://wa.me/+918796623604?text=Hi%20Nova%20Pulse,%20I%20would%20like%20to%20know%20more%20about%20your%20business%20solutions.",
  gstin: "AA070826003612E",
  msme: "UDYAM-DL-06-****",
  addresses: ["Adarsh Nagar, Delhi – 110033", "Mainpuri, Uttar Pradesh"],
  socials: {
    linkedin: "https://www.linkedin.com/company/novapulse-solution/about/",
    instagram: "https://www.instagram.com/novapulse739/",
    youtube: "https://www.youtube.com/channel/UCO-ur3BsPw_q31PsUrmOqKg",
  },
} as const;

/** Values must stay in sync with the <select> in the demo form. */
export const services = [
  "HRMS & Payroll",
  "Biometric Attendance",
  "CCTV & Security",
  "Hiring & Recruitment",
  "Lead Generation",
  "General Inquiry",
] as const;

export type Service = (typeof services)[number];

export const serviceLabels: Record<Service, string> = {
  "HRMS & Payroll": "HRMS & Payroll Software",
  "Biometric Attendance": "Biometric Attendance Hardware / Setup",
  "CCTV & Security": "CCTV & Access Control Security",
  "Hiring & Recruitment": "Corporate Hiring & Recruitment",
  "Lead Generation": "B2B Lead Generation & Sales Pipelines",
  "General Inquiry": "General Inquiry / Other",
};

/** Mirrors content/services.ts; kept here so the header stays a pure data render. */
export const solutionsMenu = [
  {
    href: "/services/hrms-payroll",
    icon: "FaIdCardClip",
    title: "HRMS & Payroll",
    blurb: "Attendance, Shifts & Payroll",
  },
  {
    href: "/services/biometric-attendance",
    icon: "FaFingerprint",
    title: "Biometric Attendance",
    blurb: "Fingerprint, Face & RFID Hardware",
  },
  {
    href: "/services/workplace-security",
    icon: "FaShieldHalved",
    title: "Workplace Security",
    blurb: "CCTV & Access Control",
  },
  {
    href: "/services/corporate-hiring",
    icon: "FaUserPlus",
    title: "Corporate Hiring",
    blurb: "Sales, Operations & Leadership",
  },
  {
    href: "/services/b2b-lead-generation",
    icon: "FaChartLine",
    title: "B2B Lead Generation",
    blurb: "Outbound & Sales Pipelines",
  },
] as const;

export const industriesMenu = [
  { href: "/industries/manufacturing", icon: "FaNetworkWired", title: "Manufacturing & Factories", blurb: "High-throughput shift changes" },
  { href: "/industries/healthcare", icon: "FaUserShield", title: "Healthcare & Clinics", blurb: "Contactless, restricted areas" },
  { href: "/industries/retail-distribution", icon: "FaChartLine", title: "Retail & Distribution", blurb: "Many sites, one dashboard" },
  { href: "/industries/it-and-bpo", icon: "FaIdCardClip", title: "IT & BPO", blurb: "Client-grade access control" },
  { href: "/industries/education", icon: "FaUsers", title: "Schools & Institutes", blurb: "Campus access & visitors" },
] as const;

export const mobileNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "All services" },
  { href: "/services/hrms-payroll", label: "HRMS & Payroll" },
  { href: "/services/biometric-attendance", label: "Biometric Attendance" },
  { href: "/services/workplace-security", label: "Workplace Security" },
  { href: "/services/corporate-hiring", label: "Corporate Hiring" },
  { href: "/services/b2b-lead-generation", label: "B2B Lead Generation" },
  { href: "/industries", label: "Industries" },
  { href: "/blog", label: "Blog" },
  { href: "/clients", label: "Clients & Partners" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;
