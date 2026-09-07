import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { BackToTop } from "@/components/ui/back-to-top";

/** Chrome for the main marketing site. /products has its own nav and footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WhatsAppFloat />
      <BackToTop />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
