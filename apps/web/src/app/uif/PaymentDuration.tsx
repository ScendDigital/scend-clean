"use client";

import type { UifResults } from "./logic";

export default function PaymentDuration({ results }: { results?: UifResults | null }) {
  if (!results) return null;
  const months = results.monthsApprox;
  const days = results.creditDays;

  return (
    <div className="mt-8 p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-2">Estimated payment duration</h3>
      <p className="text-xl font-bold">{months.toFixed(1)} month(s) (≈ {days} days)</p>
      <p className="text-sm text-gray-600 mt-2">
        Continuation payments are generally processed monthly after approval, subject to any required continuation steps.
      </p>
    </div>
  );
}
