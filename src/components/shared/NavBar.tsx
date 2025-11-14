"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [openDrop, setOpenDrop] = React.useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const base = "rounded-2xl px-4 py-2 text-sm font-semibold border transition-colors";
  const active = "bg-pink-600 text-white border-pink-600";
  const idle = "bg-white text-gray-800 border-gray-200 hover:bg-pink-100 hover:text-pink-700";

  return (
    <nav className="glow w-full border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="glow mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo with 'Scend' only */}
        <Link href="/" className="glow flex items-center gap-2">
          <Image
            src="/scend-logo.png"
            alt="Scend Logo"
            width={38}
            height={38}
            className="glow rounded-lg"
            priority
          />
          <span className="glow font-bold text-pink-700 text-xl md:text-2xl">Scend</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="glow hidden md:flex items-center gap-2">
          {/* Home */}
          <Link href="/" className={`${base} ${isActive("/") ? active : idle}`}>
            Home
          </Link>

          {/* Dropdown: Scend Tools */}
          <div className="glow relative">
            <button
              onClick={() => setOpenDrop((v) => !v)}
              className={`${base} flex items-center gap-1 ${
                pathname.startsWith("/loan") ||
                pathname.startsWith("/tax") ||
                pathname.startsWith("/uif") ||
                pathname.startsWith("/price")
                  ? active
                  : idle
              }`}
              aria-haspopup="menu"
              aria-expanded={openDrop}
            >
              Scend Tools
              <span className={`transition-transform ${openDrop ? "rotate-180 text-pink-500" : "text-gray-500"}`}>?</span>
            </button>
            {openDrop && (
              <div className="glow absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-lg z-50">
                <Link href="/loan" className="glow block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100">Loan Tool</Link>
                <Link href="/tax" className="glow block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100">SARS Tax Tool</Link>
                <Link href="/uif" className="glow block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100">UIF Tool</Link>
                <Link href="/price" className="glow block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100">Price Compare Tool</Link>
              </div>
            )}
          </div>

          {/* Other tabs */}
          <Link href="/publishing" className={`${base} ${isActive("/publishing") ? active : idle}`}>
            Scend Publishing
          </Link>
          <Link href="/contact" className={`${base} ${isActive("/contact") ? active : idle}`}>
            Contact Us
          </Link>
          <Link href="/about" className={`${base} ${isActive("/about") ? active : idle}`}>
            About Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="glow md:hidden inline-flex items-center rounded-xl border border-gray-200 px-3 py-2 text-gray-700"
          aria-label="Toggle menu"
        >
          <span className={`transition-transform ${open ? "rotate-180 text-pink-600" : "text-gray-500"}`}>?</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="glow md:hidden border-t bg-white">
          <div className="glow mx-auto max-w-6xl px-4 py-3 grid gap-2">
            <Link href="/" onClick={() => setOpen(false)} className={`block ${base} ${isActive("/") ? active : idle}`}>Home</Link>

            {/* Scend Tools (mobile) */}
            <div>
              <button
                onClick={() => setOpenDrop((v) => !v)}
                className={`${base} w-full text-left flex items-center justify-between ${
                  pathname.startsWith("/loan") ||
                  pathname.startsWith("/tax") ||
                  pathname.startsWith("/uif") ||
                  pathname.startsWith("/price")
                    ? active
                    : idle
                }`}
                aria-haspopup="menu"
                aria-expanded={openDrop}
              >
                Scend Tools
                <span className={`transition-transform ${openDrop ? "rotate-180 text-pink-500" : "text-gray-500"}`}>?</span>
              </button>
              {openDrop && (
                <div className="glow mt-2 grid gap-1 pl-4">
                  <Link href="/loan" onClick={() => setOpen(false)} className="glow block text-gray-700 text-sm py-1">
                    Loan Tool
                  </Link>
                  <Link href="/tax" onClick={() => setOpen(false)} className="glow block text-gray-700 text-sm py-1">
                    SARS Tax Tool
                  </Link>
                  <Link href="/uif" onClick={() => setOpen(false)} className="glow block text-gray-700 text-sm py-1">
                    UIF Tool
                  </Link>
                  <Link href="/price" onClick={() => setOpen(false)} className="glow block text-gray-700 text-sm py-1">
                    Price Compare Tool
                  </Link>
                </div>
              )}
            </div>

            <Link href="/publishing" onClick={() => setOpen(false)} className={`block ${base} ${isActive("/publishing") ? active : idle}`}>Scend Publishing</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className={`block ${base} ${isActive("/contact") ? active : idle}`}>Contact Us</Link>
            <Link href="/about" onClick={() => setOpen(false)} className={`block ${base} ${isActive("/about") ? active : idle}`}>About Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
}


