"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

/** Appears once the page is scrolled a screen or so; long pages need it. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Back to top"
      // Stacked above the WhatsApp button rather than under it. The offset is
      // measured from the same safe-area baseline the WhatsApp button uses, so
      // the pair keeps its spacing on a notched phone instead of drifting apart.
      className={`fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-all duration-300 hover:bg-slate-50 hover:text-brand-800 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <FaArrowUp />
    </button>
  );
}
