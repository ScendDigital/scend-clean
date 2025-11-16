import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--scend-gray-200)] bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center text-[13px] text-[var(--scend-gray-600)] md:flex-row md:justify-between md:text-left">
        <p>
          Scend© 2025 Scend Pty Ltd. All rights reserved.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <Link href="/loan" className="hover:text-[var(--scend-pink-600)]">
            Loan Tool
          </Link>
          <span className="text-[var(--scend-gray-400)]">•</span>
          <Link href="/tax" className="hover:text-[var(--scend-pink-600)]">
            Tax Tool
          </Link>
          <span className="text-[var(--scend-gray-400)]">•</span>
          <Link href="/uif" className="hover:text-[var(--scend-pink-600)]">
            UIF Tool
          </Link>
          <span className="text-[var(--scend-gray-400)]">•</span>
          <Link
            href="/contact"
            className="hover:text-[var(--scend-pink-600)]"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
