"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  const base = "px-3 py-2 rounded-md transition-colors text-pink-600 hover:text-pink-700";
  const on = "font-semibold underline underline-offset-4";
  return <Link href={href} className={`${base} ${active ? on : ""}`}>{children}</Link>;
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-pink-50 border-b-2 border-pink-500 w-full">
      <div className="h-14 flex items-center justify-end gap-3 pr-8 w-full">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/loan">LoanTool</NavItem>
        <NavItem href="/tax">TaxTool</NavItem>
        <NavItem href="/price-compare">Price-Compare Tool</NavItem>
        <NavItem href="/uif">UIF Tool</NavItem>
        <NavItem href="/about">About Us</NavItem>
        <NavItem href="/contact">Contact Us</NavItem>
      </div>
    </nav>
  );
}
