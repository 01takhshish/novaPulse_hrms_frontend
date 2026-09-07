import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/faqs";

export function Faq() {
  return (
    <section id="faq" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16" data-reveal="up">
          <span className="text-xs font-bold tracking-widest text-brand-800 uppercase">
            Knowledge Base
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-3 text-sm">
            Clear answers regarding HRMS integration, biometric hardware, and growth services.
          </p>
        </div>

        <div data-reveal="up">
          <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>

        <div data-reveal="up" className="mt-10 text-center">
          <p className="text-sm text-slate-600">
            Something not covered here?{" "}
            <Link href="/contact" className="link-underline inline-block py-1.5 font-bold text-brand-800">
              Ask us directly <FaArrowRight className="inline text-[10px]" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
