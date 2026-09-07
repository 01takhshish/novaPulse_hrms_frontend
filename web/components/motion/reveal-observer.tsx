"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every [data-reveal] on the page, mounted once.
 *
 * Elements are unobserved as soon as they reveal, so this stays O(unrevealed).
 * A MutationObserver picks up nodes added later (MDX content, client renders),
 * and the pathname dependency re-scans after a route change.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Tells the inline failsafe in the layout that JS is alive and it can stand down.
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Trigger slightly before the element reaches the fold so the motion has
      // finished by the time it is properly in view.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    /**
     * The observer's -10% bottom margin means an element sitting just inside
     * the fold on load would stay invisible until the first scroll. Anything
     * already within the real viewport is revealed straight away — it still
     * animates, because the CSS transition runs when the attribute lands.
     */
    const revealAlreadyVisible = () => {
      for (const el of document.querySelectorAll("[data-reveal]:not([data-revealed])")) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
      }
    };

    const observeAll = () => {
      revealAlreadyVisible();
      document
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((el) => observer.observe(el));
    };

    observeAll();

    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
