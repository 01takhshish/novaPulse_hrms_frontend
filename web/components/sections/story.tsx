import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";

/**
 * The "what this company actually is" section — a photograph on one side, the
 * explanation on the other.
 *
 * Everything a visitor reads here is editable in the block below without
 * touching the markup: change `story.paragraphs` for the prose and `story.points`
 * for the bullets, add or remove entries freely. That is deliberate — this is
 * static content, not a CMS entry, so the file is the edit surface.
 *
 * The copy is the positioning already argued on /about, condensed to the length
 * someone will actually read on a homepage. Keep it to claims that can be
 * pointed at elsewhere on the site; this is not the place to invent numbers.
 */
const story = {
  eyebrow: "What Nova Pulse is",
  heading: "One partner for the systems that run your workforce",
  paragraphs: [
    "Most growing businesses buy attendance hardware from one supplier, payroll software from another, cameras from a third and recruitment from a fourth. Each works on its own. None of them talk to each other.",
    "So attendance gets exported to a spreadsheet, the employee who left last month still has door access, and nobody can answer a simple headcount question without phoning four people.",
  ],
  points: [
    "Attendance, payroll, access control and CCTV on one employee record",
    "Installed and configured by our own engineers — not shipped in a box",
    "Hiring and B2B pipeline handled by the same team you already know",
    "Offices in Delhi NCR and Uttar Pradesh, so a site visit is a short drive",
  ],
  image: {
    src: "/images/services.webp",
    alt: "A Nova Pulse consultant meeting a client at the company office",
    width: 1400,
    height: 933,
  },
  link: { href: "/about", label: "How we work" },
} as const;

export function Story() {
  return (
    <section id="about-nova-pulse" className="border-b border-slate-200 bg-white py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Photograph first in source order, so on mobile it sits directly under
            the dark trust band and breaks up the stack. Putting the text first
            instead left the image stranded below the closing link. */}
        <div data-reveal="left">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            <Image
              src={story.image.src}
              alt={story.image.alt}
              width={story.image.width}
              height={story.image.height}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="h-auto w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        <div data-reveal="right">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            {story.eyebrow}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            {story.heading}
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-8 space-y-3.5">
            {story.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                <FaCircleCheck className="mt-0.5 shrink-0 text-base text-brand-700" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          <Link
            href={story.link.href}
            className="link-underline tap mt-8 gap-2 py-1.5 text-sm font-bold text-brand-800"
          >
            {story.link.label} <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
