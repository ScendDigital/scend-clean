"use client";
import React, { useMemo, useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolDisclaimer from "../components/ToolDisclaimer";

const UIF_MONTHLY_CAP = 17712;
const EMP_RATE = 0.01;
const ER_RATE = 0.01;

type BenefitType = "unemployment" | "illness" | "maternity" | "adoption" | "dependants";

const BENEFITS: { key: BenefitType; label: string; docs: string[] }[] = [
  { key: "unemployment", label: "Unemployment", docs: [
    "/docs/uif/unemployment/UIF_Unemployment_Checklist.pdf",
    "/docs/uif/unemployment/UIF_Bank_Form.pdf",
    "/docs/uif/unemployment/UIF_ID_Copy.pdf",
  ]},
  { key: "illness", label: "Illness", docs: ["/docs/uif/illness/UIF_Illness_Checklist.pdf"] },
  { key: "maternity", label: "Maternity", docs: ["/docs/uif/maternity/UIF_Maternity_Checklist.pdf"] },
  { key: "adoption", label: "Adoption", docs: ["/docs/uif/adoption/UIF_Adoption_Checklist.pdf"] },
  { key: "dependants", label: "Dependants (Death)", docs: ["/docs/uif/dependants/UIF_Dependants_Checklist.pdf"] },
];

function computeIRR(monthlyCapped: number): number {
  if (monthlyCapped <= 0) return 0.6;
  const ratio = Math.min(monthlyCapped / UIF_MONTHLY_CAP, 1);
  const irr = 0.6 - (0.22 * ratio); // 60% -> 38% at cap
  return Math.min(0.6, Math.max(0.38, irr));
}
function formatMoney(n: number): string {
  if (!isFinite(n)) return "R 0.00";
  return "R " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function downloadAll(urls: string[]) {
  urls.forEach((u, i) => setTimeout(() => {
    const a = document.createElement("a");
    a.href = u; a.download = ""; document.body.appendChild(a); a.click(); a.remove();
  }, i * 250));
}

export default function UifTool() {
  const [avgMonthly, setAvgMonthly] = useState<string>("");
  const [monthsContrib, setMonthsContrib] = useState<string>("");
  const [benefit, setBenefit] = useState<BenefitType>("unemployment");

  const {
    avgMonthlyNum, capped, employee1, employer1, total2,
    adi, irr, dailyBenefit, roughMonthly, creditDays, eligible, reason
  } = useMemo(() => {
    const am = Math.max(0, Number(avgMonthly || 0));
    const cap = Math.min(am, UIF_MONTHLY_CAP);
    const emp = cap * EMP_RATE;
    const er  = cap * ER_RATE;
    const ADI = (cap * 12) / 365;
    const IRR = computeIRR(cap);
    const daily = ADI * IRR;
    const rough = daily * 30;
    const m = Math.max(0, Math.floor(Number(monthsContrib || 0)));
    const credits = Math.min(365, Math.floor(m * 7.5));

    let eligible = am > 0 && credits > 0;
    let reason = "";
    if (!am) { eligible = false; reason = "Enter an average monthly salary."; }
    else if (credits <= 0) { eligible = false; reason = "Not enough credit days (months contributed)."; }

    return { avgMonthlyNum: am, capped: cap, employee1: emp, employer1: er, total2: emp + er, adi: ADI, irr: IRR, dailyBenefit: daily, roughMonthly: rough, creditDays: credits, eligible, reason };
  }, [avgMonthly, monthsContrib]);

  const current = BENEFITS.find(b => b.key === benefit)!;

  const resultText = () => [
    "UIF Estimate (Scend)",
    `Benefit Type: ${current.label}`,
    `Avg Monthly: ${formatMoney(avgMonthlyNum)} (capped ${formatMoney(capped)})`,
    `ADI: ${formatMoney(adi)} | IRR: ${(irr*100).toFixed(2)}%`,
    `Estimated Daily Benefit: ${formatMoney(dailyBenefit)}`,
    `~Monthly View (30d): ${formatMoney(roughMonthly)}`,
    `Credit Days: ${creditDays}`,
    eligible ? "Eligibility (hint): Likely eligible based on inputs." : `Eligibility (hint): Not eligible — ${reason}`,
    "Disclaimer: Estimator only. Final decisions by UIF.",
    typeof window !== "undefined" ? window.location.href : ""
  ].join("\n");

  const canCalc = Number(avgMonthly) > 0 && Number(monthsContrib) >= 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6 shadow-sm">
        <h2 className="text-2xl font-bold">UIF Tool (Estimator)</h2>
        <p className="mt-1 text-sm opacity-80">
          Enter your <strong>average monthly salary</strong> (last 6 months) and <strong>months contributed</strong> (last 4 years).
          Select a benefit type to see the required documents.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium">Benefit Type</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border p-3 outline-none" value={benefit} onChange={e=>setBenefit(e.target.value as BenefitType)}>
                {BENEFITS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Average Monthly Salary (ZAR)</label>
            <input type="number" min={0} value={avgMonthly} onChange={(e)=>setAvgMonthly(e.target.value)} placeholder="e.g. 10000" className="w-full rounded-xl border p-3 outline-none" />
            <p className="mt-1 text-xs opacity-70">Capped at {formatMoney(UIF_MONTHLY_CAP)} for UIF.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Months Contributed (last 4 years)</label>
            <input type="number" min={0} max={48} value={monthsContrib} onChange={(e)=>setMonthsContrib(e.target.value)} placeholder="e.g. 36" className="w-full rounded-xl border p-3 outline-none" />
            <p className="mt-1 text-xs opacity-70">Earn ~7.5 credit days per month (max 365).</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="rounded-2xl border px-5 py-3 font-semibold hover:shadow disabled:opacity-50" disabled={!canCalc}>Calculate</button>
          <button className="rounded-2xl border px-5 py-3 font-semibold hover:shadow" onClick={()=>{ setAvgMonthly(""); setMonthsContrib(""); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Eligibility hint */}
      <div className="rounded-2xl border p-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${eligible ? "bg-green-600" : "bg-red-600"}`} />
          <div className="font-semibold">{eligible ? "Eligibility (hint): Likely eligible" : "Eligibility (hint): Not eligible"}</div>
        </div>
        {!eligible && reason && <p className="mt-1 text-sm opacity-80">{reason}</p>}
      </div>

      {/* Required documents */}
      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Required Documents — {current.label}</h3>
        <ul className="mt-2 list-disc pl-5">
          {current.docs.map((d) => (
            <li key={d}><a className="underline" href={d} download>{d.split("/").pop()}</a></li>
          ))}
        </ul>
        {current.docs.length > 0 && (
          <button className="mt-4 rounded-2xl border px-5 py-2 font-semibold hover:shadow" onClick={()=>downloadAll(current.docs)}>
            Download All
          </button>
        )}
        <p className="mt-3 text-xs opacity-70">Replace these placeholders with the latest official UIF forms.</p>
      </div>

      {/* Results */}
      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Results</h3>
        <ul className="mt-2 text-sm leading-7">
          <li>• Avg Daily Income (ADI): <strong>{formatMoney(adi)}</strong></li>
          <li>• Income Replacement Rate (IRR): <strong>{(irr*100).toFixed(2)}%</strong></li>
          <li>• Estimated Daily Benefit: <strong>{formatMoney(dailyBenefit)}</strong></li>
          <li>• Rough Monthly View (~30 days): <strong>{formatMoney(roughMonthly)}</strong></li>
          <li>• Credit Days: <strong>{creditDays}</strong></li>
        </ul>
        <ShareButtons getText={resultText} />
        <ToolDisclaimer kind="uif" />
      </div>

      {/* Processing / next steps */}
      <div className="rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Processing & Next Steps</h3>
        <ul className="mt-2 list-disc pl-5 text-sm leading-7">
          <li>Submit your application with all required documents via uFiling or at a Labour Centre.</li>
          <li>Ensure bank confirmation and ID copies are clear and up to date.</li>
          <li>Respond promptly to any requests for additional information or verification.</li>
          <li>Track your claim status on uFiling or via the UIF helpline.</li>
          <li><strong>Waiting period:</strong> When approved and all documents are in order, initial payment typically takes several weeks; timing depends on UIF workload and banking processes.</li>
        </ul>
      </div>
    </div>
  );
}
