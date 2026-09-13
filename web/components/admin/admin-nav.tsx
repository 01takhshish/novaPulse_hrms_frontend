"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/services", label: "Services" },
];

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" aria-label="Admin sections">
      {LINKS.filter((link) => isAdmin || link.href === "/admin").map((link) => {
        // "/admin" is the leads index, so it must match exactly — otherwise it
        // would light up on every page beneath it, including /admin/blog.
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
