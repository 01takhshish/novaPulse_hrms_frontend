/**
 * Shared by the FAQ section and its FAQPage JSON-LD, so the visible copy and
 * the markup can never drift apart.
 *
 * Ten entries, ordered so the homepage's two columns split evenly: the first
 * five cover HRMS, payroll and rollout, the second five cover the rest of the
 * range — biometrics, security, hiring and lead generation. Every answer here
 * is already published on the matching /services page; none of it is new copy.
 */
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
  {
    question: "Which biometric devices do you supply?",
    answer:
      "Fingerprint, facial recognition and RFID card terminals, selected for your throughput and environment. We handle procurement so you are not buying hardware blind.",
  },
  {
    question: "Will the devices work if the internet goes down?",
    answer:
      "Punches are stored on the device and pushed once connectivity returns, so attendance data is never lost during an outage.",
  },
  {
    question: "Can access control use the same biometrics as attendance?",
    answer:
      "Yes \u2014 that is the point of buying them together. One enrolment drives both, and removing an employee revokes door access and attendance at the same time.",
  },
  {
    question: "What roles do you recruit for?",
    answer:
      "Executive and management search, B2B sales and revenue roles, and scalable corporate staffing across operations.",
  },
  {
    question: "Who owns the leads you generate?",
    answer:
      "You do. Qualified prospects are handed directly to your sales team.",
  },
] as const;
