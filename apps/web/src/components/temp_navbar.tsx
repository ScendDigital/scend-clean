"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hydration guard
  useEffect(() => setMounted(true), []);

  // Sticky scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  const activeTab = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const tabStyle = (isActive: boolean) =>
    `font-sans px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? "text-pink-700" : "text-[#374151]"} hover:text-pink-600 hover:bg-white/70 hover:shadow-[0_0_12px_rgba(236,72,153,0.45)]`;

  const dropdownItem = `font-sans block px-5 py-3 text-[#374151] text-sm font-semibold transition-all duration-300 hover:text-pink-600 hover:bg-white/70 hover:shadow-[0_0_12px_rgba(236,72,153,0.45)]`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur border-pink-100 shadow-[0_4px_18px_rgba(236,72,153,0.18)]"
          : "bg-gradient-to-r from-white/95 via-pink-50/30 to-white/95 border-pink-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">

        {/* LEFT — LOGO WITH GLOW */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-pink-400/30 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-300" />

            <Image
              src="/scend-logo.png"
              alt="Scend"
              width={42}
              height={42}
              className="relative rounded-xl border border-pink-200 shadow transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]"
            />
          </div>

          <div className="flex flex-col leading-tight transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
            <span className="font-sans text-xl font-extrabold text-gray-900 tracking-tight">
              Scend
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-pink-600">
              Digital • Wellness • Publishing
            </span>
          </div>
        </Link>

        {/* RIGHT — NAVIGATION */}
        <div className="flex items-center gap-1">

          <Link href="/" className={tabStyle(activeTab("/"))}>Home</Link>

          <span className="text-gray-400 px-2">|</span>

          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenTools(true)}
            onMouseLeave={() => setOpenTools(false)}
          >
            <button
              className={tabStyle(
                pathname?.startsWith("/loan") ||
                pathname?.startsWith("/tax") ||
                pathname?.startsWith("/uif") ||
                pathname?.startsWith("/price-compare") ||
                pathname?.startsWith("/publishing")
              )}
            >
              Tools <span className="ml-1 text-xs opacity-70">▾</span>
            </button>

            {openTools && (
              <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl border border-pink-100 rounded-2xl shadow-[0_10px_26px_rgba(236,72,153,0.15)] animate-fadeIn overflow-hidden">
                <Link href="/loan" className={dropdownItem}>Loan Tool</Link>
                <Link href="/tax" className={dropdownItem}>Tax Tool</Link>
                <Link href="/uif" className={dropdownItem}>UIF Tool</Link>
                <Link href="/price-compare" className={dropdownItem}>Price Compare</Link>
                <Link href="/publishing" className={dropdownItem}>Publishing Tool</Link>
              </div>
            )}
          </div>

          <span className="text-gray-400 px-2">|</span>

          <Link href="/about" className={tabStyle(activeTab("/about"))}>About Us</Link>

          <span className="text-gray-400 px-2">|</span>

          <Link href="/contact" className={tabStyle(activeTab("/contact"))}>Contact Us</Link>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.22s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}
