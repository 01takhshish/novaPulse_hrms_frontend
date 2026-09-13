import type { ServicePageRow } from "@/lib/db/schema";
import type { ServiceFormValues } from "@/components/admin/service-form";

/**
 * One row as the editor wants it. Numbers become strings because that is what
 * a text input hands back mid-type; the form converts them once on submit.
 */
export function toFormValues(row: ServicePageRow): ServiceFormValues {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    eyebrow: row.eyebrow,
    tagline: row.tagline,
    description: row.description,
    menuBlurb: row.menuBlurb,
    icon: row.icon,
    illustration: row.illustration,
    imageSrc: row.imageSrc ?? "",
    imageAlt: row.imageAlt ?? "",
    demoService: row.demoService,
    problems: row.problems,
    capabilities: row.capabilities,
    stats: row.stats.map((stat) => ({
      value: String(stat.value),
      label: stat.label,
      prefix: stat.prefix ?? "",
      suffix: stat.suffix ?? "",
      decimals: stat.decimals === undefined ? "" : String(stat.decimals),
    })),
    process: row.process,
    faqs: row.faqs,
    related: row.related,
    sortOrder: row.sortOrder,
    status: row.status,
  };
}

export type Sibling = { slug: string; name: string; status: string };

/** Everything except the page being edited, for the related-services picker. */
export function toSiblings(rows: ServicePageRow[], excludeId?: string): Sibling[] {
  return rows
    .filter((row) => row.id !== excludeId)
    .map((row) => ({ slug: row.slug, name: row.name, status: row.status }));
}
