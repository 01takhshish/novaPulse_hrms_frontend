import Link from "next/link";
import Image from "next/image";
import { FaBuilding, FaEnvelope, FaInstagram, FaLinkedinIn, FaLocationDot, FaPhone, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { site } from "@/lib/site";

const solutionLinks = [
  { href: "/services/hrms-payroll", label: "HRMS & Payroll" },
  { href: "/services/biometric-attendance", label: "Biometric Attendance" },
  { href: "/services/workplace-security", label: "CCTV & Security" },
  { href: "/services/corporate-hiring", label: "Corporate Hiring" },
  { href: "/services/b2b-lead-generation", label: "B2B Lead Generation" },
  { href: "/services", label: "All services" },
];

const industryLinks = [
  { href: "/industries/manufacturing", label: "Manufacturing" },
  { href: "/industries/healthcare", label: "Healthcare" },
  { href: "/industries/retail-distribution", label: "Retail & Distribution" },
  { href: "/industries/it-and-bpo", label: "IT & BPO" },
  { href: "/industries/education", label: "Schools & Institutes" },
  { href: "/industries", label: "All industries" },
];

const companyLinks = [
  { href: "/about", label: "About Nova Pulse" },
  { href: "/clients", label: "Clients & Partners" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/#faq", label: "FAQs" },
];

const socials = [
  { href: site.whatsapp, label: "WhatsApp", Icon: FaWhatsapp, hover: "hover:bg-emerald-600" },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: FaLinkedinIn, hover: "hover:bg-blue-600" },
  { href: site.socials.instagram, label: "Instagram", Icon: FaInstagram, hover: "hover:bg-pink-600" },
  { href: site.socials.youtube, label: "YouTube", Icon: FaYoutube, hover: "hover:bg-red-600" },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="pt-16 pb-12 bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <Image
              src="/images/logo.webp"
              alt="Nova Pulse"
              width={160}
              height={87}
              className="h-14 w-auto object-contain"
            />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Nova Pulse — The Pulse of Every Growing Business. Enterprise HRMS, Biometric
              Attendance, Security Infrastructure, Hiring, and B2B Growth Solutions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socials.map(({ href, label, Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className={`w-8 h-8 rounded-lg bg-slate-800 ${hover} text-white flex items-center justify-center transition-colors`}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-white text-sm mb-4">Solutions</h2>
            <ul className="space-y-1">
              {solutionLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1.5 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-white text-sm mb-4">Industries</h2>
            <ul className="space-y-1">
              {industryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1.5 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-white text-sm mb-4">Company</h2>
            <ul className="space-y-1">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1.5 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-white text-sm mb-4">Contact Info</h2>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <FaPhone className="text-brand-400 mt-0.5 shrink-0" />
                <a href={site.phoneHref} className="inline-block py-1 hover:text-white transition-colors">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="text-brand-400 mt-0.5 shrink-0" />
                <a href={`mailto:${site.email}`} className="inline-block py-1 hover:text-white transition-colors break-all">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaLocationDot className="text-brand-400 mt-0.5 shrink-0" />
                <span>{site.addresses[0]}</span>
              </li>
              <li className="flex items-start gap-2">
                <FaBuilding className="text-brand-400 mt-0.5 shrink-0" />
                <span>{site.addresses[1]}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>
            &copy; {new Date().getFullYear()} Nova Pulse. All rights reserved. | GSTIN: {site.gstin} |
            MSME: {site.msme}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="inline-block py-1.5 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="inline-block py-1.5 hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
