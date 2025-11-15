"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {/* ✅ Use <Image> instead of <img> */}
          <Image
            src="/logo.png"          // keep your actual logo path
            alt="Scend"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
          <span>
            © {new Date().getFullYear()} Scend Pty Ltd. All rights reserved.
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/loan" className="hover:text-pink-600">
            Loan Tool
          </Link>
          <Link href="/tax" className="hover:text-pink-600">
            Tax Tool
          </Link>
        </div>
      </div>
    </footer>
  );
}
