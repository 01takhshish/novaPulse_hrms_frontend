import {
  FaArrowRight,
  FaAward,
  FaBriefcase,
  FaBuilding,
  FaCheckDouble,
  FaClock,
  FaCubes,
  FaEnvelope,
  FaFileInvoice,
  FaHeartPulse,
  FaLocationDot,
  FaMicrochip,
  FaPhone,
  FaScrewdriverWrench,
  FaSquarePlus,
  FaStar,
  FaBullseye,
  FaCalculator,
  FaCalendarCheck,
  FaChartLine,
  FaChartPie,
  FaCircleCheck,
  FaClipboardCheck,
  FaCloudArrowUp,
  FaCreditCard,
  FaDoorClosed,
  FaFingerprint,
  FaHeadset,
  FaIdCardClip,
  FaLinkedinIn,
  FaNetworkWired,
  FaShieldHalved,
  FaUserCheck,
  FaUserPlus,
  FaUserShield,
  FaUserTie,
  FaUsers,
  FaVideo,
  FaWhatsapp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

/**
 * Content files reference icons by name, so this registry is what turns those
 * strings into components. Adding an icon means adding it here — which keeps
 * tree-shaking working, unlike a dynamic import by name.
 */
const REGISTRY = {
  FaArrowRight, FaAward, FaBriefcase, FaBuilding, FaCheckDouble, FaClock, FaCubes, FaEnvelope, FaFileInvoice, FaHeartPulse, FaLocationDot, FaMicrochip, FaPhone, FaScrewdriverWrench, FaSquarePlus, FaStar,
  FaBullseye, FaCalculator, FaCalendarCheck, FaChartLine, FaChartPie,
  FaCircleCheck, FaClipboardCheck, FaCloudArrowUp, FaCreditCard, FaDoorClosed,
  FaFingerprint, FaHeadset, FaIdCardClip, FaLinkedinIn, FaNetworkWired,
  FaShieldHalved, FaUserCheck, FaUserPlus, FaUserShield, FaUserTie, FaUsers,
  FaVideo, FaWhatsapp,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof REGISTRY;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = REGISTRY[name as IconName];
  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(`Unknown icon "${name}". Add it to components/icon.tsx.`);
    }
    return null;
  }
  return <Component className={className} />;
}
