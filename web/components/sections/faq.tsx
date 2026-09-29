import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/faqs";

/**
 * Full-bleed FAQ: the heading column holds the page edge on the left while the
 * questions take the rest of the width.
 *
 * It used to be a centred max-w-4xl stack, which left the section reading as a
 * narrow strip in the middle of an otherwise full-width page. Widening it alone
 * would have been worse — a single accordion row stretched to 1280px gives a
 * click target the width of the screen and an answer line far past a readable
 * measure. Splitting the heading out uses the width and keeps the answers at a
 * sane line length.
 *
 * `lg:sticky` keeps the heading and the contact prompt in view while a long
 * list of answers scrolls past it.
 */
export function Faq() {
  return (
    <section id="faq" className="border-b border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        <div data-reveal="up" className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            Knowledge Base
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Clear answers regarding HRMS integration, biometric hardware, and growth services.
          </p>

          <p className="mt-6 text-sm text-slate-600">
            Something not covered here?{" "}
            <Link href="/contact" className="link-underline tap py-1.5 font-bold text-brand-800">
              Ask us directly <FaArrowRight className="inline text-[10px]" />
            </Link>
          </p>
        </div>

        <div data-reveal="up">
          <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </div>
    </section>
  );
}
