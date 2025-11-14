import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Scend — UIF Tool",
  description: "UIF benefit estimator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="w-full border-b">
          <nav className="container mx-auto flex items-center justify-between py-3">
            <Link href="/" className="font-bold text-pink-600">Scend</Link>
            <div className="flex items-center gap-4">
              <Link href="/uif" className="hover:underline">UIF Tool</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="w-full border-t py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Scend
        </footer>
      </body>
    </html>
  );
}
