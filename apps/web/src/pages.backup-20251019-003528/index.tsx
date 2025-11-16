import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome to Scend</h1>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/about" className="hover:underline">About Us</Link>
            <Link href="/loan" className="hover:underline">Loan Tool</Link>
            <Link href="/tax" className="hover:underline">Tax Tool</Link>
            <Link href="/uif" className="hover:underline">UIF Tool</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Loan Qualification Tool</h2>
          <p className="text-sm text-gray-600 mb-4">
            Assess affordability, DTI, and SA NCA compliance for multiple loan types.
          </p>
          <Link href="/loan" className="inline-block rounded-xl px-4 py-2 bg-pink-500 text-white">Open Loan Tool</Link>
        </div>
        <div className="rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">SARS Tax Calculator</h2>
          <p className="text-sm text-gray-600 mb-4">
            PAYE with medical credits, mid-month proration, and travel allowance logic.
          </p>
          <Link href="/tax" className="inline-block rounded-xl px-4 py-2 bg-pink-500 text-white">Open Tax Tool</Link>
        </div>
        <div className="rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">UIF Tool</h2>
          <p className="text-sm text-gray-600 mb-4">
            Estimate benefits and contribution caps, aligned to SA UIF rules.
          </p>
          <Link href="/uif" className="inline-block rounded-xl px-4 py-2 bg-pink-500 text-white">Open UIF Tool</Link>
        </div>
      </section>
    </main>
  );
}
