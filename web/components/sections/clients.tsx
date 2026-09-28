import Link from "next/link";
import {
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaCheckDouble,
  FaFingerprint,
  FaHeartPulse,
  FaSquarePlus,
  FaUserShield,
} from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { industries } from "@/content/industries";

/**
 * Proof in one band: who we integrate with, who we work for, and which sectors
 * we have deployed in. The sector row used to be its own full section — as links
 * it still feeds the /industries pages, which is what it was really there for.
 */
const partners = [
  {
    Icon: FaCheckDouble,
    tone: "text-emerald-600",
    name: "DoubleTick",
    blurb: "WhatsApp Engagement API",
  },
  {
    Icon: FaUserShield,
    tone: "text-brand-800",
    name: "Protect Solution",
    blurb: "Security & Candidate Verification Partner",
  },
];

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
    <section id="clients" className="py-20 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase block mb-1">
            Technology &amp; Security Integrations
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Technology Partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-3xl mx-auto">
            {partners.map(({ Icon: PartnerIcon, tone, name, blurb }) => (
              <div
                key={name}
                className="flex items-center gap-3 bg-slate-50 px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm"
              >
                <PartnerIcon className={`${tone} text-2xl shrink-0`} />
                <div className="text-left">
                  <span className="block text-sm font-bold text-slate-900">{name}</span>
                  <span className="block text-[11px] text-slate-500">{blurb}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-200">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-6">
            Trusted by Growing Organizations
          </span>
          <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="animate-marquee flex gap-6 items-center py-2">
              {/* Rendered twice: the keyframe translates -50%, so the second copy
                  seamlessly takes over as the first scrolls out. */}
              {[0, 1].map((copy) =>
                clients.map(({ Icon: ClientIcon, name }) => (
                  <div
                    key={`${copy}-${name}`}
                    aria-hidden={copy === 1}
                    className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-sm whitespace-nowrap flex items-center gap-2"
                  >
                    <ClientIcon className="text-brand-700" /> {name}
                  </div>
                )),
              )}
            </div>
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

        <div data-reveal="up" className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
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
