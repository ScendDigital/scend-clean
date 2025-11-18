"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const mainLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Scend Publishing", href: "/publishing" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

const toolLinks: NavItem[] = [
  { label: "Loan Tool", href: "/loan" },
  { label: "Tax Tool", href: "/tax" },
  { label: "UIF Tool", href: "/uif" },
];

export default function NavBar() {
  const pathname = usePathname() ?? "";
  const [toolsOpen, setToolsOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const base =
    "rounded-full px-5 py-2 text-sm font-semibold border transition-colors whitespace-nowrap";
  const active = "bg-pink-600 text-white border-pink-600 shadow-sm";
  const idle =
    "bg-white text-gray-900 border-gray-200 hover:bg-pink-50 hover:text-pink-700";

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo + brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/scend-logo.png"
            alt="Scend"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full object-contain"
          />
          <span className="text-2xl font-extrabold tracking-tight text-pink-600">
            Scend
          </span>
        </Link>

        {/* Full nav – always visible */}
        <div className="flex items-center gap-3">
          {/* Home + main sections */}
          {mainLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${base} ${
                isActive(item.href) ? active : idle
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Scend Tools dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((o) => !o)}
              onBlur={() => {
                setTimeout(() => setToolsOpen(false), 120);
              }}
              className={`${base} ${
                toolLinks.some((t) => isActive(t.href)) ? active : idle
              } flex items-center gap-1`}
            >
              <span>Scend Tools</span>
              <span className="text-xs">▾</span>
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 min-w-[190px] rounded-2xl border border-gray-200 bg-white py-2 shadow-lg">
                {toolLinks.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`block px-4 py-2 text-sm ${
                      isActive(tool.href)
                        ? "bg-pink-50 text-pink-700 font-semibold"
                        : "text-gray-800 hover:bg-pink-50 hover:text-pink-700"
                    }`}
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
