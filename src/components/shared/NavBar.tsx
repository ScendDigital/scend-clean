"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  // Always a string – no more "possibly null"
  const pathname = usePathname() ?? "";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const base =
    "group relative rounded-2xl px-4 py-2 text-sm font-semibold border transition-all duration-300 flex flex-col items-center";
  const idle =
    "bg-white/90 text-gray-800 border-gray-200 hover:bg-pink-50 hover:text-pink-700 hover:shadow-[0_0_16px_rgba(236,72,153,0.6)]";
  const active =
    "bg-pink-600 text-white border-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.9)]";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white/90 via-pink-50/80 to-white/90 backdrop-blur border-b border-pink-50">
      <div className="mx-auto max-w-6xl px-4">
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

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-3">
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

            <Link
              href="/loan"
              className={`${base} ${isActive("/loan") ? active : idle}`}
            >
              <span>Loan Tool</span>
              <span
                className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                  isActive("/loan") ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>

            <Link
              href="/tax"
              className={`${base} ${isActive("/tax") ? active : idle}`}
            >
              <span>Tax Tool</span>
              <span
                className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                  isActive("/tax") ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>

            <Link
              href="/uif"
              className={`${base} ${isActive("/uif") ? active : idle}`}
            >
              <span>UIF Tool</span>
              <span
                className={`mt-1 h-[2px] w-0 rounded-full bg-pink-500 transition-all duration-300 ${
                  isActive("/uif") ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>

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
        </div>
      </div>
    </nav>
  );
}
