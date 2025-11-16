import type { ReactNode } from "react";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}