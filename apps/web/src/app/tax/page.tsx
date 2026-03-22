"use client";

import TaxTool from "@/tools/TaxTool";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tax Explanation Tool
          </h1>
          <p className="mt-2 text-gray-600">
            Understand how SARS calculated your tax
          </p>
        </header>

        <TaxTool />
      </div>
    </div>
  );
}


