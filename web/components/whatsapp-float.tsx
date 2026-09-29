import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/lib/site";

/**
 * Floating WhatsApp entry point.
 *
 * Icon-only below md. The labelled pill is ~180px wide and, being fixed, sat
 * permanently over a strip of body copy on a 375px screen — on the homepage it
 * covered part of a bullet list. A 56px circle keeps the affordance without
 * eating the content. The accessible name is on aria-label either way, so
 * dropping the visible label costs nothing to a screen reader.
 *
 * The bottom offset adds env(safe-area-inset-bottom) so the button clears the
 * iPhone home indicator rather than sitting underneath it.
 */
export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 flex flex-col items-end gap-3">
      <a
        href={site.whatsappWithMessage}
        target="_blank"
        rel="noopener"
        aria-label="Chat with an Expert on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-emerald-600 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-emerald-500 md:h-auto md:min-h-11 md:w-auto md:gap-2.5 md:px-4 md:py-3 md:text-sm md:font-bold"
      >
        {/* Decorative "we're online" pulse. Hidden on the circle, where the
            glyph alone reads faster than a glyph plus a dot. */}
        <span className="relative hidden h-2.5 w-2.5 md:flex">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        <FaWhatsapp className="h-6 w-6 md:h-4 md:w-4" />
        <span className="hidden md:inline">Talk to an Expert</span>
      </a>
    </div>
  );
}
