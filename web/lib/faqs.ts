/** Shared by the FAQ section and its FAQPage JSON-LD. */
export const faqs = [
  {
    question: "Can HRMS integrate with biometric attendance machines?",
    answer:
      "Yes. Our HRMS workflows connect directly with fingerprint, face recognition, and RFID biometric machines via LAN, Wi-Fi, or cloud push data, syncing employee punch logs in real time.",
  },
  {
    question: "Can HRMS handle payroll processing automatically?",
    answer:
      "Yes. The system calculates work days, late marks, leaves, and overtime from biometric logs, applies statutory deductions (PF, ESI, TDS), and generates 1-click payslips.",
  },
  {
    question: "Can multiple branches be managed from one centralized portal?",
    answer:
      "Yes. All branch biometric machines push records to a central cloud server, giving head office management a unified attendance dashboard across Delhi NCR, UP, and regional offices.",
  },
  {
    question: "Can employees access their attendance and payslips?",
    answer:
      "Yes. Employees receive self-service portal access where they can check their punch times, submit leave requests, and view or download monthly payslips.",
  },
  {
    question: "Do you provide on-site hardware setup and implementation support?",
    answer:
      "Yes. Our team assists with physical machine mounting, network routing, software payroll mapping, and administrative staff training.",
  },
] as const;
