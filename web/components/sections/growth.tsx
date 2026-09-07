import Image from "next/image";
import { FaCalendarCheck, FaLinkedinIn, FaStar, FaWhatsapp } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";

const channels = [
  {
    icon: <FaLinkedinIn  />,
    tone: "text-brand-800",
    title: "LinkedIn B2B Prospecting",
    blurb:
      "Reach founders, HR directors, and enterprise decision-makers with personalized messaging sequences that convert into sales calls.",
  },
  {
    icon: <FaCalendarCheck  />,
    tone: "text-brand-800",
    title: "Appointment Setting",
    blurb:
      "Dedicated SDR outbound calling teams to qualify prospects and secure high-intent meetings directly on your sales calendar.",
  },
  {
    icon: <FaWhatsapp  />,
    tone: "text-emerald-600",
    title: "WhatsApp Broadcasts via Official API",
    blurb:
      "Automated broadcast workflows and compliant message funnels that re-engage prospects and generate warm commercial inquiries.",
  },
];

const methodology = [
  { step: "STEP 01", title: "Identify", blurb: "FaBullseye verified company profiles and key decision-makers." },
  { step: "STEP 02", title: "Reach", blurb: "Engage via LinkedIn, cold email, and multi-touch outbound." },
  { step: "STEP 03", title: "Qualify", blurb: "Filter budget, timeline, and commercial authority." },
  { step: "STEP 04", title: "Book", blurb: "Schedule direct sales demos and discovery meetings." },
  { step: "STEP 05", title: "Handover", blurb: "Deliver ready prospects directly to your sales team." },
];

export function Growth() {
  return (
    <section id="growth" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Pipeline Generation
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            Turn Prospects Into Opportunities
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base">
            Build a predictable B2B pipeline with targeted prospecting, lead generation, and
            appointment setting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-3 shadow-xl group">
              <Image
                src="/images/lead-generation.webp"
                alt="Nova Pulse B2B lead generation campaign monitoring and prospecting dashboard"
                width={1400}
                height={933}
                sizes="(min-width: 1024px) 600px, 100vw"
                className="w-full h-auto rounded-2xl object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-4 bg-slate-50/90 backdrop-blur mt-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    Multi-Channel Outbound Funnels
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">Qualified Meetings</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {channels.map((channel) => (
              <div key={channel.title} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg bg-purple-100 ${channel.tone} flex items-center justify-center font-bold text-sm shrink-0`}>
                    {channel.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{channel.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{channel.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-md mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-800 mb-6 text-center">
            5-Step Outbound Methodology
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            {methodology.map((item) => (
              <div key={item.step} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold font-mono text-brand-700 mb-1">{item.step}</div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        <figure className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-purple-900 to-slate-900 border border-brand-800 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-1 text-amber-300 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i}  />
                ))}
                <span className="text-purple-200 text-xs font-semibold ml-2">
                  Verified Client Experience
                </span>
              </div>
              <blockquote className="text-sm md:text-base text-slate-100 font-medium italic leading-relaxed">
                &ldquo;I was struggling for B2B leads. I got in touch with Nova Pulse and got
                sufficient leads, and now I am focusing on revenue rather than wondering for
                data.&rdquo;
              </blockquote>
              <figcaption>
                <div className="text-sm font-bold text-white">Mr. Praveen Yadav</div>
                <div className="text-xs text-purple-200">Director, K P Surgicals Pvt Ltd</div>
              </figcaption>
            </div>
            <DemoButton
              service="Lead Generation"
              source="growth-testimonial"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-brand-900 font-bold text-xs md:text-sm shadow-md transition-all whitespace-nowrap"
            >
              Discuss Lead Generation
            </DemoButton>
          </div>
        </figure>
      </div>
    </section>
  );
}
