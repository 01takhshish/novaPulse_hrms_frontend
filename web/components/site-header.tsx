"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaChevronDown, FaPhone, FaXmark } from "react-icons/fa6";
import { Icon } from "@/components/icon";
import { industriesMenu, mobileNav, site, solutionsMenu } from "@/lib/site";
import { useDemoModal } from "./demo-modal";

type MenuItem = { readonly href: string; readonly icon: string; readonly title: string; readonly blurb: string };

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openDemo = useDemoModal();

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <Image src="/images/logo.webp" alt="Nova Pulse Logo" width={180} height={98} priority
            className="h-12 md:h-16 w-auto object-contain" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <Dropdown label="Solutions" items={solutionsMenu} allHref="/services" allLabel="View all services" />
          <Dropdown label="Industries" items={industriesMenu} allHref="/industries" allLabel="View all industries" />
          <Link href="/blog" className="py-2 hover:text-brand-800 transition-colors">Blog</Link>
          <Link href="/about" className="py-2 hover:text-brand-800 transition-colors">About</Link>
          <Link href="/contact" className="py-2 hover:text-brand-800 transition-colors">Contact</Link>
        </nav>

        <div className="hidden xl:flex items-center gap-4">
          <a href={site.phoneHref} className="py-2 text-sm font-bold text-slate-700 hover:text-brand-800 inline-flex items-center whitespace-nowrap">
            <FaPhone className="mr-1.5 text-brand-700" /> {site.phone}
          </a>
          <button type="button" onClick={() => openDemo("General Inquiry", "header")}
            className="bg-brand-800 hover:bg-brand-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-102 whitespace-nowrap">
            Book a Free Demo
          </button>
        </div>

        {/* CTA still reachable between lg and xl, where the phone number does not fit */}
        <button type="button" onClick={() => openDemo("General Inquiry", "header")}
          className="hidden lg:block xl:hidden bg-brand-800 hover:bg-brand-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all whitespace-nowrap">
          Book a Demo
        </button>

        <button type="button" onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu" aria-expanded={mobileOpen} aria-controls="mobileNav"
          className="lg:hidden text-slate-700 text-2xl focus:outline-none">
          {mobileOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobileNav"
          className="lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border-b border-slate-200 px-6 py-5 space-y-1">
          {mobileNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="block py-2.5 font-semibold text-slate-700 hover:text-brand-800">
              {item.label}
            </Link>
          ))}
          <div className="pt-3">
            <a href={site.phoneHref} className="mb-3 block py-2 text-sm font-bold text-brand-800">
              <FaPhone className="mr-1.5 inline" /> {site.phone}
            </a>
            <button type="button"
              onClick={() => { setMobileOpen(false); openDemo("General Inquiry", "mobile-nav"); }}
              className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-3 rounded-xl shadow-md">
              Book a Free Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/** Hover-opened mega menu. Pure CSS group-hover, so it works before hydration. */
function Dropdown({
  label, items, allHref, allLabel,
}: {
  label: string;
  items: readonly MenuItem[];
  allHref: string;
  allLabel: string;
}) {
  return (
    <div className="relative group py-4">
      <button className="py-2 hover:text-brand-800 transition-colors flex items-center gap-1.5">
        {label}
        <FaChevronDown className="text-[10px] transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-brand-50 hover:text-brand-800 rounded-xl transition-colors">
            <Icon name={item.icon} className="text-brand-700 w-5 shrink-0" />
            <div>
              <div className="font-bold text-sm text-slate-900">{item.title}</div>
              <div className="text-[11px] text-slate-500 font-normal">{item.blurb}</div>
            </div>
          </Link>
        ))}
        <Link href={allHref}
          className="mt-1 block rounded-xl border-t border-slate-100 px-4 py-3 text-xs font-bold text-brand-800 hover:bg-brand-50">
          {allLabel} →
        </Link>
      </div>
    </div>
  );
}
