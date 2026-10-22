"use client";

import TaxTool from "@/components/tax/TaxTool";

export default function Page() {
  return (
    <main className="scend-tool-ui scend-tool-page min-h-screen w-full bg-gray-50 px-4 py-8 md:px-8">
      <div className="scend-tool-content mx-auto w-full max-w-7xl space-y-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-white p-8 shadow-sm ring-1 ring-pink-100">
          <h1 className="text-3xl font-bold tracking-tight text-pink-600 md:text-4xl">
            Scend Tax Tool
          </h1>
          <p className="mt-2 text-[15px] text-gray-600">
            Understand how SARS calculated your tax
          </p>
        </header>
        <TaxTool />
      </div>
    </main>
  );
}