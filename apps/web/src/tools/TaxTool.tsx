"use client";

import { useMemo, useState } from "react";

/* =========================
   SARS 2024/25 TAX ENGINE
   ========================= */

function annualTaxBeforeRebates(taxable: number) {
  const brackets = [
    { up: 237100, base: 0, rate: 0.18 },
    { up: 370500, base: 42678, rate: 0.26, over: 237100 },
    { up: 512800, base: 77362, rate: 0.31, over: 370500 },
    { up: 673000, base: 121475, rate: 0.36, over: 512800 },
    { up: 857900, base: 179147, rate: 0.39, over: 673000 },
    { up: 1817000, base: 251258, rate: 0.41, over: 857900 },
    { up: Infinity, base: 644489, rate: 0.45, over: 1817000 },
  ];

  for (const b of brackets) {
    if (taxable <= b.up) {
      if (!("over" in b)) return taxable * b.rate;
      return b.base + (taxable - (b as any).over) * b.rate;
    }
  }
  return 0;
}

function rebatesByAge(age: number) {
  const primary = 17235;
  const secondary = 9444;
  const tertiary = 3145;
  if (age >= 75) return primary + secondary + tertiary;
  if (age >= 65) return primary + secondary;
  return primary;
}

function medicalCredits(beneficiaries: number) {
  if (beneficiaries <= 0) return 0;
  return Math.min(beneficiaries, 2) * 364 + Math.max(0, beneficiaries - 2) * 246;
}

/* =========================
   COMPONENT
   ========================= */

export default function TaxTool() {
  const [annualIncome, setAnnualIncome] = useState(360000);
  const [age, setAge] = useState(35);
  const [dependents, setDependents] = useState(0);

  const annualTaxable = annualIncome;

  const annualTax = useMemo(
    () => annualTaxBeforeRebates(annualTaxable),
    [annualTaxable]
  );

  const rebates = useMemo(() => rebatesByAge(age), [age]);

  const monthlyMedCredits = useMemo(
    () => medicalCredits(1 + dependents),
    [dependents]
  );

  const annualAfterRebates = Math.max(0, annualTax - rebates);

  const monthlyPAYE = Math.max(
    0,
    annualAfterRebates / 12 - monthlyMedCredits
  );

  /* =========================
     RENDER
     ========================= */

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto space-y-8">
      {/* INPUTS */}
      <div className="grid gap-6 md:grid-cols-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Annual Income
          </span>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(+e.target.value)}
            className="mt-1 border rounded px-3 py-2 w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">Age</span>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            className="mt-1 border rounded px-3 py-2 w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Medical Aid Dependents
          </span>
          <input
            type="number"
            value={dependents}
            onChange={(e) => setDependents(+e.target.value)}
            className="mt-1 border rounded px-3 py-2 w-full"
          />
        </label>
      </div>

      {/* RESULTS */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">
            Annual Tax (Before Rebates)
          </div>
          <div className="text-lg font-semibold">
            R {annualTax.toLocaleString("en-ZA")}
          </div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Annual Rebates</div>
          <div className="text-lg font-semibold">
            R {rebates.toLocaleString("en-ZA")}
          </div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">
            Estimated Monthly PAYE
          </div>
          <div className="text-2xl font-bold">
            R{" "}
            {monthlyPAYE.toLocaleString("en-ZA", {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Educational estimator based on SARS 2024/25 tables. Not a payroll
        substitute.
      </p>
    </div>
  );
}


