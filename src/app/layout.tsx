import "../styles/globals.css";
export const metadata = {
  title: "Scend",
  description: "Tools to make life simpler.",
}; param($m) $m.Value + "import Link from 'next/link'\n" 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-between items-center p-4 bg-pink-600 text-white shadow-md">
  <div className="flex items-center gap-2">
    <img src="/scend-logo.png" alt="Scend Logo" className="h-8 w-8" />
    <h1 className="font-bold text-xl">Welcome to Scend</h1>
  </div>
  <nav className="space-x-4">
    <a href="/" className="hover:underline">Home</Link>
    <a href="/loan" className="hover:underline">Loan Tool</Link>
    <a href="/tax" className="hover:underline">SARS Tax Calculator</Link>
    <a href="/uif" className="hover:underline">UIF Tool</Link>
    <a href="/price-compare" className="hover:underline">Price Compare Tool</Link>
    <a href="/about" className="hover:underline">About Us</Link>
    <a href="/contact" className="hover:underline">Contact Us</Link>
  </nav>
</header>
        <main className="min-h-screen bg-white">{children}</main>
      </body>
    </html>
  );
}











