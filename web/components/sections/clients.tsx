import Link from "next/link";
import {
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaFingerprint,
  FaHeartPulse,
  FaSquarePlus,
} from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { industries } from "@/content/industries";

/**
 * Who we work for and which sectors we have deployed in. The sector row used to
 * be its own full section — as links it still feeds the /industries pages, which
 * is what it was really there for.
 *
 * Technology partners live on /clients only; on the homepage they were proof of
 * someone else's product, not of ours.
 */
const clients = [
  { Icon: FaBuilding, name: "Human Maximizer" },
  { Icon: FaBriefcase, name: "Gyret HR" },
  { Icon: FaFingerprint, name: "eSSL Security" },
  { Icon: FaBuilding, name: "3i BPS Pvt Ltd" },
  { Icon: FaSquarePlus, name: "K P Surgicals Pvt Ltd" },
  { Icon: FaHeartPulse, name: "Vedaapulse" },
];

export function Clients() {
  return (
    <section id="clients" className="overflow-hidden border-b border-slate-200 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-800">
            Clients &amp; sectors
          </span>
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            Trusted by growing organisations
          </h2>
        </div>

        <div className="relative flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="animate-marquee flex items-center gap-6 py-2">
            {/* Rendered twice: the keyframe translates -50%, so the second copy
                seamlessly takes over as the first scrolls out. */}
            {[0, 1].map((copy) =>
              clients.map(({ Icon: ClientIcon, name }) => (
                <div
                  key={`${copy}-${name}`}
                  aria-hidden={copy === 1}
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm"
                >
                  <ClientIcon className="text-brand-700" /> {name}
                </div>
              )),
            )}
          </div>
        </div>

        <div id="industries" className="mt-12 border-t border-slate-200 pt-8 text-center">
          <span className="mb-6 block text-xs font-bold uppercase tracking-widest text-slate-400">
            Deployed across
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:border-brand-400 hover:bg-white hover:text-brand-800"
              >
                <Icon name={industry.icon} />
                {industry.name}
              </Link>
            ))}
          </div>
        </div>

        <div
          data-reveal="up"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center"
        >
          <Link
            href="/clients"
            className="link-underline inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            See all clients &amp; partners <FaArrowRight className="text-xs" />
          </Link>
          <Link
            href="/industries"
            className="link-underline inline-flex items-center gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            See all industries <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
