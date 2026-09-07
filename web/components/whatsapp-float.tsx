import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <a
        href={site.whatsappWithMessage}
        target="_blank"
        rel="noopener"
        aria-label="Chat with an Expert on WhatsApp"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 text-xs md:text-sm"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <FaWhatsapp className="w-4 h-4" />
        <span>Talk to an Expert</span>
      </a>
    </div>
  );
}
