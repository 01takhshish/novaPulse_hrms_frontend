"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa6";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  service: string;
};

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
 * One quote at a time, advancing on its own.
 *
 * The track is a native scroll-snap container rather than a transform, so a
 * phone swipes it with the browser's own momentum and the arrows are only a
 * convenience on top. That also means every quote stays in the DOM and in the
 * page source — a crawler reads all of them, not just the visible slide.
 *
 * Autoplay stops whenever it would fight the reader: pointer over the card,
 * keyboard focus inside it, the tab in the background, or the OS asking for
 * reduced motion. With a single quote there is nothing to advance to, so the
 * controls and the timer never mount at all.
 */
export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reduced, setReduced] = useState(false);

  const count = testimonials.length;
  const sliding = count > 1;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({
        left: next * track.clientWidth,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  /* Timer keyed on `index`, so each advance restarts the clock rather than
     firing on a fixed drum beat the reader cannot influence. */
  useEffect(() => {
    if (!sliding || interacting || tabHidden || reduced) return;
    const timer = setTimeout(() => goTo((index + 1) % count), 6000);
    return () => clearTimeout(timer);
  }, [index, count, sliding, interacting, tabHidden, reduced, goTo]);

  /* The scroll position is the source of truth, not the button that caused it —
     a swipe and an arrow press both land here, so the dots can never disagree
     with what is on screen. */
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        {...(sliding
          ? { role: "group", "aria-roledescription": "carousel", "aria-label": "Client testimonials" }
          : {})}
        className="flex snap-x snap-mandatory overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="w-full shrink-0 snap-center px-1"
            {...(sliding ? { "aria-roledescription": "slide" } : {})}
          >
            <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
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
            </div>
          </figure>
        ))}
      </div>

      {sliding && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo((index - 1 + count) % count)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors hover:border-brand-700 hover:text-brand-800"
          >
            <FaChevronLeft className="text-xs" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((testimonial, dot) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => goTo(dot)}
                aria-label={`Go to testimonial ${dot + 1} of ${count}`}
                aria-current={dot === index}
                className={`h-2 rounded-full transition-all ${
                  dot === index ? "w-6 bg-brand-800" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo((index + 1) % count)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors hover:border-brand-700 hover:text-brand-800"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
}
