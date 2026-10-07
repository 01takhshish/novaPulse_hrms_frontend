import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { TestimonialSlider } from "@/components/sections/testimonial-slider";
import { clients, testimonials } from "@/content/clients";

/**
 * Quotes come from content/clients.ts, which the /clients page also renders —
 * add a client's words there (with their sign-off) and both pages pick it up.
 *
 * The heading is centred over the slider, and the slider itself is the only
 * client component on the page: the section, the client row and the link below
 * all stay server-rendered, so the interactive cost is one small bundle rather
 * than the whole section.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="border-b border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div data-reveal="up" className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            In their words
          </span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            What our clients say
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Nova Pulse runs the attendance, payroll, security and pipeline systems for
            manufacturing, healthcare, retail and BPO businesses across Delhi NCR and Uttar
            Pradesh. Here is what that looks like from their side of the deployment.
          </p>
        </div>

        <div data-reveal="up" className="mx-auto max-w-3xl">
          <TestimonialSlider testimonials={testimonials} />
        </div>

        <div data-reveal="up" className="mt-14 border-t border-slate-200 pt-10">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
            Teams already running on Nova Pulse
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {clients.map((client) => (
              <li
                key={client.name}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-700"
              >
                <Icon name={client.icon} className="text-brand-700" />
                {client.name}
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link
              href="/clients"
              className="link-underline tap gap-2 py-1.5 text-sm font-bold text-brand-800"
            >
              See clients &amp; partners <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
