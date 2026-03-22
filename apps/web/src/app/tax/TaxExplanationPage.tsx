"use client";

import React from "react";

export default function TaxExplanationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4">
      <div className="w-full max-w-3xl bg-white mt-10 mb-16 p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Tax Explanation Tool
        </h1>
        <p className="text-gray-600 mb-6">
          Understand how SARS calculated your tax
        </p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Annual Income</label>
            <input className="border rounded px-3 py-2 w-full" value={360000} readOnly />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Age</label>
            <input className="border rounded px-3 py-2 w-full" value={35} readOnly />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Medical Aid Dependents</label>
            <input className="border rounded px-3 py-2 w-full" value={0} readOnly />
          </div>
        </div>

        <div className="mt-8 border-t pt-6 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Annual Tax (Before Rebates)</span>
            <span>R 74 632</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Annual Rebates</span>
            <span>R 17 235</span>
          </div>

          <div className="flex justify-between pt-2 text-lg font-semibold">
            <span>Estimated Monthly PAYE</span>
            <span>R 4 419.08</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          Educational estimator based on SARS 2024/25 tables. Not a payroll substitute.
        </p>

      </div>
    </div>
  );
}


