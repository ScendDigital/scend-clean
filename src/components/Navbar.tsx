"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";

export default function NavBar() {
  const pathname = usePathname();

  const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/publishing", label: "Publishing" },
    { href: "/contact", label: "Contact Us" },
  ];

  const toolLinks = [
    { href: "/loan", label: "Loan Tool" },
    { href: "/tax", label: "Tax Tool" },
    { href: "/uif", label: "UIF Tool" },
    { href: "/compare", label: "Price Compare Tool" }, // ✅ added/renamed
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const tabBase =
    "glow rounded-2xl px-4 py-2 text-[15px] font-medium transition-all";
  const tabIdle =
    "text-gray-800 hover:text-pink-600 hover:bg-pink-50";
  const tabActive =
    "bg-pink-600 text-white shadow-sm";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo + Title (glow on hover) */}
        <Link href="/" className="glow flex items-center gap-3 rounded-2xl px-2 py-1">
          <Image
            src="/scend-logo.png"    // from /public
            alt="Scend Logo"
            width={36}
            height={36}
            className="rounded-full border border-pink-100 shadow-sm"
            priority
          />
          <span className="text-lg font-semibold text-gray-900">
            Welcome to Scend
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {/* Tools with hover dropdown */}
          <div className="relative group">
            <Link
              href="/tools"
              className={`${tabBase} ${isActive("/tools") ? tabActive : tabIdle}`}
            >
              Tools
            </Link>

            <div
              className="
                invisible opacity-0 group-hover:visible group-hover:opacity-100
                group-focus-within:visible group-focus-within:opacity-100
                transition-opacity duration-150
                absolute left-0 mt-2 w-56
                rounded-2xl border border-gray-200 bg-white shadow-lg
                p-2
              "
            >
              {toolLinks.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="glow block rounded-xl px-3 py-2 text-[14px] text-gray-800 hover:bg-gray-50"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Other tabs */}
          {primaryLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${tabBase} ${isActive(href) ? tabActive : tabIdle}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
