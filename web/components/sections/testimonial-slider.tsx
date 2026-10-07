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
 * Two quotes a page on a desktop, one on a phone, advancing on their own.
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

  /**
   * Two cards share the view from `md` up, so the number of pages is not the
   * number of quotes. Measure it off the track rather than guessing from a
   * breakpoint, and remeasure on resize — otherwise a rotated phone leaves the
   * dots offering pages that no longer exist.
   */
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const next = Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
      setPages(next);
      setIndex((current) => Math.min(current, next - 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [testimonials.length]);

  const sliding = pages > 1;

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
    const timer = setTimeout(() => goTo((index + 1) % pages), 6000);
    return () => clearTimeout(timer);
  }, [index, pages, sliding, interacting, tabHidden, reduced, goTo]);

  /* The scroll position is the source of truth, not the button that caused it —
     a swipe and an arrow press both land here, so the dots can never disagree
     with what is on screen. */
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    /* `relative` and the clip are load-bearing together, and the reason is not
       the cards — the track already clips those. It is the `sr-only` span on
       each card: Tailwind makes that `position: absolute`, so without a
       positioned ancestor here its containing block was somewhere up near the
       body, and an absolutely-positioned box is not clipped by an unpositioned
       ancestor's overflow. The spans for the off-screen cards therefore escaped
       the track and dragged the whole document's scrollable width out to the
       right, letting the page scroll sideways. `relative` pulls their
       containing block back to this element and the clip then contains them.
       `clip` rather than `hidden` so the vertical reveal transform still moves
       freely, and the margin leaves the cards' shadows room to render. */
    <div
      className="relative overflow-x-clip [overflow-clip-margin:12px]"
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
            className="w-full shrink-0 snap-start px-1 md:w-1/2 md:px-3"
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
            onClick={() => goTo((index - 1 + pages) % pages)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors hover:border-brand-700 hover:text-brand-800"
          >
            <FaChevronLeft className="text-xs" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pages }).map((_, dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => goTo(dot)}
                aria-label={`Go to slide ${dot + 1} of ${pages}`}
                aria-current={dot === index}
                className={`h-2 rounded-full transition-all ${
                  dot === index ? "w-6 bg-brand-800" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo((index + 1) % pages)}
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
