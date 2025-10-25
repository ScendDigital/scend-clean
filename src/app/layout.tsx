import NoMailtoGuard from "@/components/shared/NoMailtoGuard";
// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css"; // keep your Tailwind/global styles
import NavBar from "@/components/shared/NavBar"; // uses your new Scend Tools NavBar

export const metadata = {
  title: "Scend Tools",
  description:
    "Smart digital tools by Scend — Loan Qualification, SARS Tax Calculator Tool, UIF Estimator, and Price Comparison, built for South Africans with compliance and transparency.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
    <NoMailtoGuard />
        {/* ✅ Global Navbar */}
        <NavBar />

        {/* ✅ Main content */}
        <main className="pt-4 pb-12">{children}</main>

        {/* ✅ Optional Footer */}
        <footer className="border-t py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Scend Pty Ltd. All rights reserved.
        </footer>
      </body>
    </html>
  );
}




