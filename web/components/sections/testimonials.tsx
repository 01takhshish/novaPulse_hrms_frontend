import Link from "next/link";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { clients, testimonials } from "@/content/clients";

/** "Mr. Praveen Yadav" → "PY" for the avatar disc. */
function initials(name: string) {
  const honorifics = new Set(["mr", "mrs", "ms", "dr", "shri", "smt"]);
  return name
    .split(/\s+/)
    .filter((word) => !honorifics.has(word.replace(/\./g, "").toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Quotes come from content/clients.ts, which the /clients page also renders —
 * add a client's words there (with their sign-off) and both pages pick it up.
 *
 * Two layouts, picked by how many quotes exist. With one, the heading sits
 * beside the card in a two-column split, because a lone card under a full-width
 * heading reads as a section that failed to load. With two or more, the heading
 * goes above a normal grid. Nothing to change when a quote is added — the
 * section reflows itself.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  const solo = testimonials.length === 1;

  return (
    <section id="testimonials" className="border-b border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className={solo ? "grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16" : ""}>
          <div
            data-reveal={solo ? "left" : "up"}
            className={solo ? "" : "mb-12 max-w-2xl"}
          >
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

          <div className={solo ? "" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                data-reveal={solo ? "right" : "up"}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
              >
                {/* Client first, quote second — you decide whether a review is
                    worth reading by who wrote it, so the attribution leads
                    instead of being a footnote under the text. */}
                <figcaption className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white"
                  >
                    {initials(testimonial.name)}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </figcaption>

                {/* Same five stars the /clients page already publishes for these
                    quotes, so the two pages can't show different ratings. */}
                <div className="mt-5 flex items-center gap-1 text-sm text-amber-500">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <FaStar key={star} aria-hidden="true" />
                  ))}
                  <span className="sr-only">Rated 5 out of 5</span>
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-brand-700">
                    {testimonial.service}
                  </span>
                </div>

                <blockquote className="mt-5 flex-1 border-t border-slate-100 pt-5 text-base leading-relaxed text-slate-700 md:text-lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </figure>
            ))}
          </div>
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
