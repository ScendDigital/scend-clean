"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);

  const tools = [
    { name: "Loan Tool", href: "/loan" },
    { name: "SARS Tax Calculator Tool", href: "/tax" },
    { name: "UIF Tool", href: "/uif" },
    { name: "Price Compare Tool", href: "/compare" },
  ];

  // === styles that match your pink "Loan Tool" button ===
  const base = "rounded-full px-5 py-2.5 border transition";
  const active = "bg-pink-600 text-white border-pink-600 shadow-sm";
  const inactive = "bg-white text-gray-900 border-gray-300 hover:bg-pink-200";

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const tabClass = (href: string) => (isActive(href) ? `${base} ${active}` : `${base} ${inactive}`);

  const dropItemClass = (href: string) =>
    isActive(href)
      ? "block rounded-full px-4 py-2 bg-pink-100 text-pink-700 font-medium"
      : "block rounded-full px-4 py-2 hover:bg-pink-200";

  const anyToolActive = useMemo(() => tools.some(t => isActive(t.href)), [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img src="/scend-logo.png" alt="Scend Logo" className="h-8 w-8 object-contain" />
          <span className="text-2xl font-bold text-pink-600">Scend</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/" className={tabClass("/")}>Home</Link>

          {/* Scend Tools (button should look active like the pink button when on any tool route) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDrop(v => !v)}
              className={`${base} ${anyToolActive ? active : inactive}`}
              aria-haspopup="menu"
              aria-expanded={openDrop}
            >
              <span className="mr-1.5 font-medium">Scend Tools</span>
              <span className={`inline-block transition-transform ${openDrop ? "rotate-180" : ""}`}>▾</span>
            </button>

            {openDrop && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-2xl border bg-white shadow-lg p-2"
                onMouseLeave={() => setOpenDrop(false)}
              >
                {tools.map(t => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={dropItemClass(t.href)}
                    onClick={() => setOpenDrop(false)}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className={tabClass("/about")}>About Us</Link>
          <Link href="/contact" className={tabClass("/contact")}>Contact Us</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex items-center rounded-full border px-3 py-2"
          aria-label="Toggle menu"
        >
          <span className="text-xl">☰</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t">
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-3">
            <Link href="/" className={tabClass("/")} onClick={() => setOpen(false)}>Home</Link>

            <details className="group">
              <summary className={`${base} ${anyToolActive ? active : inactive} cursor-pointer flex items-center justify-between`}>
                <span className="font-medium">Scend Tools</span>
                <span className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="mt-2 pl-1 space-y-2">
                {tools.map(t => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={dropItemClass(t.href)}
                    onClick={() => setOpen(false)}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </details>

            <Link href="/about" className={tabClass("/about")} onClick={() => setOpen(false)}>About Us</Link>
            <Link href="/contact" className={tabClass("/contact")} onClick={() => setOpen(false)}>Contact Us</Link>
          </div>
        </div>
      )}
    </header>
  );
}
