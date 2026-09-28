import Link from "next/link";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { RevealGroup } from "@/components/motion/reveal";
import { getServiceForReference } from "@/lib/services";

/**
 * The four service lines beyond HRMS, as cards rather than four full sections.
 *
 * Each card is built from the service's own content, so the copy here can never
 * drift from the page it links to — and a service edited in /admin updates both.
 * Depth lives on /services/<slug>; the homepage only has to say enough for a
 * visitor to know which one they want.
 */
const slugs = [
  "biometric-attendance",
  "workplace-security",
  "corporate-hiring",
  "b2b-lead-generation",
];

export async function ServicesGrid() {
  const resolved = await Promise.all(slugs.map((slug) => getServiceForReference(slug)));
  const cards = resolved.filter((service): service is NonNullable<typeof service> => service !== null);
  if (cards.length === 0) return null;

  return (
    <section id="services" className="border-b border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center" data-reveal="up">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            The rest of the stack
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Everything else we run for you
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Four more service lines, each tied back to the same workforce record.
          </p>
        </div>

        <RevealGroup
          step={90}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          itemClassName="h-full"
        >
          {cards.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="lift group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-brand-500 hover:shadow-xl"
            >
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl text-brand-800 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                  <Icon name={service.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{service.tagline}</p>
                <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  {service.capabilities.slice(0, 3).map((capability) => (
                    <li key={capability.title} className="flex items-start gap-2">
                      <FaCircleCheck className="mt-0.5 shrink-0 text-brand-700" />
                      {capability.title}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-brand-800">
                Explore {service.name} <FaArrowRight className="text-[10px]" />
              </span>
            </Link>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
