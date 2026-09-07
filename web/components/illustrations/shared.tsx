import type { ReactNode } from "react";

/**
 * Original SVG illustrations, drawn in the brand palette.
 *
 * Not stock photography or scraped images: these are owned outright, weigh a
 * few KB, stay sharp at any size, and can be animated. Motion lives in
 * globals.css so `prefers-reduced-motion` disables it centrally.
 */
export function Figure({
  label,
  /**
   * Namespaces this scene's gradient ids. SVG ids are document-global, so
   * without it two scenes on one page would both define `np-violet` and the
   * second would silently render with the first's colours.
   */
  ns,
  className,
  viewBox = "0 0 320 240",
  children,
}: {
  /** Empty string marks it decorative and hides it from screen readers. */
  label: string;
  ns: string;
  className?: string;
  viewBox?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? "img" : "presentation"}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      {label && <title>{label}</title>}
      <defs>
        <linearGradient id={`${ns}-violet`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <linearGradient id={`${ns}-deep`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b0764" />
          <stop offset="100%" stopColor="#200338" />
        </linearGradient>
        <linearGradient id={`${ns}-soft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
}

/** Rounded card body used as the base of several scenes. */
export function Panel(props: React.SVGProps<SVGRectElement>) {
  return <rect rx="10" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" {...props} />;
}

/** Small standing figure, reused where a scene needs people. */
export function Person({
  x,
  y,
  scale = 1,
  fill = "#7e22ce",
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="5" fill={fill} />
      <path d="M-7 18a7 7 0 0 1 14 0z" fill={fill} />
    </g>
  );
}
