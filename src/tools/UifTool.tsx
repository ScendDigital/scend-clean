// src/tools/UifTool.tsx
"use client";

import React, { useState } from "react";
import ToolDisclaimer from "@/components/shared/ToolDisclaimer";

const ZAR = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

// Parse string/number into a usable number
function num(v: string | number): number {
  const n = parseFloat(String(v).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function UifTool() {
  // Inputs
  const [monthlySalary, setMonthlySalary] = useState<string>("");
  const [monthsContributed, setMonthsContributed] = useState<string>("");

  // Results
  const [creditDays, setCreditDays] = useState<number | null>(null);
  const [dailyBenefit, setDailyBenefit] = useState<number | null>(null);
  const [totalBenefit, setTotalBenefit] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    const salary = num(monthlySalary);
    const months = num(monthsContributed);

    if (!salary || salary <= 0) {
      setError("Please enter a valid monthly salary.");
      return;
    }

    if (!months || months <= 0) {
      setError("Please enter how many months you have contributed to UIF.");
      return;
    }

    // --- Simple UIF-style assumptions (you can refine later) ---

    // Credit days: approx 1 day for every 6 days worked
    // Assume 30 days/month → 30 * months / 6
    // Cap at 365 days
    const calculatedCreditDays = Math.min(365, Math.floor((30 * months) / 6));

    // Daily remuneration ≈ (monthly * 12) / 365
    const dailyRemuneration = (salary * 12) / 365;

    // UIF benefit between ±38–60% of daily remuneration.
    // Use conservative 38% for estimate.
    const benefitRate = 0.38;
    const calculatedDailyBenefit = dailyRemuneration * benefitRate;

    const calculatedTotalBenefit =
      calculatedDailyBenefit * calculatedCreditDays;

    setCreditDays(calculatedCreditDays);
    setDailyBenefit(calculatedDailyBenefit);
    setTotalBenefit(calculatedTotalBenefit);
  };

  const handleClear = () => {
    setMonthlySalary("");
    setMonthsContributed("");
    setCreditDays(null);
    setDailyBenefit(null);
    setTotalBenefit(null);
    setError(null);
  };

  const hasResult =
    creditDays !== null && dailyBenefit !== null && totalBenefit !== null;

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-md p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">
          UIF Benefit Estimator
        </h1>
        <p className="text-sm text-gray-600">
          Estimate your potential UIF benefit based on your salary and
          contribution history. This is an{" "}
          <span className="font-semibold">informal estimate</span> and does not
          replace the official calculation of the Department of Employment and
          Labour.
        </p>
      </header>

      {/* Inputs */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="monthlySalary"
            className="text-sm font-medium text-gray-800"
          >
            Monthly salary (gross)
          </label>
          <input
            id="monthlySalary"
            type="text"
            inputMode="decimal"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            placeholder="e.g. 18 000"
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="monthsContributed"
            className="text-sm font-medium text-gray-800"
          >
            Months contributed to UIF
          </label>
          <input
            id="monthsContributed"
            type="text"
            inputMode="numeric"
            value={monthsContributed}
            onChange={(e) => setMonthsContributed(e.target.value)}
            placeholder="e.g. 12"
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </section>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          className="rounded-2xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          Calculate UIF Estimate
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Results */}
      {hasResult && (
        <section className="mt-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 space-y-3">
          <h2 className="text-base font-semibold text-gray-900">
            Estimated UIF Benefit
          </h2>
          <ul className="space-y-1 text-sm text-gray-800 list-disc list-inside">
            <li>
              Credit days:{" "}
              <strong>{creditDays !== null ? creditDays : "-"}</strong>
            </li>
            <li>
              Estimated daily benefit:{" "}
              <strong>
                {dailyBenefit !== null ? ZAR.format(dailyBenefit) : "-"}
              </strong>
            </li>
            <li>
              Estimated total benefit over credit period:{" "}
              <strong>
                {totalBenefit !== null ? ZAR.format(totalBenefit) : "-"}
              </strong>
            </li>
          </ul>

          <ToolDisclaimer kind="uif" />
        </section>
      )}

      {!hasResult && !error && (
        <div className="text-xs text-gray-500">
          Enter your details and click{" "}
          <strong>Calculate UIF Estimate</strong> to see an indicative benefit.
        </div>
      )}
    </div>
  );
}
