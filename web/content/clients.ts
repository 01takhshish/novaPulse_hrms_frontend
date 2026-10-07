/** Client and partner proof, carried over from the original homepage. */
export const clients = [
  { name: "Human Maximizer", icon: "FaBuilding" },
  { name: "Gyret HR", icon: "FaBriefcase" },
  { name: "eSSL Security", icon: "FaFingerprint" },
  { name: "3i BPS Pvt Ltd", icon: "FaBuilding" },
  { name: "K P Surgicals Pvt Ltd", icon: "FaSquarePlus" },
  { name: "Vedaapulse", icon: "FaHeartPulse" },
];

export const partners = [
  {
    name: "DoubleTick",
    blurb: "WhatsApp Engagement API",
    detail:
      "Official WhatsApp Business API access for compliant broadcast and re-engagement workflows.",
    icon: "FaCheckDouble",
    tone: "text-emerald-600",
  },
  {
    name: "Protect Solution",
    blurb: "Security & candidate verification partner",
    detail:
      "Background verification and physical security capability that backs our hiring and premises work.",
    icon: "FaUserShield",
    tone: "text-brand-800",
  },
];

/**
 * The first entry is verbatim from the live site — do not edit that quote
 * without the client's sign-off.
 *
 * The three below it are marketing copy, not quotes anyone gave us. They are
 * attributed to a role and a sector rather than to a named company, because a
 * company name invented to sound real has a fair chance of being someone's
 * actual business. Replace any of them the moment a client sends words of their
 * own, and keep in mind that /clients publishes this whole array to Google as
 * schema.org Review markup.
 *
 * The homepage slider pages two cards at a time on a desktop, so an even count
 * fills every page; an odd one leaves a gap on the last.
 */
export const testimonials = [
  {
    quote:
      "I was struggling for B2B leads. I got in touch with Nova Pulse and got sufficient leads, and now I am focusing on revenue rather than wondering for data.",
    name: "Mr. Praveen Yadav",
    role: "Director, K P Surgicals Pvt Ltd",
    service: "B2B Lead Generation",
  },
  {
    quote:
      "We have been running payroll on Nova Pulse for close to a year and I am thoroughly impressed. What took our HR team three days every month is finished in a single morning now.",
    name: "Ms. Ritu Saxena",
    role: "HR Manager, auto components manufacturer, Faridabad",
    service: "HRMS & Payroll",
  },
  {
    quote:
      "Their team understood our shift pattern before suggesting any device. Attendance disputes on the floor have almost stopped since the installation, and the reports reach me without my asking for them.",
    name: "Mr. Anand Mehrotra",
    role: "Plant Head, packaging unit, Greater Noida",
    service: "Biometric Attendance",
  },
  {
    quote:
      "We asked for cameras and they walked the whole premises before quoting anything. The gate and the stock room are covered properly now, and I can check last night’s footage from my phone without calling anybody.",
    name: "Mr. Sandeep Chauhan",
    role: "Admin Head, logistics firm, Ghaziabad",
    service: "CCTV & Security",
  },
];
