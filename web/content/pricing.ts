/**
 * NovaPulse HRMS plans, verbatim from the HRMS brochure — rendered by the
 * homepage pricing modal and the /pricing page. Keep in sync with the brochure.
 */
export const hrmsPlans = [
  {
    id: "msme",
    name: "MSME Plan",
    blurb: "For small and growing businesses",
    price: "₹799",
    limit: "Up to 10 employees",
    extra: "+ ₹40 / additional employee",
    popular: false,
    features: [
      "Core HR",
      "Employee Database",
      "Leave Management",
      "Basic Attendance",
      "Employee Self-Service",
      "Employee Documents",
      "Basic Reports & HR Dashboard",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    blurb: "For businesses ready to automate HR",
    price: "₹2,499",
    limit: "Up to 30 employees",
    extra: "+ ₹40 / additional employee",
    popular: true,
    features: [
      "Everything in MSME",
      "Advanced Attendance & Shifts",
      "Biometric Integration",
      "Overtime Management",
      "Payroll, PF / ESI / PT",
      "Salary Slips",
      "Advanced Reports & Multi-Branch",
    ],
  },
  {
    id: "professional",
    name: "Professional Plan",
    blurb: "For growing, multi-location organizations",
    price: "₹4,599",
    limit: "Up to 50 employees",
    extra: "+ ₹40 / additional employee",
    popular: false,
    features: [
      "Everything in Growth",
      "Advanced Payroll",
      "Performance Management",
      "Recruitment",
      "Workforce Analytics",
      "Custom Workflows & Roles",
      "API / Integrations, Priority Support",
    ],
  },
] as const;

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

export const pricingDisclaimer =
  "Pricing shown is indicative and may vary based on employee count, modules, implementation requirements, biometric integration and customization. Contact NovaPulse for the final commercial proposal.";
