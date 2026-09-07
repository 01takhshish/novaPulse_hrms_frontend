import type { Metadata, Viewport } from "next";
import { DemoModalProvider } from "@/components/demo-modal";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { isProduction, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "HRMS, Payroll & Biometric Attendance Solutions | Nova Pulse",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "HRMS software",
    "biometric attendance machine",
    "payroll system",
    "CCTV security",
    "corporate hiring",
    "B2B lead generation",
    "Delhi NCR",
    "Uttar Pradesh",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description:
      "Hire. Secure. Grow. Integrated HRMS, Biometric Attendance, Security, Recruitment, and B2B Growth Solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description:
      "Hire. Secure. Grow. Integrated HRMS, Biometric Attendance, Security, Recruitment, and B2B Growth Solutions.",
  },
  robots: isProduction
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#6b21a8",
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/logo-og.png`,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Adarsh Nagar",
    addressLocality: "Delhi",
    postalCode: "110033",
    addressCountry: "IN",
  },
  sameAs: [site.socials.linkedin, site.socials.instagram, site.socials.youtube],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds `js` to <html>
    // before React hydrates, so the class list legitimately differs from the
    // server output. It is scoped to this element's own attributes.
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased selection:bg-brand-800 selection:text-white">
        <script
          dangerouslySetInnerHTML={{
            // Runs before first paint so reveal styles apply without a flash.
            // The timeout is a failsafe: if hydration never happens (a chunk
            // fails, an extension breaks React), every reveal is forced visible
            // rather than leaving the page blank.
            __html:
              "document.documentElement.classList.add('js');" +
              "setTimeout(function(){if(window.__revealReady)return;" +
              "document.querySelectorAll('[data-reveal]').forEach(function(e){e.setAttribute('data-revealed','')})},3000)",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-brand-800 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <RevealObserver />
        <DemoModalProvider>{children}</DemoModalProvider>
      </body>
    </html>
  );
}
