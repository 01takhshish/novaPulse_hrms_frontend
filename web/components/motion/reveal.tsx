import type { ElementType, ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right";

/**
 * Scroll-triggered reveal.
 *
 * Deliberately a *server* component: it only emits data attributes, and one
 * shared IntersectionObserver (<RevealObserver/>, mounted once in the layout)
 * drives every reveal on the page. So sections stay server-rendered and the
 * effect costs no per-element client JavaScript.
 *
 * The hidden state is applied by CSS scoped to `.js`, which an inline script
 * sets before first paint — so without JavaScript nothing is ever hidden, and
 * crawlers always see the content.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  /** Milliseconds. Use to stagger siblings. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      data-reveal={variant}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggers its children by index. Children must be elements; each is wrapped in
 * its own Reveal so the whole group animates in sequence rather than at once.
 */
export function RevealGroup({
  as: Tag = "div",
  variant = "up",
  step = 90,
  initialDelay = 0,
  className,
  itemClassName,
  children,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  /** Milliseconds between consecutive children. */
  step?: number;
  initialDelay?: number;
  className?: string;
  itemClassName?: string;
  children: ReactNode[];
}) {
  return (
    <Tag className={className}>
      {children.map((child, i) => (
        <Reveal
          key={i}
          variant={variant}
          delay={initialDelay + i * step}
          className={itemClassName}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
