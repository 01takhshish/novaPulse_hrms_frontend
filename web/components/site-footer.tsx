import { getServices } from "@/lib/services";
import Link from "next/link";
import Image from "next/image";
import {
  FaClock,
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { locations, workingHours } from "@/content/company";
import { site } from "@/lib/site";

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
  { href: "/pricing", label: "HRMS Pricing" },
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

export async function SiteFooter() {
  const solutionLinks = [
    ...(await getServices()).map((service) => ({
      href: `/services/${service.slug}`,
      label: service.name,
    })),
    { href: "/services", label: "All services" },
  ];

  return (
    <footer
      id="contact"
      className="border-t border-slate-800 bg-slate-950 pb-12 pt-16 text-xs text-slate-400"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* REACH-US BAND
            The offices used to share a single 1/6-width column with the phone
            number and the email, which wrapped every address onto three lines.
            They get a full-width band of their own instead — a visitor looking
            for "where are they, and when are they open" finds it in one place.

            Phone, email and hours are company-wide, not per office, so they are
            stated once. Repeating them under each city would imply direct lines
            and local opening times that don't exist. */}
        <div className="grid grid-cols-1 gap-8 border-b border-slate-800 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <div key={location.city}>
              <h2 className="text-sm font-bold text-white">{location.city}</h2>
              <p className="mt-3 flex items-start gap-2 leading-relaxed">
                <FaLocationDot className="mt-0.5 shrink-0 text-brand-400" />
                <span>{location.address}</span>
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{location.note}</p>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-bold text-white">Talk to us</h2>
            <ul className="mt-3 space-y-0.5">
              <li className="flex items-center gap-2">
                <FaPhone className="shrink-0 text-brand-400" />
                <a href={site.phoneHref} className="tap py-1 transition-colors hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="shrink-0 text-brand-400" />
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="tap py-1 transition-colors hover:text-white"
                >
                  Message on WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="shrink-0 text-brand-400" />
                <a
                  href={`mailto:${site.email}`}
                  className="tap break-all py-1 transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <FaClock className="shrink-0 text-brand-400" /> Working hours
            </h2>
            <dl className="mt-3 space-y-2">
              {workingHours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-3">
                  <dt>{entry.days}</dt>
                  <dd className="font-semibold text-slate-200">{entry.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* LINKS BAND */}
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Image
              src="/images/logo.webp"
              alt="Nova Pulse"
              width={160}
              height={87}
              className="h-14 w-auto object-contain"
            />
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
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
                  className={`h-11 w-11 rounded-xl bg-slate-800 ${hover} flex items-center justify-center text-white transition-colors`}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Solutions</h2>
            <ul className="space-y-1">
              {solutionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap py-1.5 transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Industries</h2>
            <ul className="space-y-1">
              {industryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap py-1.5 transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Company</h2>
            <ul className="space-y-1">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap py-1.5 transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-[11px] text-slate-500 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Nova Pulse. All rights reserved. | GSTIN: {site.gstin}{" "}
            | MSME: {site.msme}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="tap py-1.5 transition-colors hover:text-slate-300"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms-conditions"
              className="tap py-1.5 transition-colors hover:text-slate-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
