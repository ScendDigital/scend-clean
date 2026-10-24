import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const toolLinks = [
  { label: "Tax Tool", href: "/tax" },
  { label: "Loan Tool", href: "/loan" },
  { label: "UIF Tool", href: "/uif" },
  { label: "Price Compare", href: "/price-compare" },
  { label: "Publishing", href: "/publishing" },
];

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-pink-50 hover:text-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700";

export default function NavBar() {
  return (
    <nav aria-label="Main navigation" className="relative z-30 w-full border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col items-center justify-between gap-2 py-2 sm:flex-row sm:gap-4 sm:py-0">
        <Link href="/" aria-label="Scend home" className="inline-flex shrink-0 items-center">
          <Image
            src="/scend-logo.png"
            alt="Scend - We Got You Covered"
            width={185}
            height={115}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex w-full flex-wrap items-center justify-center gap-1 sm:w-auto sm:justify-end sm:gap-2">
          <Link href="/" className={linkClass}>Home</Link>
          <details className="group relative">
            <summary className={`${linkClass} flex cursor-pointer list-none items-center gap-1.5 [&::-webkit-details-marker]:hidden`}>
              Tools
              <ChevronDown aria-hidden="true" size={15} className="transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-pink-100 bg-white p-2 shadow-xl shadow-gray-900/10">
              {toolLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-pink-50 hover:text-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/services" className={linkClass}>Our Services</Link>
          <Link href="/publishing" className={linkClass}>Publishing</Link>
          <Link href="/about" className={linkClass}>About</Link>
          <Link href="/directors" className={linkClass}>Directors</Link>
          <Link href="/contact" className={linkClass}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}