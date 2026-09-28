/**
 * The site's button vocabulary — one primary and one secondary shape, each with
 * a variant for dark sections, plus a compact size for headers and toolbars.
 *
 * The UI/UX audit (§11) found four primary and six secondary shapes across the
 * marketing pages, including a CTA on a different brand shade from every other.
 * Import from here instead of retyping a class list; a new shape is a change to
 * this file, which makes it a decision rather than a drift.
 *
 * Geometry is shared so the two roles differ only in colour: same radius, same
 * padding, same weight. `min-h-11` guarantees the 44px tap target the audit asks
 * for even where padding is trimmed at small sizes.
 *
 * Layout stays at the call site — add `w-full sm:w-auto` where the CTA should
 * stretch on mobile. These strings are static so Tailwind still sees every class.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all";

/** Section-scale CTAs: hero, pricing, final call to action. */
const lg = "px-8 py-4 text-base min-h-11";
/** Compact CTAs: site header, cards, toolbars. */
const sm = "px-5 py-2.5 text-sm min-h-11";

/** The one primary action on a light surface. */
export const btnPrimary =
  `${base} ${lg} bg-brand-800 text-white shadow-lg shadow-brand-900/20 hover:bg-brand-900 hover:scale-102`;

/** The one secondary action on a light surface. */
export const btnSecondary =
  `${base} ${lg} border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-100`;

/** Primary on a dark section — brand-800 sits too close to slate-900 to read. */
export const btnPrimaryOnDark =
  `${base} ${lg} bg-brand-600 text-white shadow-lg hover:bg-brand-500`;

/** Secondary on a dark section. */
export const btnSecondaryOnDark =
  `${base} ${lg} border border-slate-700 bg-slate-800 text-white hover:bg-slate-700`;

/** Compact primary — same colours, less padding. */
export const btnPrimarySm =
  `${base} ${sm} bg-brand-800 text-white shadow-md hover:bg-brand-900`;

/** Compact secondary. */
export const btnSecondarySm =
  `${base} ${sm} border border-slate-300 bg-white text-slate-800 hover:bg-slate-100`;

/**
 * Primary on a brand-dark (purple) section, where the surface already carries
 * the brand colour and a purple button would disappear into it.
 */
export const btnPrimaryOnBrand =
  `${base} ${lg} bg-white text-brand-900 shadow-lg hover:scale-102`;

/** Secondary on a brand-dark section. */
export const btnSecondaryOnBrand =
  `${base} ${lg} border border-white/25 text-white hover:bg-white/10`;
