import { requireAdmin } from "@/lib/auth/guard";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/service-form";
import { listAll } from "@/lib/services/service";
import { toSiblings } from "../form-values";

export const dynamic = "force-dynamic";
export const metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireAdmin();
  const existing = await listAll();

  const blank: ServiceFormValues = {
    slug: "",
    name: "",
    title: "",
    eyebrow: "",
    tagline: "",
    description: "",
    menuBlurb: "",
    icon: "FaCubes",
    illustration: "MultiSiteNetwork",
    imageSrc: "",
    imageAlt: "",
    demoService: "General Inquiry",
    problems: [],
    capabilities: [{ icon: "FaCircleCheck", title: "", body: "" }],
    stats: [],
    process: [],
    faqs: [],
    related: [],
    // Lands at the end of the menu rather than silently tying with an existing
    // page for first place.
    sortOrder: existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1,
    status: "draft",
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-brand-800"
      >
        <FaArrowLeft className="text-[10px]" /> Services
      </Link>
      <h1 className="text-2xl font-extrabold text-slate-900">New service</h1>
      <ServiceForm initial={blank} siblings={toSiblings(existing)} />
    </div>
  );
}
