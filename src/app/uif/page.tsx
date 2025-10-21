/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * UIF estimator:
 * - Claim type dropdown + grouped document list by reason
 * - Sliding scale (38–60%) for first 0–238 days; 20% for days 239–365
 * - Claim-type maximum payable days
 * - DoL downtime warning (nights/weekends)
 * - Share / Email / Copy / PDF / Print in the Results footer
 * - Monthly payout estimates for each phase (first & later phase)
 */

type ClaimType =
  | "unemployment"
  | "maternity"
  | "parental"
  | "adoption"
  | "illness"
  | "reduced"
  | "dependants";

const UIF_MONTHLY_CEILING = 17712; // R per month cap
const SLIDING_MAX_DAYS = 238;      // days on IRR sliding scale
const GLOBAL_MAX_CREDIT_DAYS = 365;

// ---- Documents (links + reason-specific extras) ----
const DOC_LINKS = {
  UI19: {
    label: "UI-19 — Employer Declaration",
    official:
      "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-19.pdf",
    mirror: "/uif/forms/UI-19.pdf",
  },
  UI28: {
    label: "UI-2.8 — Banking Details",
    official:
      "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2.8.pdf",
    mirror: "/uif/forms/UI-2.8.pdf",
  },
  UI21: {
    label: "UI-2.1 — Application for Benefits",
    official:
      "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2.1.pdf",
    mirror: "/uif/forms/UI-2.1.pdf",
  },
  UI27: {
    label: "UI-2.7 — Employer Certificate",
    official:
      "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2.7.pdf",
    mirror: "/uif/forms/UI-2.7.pdf",
  },
  UI22: {
    label: "UI-2.2 — Remuneration While Unemployed (if applicable)",
    official:
      "https://www.labour.gov.za/DocumentCenter/Forms/Unemployment%20Insurance%20Fund/UI-2.2.pdf",
    mirror: "/uif/forms/UI-2.2.pdf",
  },
  UFiling: {
    label: "Submit online via uFiling (official UIF portal)",
    official: "https://www.ufiling.labour.gov.za/uif/",
  },
  Offices: {
    label: "Find your nearest Department of Labour Centre",
    official: "https://www.labour.gov.za/Contacts/Provincial%20Offices",
  },
};

const CLAIM_LIMITS: Record<ClaimType, { label: string; maxDays: number; notes?: string }> = {
  unemployment: { label: "Unemployment", maxDays: 365, notes: "Days 0–238 at sliding rate; 239–365 at 20%." },
  maternity:    { label: "Maternity",    maxDays: 121, notes: "Typical max ~4 months (≈121 work days)." },
  parental:     { label: "Parental",     maxDays: 10,  notes: "Statutory ~10 consecutive work days." },
  adoption:     { label: "Adoption",     maxDays: 50,  notes: "Typical ~10 weeks (≈50 work days)." },
  illness:      { label: "Illness",      maxDays: 238, notes: "Often up to 238 work days with medical proof." },
  reduced:      { label: "Reduced Work Time", maxDays: 365, notes: "Paid for lost hours; depends on verified short time." },
  dependants:   { label: "Dependants (death claim)", maxDays: 365, notes: "Paid to dependants; credits cap applies." },
};

// Reason-specific extra docs (beyond the core forms)
const EXTRA_DOCS: Record<ClaimType, string[]> = {
  unemployment: [
    "Copy of ID / Passport",
    "Proof of termination (dismissal/retrenchment letter) if available",
    "Recent payslips (helpful for verification)",
  ],
  maternity: [
    "Copy of ID / Passport",
    "Medical certificate / Proof of birth (when available)",
  ],
  parental: [
    "Copy of ID / Passport",
    "Child's birth certificate",
    "Proof of parental leave from employer (if available)",
  ],
  adoption: [
    "Copy of ID / Passport",
    "Adoption court order / placement letter",
  ],
  illness: [
    "Copy of ID / Passport",
    "Recent medical certificate (original; not older than 14 days where applicable)",
  ],
  reduced: [
    "Copy of ID / Passport",
    "Proof of reduced hours / short-time letter from employer",
    "Recent payslips showing reduced earnings",
  ],
  dependants: [
    "Deceased’s death certificate",
    "Deceased’s ID copy",
    "Proof of relationship (marriage/birth certificate, affidavit if applicable)",
  ],
};

function clamp(n: number, min: number, max: number) { return Math.min(Math.max(n, min), max); }
function round2(n: number) { return Math.round(n * 100) / 100; }
function fmtMoney(n: number) { return n.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 }); }

export default function UifPage() {
  // Inputs
  const [claimType, setClaimType] = useState<ClaimType>("unemployment");
  const [salary, setSalary] = useState("");
  const [monthsWorked, setMonthsWorked] = useState("");
  const [result, setResult] = useState<null | {
    cappedSalary: number;
    dailyIncome: number;
    irrPct: number;
    dailyBenefitSliding: number;
    dailyBenefitFlat20: number;
    creditDays: number;
    daysSliding: number;
    daysFlat20: number;
    totalBenefit: number;
    estMonths: number;
    estMonthlySliding: number; // NEW
    estMonthlyFlat: number;    // NEW
    monthsSliding: number;     // NEW
    monthsFlat: number;        // NEW
  }>(null);

  // Off-hours detection: Nights (20:00–06:59) or Weekends (Sat/Sun)
  const showDowntimeWarning = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const hr = now.getHours();
    const isWeekend = day === 0 || day === 6;
    const isNight   = hr >= 20 || hr < 7;
    return isWeekend || isNight;
  }, []);

  // ---- Core computation ----
  function computeBenefit(avgMonthly: number, months: number, type: ClaimType) {
    const limits = CLAIM_LIMITS[type];

    // 1) Cap the average monthly salary
    const cappedSalary = Math.min(Math.max(avgMonthly, 0), UIF_MONTHLY_CEILING);

    // 2) Daily income
    const Y1 = (cappedSalary * 12) / 365;

    // 3) IRR (38–60%) sliding rate
    const irrRaw = 29.2 + 7173.92 / (232.92 + Y1);
    const irrPct = clamp(irrRaw, 38, 60);

    // 4) Daily benefits
    const dailySliding = (irrPct / 100) * Y1; // for first 0–238 days
    const dailyFlat20  = Y1 * 0.20;           // for days 239–365

    // 5) Credits ≈ 1 per 4 days worked; ~7–8/month
    const approxCredits = Math.floor((months * 30) / 4);
    const creditDays = clamp(approxCredits, 0, Math.min(GLOBAL_MAX_CREDIT_DAYS, limits.maxDays));

    // 6) Split days
    const daysSliding = clamp(creditDays, 0, SLIDING_MAX_DAYS);
    const daysFlat20 = creditDays > SLIDING_MAX_DAYS ? creditDays - SLIDING_MAX_DAYS : 0;

    // 7) Totals
    const totalSliding = dailySliding * daysSliding;
    const totalFlat = dailyFlat20 * daysFlat20;
    const totalBenefit = totalSliding + totalFlat;

    // 8) Months payable (roughly) + MONTHLY ESTIMATES
    const estMonths = creditDays > 0 ? creditDays / 21.67 : 0;

    const estMonthlySliding = dailySliding * 21.67;
    const estMonthlyFlat = dailyFlat20 * 21.67;
    const monthsSliding = daysSliding / 21.67;
    const monthsFlat = daysFlat20 / 21.67;

    return {
      cappedSalary,
      dailyIncome: round2(Y1),
      irrPct: round2(irrPct),
      dailyBenefitSliding: round2(dailySliding),
      dailyBenefitFlat20: round2(dailyFlat20),
      creditDays,
      daysSliding,
      daysFlat20,
      totalBenefit: round2(totalBenefit),
      estMonths: round2(estMonths),
      estMonthlySliding: round2(estMonthlySliding),
      estMonthlyFlat: round2(estMonthlyFlat),
      monthsSliding: round2(monthsSliding),
      monthsFlat: round2(monthsFlat),
    };
  }

  const calculate = () => {
    const sal = parseFloat(salary) || 0;
    const months = parseFloat(monthsWorked) || 0;
    if (sal <= 0 || months <= 0) { setResult(null); return; }
    setResult(computeBenefit(sal, months, claimType));
  };

  const clear = () => {
    setSalary("");
    setMonthsWorked("");
    setResult(null);
  };

  // ---- Share helpers ----
  function shareSummary() {
    if (!result) return "UIF result: Enter inputs and click Calculate.";
    const t = CLAIM_LIMITS[claimType]?.label ?? "UIF";
    const lines = [
      `${t} UIF Estimate`,
      `Salary used (cap): ${fmtMoney(result.cappedSalary)}`,
      `IRR: ${result.irrPct}%`,
      `Daily benefit: ${fmtMoney(result.dailyBenefitSliding)} (sliding) / ${fmtMoney(result.dailyBenefitFlat20)} (20% band)`,
      `First-phase monthly ≈ ${fmtMoney(result.estMonthlySliding)}${result.monthsSliding > 0 ? ` (~${result.monthsSliding} months)` : ""}`,
      ...(result.monthsFlat > 0 ? [`Later-phase monthly ≈ ${fmtMoney(result.estMonthlyFlat)} (~${result.monthsFlat} months)`] : []),
      `Credit days: ${result.creditDays} (sliding ${result.daysSliding}, flat20 ${result.daysFlat20})`,
      `Months payable: ${result.estMonths}`,
      `Total estimated: ${fmtMoney(result.totalBenefit)}`
    ];
    return lines.join(" • ");
  }
  function waShare() {
    if (!result) { alert("Calculate first, then share."); return; }
    const text = encodeURIComponent(shareSummary() + " — " + (typeof window !== "undefined" ? window.location.href : ""));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
  function emailShare() {
    if (!result) { alert("Calculate first, then share."); return; }
    const subject = encodeURIComponent("UIF estimate");
    const body = encodeURIComponent(shareSummary() + "\n\n" + (typeof window !== "undefined" ? window.location.href : ""));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  async function copyShare() {
    if (!result) { alert("Calculate first, then copy."); return; }
    try { await navigator.clipboard.writeText(shareSummary() + " — " + (typeof window !== "undefined" ? window.location.href : "")); alert("Copied to clipboard"); }
    catch { alert("Copy failed"); }
  }

  // ---- PDF export ----
  function exportPDF() {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Scend — UIF Benefit Estimate", 14, 16);
    doc.setFontSize(10);
    doc.text(`Claim type: ${CLAIM_LIMITS[claimType].label}`, 14, 23);

    const rows: any[] = [
      ["Salary used (cap)", fmtMoney(result.cappedSalary)],
      ["Daily income (Y1)", fmtMoney(result.dailyIncome)],
      ["IRR (sliding rate)", `${result.irrPct}%`],
      ["Daily benefit (sliding)", fmtMoney(result.dailyBenefitSliding)],
      ["Daily benefit (20% band)", fmtMoney(result.dailyBenefitFlat20)],
      ["Est. monthly payout (first phase)", fmtMoney(result.estMonthlySliding)],
      ["Est. monthly payout (later phase)", result.monthsFlat > 0 ? fmtMoney(result.estMonthlyFlat) : "—"],
      ["Credit days (total)", String(result.creditDays)],
      ["— Sliding scale days (0–238)", String(result.daysSliding)],
      ["— Flat 20% days (239–365)", String(result.daysFlat20)],
      ["Estimated months payable", String(result.estMonths)],
      ["Total estimated benefit", fmtMoney(result.totalBenefit)]
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field","Value"]],
      body: rows,
      styles: { fontSize: 10 },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });

    const disclaimer =
      "Indicative only — not advice. The Department of Employment and Labour/UIF have final say. " +
      "Rules may vary by claim type and verification. If official links time out, use mirror downloads.";
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.text(disclaimer, 14, footerY, { maxWidth: pageWidth - 28 });

    doc.save("UIF_Estimate.pdf");
  }

  // ---- Print (browser native) ----
  function printPage() { window.print(); }

  // Pink buttons
  const btnPrimary = "rounded-xl px-4 py-2 bg-pink-600 text-white hover:opacity-90";
  const btnOutline = "rounded-xl px-3 py-2 border";

  // Reusable link row
  const LinkRow: React.FC<{ label: string; official: string; mirror?: string }> = ({ label, official, mirror }) => (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <a href={official} target="_blank" rel="noreferrer" className="text-pink-600 underline">{label} (official)</a>
      {mirror && (
        <>
          <span className="text-gray-400">•</span>
          <a href={mirror} download className="text-pink-600 underline">Mirror download</a>
        </>
      )}
    </li>
  );

  return (
    <section className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">UIF Tool</h1>
        <p className="text-sm text-gray-600">
          Estimate your UIF benefit and find the official forms and steps for claiming.
        </p>
      </div>

      {/* DoL off-hours / downtime warning */}
      {showDowntimeWarning && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm">
          <b>Heads up:</b> The Department of Employment and Labour site often experiences downtime
          at night and on weekends. If an official link times out, use the <b>Mirror download</b> next to it.
        </div>
      )}

      {/* Inputs */}
      <div className="rounded-xl border bg-white shadow-sm p-4 space-y-4">
        {/* Claim type */}
        <div>
          <label className="block text-sm font-medium">What are you claiming for?</label>
          <select
            className="border rounded-md px-3 py-2 w-full md:w-80"
            value={claimType}
            onChange={e => { setClaimType(e.target.value as ClaimType); setResult(null); }}
          >
            {Object.entries(CLAIM_LIMITS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          {CLAIM_LIMITS[claimType]?.notes && (
            <p className="text-xs text-gray-500 mt-1">{CLAIM_LIMITS[claimType].notes}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Average Monthly Salary (R)</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border rounded-md px-3 py-2 w-60"
            placeholder="e.g. 12000"
          />
          <p className="text-xs text-gray-500 mt-1">Capped at {fmtMoney(UIF_MONTHLY_CEILING)} for UIF calculations.</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Months Worked in the Last 4 Years</label>
          <input
            type="number"
            value={monthsWorked}
            onChange={(e) => setMonthsWorked(e.target.value)}
            className="border rounded-md px-3 py-2 w-60"
            placeholder="e.g. 24"
          />
          <p className="text-xs text-gray-500 mt-1">
            Credits accrue at roughly 1 day for every 4 days worked (≈7–8 per month).
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={calculate} className={btnPrimary}>Calculate</button>
          <button onClick={clear} className="rounded-xl px-4 py-2 border">Clear</button>
        </div>
      </div>

      {/* Results with footer actions ONLY */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold">Results</h2>
        </div>
        <div className="px-5 py-4">
          {result ? (
            <div className="grid gap-2">
              <div className="flex justify-between"><span>Claim type</span><b>{CLAIM_LIMITS[claimType].label}</b></div>
              <div className="flex justify-between"><span>Salary used (cap)</span><b>{fmtMoney(result.cappedSalary)}</b></div>
              <div className="flex justify-between"><span>Daily income (Y1)</span><b>{fmtMoney(result.dailyIncome)}</b></div>
              <div className="flex justify-between"><span>IRR (sliding rate)</span><b>{result.irrPct}%</b></div>

              <div className="flex justify-between"><span>Daily benefit (first {SLIDING_MAX_DAYS} days)</span><b>{fmtMoney(result.dailyBenefitSliding)}</b></div>
              <div className="flex justify-between"><span>Estimated monthly payout (first phase)</span><b>{fmtMoney(result.estMonthlySliding)}{result.monthsSliding > 0 ? ` (≈ ${result.monthsSliding} months)` : ""}</b></div>

              <div className="flex justify-between"><span>Daily benefit (days 239–365)</span><b>{fmtMoney(result.dailyBenefitFlat20)}</b></div>
              {result.monthsFlat > 0 && (
                <div className="flex justify-between"><span>Estimated monthly payout (later phase)</span><b>{fmtMoney(result.estMonthlyFlat)} (≈ {result.monthsFlat} months)</b></div>
              )}

              <div className="flex justify-between"><span>Total credit days (capped)</span><b>{result.creditDays}</b></div>
              <div className="flex justify-between"><span>— Sliding-scale days</span><b>{result.daysSliding}</b></div>
              <div className="flex justify-between"><span>— Flat 20% days</span><b>{result.daysFlat20}</b></div>
              <div className="flex justify-between"><span>Estimated months payable</span><b>{result.estMonths}</b></div>
              <div className="flex justify-between"><span>Total UIF benefit (estimate)</span><b>{fmtMoney(result.totalBenefit)}</b></div>

              <p className="text-xs text-gray-500 mt-2">
                Timing and validation can affect totals. For Reduced Work Time, actual payouts depend on verified lost hours.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Enter inputs and click <b>Calculate</b> to see results.</p>
          )}
        </div>

        {/* Results footer actions (the ONLY location for share/export/print) */}
        <div className="px-5 py-3 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex flex-wrap gap-2">
            <button className={btnOutline} onClick={waShare} disabled={!result}>Share WhatsApp</button>
            <button className={btnOutline} onClick={emailShare} disabled={!result}>Share Email</button>
            <button className={btnOutline} onClick={copyShare} disabled={!result}>Copy summary</button>
            <button className={btnOutline} onClick={exportPDF} disabled={!result}>Export PDF</button>
            <button className={btnOutline} onClick={printPage}>Print</button>
          </div>
        </div>
      </div>

      {/* Grouped required documents for the chosen reason */}
      <div className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
        <h3 className="font-semibold">Required documents for {CLAIM_LIMITS[claimType].label}</h3>
        <p className="text-xs text-gray-500 -mt-1">
          If an official link times out (DoL servers are often down after hours), use the <b>Mirror download</b>.
        </p>

        {/* Core UIF forms — shown for every reason */}
        <div>
          <p className="font-medium">Core UIF forms</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
            <LinkRow label={DOC_LINKS.UI19.label} official={DOC_LINKS.UI19.official} mirror={DOC_LINKS.UI19.mirror} />
            <LinkRow label={DOC_LINKS.UI21.label} official={DOC_LINKS.UI21.official} mirror={DOC_LINKS.UI21.mirror} />
            <LinkRow label={DOC_LINKS.UI27.label} official={DOC_LINKS.UI27.official} mirror={DOC_LINKS.UI27.mirror} />
            <LinkRow label={DOC_LINKS.UI28.label} official={DOC_LINKS.UI28.official} mirror={DOC_LINKS.UI28.mirror} />
            <LinkRow label={DOC_LINKS.UI22.label} official={DOC_LINKS.UI22.official} mirror={DOC_LINKS.UI22.mirror} />
          </ul>
        </div>

        {/* Reason-specific extras */}
        <div>
          <p className="font-medium">Additional documents for {CLAIM_LIMITS[claimType].label}</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
            {EXTRA_DOCS[claimType].map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>

        {/* Useful links */}
        <div className="pt-1">
          <p className="font-medium">Where to submit / get help</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
            <li><a href={DOC_LINKS.UFiling.official} target="_blank" rel="noreferrer" className="text-pink-600 underline">{DOC_LINKS.UFiling.label}</a></li>
            <li><a href={DOC_LINKS.Offices.official} target="_blank" rel="noreferrer" className="text-pink-600 underline">{DOC_LINKS.Offices.label}</a></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 bg-gray-50 border rounded-xl p-3 leading-relaxed">
        <b>Disclaimer:</b> This calculator provides indicative results only. The Department of Employment and Labour and
        the Unemployment Insurance Fund (UIF) have final authority over claim approval, eligibility, rates and payouts.
        Mirrors are provided for convenience when official servers are unavailable.
      </div>
    </section>
  );
}

