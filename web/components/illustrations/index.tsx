export { AttendanceFlow } from "./attendance-flow";
export { CampusGate } from "./campus-gate";
export { ClinicRoster } from "./clinic-roster";
export { DeliveryFloor } from "./delivery-floor";
export { FactoryFloor } from "./factory-floor";
export { GrowthFunnel } from "./growth-funnel";
export { HiringScene } from "./hiring-scene";
export { MultiSiteNetwork } from "./multi-site-network";
export { PayrollFlow } from "./payroll-flow";
export { SecurityScene } from "./security-scene";

import { AttendanceFlow } from "./attendance-flow";
import { CampusGate } from "./campus-gate";
import { ClinicRoster } from "./clinic-roster";
import { DeliveryFloor } from "./delivery-floor";
import { FactoryFloor } from "./factory-floor";
import { GrowthFunnel } from "./growth-funnel";
import { HiringScene } from "./hiring-scene";
import { MultiSiteNetwork } from "./multi-site-network";
import { PayrollFlow } from "./payroll-flow";
import { SecurityScene } from "./security-scene";

/**
 * Lets content files pick a scene by name, like the icon registry.
 * One scene per page — each has its own gradient namespace so two on a page
 * would not clash either.
 */
const REGISTRY = {
  AttendanceFlow,
  CampusGate,
  ClinicRoster,
  DeliveryFloor,
  FactoryFloor,
  GrowthFunnel,
  HiringScene,
  MultiSiteNetwork,
  PayrollFlow,
  SecurityScene,
} as const;

export type IllustrationName = keyof typeof REGISTRY;

export function Illustration({ name, className }: { name: string; className?: string }) {
  const Component = REGISTRY[name as IllustrationName];
  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(`Unknown illustration "${name}". Add it to components/illustrations/index.tsx.`);
    }
    return null;
  }
  return <Component className={className} />;
}
