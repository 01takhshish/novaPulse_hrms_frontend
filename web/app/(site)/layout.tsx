import { AttributionCapture } from "@/components/attribution-capture";
import { DemoModalProvider } from "@/components/demo-modal";
import { SiteHeader } from "@/components/site-header";
import { getServices, getSolutionsMenu } from "@/lib/services";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { BackToTop } from "@/components/ui/back-to-top";

/** Chrome for the main marketing site. /products has its own nav and footer. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // The Solutions dropdown and the mobile menu are both built from this.
  const [menu, services] = await Promise.all([getSolutionsMenu(), getServices()]);
  const serviceOptions = ["General Inquiry", ...services.map((service) => service.name)
    .filter((name) => name !== "General Inquiry")];

  return (
    <DemoModalProvider serviceOptions={serviceOptions}>
      <AttributionCapture />
      <WhatsAppFloat />
      <BackToTop />
      <SiteHeader menu={menu} />
      <main id="main">{children}</main>
      <SiteFooter />
    </DemoModalProvider>
  );
}

export const revalidate = 300;
