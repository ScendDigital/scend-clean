"use client";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-center">
      {/* Scend Welcome Section */}
      <h1 className="text-4xl font-bold text-pink-600 mb-4">
        Welcome to Scend
      </h1>
      <p className="text-gray-700 text-lg max-w-2xl mx-auto">
        Tools to make life simpler — from smart loan qualification and SARS tax clarity 
        to UIF estimating and price comparisons. Built for South Africans, with transparency 
        and compliance in mind.
      </p>

      {/* Optional: Add buttons to key tools */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href="/loan"
          className="rounded-2xl border px-6 py-3 bg-pink-600 text-white hover:bg-pink-700 transition"
        >
          Loan Tool
        </a>
        <a
          href="/tax"
          className="rounded-2xl border px-6 py-3 hover:bg-pink-50 transition"
        >
          SARS Tax Calculator Tool
        </a>
        <a
          href="/uif"
          className="rounded-2xl border px-6 py-3 hover:bg-pink-50 transition"
        >
          UIF Tool
        </a>
        <a
          href="/compare"
          className="rounded-2xl border px-6 py-3 hover:bg-pink-50 transition"
        >
          Price Compare Tool
        </a>
      </div>
    </main>
  );
}
