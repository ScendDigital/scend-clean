import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-semibold text-scendGrey mb-2">
          Welcome to Scend
        </h1>
        <p className="text-gray-600 mb-6">Tools to make life simpler.</p>

        {/* UIF Tool */}
        <a
          href="https://uif.scend.co.za/uif"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-3 rounded-2xl bg-scendPink text-white font-medium hover:opacity-90 transition"
        >
          Open UIF Payout Estimator
        </a>

        {/* Optional: Add more tools below */}
        <div className="mt-4 flex flex-col gap-3">
          <Link
            href="/loan"
            className="inline-block px-5 py-3 rounded-2xl bg-pink-100 text-pink-600 font-medium hover:bg-pink-200 transition"
          >
            Loan Qualification Tool
          </Link>
          <Link
            href="/tax"
            className="inline-block px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            SARS Tax Calculator
          </Link>
        </div>
      </div>
    </main>
  );
}
