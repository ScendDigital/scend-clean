"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname() ?? "";
  const [openTools, setOpenTools] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const base =
    "group relative rounded-2xl px-4 py-2 text-sm font-semibold border transition-all duration-300 flex flex-col items-center";
  const idle =
    "bg-white/90 text-gray-800 border-gray-200 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_16px_rgba(236,72,153,0.6)]";
  const active =
    "bg-pink-600 text-white border-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.9)]";

  const navGlow = scrolled
    ? "shadow-[0_10px_30px_rgba(236,72,153,0.25)] border-pink-100/60"
    : "border-pink-50";

  return (
    <nav
      suppressHydrationWarning
      className={`sticky top-0 z-50 bg-gradient-to-r from-white/90 via-pink-50/80 to-white/90 backdrop-blur ${navGlow}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-md bg-pink-400/50 opacity-60" />
              <Image
                src="/scend-logo.png"
                alt="Scend Logo"
                width={40}
                height={40}
                className="relative rounded-2xl border border-pink-200 shadow-sm"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Scend
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-pink-600">
                Digital • Wellness • Publishing
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Home */}
            <Link
              href="/"
              className={`${base} ${isActive("/") ? active : idle}`}
            >
              <span>Home</span>
              <span
                className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                  isActive("/") ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>

            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenTools(true)}
              onMouseLeave={() => setOpenTools(false)}
            >
              <button
                className={`${base} ${
                  pathname.startsWith("/loan") ||
                  pathname.startsWith("/tax") ||
                  pathname.startsWith("/uif") ||
                  pathname.startsWith("/price-compare") ||
                  pathname.startsWith("/publishing")
                    ? active
                    : idle
                }`}
              >
                <span className="flex items-center gap-1">
                  Tools
                  <span className="text-[10px]">▾</span>
                </span>
                <span
                  className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                    pathname.startsWith("/loan") ||
                    pathname.startsWith("/tax") ||
                    pathname.startsWith("/uif") ||
                    pathname.startsWith("/price-compare") ||
                    pathname.startsWith("/publishing")
                      ? "w-full"
                      : "group-hover:w-full"
                  }`}
                />
              </button>

              {openTools && (
                <div className="absolute right-0 mt-2 w-52 bg-white/95 shadow-xl rounded-2xl border border-pink-100 backdrop-blur animate-fadeIn">
                  <Link
                    href="/loan"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)] rounded-t-2xl"
                  >
                    Loan Tool
                  </Link>

                  <Link
                    href="/tax"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)]"
                  >
                    Tax Tool
                  </Link>

                  <Link
                    href="/uif"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)]"
                  >
                    UIF Tool
                  </Link>

                  <Link
                    href="/price-compare"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)]"
                  >
                    Price Compare Tool
                  </Link>

                  <Link
                    href="/publishing"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)] rounded-b-2xl"
                  >
                    Publishing Tool
                  </Link>
                </div>
              )}
            </div>

            {/* About */}
            <Link
              href="/about"
              className={`${base} ${isActive("/about") ? active : idle}`}
            >
              <span>About Us</span>
              <span
                className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                  isActive("/about") ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              className={`${base} ${isActive("/contact") ? active : idle}`}
            >
              <span>Contact Us</span>
              <span
                className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                  isActive("/contact") ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden relative inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-white/90 px-3 py-2 shadow-sm hover:shadow-[0_0_14px_rgba(236,72,153,0.6)] transition-all"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 rounded-full bg-pink-600 transition-transform duration-300 ${
                  mobileOpen ? "translate-y-1 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 rounded-full bg-pink-600 transition-opacity duration-300 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-pink-600 transition-transform duration-300 ${
                  mobileOpen ? "-translate-y-1 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block w-full text-left px-4 py-2 rounded-2xl text-sm font-semibold border transition-all ${
                isActive("/")
                  ? "bg-pink-600 text-white border-pink-600 shadow-[0_0_18px_rgba(236,72,153,0.9)]"
                  : "bg-white/95 text-gray-800 border-gray-200 hover:bg-pink-50 hover:text-pink-700"
              }`}
            >
              Home
            </Link>

            {/* Tools Section */}
            <div className="space-y-2 rounded-2xl bg-white/90 border border-pink-100 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 mb-1">
                Tools
              </div>

              <Link
                href="/loan"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium bg-white hover:bg-pink-50 hover:text-pink-700"
              >
                Loan Tool
              </Link>

              <Link
                href="/tax"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium bg-white hover:bg-pink-50 hover:text-pink-700"
              >
                Tax Tool
              </Link>

              <Link
                href="/uif"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium bg-white hover:bg-pink-50 hover:text-pink-700"
              >
                UIF Tool
              </Link>

              <Link
                href="/price-compare"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium bg-white hover:bg-pink-50 hover:text-pink-700"
              >
                Price Compare Tool
              </Link>

              <Link
                href="/publishing"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium bg-white hover:bg-pink-50 hover:text-pink-700"
              >
                Publishing Tool
              </Link>
            </div>

            {/* About Us */}
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-2xl bg-white/95 hover:bg-pink-50 hover:text-pink-700 text-sm font-semibold border"
            >
              About Us
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-2xl bg-white/95 hover:bg-pink-50 hover:text-pink-700 text-sm font-semibold border"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
