"use client";

export default function PriceComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-center">
      <h1 className="text-3xl font-semibold text-pink-600 mb-3">
        Price Compare Tool
      </h1>

      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-gray-700">
          This feature is currently under development.
        </p>
        <p className="text-gray-600 mt-2">
          We’re building a smarter way to compare grocery and retail prices in South Africa.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/loan" className="rounded-2xl border px-5 py-2 hover:bg-pink-100">
            Try the Loan Tool
          </a>
          <a href="/tax" className="rounded-2xl border px-5 py-2 hover:bg-pink-100">
            SARS Tax Calculator Tool
          </a>
          <a href="/uif" className="rounded-2xl border px-5 py-2 hover:bg-pink-100">
            UIF Tool
          </a>
        </div>
      </div>
    </main>
  );
}
