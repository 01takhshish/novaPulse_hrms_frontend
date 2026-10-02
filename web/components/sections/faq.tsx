import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/faqs";

/** Five questions per column, so the split stays even as the list grows. */
const half = Math.ceil(faqs.length / 2);
const leftColumn = faqs.slice(0, half);
const rightColumn = faqs.slice(half);

/**
 * Centred heading over a two-column question list.
 *
 * A single full-width accordion was the wrong shape for this page: one row
 * stretched to 1280px gives a click target the width of the screen and an
 * answer line far past a readable measure. Two columns use the same width
 * while keeping each row at a sane line length, and halve the vertical run so
 * the section no longer pushes the final CTA a screen and a half down.
 *
 * The columns are independent accordions, so opening a row on the left does
 * not shift the right-hand rows under the reader's cursor. Only the first
 * left-hand row is open on arrival — see the `defaultOpen` note in Accordion.
 *
 * Below lg they stack into one list in reading order, 1 through 10. The row
 * gap matches the spacing inside a column there, so the join between the two
 * halves is invisible rather than reading as two separate lists.
 */
export function Faq() {
  return (
    <section id="faq" className="border-b border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div data-reveal="up" className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            Knowledge Base
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Clear answers regarding HRMS integration, biometric hardware, and growth services.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-3 lg:grid-cols-2 lg:gap-8">
          <div data-reveal="up">
            <Accordion items={leftColumn.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
          <div data-reveal="up">
            <Accordion
              items={rightColumn.map((f) => ({ question: f.question, answer: f.answer }))}
              defaultOpen={null}
            />
          </div>
        </div>

        <p data-reveal="up" className="mt-12 text-center text-sm text-slate-600">
          Something not covered here?{" "}
          <Link href="/contact" className="link-underline tap py-1.5 font-bold text-brand-800">
            Ask us directly <FaArrowRight className="inline text-[10px]" />
          </Link>
        </p>
      </div>
    </section>
  );
}
