import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Scend • Digital • Wellness • Publishing",
  description:
    "Scend tools turn complex South African regulations into clear, practical decisions – from loans and tax to UIF and everyday affordability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--scend-page)] text-[var(--scend-gray-900)]"
      >
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
