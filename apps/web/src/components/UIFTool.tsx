"use client";

import { useState } from "react";

/**
 * UIF Estimator (Unemployment / Illness / Maternity / Adoption)
 * - Employee: 1% of remuneration (capped at UIF ceiling)
 * - Employer: 1% (capped at UIF ceiling)
 * - Earnings ceiling: R17,712 / month (editable constant)
 * - IRR sliding scale (≈38%–60%): IRR = 29.2 + (7173.92 / (DI + 232.92))
 *   where DI = Average Daily Income = (monthly income * 12) / 365
 * - Credit days: ≈7.5 per month contributed, capped by claim type and overall max
 *
 * Notes:
 * • Caps and IRR formula here are typical — adjust constants if rules change.
 * • This is an estimate; actual payouts depend on UIF assessment and prior claims.
 */

const UIF_CEILING_PM = 17712;        // Monthly ceiling (R)
const EMP_RATE = 0.01;               // Employee contribution (1%)
const ER_RATE = 0.01;                // Employer contribution (1%)
const MAX_CREDIT_DAYS = 365;         // Absolute max in 4-year cycle

// Typical claim-type caps (edit as needed)
const CLAIM_TYPES = [
  { value: "unemployment", label: "Unemployment", capDays: 365 },
  { value: "illness", label: "Illness", capDays: 238 },
  { value: "maternity", label: "Maternity", capDays: 121 },
  { value: "adoption", label: "Adoption", capDays: 121 },
] as const;
type ClaimType = (typeof CLAIM_TYPES)[number]["value"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatCurrencyZAR(n: number) {
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `R ${n.toFixed(2)}`;
  }
}

export default function UIFTool() {
  const [income, setIncome] = useState<string>("");
  const [monthsContrib, setMonthsContrib] = useState<string>("");
  const [claimType, setClaimType] = useState<ClaimType>("unemployment");
  const [useCapForBenefit, setUseCapForBenefit] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  function calculate() {
    const incomeNum = Number(income);
    const monthsNum = Number(monthsContrib);

    if (
      !Number.isFinite(incomeNum) ||
      !Number.isFinite(monthsNum) ||
      incomeNum <= 0 ||
      monthsNum <= 0
    ) {
      setResult("Please enter valid positive numbers.");
      return;
    }

    // --- Contributions (capped at ceiling) ---
    const cappedIncome = Math.min(incomeNum, UIF_CEILING_PM);
    const employeeUIF = cappedIncome * EMP_RATE;
    const employerUIF = cappedIncome * ER_RATE;
    const totalUIF = employeeUIF + employerUIF;

    // --- Daily Income & IRR ---
    // Toggle lets the user choose whether benefit calc should also respect the ceiling.
    const incomeForBenefit = useCapForBenefit
      ? Math.min(incomeNum, UIF_CEILING_PM)
      : incomeNum;

    const dailyIncome = (incomeForBenefit * 12) / 365;

    // Dept. of Labour IRR formula
    let irr = 29.2 + 7173.92 / (dailyIncome + 232.92);
    irr = clamp(irr, 38, 60);

    const dailyBenefit = (irr / 100) * dailyIncome;
    const monthlyBenefitEstimate = dailyBenefit * 30; // rough 30-day view

    // --- Credit Days ---
    const approxCreditDays = Math.min(Math.floor(monthsNum * 7.5), MAX_CREDIT_DAYS);
    const typeCap = CLAIM_TYPES.find((c) => c.value === claimType)?.capDays ?? MAX_CREDIT_DAYS;
    const creditDays = Math.min(approxCreditDays, typeCap);

    const totalPotentialPayout = dailyBenefit * creditDays;

    // Build output
    const text = [
      `Inputs:`,
      `• Claim type: ${CLAIM_TYPES.find((c) => c.value === claimType)?.label}`,
      `• Average monthly salary: ${formatCurrencyZAR(incomeNum)}`,
      `• Months contributed (last 4 years): ${monthsNum} month(s)`,
      `${incomeNum > UIF_CEILING_PM ? `• Note: Income entered exceeds the UIF ceiling (${formatCurrencyZAR(UIF_CEILING_PM)}).` : ""}`,
      `${useCapForBenefit ? `• Benefit calc capped at ceiling.` : `• Benefit calc NOT capped (only contributions are capped).`}`,
      ``,
      `UIF Contributions (per month):`,
      `• Employee (1%): ${formatCurrencyZAR(employeeUIF)}  (capped at ${formatCurrencyZAR(UIF_CEILING_PM)})`,
      `• Employer (1%): ${formatCurrencyZAR(employerUIF)}`,
      `• Total: ${formatCurrencyZAR(totalUIF)}`,
      ``,
      `Benefit Estimate:`,
      `• Avg Daily Income (ADI): ${formatCurrencyZAR(dailyIncome)}`,
      `• Income Replacement Rate (IRR): ${irr.toFixed(2)}%`,
      `• Estimated Daily Benefit: ${formatCurrencyZAR(dailyBenefit)}`,
      `• Rough Monthly View (~30 days): ${formatCurrencyZAR(monthlyBenefitEstimate)}`,
      ``,
      `Claim Duration:`,
      `• Estimated credit days (by contributions): ${approxCreditDays} day(s)`,
      `• Claim-type cap: ${typeCap} day(s)`,
      `• Usable credit days for this claim: ${creditDays} day(s)`,
      `• Total Potential Payout (benefit × credit days): ${formatCurrencyZAR(totalPotentialPayout)}`,
      ``,
      `Disclaimer: This tool provides an estimate. Actual UIF payouts depend on UIF assessment, capped earnings, claim type rules, prior claims, and administrative decisions.`,
    ]
      .filter(Boolean)
      .join("\n");

    setResult(text);
  }

  function clearAll() {
    setIncome("");
    setMonthsContrib("");
    setClaimType("unemployment");
    setUseCapForBenefit(false);
    setResult("");
  }

  const exceedsCeiling = Number(income) > UIF_CEILING_PM;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-4">UIF Tool (Estimator)</h1>

      {exceedsCeiling && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm">
          Your salary exceeds the UIF ceiling ({formatCurrencyZAR(UIF_CEILING_PM)}). Contributions are capped at the ceiling.
          <div className="mt-2 flex items-center gap-2">
            <input
              id="cap-benefit"
              type="checkbox"
              checked={useCapForBenefit}
              onChange={(e) => setUseCapForBenefit(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="cap-benefit">Also cap the benefit calculation at the ceiling</label>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Claim Type</label>
          <select
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            value={claimType}
            onChange={(e) => setClaimType(e.target.value as ClaimType)}
          >
            {CLAIM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Each claim type may have a different maximum number of payable days.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Average Monthly Salary (ZAR)
          </label>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="e.g. 18000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            min={0}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use your average of the last 6 months.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Months Contributed in Last 4 Years
          </label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="e.g. 24"
            value={monthsContrib}
            onChange={(e) => setMonthsContrib(e.target.value)}
            min={0}
            max={48}
          />
          <p className="text-xs text-gray-500 mt-1">
            You earn ≈7.5 credit days per month worked, capped at {MAX_CREDIT_DAYS}.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="rounded-xl px-4 py-2 bg-pink-600 text-white hover:bg-pink-700"
          >
            Calculate
          </button>
          <button
            onClick={clearAll}
            className="rounded-xl px-4 py-2 border hover:bg-gray-50"
          >
            Clear
          </button>
        </div>

        {result && (
          <pre className="mt-4 rounded-xl bg-gray-50 border px-4 py-3 text-sm whitespace-pre-wrap">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
