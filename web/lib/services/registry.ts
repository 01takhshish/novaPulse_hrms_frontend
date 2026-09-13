import type { IconName } from "@/components/icon";
import type { IllustrationName } from "@/components/illustrations";

/**
 * The allowlists behind the icon and illustration dropdowns in the admin form.
 *
 * They are plain strings rather than re-exports of the registries themselves
 * because this module is imported by the browser: pulling in components/icon.tsx
 * would drag every react-icons glyph into the admin bundle just to populate a
 * <select>. The two type assertions below fail the build if these lists ever
 * drift from the real registries, which is the part that actually matters —
 * a service pointing at a component that does not exist would throw at render.
 */
export const iconNames = [
  "FaArrowRight", "FaAward", "FaBriefcase", "FaBuilding", "FaCheckDouble",
  "FaClock", "FaCubes", "FaEnvelope", "FaFileInvoice", "FaHeartPulse",
  "FaLocationDot", "FaMicrochip", "FaPhone", "FaScrewdriverWrench",
  "FaSquarePlus", "FaStar", "FaBullseye", "FaCalculator", "FaCalendarCheck",
  "FaChartLine", "FaChartPie", "FaCircleCheck", "FaClipboardCheck",
  "FaCloudArrowUp", "FaCreditCard", "FaDoorClosed", "FaFingerprint",
  "FaHeadset", "FaIdCardClip", "FaLinkedinIn", "FaNetworkWired",
  "FaShieldHalved", "FaUserCheck", "FaUserPlus", "FaUserShield", "FaUserTie",
  "FaUsers", "FaVideo", "FaWhatsapp",
] as const;

export const illustrationNames = [
  "AttendanceFlow", "CampusGate", "ClinicRoster", "DeliveryFloor",
  "FactoryFloor", "GrowthFunnel", "HiringScene", "MultiSiteNetwork",
  "PayrollFlow", "SecurityScene",
] as const;

/** Compile-time only: `A extends B` fails to resolve when a name is missing. */
type Exhaustive<Actual extends Listed, Listed> = [Actual, Listed];

/* These aliases exist to be type-checked, never referenced — that is the whole
   mechanism. eslint cannot tell the difference, so it is silenced here only. */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Each direction is checked separately: the first catches a name added to the
// registry but not offered in the dropdown, the second catches a dropdown
// option that no longer resolves to a component.
type _IconsCoverRegistry = Exhaustive<IconName, (typeof iconNames)[number]>;
type _IconsAreReal = Exhaustive<(typeof iconNames)[number], IconName>;
type _IllustrationsCoverRegistry = Exhaustive<
  IllustrationName,
  (typeof illustrationNames)[number]
>;
type _IllustrationsAreReal = Exhaustive<
  (typeof illustrationNames)[number],
  IllustrationName
>;
/* eslint-enable @typescript-eslint/no-unused-vars */
