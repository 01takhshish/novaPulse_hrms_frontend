import { FaQuoteLeft } from "react-icons/fa6";
import { testimonials } from "@/content/clients";

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
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase block mb-1">
            In Their Words
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            What Our Clients Say
          </h2>
        </div>

        <div
          className={
            testimonials.length === 1
              ? "max-w-3xl mx-auto"
              : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              data-reveal="up"
              className="relative flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm p-8 md:p-10"
            >
              <FaQuoteLeft className="text-2xl text-brand-200" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-base md:text-lg leading-relaxed text-slate-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white"
                >
                  {initials(testimonial.name)}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-xs text-slate-500">{testimonial.role}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand-700">
                    {testimonial.service}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
