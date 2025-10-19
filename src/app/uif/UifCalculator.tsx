"use client";

import { useMemo, useState } from "react";
import { calculateUif, formatMoney, UifInputs, UifResults } from "./logic";

type Props = {
  onCalculated?: (results: UifResults, inputs: UifInputs) => void;
};

export default function UifCalculator({ onCalculated }: Props) {
  const [avgMonthlySalary, setAvgMonthlySalary] = useState<string>("");
  const [workedValue, setWorkedValue] = useState<string>("");
  const [inputType, setInputType] = useState<"days" | "months">("days");
  const [salaryCap, setSalaryCap] = useState<string>("17712");
  const [results, setResults] = useState<UifResults | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);

  const valid = useMemo(() => {
    const e: string[] = [];
    const sal = Number(avgMonthlySalary);
    const worked = Number(workedValue);
    const cap = Number(salaryCap);

    if (!isFinite(sal) || sal <= 0) e.push("Enter a valid average monthly salary.");
    if (!isFinite(worked) || worked < 0) e.push("Enter valid work duration (days or months).");
    if (!isFinite(cap) || cap <= 0) e.push("Enter a valid UIF salary cap (ZAR).");

    setErrors(e);
    return e.length === 0;
  }, [avgMonthlySalary, workedValue, salaryCap]);

  function onCalculate() {
    if (!valid) return;

    const worked = Number(workedValue);
    // Convert months to days if needed (approx. 21.67 working days per month)
    const daysWorkedLast48Months =
      inputType === "months" ? worked * 21.67 : worked;

    const input: UifInputs = {
      avgMonthlySalary: Number(avgMonthlySalary),
      daysWorkedLast48Months,
      salaryCap: Number(salaryCap),
    };

    const r = calculateUif(input);
    setResults(r);
    onCalculated?.(r, input);
  }

  return (
    <div className="mt-6 grid gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Average Monthly Salary (ZAR)</label>
          <input
            inputMode="decimal"
            className="mt-1 w-full rounded-2xl border px-3 py-2"
            placeholder="e.g., 12500"
            value={avgMonthlySalary}
            onChange={(e) => setAvgMonthlySalary(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Worked ({inputType === "days" ? "Days" : "Months"}) in last 48 months</label>
          <div className="flex gap-2 mt-1">
            <input
              inputMode="decimal"
              className="w-full rounded-2xl border px-3 py-2"
              placeholder={inputType === "days" ? "e.g., 850" : "e.g., 36"}
              value={workedValue}
              onChange={(e) => setWorkedValue(e.target.value)}
            />
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as "days" | "months")}
              className="rounded-2xl border px-2 py-1 text-sm"
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {inputType === "days"
              ? "Enter total days worked in the last 4 years."
              : "We’ll convert months to days using 21.67 working days per month."}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">UIF Salary Cap (ZAR)</label>
          <input
            inputMode="decimal"
            className="mt-1 w-full rounded-2xl border px-3 py-2"
            value={salaryCap}
            onChange={(e) => setSalaryCap(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Used to cap remuneration before applying the % benefit.
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm">
          <ul className="list-disc pl-5">
            {errors.map((er, i) => (
              <li key={i}>{er}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={onCalculate}
          className="px-4 py-2 rounded-2xl shadow border bg-pink-500 text-white hover:bg-pink-600 border-pink-500"
        >
          Calculate
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showGuide}
            onChange={(e) => setShowGuide(e.target.checked)}
          />
          Show continuation / process guidance
        </label>
      </div>

      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4">
            <h3 className="text-lg font-semibold mb-2">Estimates</h3>
            <div className="space-y-1 text-sm">
              <p>Benefit rate: <strong>{(results.benefitRate * 100).toFixed(0)}%</strong></p>
              <p>Capped salary used: <strong>{formatMoney(results.cappedSalary)}</strong></p>
              <p>Daily remuneration: <strong>{formatMoney(results.dailyRemuneration)}</strong></p>
              <p>Daily UIF benefit: <strong>{formatMoney(results.dailyBenefit)}</strong></p>
              <p>Monthly benefit (approx): <strong>{formatMoney(results.monthlyBenefitApprox)}</strong></p>
            </div>
          </div>
          <div className="rounded-2xl border p-4">
            <h3 className="text-lg font-semibold mb-2">Duration & Totals</h3>
            <div className="space-y-1 text-sm">
              <p>Credit days: <strong>{results.creditDays}</strong></p>
              <p>Estimated duration: <strong>{results.monthsApprox.toFixed(1)} months</strong></p>
              <p>Total potential (if full credit days paid): <strong>{formatMoney(results.totalPotential)}</strong></p>
            </div>
          </div>
          {showGuide && (
            <div className="md:col-span-2 rounded-2xl border p-4 bg-gray-50">
              <h4 className="font-semibold mb-2">Continuation payments (after approval)</h4>
              <p className="text-sm">
                Benefits are generally paid monthly. You may be asked to confirm that you are still unemployed
                and actively seeking work. Keep your bank details active and respond promptly to any requests.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
