"use client";
import React, { useState } from "react";
import TaxToolClient from "../../components/TaxToolClient"; // keep your existing tool client if you have one
import ShareButtons from "../../components/ShareButtons";
import ToolDisclaimer from "../../components/ToolDisclaimer";

/** Lightweight shell that adds period + prorata UI around your existing tool. */
export default function Page() {
  const [period, setPeriod] = useState<"yearly"|"monthly">("yearly");
  const [prorated, setProrated] = useState(false);
  const [daysWorked, setDaysWorked] = useState<string>("");
  const [workDaysInMonth, setWorkDaysInMonth] = useState<string>("");

  return (
<>
<div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">SARS Tax Calculator</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Calculation Period</label>
          <select className="w-full rounded-xl border p-3 outline-none" value={period} onChange={(e)=>setPeriod(e.target.value as any)}>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-end gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" checked={prorated} onChange={(e)=>setProrated(e.target.checked)} />
            Month is prorated
          </label>

          {prorated && (
            <div className="flex gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Days Worked</label>
                <input type="number" min={0} className="w-28 rounded-xl border p-2 outline-none" value={daysWorked} onChange={(e)=>setDaysWorked(e.target.value)} placeholder="e.g. 10" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Work Days in Month</label>
                <input type="number" min={0} className="w-28 rounded-xl border p-2 outline-none" value={workDaysInMonth} onChange={(e)=>setWorkDaysInMonth(e.target.value)} placeholder="e.g. 22" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Your existing tax tool renders here */}
      <TaxToolClient />

      <ShareButtons />
      <ToolDisclaimer kind="tax" />
    </div>
{/* ⬇ SCEND TAX BLOCK (auto) */}
<section className="mx-auto max-w-5xl px-4">
  {/* Ensure these state vars exist in your component: mode, isProrated, grossAnnual, daysInMonth, daysWorked, monthlyTax, annualTax, medicalDependants, decisionNotes */}
  {(() => {
    try {
      const grossForCalc = deriveGrossForCalc({ mode, grossAnnual, isProrated, daysInMonth, daysWorked });
      return (
        <div className="mt-4 rounded-xl border p-4">
          <div className="text-sm opacity-80">Calculating on: <b>R {Number(grossForCalc||0).toLocaleString()}</b> ({String(mode)}{isProrated ? ", prorated" : ""})</div>
          <button
            className="rounded-lg border px-3 py-2 mt-3"
            onClick={() => exportTaxPdf({
              mode,
              isProrated,
              grossIncome: Number(grossForCalc||0),
              monthlyTax,
              annualTax,
              medicalDependants,
              notes: decisionNotes,
            })}
          >
            Export PDF
          </button>
        </div>
      );
    } catch {
      return null;
    }
  })()}
</section>
{/* ⬆ SCEND TAX BLOCK (auto) */}
</>
);
}
// ---- SCEND NOTE (TAX) ----
// import { exportTaxPdf } from "./exportTaxPdf";
// import { deriveGrossForCalc, type Mode } from "./prorataHelper";
//
// Example wiring:
//   const grossForCalc = deriveGrossForCalc({ mode, grossAnnual, isProrated, daysInMonth, daysWorked });
//   // feed grossForCalc into your PAYE engine to compute monthlyTax/annualTax.
//   <button className="rounded-lg border px-3 py-2 mt-3"
//           onClick={() => exportTaxPdf({ mode, isProrated, grossIncome: grossForCalc, monthlyTax, annualTax, medicalDependants, notes: decisionNotes })}>
//     Export PDF
//   </button>
// --------------------------

