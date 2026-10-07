// import Link from "next/link";
// import { FaArrowRight } from "react-icons/fa6";
import { TestimonialSlider } from "@/components/sections/testimonial-slider";
import { testimonials } from "@/content/clients";

/**
 * Quotes come from content/clients.ts, which the /clients page also renders —
 * add a client's words there (with their sign-off) and both pages pick it up.
 *
 * The heading is centred over the slider, and the slider itself is the only
 * client component on the page: the section and the link below it stay
 * server-rendered, so the interactive cost is one small bundle rather than the
 * whole section.
 *
 * The wrapper is deliberately wider than a single card — the slider shows two
 * cards side by side from `md` up, which is what keeps the row from sitting in
 * a narrow column with dead space either side.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="border-b border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div data-reveal="up" className="mx-auto mb-12 max-w-5xl px-4 text-center">
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

        <div data-reveal="up" className="mx-auto max-w-6xl">
          <TestimonialSlider testimonials={testimonials} />
        </div>

        {/* Link out to /clients, parked until that page is ready to be shown.
            Restore this and the two imports above it together. */}
        {/* <div data-reveal="up" className="mt-12 text-center">
          <Link
            href="/clients"
            className="link-underline tap gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            See clients &amp; partners <FaArrowRight className="text-xs" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}
