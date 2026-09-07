"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up once, when scrolled into view. Falls straight to the final value
 * for anyone who prefers reduced motion, and renders the final value on the
 * server so the number is always in the HTML.
 */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  durationMs = 1400,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStarted(true);

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // easeOutExpo — fast out of the gate, settles gently on the number.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(to * eased);
          if (t < 1) requestAnimationFrame(tick);
          else setValue(to);
        };
        setValue(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, durationMs, started]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
