import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FaDoorOpen,
  FaEnvelope,
  FaFingerprint,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaUsersGear,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Workforce & Access Management Solutions",
  description:
    "NovaPulse business store: biometric attendance, access control hardware, and integrated HRMS software for modern enterprises.",
  alternates: { canonical: "/products" },
};

const solutions = [
  {
    Icon: FaFingerprint,
    title: "Biometric Attendance",
    blurb:
      "High-accuracy fingerprint and facial recognition systems that sync attendance logs directly to your payroll processing suite.",
  },
  {
    Icon: FaDoorOpen,
    title: "Access Control",
    blurb:
      "Multi-door access controllers, electromagnetic locks, and card terminals to secure office perimeters effortlessly.",
  },
  {
    Icon: FaUsersGear,
    title: "Integrated HRMS Software",
    blurb:
      "Centralize employee profiles, leave tracking, shift rosters, and real-time biometric reporting under a single platform.",
  },
];

const socials = [
  { href: site.whatsapp, label: "WhatsApp", Icon: FaWhatsapp },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  { href: site.socials.instagram, label: "Instagram", Icon: FaInstagram },
  { href: site.socials.youtube, label: "YouTube", Icon: FaYoutube },
];

export default function Products() {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-[#090d16] px-6 md:px-8 py-4 flex justify-between items-center border-b border-[#1e1b4b] shadow-lg sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.webp"
            alt="NovaPulse Logo"
            width={140}
            height={76}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>
        <ul className="flex list-none gap-6">
          <li>
            <Link
              href="/"
              className="text-slate-300 hover:text-white text-base font-medium pb-1.5 border-b-2 border-transparent hover:border-white transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="text-white text-base font-medium pb-1.5 border-b-2 border-white"
            >
              Business Store
            </Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-900 to-slate-900 text-white text-center px-5 py-20 md:py-25 border-b border-blue-900">
        <h1 className="text-4xl md:text-5xl mb-5 font-bold tracking-tight">
          Smart Human Capital &amp; Hardware Solutions
        </h1>
        <p className="text-blue-200 text-base md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          Streamline workforce management with seamless biometric tracking, access control, and
          integrated HRMS software designed for modern enterprises.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#solutions"
            className="bg-brand-700 hover:bg-brand-800 text-white px-7 py-3.5 rounded-lg text-base font-semibold transition-colors"
          >
            Explore Store
          </a>
          <Link
            href="/#workforce-hrms"
            className="border border-blue-200 text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* SOLUTIONS */}
      <main id="main" className="max-w-[1200px] mx-auto px-5 my-12 flex-1 w-full">
        <div id="solutions">
        <h2 className="text-2xl md:text-3xl mt-10 mb-6 text-slate-100 border-l-4 border-white pl-4 tracking-tight">
          Core Enterprise Solutions
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[30px] mb-12">
          {solutions.map(({ Icon, title, blurb }) => (
            <div
              key={title}
              className="bg-white border border-brand-200 rounded-xl px-6 py-8 flex flex-col justify-between shadow-lg shadow-brand-500/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/20 hover:border-brand-400 transition-all"
            >
              <div>
                <Icon className="text-4xl text-brand-700 mb-5" />
                <h3 className="text-xl text-[#1e1b4b] mb-3 font-bold">{title}</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">{blurb}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </main>

      {/* CONTACT & SOCIAL */}
      <section className="bg-gray-900 px-5 py-14 border-t border-blue-900 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 text-left">
          <div className="flex flex-col gap-5">
            <h2 className="text-xl text-white font-bold mb-1">Contact Us</h2>
            <div className="flex items-center gap-4 text-blue-200 text-base">
              <FaLocationDot className="text-white w-5 text-center" />
              <span>{site.addresses[0]}</span>
            </div>
            <div className="flex items-center gap-4 text-blue-200 text-base">
              <FaPhone className="text-white w-5 text-center" />
              <a href={site.phoneHref} className="hover:text-white transition-colors">
                {site.phone}
              </a>
            </div>
            <div className="flex items-center gap-4 text-blue-200 text-base">
              <FaEnvelope className="text-white w-5 text-center" />
              <a href={`mailto:${site.email}`} className="hover:text-white transition-colors break-all">
                {site.email}
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-xl text-white font-bold mb-1">Follow Us</h2>
            <p className="text-blue-200 mb-2.5">
              Stay updated with our latest products and offers.
            </p>
            <div className="flex gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="text-blue-200 text-2xl hover:text-white hover:scale-110 transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#090d16] text-slate-400 text-center px-5 py-6 text-[15px] border-t border-[#1e1b4b]">
        <p>&copy; {new Date().getFullYear()} NovaPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
