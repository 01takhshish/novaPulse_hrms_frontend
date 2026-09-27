/**
 * NovaPulse HRMS is quoted per requirement rather than from a published rate
 * card, so this file carries the inputs to that conversation instead of prices.
 *
 * The factors below are exactly the ones the HRMS brochure names as driving the
 * commercial proposal — do not add others without something to back them up.
 * Rendered by the homepage pricing modal and the /pricing page.
 */

/** What we need to know before putting a number on a proposal. */
export const quoteFactors = [
  {
    icon: "FaUsers",
    title: "Team size",
    blurb: "Your headcount today, and how fast you expect it to grow this year.",
  },
  {
    icon: "FaCubes",
    title: "Modules you need",
    blurb: "Core HR, attendance, payroll, leave, self-service — all of it, or start with a part.",
  },
  {
    icon: "FaFingerprint",
    title: "Biometric setup",
    blurb: "Fingerprint, face or RFID devices — and whether you already own the hardware.",
  },
  {
    icon: "FaNetworkWired",
    title: "Branches & entities",
    blurb: "One office, several branches, or multiple companies under one group.",
  },
  {
    icon: "FaScrewdriverWrench",
    title: "Implementation",
    blurb: "Migrating existing employee data, and the approval rules specific to how you work.",
  },
  {
    icon: "FaCloudArrowUp",
    title: "Integrations",
    blurb: "APIs and links to the accounting or ERP systems you already run.",
  },
] as const;

/** Requirements we are already set up to handle — from the brochure. */
export const customPlanPoints = [
  "100+ employees",
  "Multiple branches",
  "Multiple companies",
  "Complex payroll",
  "Custom HR workflows",
  "Special biometric needs",
  "API / system integrations",
  "Enterprise requirements",
] as const;

export const pricingHeading = "Let's build a plan around your business";

export const pricingIntro =
  "Every workforce runs differently, so we don't put a one-size rate card in front of you. Tell us how your team works and we'll scope a plan — and a price — that fits it.";

export const pricingNote =
  "Your final commercial proposal depends on employee count, modules, implementation requirements, biometric integration and customization. Share your requirement and we'll send it to you in writing — no obligation.";
