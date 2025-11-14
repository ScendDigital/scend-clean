"use client";
import Link from "next/link";

const linkCls = "text-gray-700 hover:text-pink-600 transition-colors";
const container = "mx-auto max-w-6xl px-4";

export default function Navbar() {
  return (
    <nav className="glow sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className={container}>
        <div className="glow flex items-center gap-6 h-14">
          <Link href="/" className="glow flex items-center gap-2">
            <img src="/scend-logo" alt="Scend" width="28" height="28" className="glow rounded" />
            <span className="glow font-bold text-pink-600">Scend</span>
          </Link>
          <div className="glow flex items-center gap-5 text-[15px]">
            <Link href="/" className={linkCls}>Home</Link>
            <Link href="/loan" className={linkCls}>Loan Tool</Link>
            <Link href="/tax" className={linkCls}>Tax Tool</Link>
            <Link href="/price-compare" className={linkCls}>Price Compare</Link>
            <Link href="/uif" className={linkCls}>UIF Tool</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

