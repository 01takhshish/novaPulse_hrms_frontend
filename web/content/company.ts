/**
 * About / clients / careers content.
 *
 * Everything here is carried over from copy that was already live. Nothing is
 * invented — where a fact was not on the original site (leadership names, open
 * roles), the array is empty and the section hides itself until you fill it in.
 */
export const values = [
  {
    icon: "FaCubes",
    title: "One partner, not five vendors",
    body: "Workforce software, biometric hardware, security, hiring and pipelines from one team, sharing one employee record and one account manager.",
  },
  {
    icon: "FaScrewdriverWrench",
    title: "We implement, not just sell",
    body: "Device installation, LAN configuration and payroll rules mapping are part of the job. A licence handed over is not a deployment.",
  },
  {
    icon: "FaMicrochip",
    title: "Technology that holds up",
    body: "Cloud-synced biometrics and encrypted, compliance-aware architecture — because attendance data is personal data.",
  },
  {
    icon: "FaBriefcase",
    title: "Measured in business outcomes",
    body: "Fewer payroll errors, tighter premises, stronger pipeline. Not seats sold.",
  },
];

export const credentials = [
  { label: "Govt. recognised MSME", detail: "UDYAM-DL-06-****", icon: "FaAward" },
  { label: "GST registered entity", detail: "AA070826003612E", icon: "FaFileInvoice" },
  { label: "Enterprise security audit", detail: "Verified deployment", icon: "FaShieldHalved" },
];

export const locations = [
  {
    city: "Delhi",
    address: "Adarsh Nagar, Delhi – 110033",
    note: "Head office — sales, support and deployment team",
  },
  {
    city: "Mainpuri",
    address: "Mainpuri, Uttar Pradesh",
    note: "Regional operations for UP deployments",
  },
];

/**
 * Leadership. Left empty deliberately — the original site never named anyone,
 * and publishing a name or title we cannot verify would be inventing facts
 * about a real person. Add entries here and the section appears on /about.
 *
 * Shape: { name, role, bio, image }
 */
export const leadership: { name: string; role: string; bio: string; image: string }[] = [];

/**
 * Open roles. Empty until you have genuine vacancies — /careers falls back to a
 * general application. Do not seed this with placeholder jobs.
 */
export const openRoles: {
  title: string;
  location: string;
  type: string;
  summary: string;
}[] = [];

export const careerReasons = [
  {
    icon: "FaChartLine",
    title: "You will see the whole deal",
    body: "Small team, real customers. You are in the room from first conversation to installed system, not handed a ticket queue.",
  },
  {
    icon: "FaScrewdriverWrench",
    title: "Hardware and software",
    body: "Rare combination: you will configure payroll rules in the morning and be on a site survey in the afternoon.",
  },
  {
    icon: "FaUsers",
    title: "Customers you can name",
    body: "Manufacturing, healthcare, retail and BPO businesses across Delhi NCR and UP, not anonymous accounts.",
  },
];
