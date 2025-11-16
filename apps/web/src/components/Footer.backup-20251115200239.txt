import Link from "next/link";

export default function Footer(){
  return (
    <footer className="mt-16 border-t border-[var(--scend-gray-200)] bg-white">
      <div className="footer-accent"></div>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 py-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <img src="/scend-logo.png" alt="Scend" className="h-8 w-auto" />
            <div>
              <p className="text-sm font-semibold text-[var(--scend-gray-900)]">Scend Pty Ltd</p>
              <p className="text-sm text-[var(--scend-gray-700)]">We got you covered.</p>
            </div>
          </div>

          {/* Quick links */}
          <nav className="text-sm">
            <p className="mb-2 font-semibold text-[var(--scend-gray-900)]">Quick links</p>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </nav>

          {/* Copyright */}
          <div className="md:text-right">
            <p className="text-sm text-[var(--scend-gray-700)]">
              © {new Date().getFullYear()} Scend Pty Ltd. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-[var(--scend-gray-700)]">
              Built in South Africa — pink & grey, always.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}