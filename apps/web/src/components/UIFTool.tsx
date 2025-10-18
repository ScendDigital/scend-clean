"use client";

import React, { useMemo, useState } from "react";

type BenefitType = "unemployment" | "illness" | "maternity" | "adoption";

const ZAR = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" });
const AVG_DAYS_PER_MONTH = 30.4167;                      // calendar average
const MONTHLY_THRESHOLD = 17712;                         // UIF monthly ceiling (ZAR)
const THRESHOLD_ADR = MONTHLY_THRESHOLD / AVG_DAYS_PER_MONTH;

// Sliding IRR for unemployment: 60% → 38% linearly over the capped ADR
function getSlidingIRR(adr: number) {
  if (adr <= 0) return 0.38;
  const ratio = Math.min(1, adr / THRESHOLD_ADR); // 0..1
  const irr = 0.60 - 0.22 * ratio;                // 60% minus up to 22%
  return Math.min(0.60, Math.max(0.38, irr));
}

// Credit days earned ≈ 7.5 per month worked, capped at 365
function getCreditDays(months: number) {
  return Math.min(365, Math.max(0, months * 7.5));
}

// UIF max days per benefit type
function maxDaysForBenefit(type: BenefitType) {
  switch (type) {
    case "illness": return 238;
    case "maternity": return 121;
    case "adoption": return 65;
    default: return 365; // unemployment
  }
}

export default function UIFTool() {
  const [benefit, setBenefit] = useState<BenefitType>("unemployment");
  const [monthly, setMonthly] = useState<number>(10000);
  const [monthsContrib, setMonthsContrib] = useState<number>(36);
  const [showResult, setShowResult] = useState<boolean>(true); // default show (you can set false)

  const calc = useMemo(() => {
    const adrActual = monthly > 0 ? monthly / AVG_DAYS_PER_MONTH : 0;
    const adrCapped = Math.min(adrActual, THRESHOLD_ADR);

    const irr =
      benefit === "unemployment"
        ? getSlidingIRR(adrCapped)
        : 0.66; // ±66% commonly applied for illness/maternity/adoption

    const daily = adrCapped * irr;
    const monthlyApprox = daily * 30; // simple ~30-day view

    const credits = getCreditDays(monthsContrib);
    const cap = maxDaysForBenefit(benefit);
    const eligible = Math.min(credits, cap);

    const total = daily * eligible;

    return {
      adrActual,
      adrCapped,
      irr,
      daily,
      monthlyApprox,
      credits,
      cap,
      eligible,
      total,
    };
  }, [benefit, monthly, monthsContrib]);

  const onCalculate = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowResult(true);
  };

  const onClear = () => {
    setMonthly(0);
    setMonthsContrib(0);
    setBenefit("unemployment");
    setShowResult(false);
  };

  const onExportPdf = () => {
    // Keep it dependency-free: use browser's Print to PDF
    window.print();
  };

  const onPrintChecklist = () => {
    const html = `
      <html>
        <head>
          <title>UIF Checklist</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { color: #d63384; }
            h2 { margin-top: 28px; }
            ul { margin-left: 18px; }
            a { color: #0a58ca; }
          </style>
        </head>
        <body>
          <h1>UIF Checklist</h1>
          <p>Print and take this along when you visit the Department of Labour.</p>
          <h2>Documents Required</h2>
          <ul>
            <li>SA ID/Smart ID (or valid passport + work permit)</li>
            <li>UI-19 — Employer declaration (employment start/end, reason for termination)</li>
            <li>UI-2.8 — Banking details form (stamped by bank)</li>
            <li>Recent bank statement</li>
            <li>Payslips / proof of earnings for the last 6 months</li>
            <li>Proof of termination (retrenchment/contract expiry/closure letter)</li>
            <li>Illness (if applicable): Medical certificate; optionally UI-2.7</li>
            <li>Maternity (if applicable): UI-2.3 application + doctor/midwife certificate</li>
            <li>Adoption/Parental (if applicable): Adoption order / UI-2.9</li>
            <li>Death (dependants): Death certificate + proof of relationship</li>
          </ul>
          <p><em>Tip:</em> Submit within 6 months of termination to avoid forfeiting benefits.</p>
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6">
        <h2 className="text-2xl font-bold mb-2">UIF Tool (Estimator)</h2>
        <p className="text-sm text-gray-600">
          Choose a benefit type. Calculations use a sliding IRR (where applicable) and cap benefits at the UIF ceiling.
        </p>

        <form onSubmit={onCalculate} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Benefit Type</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value as BenefitType)}
            >
              <option value="unemployment">Unemployment</option>
              <option value="illness">Illness</option>
              <option value="maternity">Maternity</option>
              <option value="adoption">Adoption</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Average Monthly Salary (ZAR)</label>
            <input
              type="number"
              min={0}
              className="w-full rounded border px-3 py-2"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">Use average gross of last 6 months.</p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Months Contributed (last 4 years)</label>
            <input
              type="number"
              min={0}
              max={48}
              className="w-full rounded border px-3 py-2"
              value={monthsContrib}
              onChange={(e) => setMonthsContrib(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">Earn ≈7.5 credit days/month (max 365).</p>
          </div>

          <div className="col-span-2 flex gap-2 mt-2">
            <button
              type="submit"
              className="rounded-lg bg-pink-600 text-white px-4 py-2 hover:bg-pink-700"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border px-4 py-2"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onExportPdf}
              className="rounded-lg border px-4 py-2"
            >
              Export PDF
            </button>
          </div>
        </form>
      </div>

      {showResult && (
        <div className="rounded-2xl border p-6">
          <h3 className="text-xl font-semibold mb-3">Estimate</h3>
          <div className="space-y-1 text-sm">
            <div><strong>Benefit:</strong> {benefit}</div>
            <div><strong>ADR (Actual):</strong> {ZAR.format(calc.adrActual)}</div>
            <div><strong>ADR (Capped):</strong> {ZAR.format(calc.adrCapped)}</div>
            <div><strong>IRR:</strong> {(calc.irr * 100).toFixed(2)}%</div>
            <div><strong>Daily Benefit:</strong> {ZAR.format(calc.daily)}</div>
            <div><strong>Monthly Benefit (~30d):</strong> {ZAR.format(calc.monthlyApprox)}</div>
            <div><strong>Eligible Days:</strong> {calc.eligible} (credits: {calc.credits.toFixed(0)}, cap: {calc.cap})</div>
            <div><strong>Total Potential Payout:</strong> {ZAR.format(calc.total)}</div>
          </div>

          <p className="text-xs text-gray-600 mt-3">
            <strong>Note:</strong> “Total Potential Payout” is the cumulative amount over your eligible days; UIF pays in
            monthly instalments, not as a once-off lump sum.
          </p>

          <p className="text-xs text-gray-600 mt-2">
            <strong>Important:</strong> This is an estimate for planning. The Department of Labour/UIF verifies all records and has the final say.
            Calculations use current caps and widely used UIF rules, so results should be close to what is paid.
          </p>
        </div>
      )}

      <div className="rounded-2xl border p-6">
        <h3 className="text-xl font-semibold mb-3">Who Qualifies for UIF and When You Can Claim</h3>
        <p className="text-sm">
          UIF protects contributors who stop working or earning due to reasons beyond their control. You must have contributed
          (1% employee + 1% employer) and apply within 6 months of employment ending.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 mt-4">
          <div>
            <h4 className="font-semibold mb-2">✅ Qualifying reasons</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Retrenchment or downsizing</li>
              <li>End of fixed-term or project contract</li>
              <li>Employer closure/liquidation, or death (domestic workers)</li>
              <li>Illness or injury certified by a doctor</li>
              <li>Maternity leave (up to 121 days at ±66%)</li>
              <li>Adoption of a child under 2 years (up to 65 days at ±66%)</li>
              <li>Death of a contributor (dependants may claim)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🚫 Not covered</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Voluntary resignation</li>
              <li>Dismissal for misconduct/fraud</li>
              <li>Absconding from work</li>
              <li>Receiving full salary during notice or leave</li>
              <li>Already receiving a pension/social grant replacing income</li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">⏳ Claim timeframes</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Unemployment: up to 365 days (based on credits)</li>
            <li>Illness: up to 238 days (medical certificate required)</li>
            <li>Maternity: up to 121 days</li>
            <li>Adoption: up to 65 days</li>
            <li>Death (dependants): claim within 18 months</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            After your benefit period ends: UIF stops paying once eligible days are used. You can claim again only after working and
            contributing long enough to earn new credit days.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <h3 className="text-xl font-semibold mb-3">Documents Required Before Visiting Labour (with download links)</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>SA ID/Smart ID (or valid passport + work permit for foreign nationals)</li>
          <li>UI-19 — Employer declaration (employment start/end, reason for termination). <a target="_blank" rel="noreferrer noopener" href="#">Download UI-19</a></li>
          <li>UI-2.8 — Banking details form (stamped by bank). <a target="_blank" rel="noreferrer noopener" href="#">Download UI-2.8</a></li>
          <li>Recent bank statement (shows account holder & number)</li>
          <li>Payslips / proof of earnings for the last 6 months</li>
          <li>Proof of termination (retrenchment/contract expiry/closure letter)</li>
          <li>For Illness: Medical certificate; optionally UI-2.7 (income while on leave). <a target="_blank" rel="noreferrer noopener" href="#">Download UI-2.7</a></li>
          <li>For Maternity: UI-2.3 application + doctor/midwife certificate. <a target="_blank" rel="noreferrer noopener" href="#">Download UI-2.3</a></li>
          <li>For Adoption/Parental: Adoption order / parental form (UI-2.9). <a target="_blank" rel="noreferrer noopener" href="#">Download UI-2.9</a></li>
          <li>For Death (dependants): Death certificate + proof of relationship</li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Tip: Keep both physical and digital copies. Submit within 6 months of termination to avoid forfeiting benefits.
        </p>

        <div className="mt-4">
          <button onClick={onPrintChecklist} className="rounded-lg border px-4 py-2">Print Checklist</button>
          <span className="ml-3 text-sm text-gray-600">Opens a printer-friendly checklist.</span>
        </div>

        <p className="text-sm mt-4">
          More forms and updates:{" "}
          <a target="_blank" rel="noreferrer noopener" href="#" className="text-blue-600 underline">
            Department of Labour: UIF Forms
          </a>
        </p>
      </div>
    </div>
  );
}
